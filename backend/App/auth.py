from flask import Flask, request, jsonify, current_app, Blueprint
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
from User_validation import validate_user_input_exist, validate_username, validate_password

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

    return jsonify_template(401, False, "You need to log in to access this"), 401

@user_auth.route("/register", methods=["POST"])
def uesr_register():
    data = request.get_json()

    username = data.get("username")
    password = data.get("username")

    input_valid, input_msg = validate_user_input_exist(username, password)
    usnm_valid, usnm_msg = validate_username(username)
    pssw_valid, pssw_msg = validate_password(password)

    if not input_valid:
        logger.error(input_msg)
        return jsonify_template(422, False, input_msg), 422

    if not usnm_valid:
        logger.error(usnm_msg)
        return jsonify_template(422, False, usnm_msg), 422
    
    if not pssw_valid:
        logger.error(pssw_msg)
        return jsonify_template(422, False, pssw_msg), 422

    if Users.query.filter_by(username=username).first():
        msg = "Username already exist"
        logger.error(msg)
        return jsonify_template(409, False, msg), 409
    
    user = Users(username=username)
    user.set_password(password)

    db.session.add(user)
    success, error = commit_session()
    if not success:
        logger.exception(error)
        return jsonify_template(500, False, "Database Error"), 500
    
    return jsonify_template(200, True, "User registered successful"), 200

def commit_session():
    try:
        db.session.commit()
        return (True, None)
    except Exception as e:
        db.session.rollback()
        return (False, str(e))

def jsonify_template(status: int, ok: bool, message: str):
    return jsonify({ "status": status, "ok": ok, "message": message })
