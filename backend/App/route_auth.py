from App import supabase_client
from flask import request, current_app, Blueprint
from datetime import datetime, timezone
from sqlalchemy import select, and_, or_
from .database import db_session as db
from .helper_user_validation import handle_user_input_exist, handle_validate_requirements, handle_profile_pic
from .helper_methods import ( commit_session, jsonify_template_user, logger_setup )
from .model import ( Root_User, Users, Oauth_Users, 
                    RefreshToken, User_Roles )
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
        return jsonify_template_user(400, False, validate_result )
    
    validate_user_requirements, req_flag = handle_validate_requirements(username, password)
    if req_flag:
        logger.error(validate_user_requirements)
        return jsonify_template_user(422, False, validate_user_requirements)

    stmt = select(Users).where(Users.username == username)
    if db.execute(stmt).scalar_one_or_none():
        msg = "Username already exist"
        logger.error(msg)
        return jsonify_template_user(409, False, msg)
    
    user = Users(username=username)
    user.set_password(password)
    user.role = User_Roles.USER.value

    db.add(user)
    success, error = commit_session()
    if not success:
        logger.exception(error)
        return jsonify_template_user(500, False, "Database Error")
    logger.info("Registered successfully")        
    
    return jsonify_template_user(200, True, "User registered successful")


@user_auth.route("/login", methods=["POST"])
def user_login():
    data: dict = request.get_json(silent=True) or {} # Gets the JSON from the frontend, returns None if its not JSON or in this case an empty dict

    username = data.get("username", "")
    password = data.get("password", "")

    validate_result, exists_flag = handle_user_input_exist(username, password)
    if exists_flag:
        logger.error(validate_result)
        return jsonify_template_user(400, False, validate_result)
    
    stmt = select(Users).where(Users.username == username)
    user = db.execute(stmt).scalar_one_or_none()
    if not user:
        msg = "Username does not exist"
        logger.error(msg)
        return jsonify_template_user(404, False, msg)
    
    if not user.check_password(password):
        msg = "Incorrect password"
        logger.error(msg)
        return jsonify_template_user(401, False, msg)
    
    access_token = create_access_token(identity=str(user.id))
    refresh_token = create_refresh_token(identity=str(user.id))

    jti = get_jti(refresh_token)

    expires = datetime.now(timezone.utc) + current_app.config["JWT_REFRESH_TOKEN_EXPIRES"]
    current_refresh_token = RefreshToken(jti=jti, user_token=user, expires_at=expires)

    db.add(current_refresh_token)

    success, error = commit_session()
    if not success:
        logger.exception(error)
        return jsonify_template_user(500, False, "Database Error")
    
    response = jsonify_template_user(200, True, "Login successful", login_type="inquira")

    set_access_cookies(response, access_token)
    set_refresh_cookies(response, refresh_token)

    logger.info("Login Succesful")

    return response


@user_auth.route("/profile_upload", methods=["POST"])
@jwt_required()
def profile_upload():
    profile_pic = request.files.get("profile_pic")

    user_id = get_jwt_identity()
    user = db.get(Users, int(user_id))

    if not user:
        logger.info("Someone tired to change profile without logging or having a nexisting user")
        return jsonify_template_user(400, False, "You need to log in to access this")

    profile_msg, profile_flag = handle_profile_pic(profile_pic)
    if profile_flag:
        logger.error(profile_msg)
        return jsonify_template_user(400, False, profile_msg)
    
    filename = f"{uuid.uuid4()}_{profile_pic.filename}"

    resp = supabase_client.storage.from_("profile_pic").upload(path=filename, file=profile_pic.read(), 
                                                               file_options={"content-type": profile_pic.content_type})
    if resp.get("error"):
        logger.error(resp["error"]["message"])
        return jsonify_template_user(500, False, resp["error"]["message"])
    
    public_url = supabase_client.storage.from_("profile_pic").get_public_url(path=filename)
    user.profile_pic_url = public_url

    success, error = commit_session()
    if not success:
        logger.exception(error)
        return jsonify_template_user(500, False, "Database Error")
    
    logger.info("User has uploaded a profile picture")

    return jsonify_template_user(200, True, "Upload successful")


@user_auth.route("/logout", methods=["POST"])
@jwt_required(refresh=True)
def logout():
    jti = get_jwt()["jti"]
    stmt = select(RefreshToken).where(RefreshToken.jti == jti)
    token = db.execute(stmt).scalar_one_or_none()

    if not token:
        return jsonify_template_user(404, False, "I dont even know how you got this error. but you dont have a token")
    
    if token.revoked:
        return jsonify_template_user(404, False, "I dont even know how you got this error. but your JWT has been revoked")
    
    token.revoked = True

    success, error = commit_session()
    if not success:
        logger.error(error)
        return jsonify_template_user(500, False, "Database error")
    
    response = jsonify_template_user(200, True, "Successfully logged out")

    unset_jwt_cookies(response)
    logger.info("User has logged out")

    return response

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
    access_token = create_access_token(identity=str(user_id))
    response = jsonify_template_user(200, True, "Refresh Token successful")

    set_access_cookies(response, access_token)

    return response

@user_auth.route('/user_data', methods=['GET'])
@jwt_required()
def get_user_data():
    user_id = get_jwt_identity()
    user = db.get(Root_User, int(user_id))

    if not user:
        logger.error("Somehow, someone accessed the fucking route wihtout them being in the database")
        return jsonify_template_user(400, False, "How did you even access this, you are not in the database")

    who_user: Users | Oauth_Users = db.get(Users, int(user_id)) if user.user_type == "local" else db.get(Oauth_Users, int(user_id))

    user_info = who_user.get_user()
    user_posts = [post.get_post() for post in user.posts]

    data = {"user_indo": user_info, 
            "user_posts": user_posts,}

    return jsonify_template_user(200, True, data)

# Global endpoint message for when the user successfully logs in 
@user_auth.route('/login_success', methods=['GET'])
@jwt_required()
def login_success():
    user_id = get_jwt_identity()
    user = db.get(Root_User, int(user_id))

    if not user:
        logger.info("User tried to access login successfull wihtout logging in")
        return jsonify_template_user(400, False, "Please log in to access this")
    
    who_user: Users | Oauth_Users = db.get(Users, int(user_id)) if user.user_type == "local" else db.get(Oauth_Users, int(user_id))

    user_data = {
        "id": who_user.id,
        "username": who_user.username,
        "profile_pic": who_user.profile_pic_url,
        "provider": "local" if who_user.user_type == "local" else who_user.provider,
    }

    return jsonify_template_user(200, True, user_data)
