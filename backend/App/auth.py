from flask import Flask, request, current_app, Blueprint
from flask_jwt_extended import (
    create_access_token, create_refresh_token, 
    set_access_cookies, set_refresh_cookies, 
    unset_jwt_cookies, decode_token,
    get_jwt_identity, jwt_required, get_jwt
)
from .model import Users, RefreshToken
from App import db, jwt
from datetime import datetime, timezone
import logging
from .user_validation import validate_user_input_exist, validate_username_password
from .db_interaciton import commit_session, jsonify_template_user

logger = logging.getLogger(__name__)
FORMAT = "%(name)s - %(asctime)s - %(funcName)s - %(lineno)d -  %(levelname)s - %(message)s"

handler = logging.FileHandler("Users.log", mode="a")
formatter = logging.Formatter(FORMAT)

handler.setFormatter(formatter)
logger.addHandler(handler) 

user_auth = Blueprint("user_auth", __name__)

@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload):
    jti = jwt_payload["jti"]
    token = RefreshToken.query.filter_by(jti=jti).first()
    return token is not None and token.revoked

@jwt.unauthorized_loader
def check_unauthorized_access(err_msg):
    logger.error(err_msg)

    return jsonify_template_user(401, False, "You need to log in to access this"), 401

@user_auth.route("/register", methods=["POST"])
def user_register():
    data = request.get_json()

    username = data.get("username")
    password = data.get("password")

    validate_result = validate_user_input_exist(username, password)
    validate_user_requirements = validate_username_password(username, password)

    if not validate_result["username"]["ok"] or not validate_result["password"]["ok"]:
        logger.error(validate_result)
        return jsonify_template_user(400, False, validate_result ), 400
    
    if not validate_user_requirements["username"]["ok"] or not validate_user_requirements["password"]["ok"]:
        logger.error(validate_user_requirements)
        return jsonify_template_user(422, False, validate_user_requirements), 422

    if Users.query.filter_by(username=username).first():
        msg = "Username already exist"
        logger.error(msg)
        return jsonify_template_user(409, False, msg), 409
    
    user = Users(username=username)
    user.set_password(password)

    db.session.add(user)
    success, error = commit_session()
    if not success:
        logger.exception(error)
        return jsonify_template_user(500, False, "Database Error"), 500
    
    return jsonify_template_user(200, True, "User registered successful"), 200

@user_auth.route("/login", methods=["PSOT"])
def user_login():
    data = request.get_json()

    username = data.get("username")
    password = data.get("password")

    validate_result = validate_user_input_exist(username, password)

    if not validate_result["username"]["ok"] or not validate_result["password"]["ok"]:
        logger.error(validate_result)
        return jsonify_template_user(400, False, validate_result), 400
    
    user = Users.query.filter_by(username=username).first()

    if not user:
        msg = "Username does not exist"
        logger.error(msg)
        return jsonify_template_user(400, False, msg), 400
    
    access_token = create_access_token(identity=str(user.id))
    refresh_token = create_refresh_token(identity=str(user.id))

    refresh_token_decoded = decode_token(refresh_token)
    jti = refresh_token_decoded.get("jti")

    expires = datetime.now(timezone.utc) + current_app.config["JWT_REFRESH_TOKEN_EXPIRES"]
    current_refresh_token = RefreshToken(jti=jti, user_id=user.id, expires_at=expires)

    db.session.add(current_refresh_token)

    success, error = commit_session()
    if not success:
        logger.exception(error)
        return jsonify_template_user(500, False, "Database Error"), 500
    
    response = jsonify_template_user(200, True, "Login successful")

    set_access_cookies(response, access_token)
    set_refresh_cookies(response, refresh_token)

    logger.info("Login Succesful")

    return response, 200
    
@user_auth.route("/logout", methods=["POST"])
@jwt_required(refresh=True)
def logout():
    jti = get_jwt()["jti"]
    token = RefreshToken.query.filter_by(jti=jti)

    if not token.revoked:
        return jsonify_template_user(404, False, "You need to log in again")
    
    token.revoked = True

    success, error = commit_session()
    if not success:
        logger.error(error)
        return jsonify_template_user(500, False, "Databse error")
    
    response = jsonify_template_user(200, True, "Successfylly logged out")

    unset_jwt_cookies(response)
    logger.info("User has logged out")

    return response, 200

@user_auth.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh_access():
    jti = get_jwt()["jti"]
    token = RefreshToken.query.filter_by(jti=jti, revoked=False).first()

    if not token:
        return jsonify_template_user(404, False, "You need to log in again"), 404
    
    user_id = get_jwt_identity()
    access_token = create_access_token(identity=user_id)
    response = jsonify_template_user(200, True, "Refresh Token successful")

    set_access_cookies(response, access_token)

    return response, 200