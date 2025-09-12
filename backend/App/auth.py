from flask import Flask, request, jsonify, current_app, Blueprint
from flask_jwt_extended import (
    create_access_token, create_refresh_token, 
    set_access_cookies, set_refresh_cookies, 
    unset_jwt_cookies, decode_token,
    get_jwt_identity, jwt_required, get_jwt
)
from .model import User
from App import db, jwt
from datetime import datetime, timezone
import logging

logger = logging.getLogger(__name__)
FORMAT = "%(name)s - %(asctime)s - %(funcName)s - %(lineno)d -  %(levelname)s - %(message)s"

handler = logging.FileHandler("Users.log", mode="a")
formatter = logging.Formatter(FORMAT)

handler.setFormatter(formatter)
logger.addHandler(handler) 

user_auth = Blueprint("user_auth", __name__)

def commit_session():
    try:
        db.session.commit()
        return (True, None)
    except Exception as e:
        db.session.rollback()
        return (False, str(e))
    
def validate_user(data, username, password):
    if not data or not username or not password:
        logger.error("Missing Credentials")
        return False
    return True