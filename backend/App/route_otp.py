from flask import Blueprint, request, session
from flask_mail import Message
from smtplib import SMTPException
from flask_jwt_extended import jwt_required, get_jwt_identity
from secrets import randbelow, token_hex
from datetime import datetime, timedelta, timezone
from App import mail
from .helper_methods import logger_setup, commit_session, jsonify_template_user
from .helper_user_validation import handle_validate_requirements
from .model import OTP, Root_User, Users, Oauth_Users
from .database import db_session as db

generate_otp = lambda: f"{randbelow(1000000):06}"
generate_code = lambda: f"{token_hex(3)}"

logger = logger_setup(__name__, "otp.log")

otp_route = Blueprint("otp_route", __name__)

@otp_route.route("/send_otp", methods=['POST'])
@jwt_required()
def send_otp():
    data = request.get_json() or {}

    user_id = get_jwt_identity()
    user = db.get(Root_User, int(user_id))

    if not user:
        logger.error("User trued to access send otp wihtout logging in")
        return jsonify_template_user(401, False, "You need to log in to access this")

    email = data.get("email")
    if not email:
        logger.error("user send a non existing email")
        return jsonify_template_user(400, False, "Please provide an email")

    otp_expiration = datetime.now(timezone.utc) + timedelta(minutes=30)
    otp_db = OTP( otp_text=generate_code(), expires_at=otp_expiration, is_used = False)

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
            <p>Your One-Time Password (OTP) to reset your account is:</p>
            <h1 style="color: #2c7be5; text-align: center; background-color: black; padding: 15px 0 15px 0; font-weight: bold; border-radius: 7px;">{generate_otp}</h1>
            <p>This code will expire in <strong>5 minutes</strong>. Please do not share it with anyone.</p>
            <p style="color: #999; font-size: 12px;">If you dit not request this, you can safely ignore this email.</p>
        </div>
    </body>
    </html>
    """
    try:
        mail.send(msg)
    except SMTPException as e:
        logger.exception(str(e))
        return jsonify_template_user(400, False, "Falsed to send email", mail_error=str(e))

    user.otp = otp_db

    success, error = commit_session()
    if not success:
        logger.error(error)
        return jsonify_template_user(500, False, "Database error")

    logger.info(f"Successfully send OTP to {email}")

    return jsonify_template_user(200, True, "Sent OTP, please check your email")

@otp_route.route("/input_otp", methods=['POST'])
@jwt_required()
def input_otp():
    data: dict = request.get_json()
    otp = data.get("otp")

    user_id = get_jwt_identity()
    user = db.get(Root_User, int(user_id))

    if not user:
        logger.error("Someone tried to access the reset password without logging in")
        return jsonify_template_user(401, False, "Holy fuck, how dod you access this, please log in")
    
    if not otp:
        logger.error(f"{user.id} did not provide an otp")
        return jsonify_template_user(400, False, "Please input the OTP we provided")

    otp_db: OTP = user.otp

    if otp_db.otp_text != otp:
        logger.error(f"{user.id} inputed the wrong OTP")
        return jsonify_template_user(400, False, "Please iput the right OTP")
    
    otp_db.is_used = True
    session["otp"] = otp

    return jsonify_template_user(200, True, "Please proceed to changing your password now")
    

@otp_route.route("/reset_pssw", methods=['POST'])
@jwt_required()
def reset_pssw():
    data: dict = request.get_json()

    user_id = get_jwt_identity()
    user = db.get(Root_User, int(user_id))

    if not user:
        logger.error("Someone tried to access the reset password without logging in")
        return jsonify_template_user(401, False, "Holy fuck, how dod you access this, please log in")

    who_user = db.get(Users, int(user_id)) if user.user_type == "local" else db.get(Oauth_Users, int(user_id))
    otp = session.get("otp")
    new_pssw = data.get("new_password")
    
    if not new_pssw:
        logger.error(f"{user.id} accessed otp wihout providing a password")
        return jsonify_template_user(400, False, "Please enter the new password you want")
    
    user_valid_req, user_valid_flag =  handle_validate_requirements(who_user.username, new_pssw )
    if user_valid_flag:
        logger.error(user_valid_req)
        return jsonify_template_user(422, False, user_valid_flag)
    
