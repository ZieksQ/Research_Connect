from App import supabase_client, limiter
from flask import request, current_app, Blueprint, jsonify
from datetime import datetime, timezone
from sqlalchemy import select, and_, or_
from App.database import db_session as db
from App.models.model_users import Root_User, Users, Oauth_Users, RefreshToken
from App.models.model_enums import User_Roles
from App.helper_user_validation import ( handle_user_input_exist, handle_validate_requirements, 
                                        handle_profile_pic, handle_password_reset_user, handle_user_info_requirements )
from App.helper_methods import ( commit_session, jsonify_template_user,
                                logger_setup, create_access_refresh_tokens )
from flask_jwt_extended import (
    set_access_cookies, set_refresh_cookies, unset_jwt_cookies, 
    get_jti, get_jwt_identity, jwt_required, get_jwt
)
import uuid

# Sets up the logger from my helper file
logger = logger_setup(__name__, "auth_users.log")
# Set up a route for each file so it is more organized
user_auth = Blueprint("user_auth", __name__)

who_user_query = lambda id, utype: db.get(Users, id) if utype == "local" else db.get(Oauth_Users, id)

@user_auth.route("/register", methods=["POST"])
@limiter.limit("10 per minute;100 per hour;200 per day")
def user_register():
    data: dict = request.get_json(silent=True) or {} # Gets the JSON from the frontend, returns None if its not JSON or in this case an empty dict

    username = data.get("username", "")
    password = data.get("password", "")

    validate_result, exists_flag = handle_user_input_exist(username, password)
    if exists_flag:
        logger.error(validate_result)
        return jsonify_template_user(404, False, validate_result )
    
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
@limiter.limit("10 per minute;100 per hour;200 per day")
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
    
    access_token, refresh_token = create_access_refresh_tokens(identity=user)

    jti = get_jti(refresh_token)

    expires: datetime = datetime.now(timezone.utc) + current_app.config["JWT_REFRESH_TOKEN_EXPIRES"]
    current_refresh_token = RefreshToken(jti=jti, user_token=user, expires_at=expires )

    db.add(current_refresh_token)

    success, error = commit_session()
    if not success:
        logger.exception(error)
        return jsonify_template_user(500, False, "Database Error")
    
    response = jsonify_template_user(200, True, "Login successful", login_type="inquira")

    set_access_cookies(response, access_token)
    set_refresh_cookies(response, refresh_token)

    logger.info(response.headers)
    logger.info("Login Succesful")

    return response

@user_auth.route("/profile_upload", methods=["PATCH"])
@jwt_required()
@limiter.limit("2 per minute;10 per hour;50 per day", key_func=get_jwt_identity)
def profile_upload():
    profile_pic = request.files.get("profile_pic")

    user_id = get_jwt_identity()
    user = db.get(Root_User, int(user_id))

    if not user:
        logger.info("Someone tired to change profile without logging or having a nexisting user")
        return jsonify_template_user(400, False, "You need to log in to access this")

    profile_msg, profile_flag = handle_profile_pic(profile_pic)
    if profile_flag:
        logger.error(profile_msg)
        return jsonify_template_user(400, False, profile_msg)
    
    filename = f"{uuid.uuid4()}_{profile_pic.filename}"

    try:
        resp = supabase_client.storage.from_("profile_pic").upload(path=filename, file=profile_pic.read(), 
                                                               file_options={"content-type": profile_pic.content_type})
    except Exception as e:
        logger.exception(f"Exception type: {type(e).__name__}, message: {e}")
        return jsonify_template_user(500, False, str(type(e).__name__))
    
    logger.info(resp)
    if hasattr(resp, "error"):
        logger.error(resp.error)
        return jsonify_template_user(500, False, resp.error)
    
    who_user = who_user_query(int(user_id), user.user_type)
    public_url = supabase_client.storage.from_("profile_pic").get_public_url(path=filename)
    who_user.profile_pic_url = public_url

    success, error = commit_session()
    if not success:
        logger.exception(error)
        return jsonify_template_user(500, False, "Database Error")
    
    logger.info("User has uploaded a profile picture")

    return jsonify_template_user(200, True, "Upload successful")


@user_auth.route("/refresh/logout", methods=["POST"])
@jwt_required(refresh=True)
@limiter.limit("10 per minute;100 per hour;200 per day", key_func=get_jwt_identity)
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
@limiter.limit("2 per minute;30 per hour;500 per day", key_func=get_jwt_identity)
def refresh_access():
    jti = get_jwt()["jti"]
    stmt = select(RefreshToken).where(and_(RefreshToken.jti == jti, RefreshToken.revoked == False))
    token = db.execute(stmt).scalar_one_or_none()

    if not token:
        return jsonify_template_user(404, False, "You need to log in again")
    
    user_id = get_jwt_identity()
    user = db.get(Root_User, int(user_id))
    if not user:
        logger.error("Users tried to refresh wihtout logging in")
        return jsonify_template_user(401, False,
                                     "Please log in")
    
    access_token, _ = create_access_refresh_tokens(identity=user)
    response = jsonify_template_user(200, True, "Refresh Token successful")

    set_access_cookies(response, access_token)

    logger.info(f"{user_id} refresh access cookie")

    return response

@user_auth.route('/user_data', methods=['GET'])
@jwt_required()
@limiter.limit("20 per minute;300 per hour;5000 per day", key_func=get_jwt_identity)
def get_user_data():
    user_id = get_jwt_identity()
    user = db.get(Root_User, int(user_id))

    if not user:
        logger.error("Somehow, someone accessed the fucking route wihtout them being in the database")
        return jsonify_template_user(400, False, "How did you even access this, you are not in the database")

    who_user =  who_user_query(int(user_id), user.user_type)
    user_info = who_user.get_user()
    user_posts = [post.get_post() for post in user.posts]

    data = {"user_info": user_info, 
            "user_posts": user_posts,}
    
    logger.info("You have got the user data")

    return jsonify_template_user(200, True, data)

# Global endpoint message for when the user successfully logs in1 
@user_auth.route('/login_success', methods=['GET'])
@jwt_required()
@limiter.limit("2 per minute;30 per hour;200 per day", key_func=get_jwt_identity)
def login_success():
    user_id = get_jwt_identity()
    user = db.get(Root_User, int(user_id))

    if not user:
        logger.info("User tried to access login successfull wihtout logging in")
        return jsonify_template_user(400, False, "Please log in to access this")
    
    who_user = who_user_query(int(user_id), user.user_type)

    user_data = {
        "user_info": who_user.get_user(),
        "role": who_user.user_type,
    }

    return jsonify_template_user(200, True, user_data, is_logged_in=True)

@user_auth.route("/update_data", methods=["PATCH"])
@jwt_required()
@limiter.limit("2 per minute;100 per hour;500 per day")
def update_data():
    data: dict = request.get_json()

    user_id = get_jwt_identity()
    user = db.get(Root_User, int(user_id))

    logger.info(data)

    if not user:
        logger.info("User tried to change their info without logging in")
        return jsonify_template_user(401, False, "You need to log in to access this")

    username: str = data.get("username", None).strip()
    school: str = data.get("school", None).strip()
    program: str = data.get("program", None).strip()

    info_validate, info_flag = handle_user_info_requirements(username, school, program)
    if info_flag:
        logger.info(f"{user.id} tried to change their info with missing requirements")
        logger.info(info_validate)
        return jsonify_template_user(422, False, info_validate, extra_msg="You must meet these requirements")
    
    who_user = who_user_query(user.id, user.user_type)

    who_user.username = username
    who_user.school = school
    who_user.program = program

    succ, err = commit_session()
    if not succ:
        logger.info(err)
        return jsonify_template_user(500, False, "Database Error")
    
    logger.info(f"{user.id} has updated their info")

    return jsonify_template_user(200, True, "You have updated your info")


@user_auth.route("/debug", methods=['GET'])
@jwt_required()
def debug():
    logger.info("getting cookies")
    payload = get_jwt()

    user_id = get_jwt_identity()
    user = db.get(Root_User, int(user_id))
    oauth_user = db.get(Oauth_Users, 3)

    who_user = who_user_query(user.id, user.user_type)
    user = str(type(who_user)).split(".")
    oauth_user = str(type(oauth_user)).split(".")
    user_strped = user[-1].rstrip("'>")
    oauth_user_strped = oauth_user[-1].rstrip("'>")
    verify1 = "Users" == user_strped
    verify2 = "Users" == oauth_user_strped
    handle_user = handle_password_reset_user(oauth_user)

    return jsonify({
        # "cookies": dict(request.cookies),
        # "headers": dict(request.headers),'
        "type1": verify1,
        "type2": verify2,
        "user_strped": user_strped,
        "oauth_user_strped": oauth_user_strped,
        "user": user,
        "oauth_user": oauth_user,
        "handle_user": handle_user,
        "role": payload,
    })