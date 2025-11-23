from App import limiter
from flask import Blueprint, request, session
from flask_mail import Message
from smtplib import SMTPException
from flask_jwt_extended import jwt_required, get_jwt_identity
from secrets import randbelow
from datetime import datetime, timedelta, timezone
from App import mail
from App.helper_methods import logger_setup, commit_session, jsonify_template_user, datetime_return_tzinfo
from App.helper_user_validation import handle_validate_requirements, handle_password_reset_user
from App.models.model_users import Root_User, Users, Oauth_Users
from App.models.model_otp import OTP
from App.database import db_session as db

generate_otp = lambda: f"{randbelow(1000000):06}"

logger = logger_setup(__name__, "otp.log")

otp_route = Blueprint("otp_route", __name__)

who_user_query = lambda id, utype: db.get(Users, id) if utype == "local" else db.get(Oauth_Users, id)

@otp_route.route("/send_otp", methods=['POST'])
@jwt_required()
@limiter.limit("3 per 10 minute;10 per hour;30 per day")
def send_otp():
    data = request.get_json() or {}

    user_id = get_jwt_identity()
    user = db.get(Root_User, int(user_id))

    if not user:
        logger.error("User tried to access send otp without logging in")
        return jsonify_template_user(401, False, "You need to log in to access this")
    
    who_user = who_user_query(user.id, user.user_type)

    email = who_user.email

    if not who_user.email:
        email = data.get("email")
        if not email:
            logger.error("user send a non existing email")
            return jsonify_template_user(400, False, "Please provide an email")

    generated_otp = generate_otp()
    otp_expiration = datetime.now(timezone.utc) + timedelta(minutes=30)
    otp_db = OTP( otp_text=generated_otp, expires_at=otp_expiration, is_used = False)

    msg = Message(
        subject="From Inquira",
        recipients=[email],
    )
    msg.html = f"""
    <html>
    <body style="font-family: Arial, sans-serif; background-color: #f6f6f6; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: white; padding: 30px; border-radius: 10px;">
            <h2 style="color: #333;">🔐 Password Reset OTP</h2>
            <p>Hello,</p>
            <p>Your One-Time Password (OTP) to reset your account password is:</p>
            <h1 style="color: #2c7be5; text-align: center; background-color: black; padding: 15px 0 15px 0; font-weight: bold; border-radius: 7px;">{generated_otp}</h1>
            <p>This code will expire in <strong>30 minutes</strong>. Please do not share it with anyone.</p>
            <p style="color: #999; font-size: 12px;">If you did not request this, you can safely ignore this email.</p>
        </div>
    </body>
    </html>
    """
    try:
        mail.send(msg)
    except SMTPException as e:
        logger.exception(str(e))
        return jsonify_template_user(400, False, "Failed to send email", mail_error=str(e))

    user.otp = otp_db

    success, error = commit_session()
    if not success:
        logger.error(error)
        return jsonify_template_user(500, False, "Database error")

    logger.info(f"Successfully send OTP to {email}")
    session["email"] = email

    return jsonify_template_user(200, True, "Sent OTP, please check your email")

@otp_route.route("/input_otp", methods=['POST'])
@jwt_required()
@limiter.limit("3 per 10 minute;10 per hour;30 per day")
def input_otp():
    data: dict = request.get_json()
    otp = data.get("otp")

    user_id = get_jwt_identity()
    user = db.get(Root_User, int(user_id))

    if not user:
        logger.error("Someone tried to access the reset password without logging in")
        return jsonify_template_user(401, False, 
                                     "Holy fuck, how did you access this, please log in")
    
    if not otp:
        logger.error(f"{user.id} did not provide an otp")
        return jsonify_template_user(400, False, "Missing OTP, please input the OTP we provided")

    otp_db: OTP = user.otp

    if not otp_db:
        logger.info(f"{user_id} tried to input with a non existant otp")
        return jsonify_template_user(404, False, "You havent requested an OTP yet")
        
    if otp_db.otp_text != otp:
        logger.error(f"{user.id} inputed the wrong OTP")
        return jsonify_template_user(400, False, "Please iput the correct OTP")

    if otp_db.is_used:
        logger.info("User tried to input a used OTP")
        return jsonify_template_user(409, False, "This OTP have been used")
    
    otp_db.is_used = True
    session["otp"] = otp

    success, error = commit_session()
    if not success:
        logger.info(error)
        return jsonify_template_user(500, False, "Database Error")

    return jsonify_template_user(200, True, "Please proceed to use your OTP")
    

@otp_route.route("/reset_pssw", methods=['PATCH'])
@jwt_required()
@limiter.limit("3 per 10 minute;10 per hour;30 per day")
def reset_pssw():
    data: dict = request.get_json()

    user_id = get_jwt_identity()
    user = db.get(Root_User, int(user_id))

    if not user:
        logger.error("Someone tried to access the reset password without logging in")
        return jsonify_template_user(401, False, "Holy fuck, how did you access this, please log in")

    who_user = who_user_query(user.id, user.user_type)
    otp_db: OTP = who_user.otp
    user_check = handle_password_reset_user(who_user)
    otp = session.get("otp")
    new_pssw = data.get("new_password")

    if not user_check:
        logger.info("User tried to change password but not logged in using local")
        return jsonify_template_user(403, False, 
                                     "You cannot change password using this account type. Only users logged in using Inquira will be able to change password")
    if not otp_db:
        logger.info(f"{user_id} tried to input with a non existant otp")
        return jsonify_template_user(404, False, "You havent requested an OTP yet")
    
    if otp != otp_db.otp_text:
        logger.error("User tampered with the session OTP")
        return jsonify_template_user(400, False, "Look man, please dont tamper with the session's OTP")
    
    if not new_pssw:
        logger.error(f"{user.id} accessed otp wihout providing a password")
        return jsonify_template_user(400, False, "Please enter the new password you want")
    
    user_valid_req, user_valid_flag = handle_validate_requirements(who_user.username, new_pssw )
    if user_valid_flag:
        logger.error(user_valid_req)
        return jsonify_template_user(422, False, user_valid_flag)
    
    expires_at: datetime = datetime_return_tzinfo(otp_db.expires_at)
    if expires_at < datetime.now(timezone.utc):
        logger.info("User tried to reest pasword but the OTP is expired")
        return jsonify_template_user(400, False, "Your otp has expired, please use it within 30 mins")

    who_user.set_password(new_pssw)

    success, error = commit_session()
    if not success:
        logger.error(error)
        return jsonify_template_user(500, False, "Database Error")
    
    logger.info(f"{user.id} has changed their password")

    return jsonify_template_user(200, True, "Password reset successfully")

@otp_route.route("/enter_email", methods=['PATCH'])
@jwt_required()
@limiter.limit("3 per minute;100 per hour; 30 per day")
def enter_email():

    data: dict = request.get_json()
    otp = data.get("otp")

    user_id = get_jwt_identity()
    user = db.get(Root_User, int(user_id))

    if not user:
        logger.info("Someone tried to access the reset password without logging in")
        return jsonify_template_user(401, False, "You need to log in to access this")
    
    if not otp:
        logger.error(f"{user.id} did not provide an otp")
        return jsonify_template_user(400, False, "Missing OTP, please input the OTP we provided")
    
    who_user = who_user_query(user.id, user.user_type)

    user_check = handle_password_reset_user(who_user)
    email = session.get("email")
    otp_db: OTP = who_user.otp

    if not user_check:
        logger.info("User tried to change email but not logged in using local")
        return jsonify_template_user(403, False, 
                                     "You cannot change email using this account type. Only users logged in using Inquira will be able to change email")

    if not otp_db:
        logger.info(f"{user_id} tried to input with a non existant otp")
        return jsonify_template_user(404, False, "You havent requested an OTP yet")
    
    if not email:
        logger.error(f"{user.id} tampered with the session OTP")
        return jsonify_template_user(400, False, "Look man, please dont tamper with the session's email")
    
    if otp != otp_db.otp_text:
        logger.error("User tampered with the session OTP")
        return jsonify_template_user(400, False, "Look man, please dont tamper with the session's OTP")
    
    if otp_db.is_used:
        logger.info("User tried to input a used OTP")
        return jsonify_template_user(409, False, "This OTP have been used")
    
    who_user.email = email
    otp_db.is_used = True

    succ, err = commit_session()
    if not succ:
        logger.error(err)
        return jsonify_template_user(500, False, "Database Error")

    logger.info(f"{user.id} has changed their email into {email}")
    return jsonify_template_user(200, True, "You have changed your email")

