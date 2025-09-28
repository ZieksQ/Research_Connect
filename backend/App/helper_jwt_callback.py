from App import jwt
from sqlalchemy import select
from .helper_db_interaction import jsonify_template_user, logger_setup
from .database import db_session as db
from .model import RefreshToken

logger = logger_setup(__name__, "JWT_callback.log")

# Callback method to return as response to expired token
@jwt.expired_token_loader
def expired_token_response(jwt_header, jwt_payload):
    return jsonify_template_user(401, False, "You need to refresh the access token", token={"Expired Token" : True}), 401

# Callback method to check if the token is revoked
@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload):
    jti = jwt_payload["jti"]

    stmt = select(RefreshToken).where(RefreshToken.jti == jti)
    token = db.execute(stmt).scalars().first() 

    return token is not None and token.revoked

# Customize callback method to send a messaage to the frontend for any unauthorized access e.g. users accessing jwt_required()
@jwt.unauthorized_loader
def check_unauthorized_access(err_msg):
    logger.error(err_msg)

    return jsonify_template_user(401, False, "You need to log in to access this"), 401
