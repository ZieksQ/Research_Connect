from App import supabase_client
from flask import request, current_app, Blueprint
from datetime import datetime, timezone
from sqlalchemy import select, and_, or_
from .model import Users, RefreshToken
from .database import db_session as db
from .helper_user_validation import handle_user_input_exist, handle_validate_requirements, handle_profile_pic
from .helper_methods import ( commit_session, jsonify_template_user, logger_setup )
from flask_jwt_extended import (
    create_access_token, create_refresh_token, 
    set_access_cookies, set_refresh_cookies, 
    unset_jwt_cookies, get_jti,
    get_jwt_identity, jwt_required, get_jwt
)
import uuid

# Sets up the logger from my helper file
logger = logger_setup(__name__, "auth_users.log")
# Set up a route for each file so it is more organized
user_auth = Blueprint("user_auth", __name__)

@user_auth.route("/register", methods=["POST"])
def user_register():
    data: dict = request.get_json(silent=True) or {} # Gets the JSON from the frontend, returns None if its not JSON or in this case an empty dict

    username = data.get("username", "")
    password = data.get("password", "")

    validate_result, exists_flag = handle_user_input_exist(username, password)
    if exists_flag:
        logger.error(validate_result)
        return jsonify_template_user(400, False, validate_result ), 400
    
    validate_user_requirements, req_flag = handle_validate_requirements(username, password)
    if req_flag:
        logger.error(validate_user_requirements)
        return jsonify_template_user(422, False, validate_user_requirements), 422

    stmt = select(Users).where(Users.username == username)
    if db.execute(stmt).scalar_one_or_none():
        msg = "Username already exist"
        logger.error(msg)
        return jsonify_template_user(409, False, msg), 409
    
    user = Users(username=username)
    user.set_password(password)

    db.add(user)
    success, error = commit_session()
    if not success:
        logger.exception(error)
        return jsonify_template_user(500, False, "Database Error"), 500
    logger.info("Registered successfully")        
    
    return jsonify_template_user(200, True, "User registered successful"), 200


@user_auth.route("/login", methods=["POST"])
def user_login():
    data: dict = request.get_json(silent=True) or {} # Gets the JSON from the frontend, returns None if its not JSON or in this case an empty dict

    username = data.get("username", "")
    password = data.get("password", "")

    validate_result, exists_flag = handle_user_input_exist(username, password)
    if exists_flag:
        logger.error(validate_result)
        return jsonify_template_user(400, False, validate_result), 400
    
    stmt = select(Users).where(Users.username == username)
    user = db.execute(stmt).scalar_one_or_none()
    if not user:
        msg = "Username does not exist"
        logger.error(msg)
        return jsonify_template_user(404, False, msg), 404
    
    if not user.check_password(password):
        msg = "Incorrect password"
        logger.error(msg)
        return jsonify_template_user(401, False, msg), 401
    
    access_token = create_access_token(identity=str(user.id))
    refresh_token = create_refresh_token(identity=str(user.id))

    jti = get_jti(refresh_token)

    expires = datetime.now(timezone.utc) + current_app.config["JWT_REFRESH_TOKEN_EXPIRES"]
    current_refresh_token = RefreshToken(jti=jti, user_token=user, expires_at=expires)

    db.add(current_refresh_token)

    success, error = commit_session()
    if not success:
        logger.exception(error)
        return jsonify_template_user(500, False, "Database Error"), 500
    
    response = jsonify_template_user(200, True, "Login successful")

    set_access_cookies(response, access_token)
    set_refresh_cookies(response, refresh_token)

    logger.info("Login Succesful")

    return response, 200


@user_auth.route("/user/profile_upload", methods=["POST"])
@jwt_required()
def profile_upload():
    profile_pic = request.files.get("profile_pic")
    profile_msg, profile_flag = handle_profile_pic(profile_pic)

    user_id = get_jwt_identity()

    if profile_flag:
        logger.error(profile_msg)
        return jsonify_template_user(400, False, profile_msg), 400
    
    filename = f"{uuid.uuid4()}_{profile_pic.filename}"

    resp = supabase_client.storage.from_("profile_pic").upload(path=filename, file=profile_pic.read(), 
                                                               file_options={"content-type": profile_pic.content_type})
    
    if resp.get("error"):
        logger.error(resp["error"]["message"])
        return jsonify_template_user(500, False, resp["error"]["message"]), 500
    
    user = db.get(Users, int(user_id))
    public_url = supabase_client.storage.from_("profile_pic").get_public_url(path=filename)
    user.profile_pic_url = public_url

    success, error = commit_session()
    if not success:
        logger.exception(error)
        return jsonify_template_user(500, False, "Database Error"), 500
    
    logger.info("User has uploaded a profile picture")

    return jsonify_template_user(200, True, "Upload successful"), 200


@user_auth.route("/logout", methods=["POST"])
@jwt_required(refresh=True)
def logout():
    jti = get_jwt()["jti"]
    stmt = select(RefreshToken).where(RefreshToken.jti == jti)
    token = db.execute(stmt).scalar_one_or_none()

    if not token:
        return jsonify_template_user(404, False, "I dont even know how you got this error. but you dont have a token"), 404
    
    if token.revoked:
        return jsonify_template_user(404, False, "I dont even know how you got this error. but your JWT has been revoked"), 404
    
    token.revoked = True

    success, error = commit_session()
    if not success:
        logger.error(error)
        return jsonify_template_user(500, False, "Database error"), 500
    
    response = jsonify_template_user(200, True, "Successfully logged out")

    unset_jwt_cookies(response)
    logger.info("User has logged out")

    return response, 200


# Route to refresh the access token for more security
# If the refresh token expires the user needs to log in again
@user_auth.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh_access():
    jti = get_jwt()["jti"]
    stmt = select(RefreshToken).where(and_(RefreshToken.jti == jti, RefreshToken.revoked == False))
    token = db.execute(stmt).scalar_one_or_none()

    if not token:
        return jsonify_template_user(404, False, "You need to log in again"), 404
    
    user_id = get_jwt_identity()
    access_token = create_access_token(identity=user_id)
    response = jsonify_template_user(200, True, "Refresh Token successful")

    set_access_cookies(response, access_token)

    return response, 200