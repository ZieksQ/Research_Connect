from App import jwt
from sqlalchemy import select
from datetime import datetime, timezone
from .helper_methods import jsonify_template_user, logger_setup
from .database import db_session as db
from .model import RefreshToken

logger = logger_setup(__name__, "JWT_callback.log")

# Callback method to return as response to expired token
@jwt.expired_token_loader
def expired_token_response(jwt_header, jwt_payload):
    token_type = jwt_payload.get("type", "access")  # default to 'access'

    if token_type == "refresh":
        return jsonify_template_user( 401, False, "Your refresh token has expired. Please log in again.",
            token=False, token_msg="refresh token expired"
        )
    
    return jsonify_template_user( 401, False, "Access token expired. You need to refresh it.",
        token=False, token_msg="access token expired"
    )

# Callback method to check if the token is revoked
@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload):
    jti = jwt_payload["jti"]

    stmt = select(RefreshToken).where(RefreshToken.jti == jti)
    token = db.execute(stmt).scalars().first() 

    if token is None:
        return True

    if token.expires_at < datetime.now(timezone.utc):
        return True

    return token.revoked

# Customize callback method to send a messaage to the frontend for any unauthorized access e.g. users accessing jwt_required()
@jwt.unauthorized_loader
def check_unauthorized_access(err_msg):
    logger.error(err_msg)

    return jsonify_template_user(401, False, "You need to log in to access this",
                                 logged_in=False, logged_in_msg="Please log in before accessing this")

#-------------------------------------------------------------------------------------------------------

'''
jwt_payload
{
    "sub": 42,                      # "subject" - usually the user id
    "iat": 1728463517,              # Issued At (UNIX timestamp)
    "nbf": 1728463517,              # Not Before
    "exp": 1728467117,              # Expiration Time
    "type": "access",               # 'access' or 'refresh'
    "fresh": True,                  # True for fresh tokens (login), False for refreshed
    "jti": "e6e7a84a-859b-4c3d...", # JWT ID (unique identifier)
    "custom_field": "whatever_you_added"  # Any extra data you set in create_access_token()
}

jwt_header
{
    "alg": "HS256",    # Algorithm used (HMAC SHA256)
    "typ": "JWT"       # Token type
}
'''

#-------------------------------------------------------------------------------------------------------

'''
from flask_jwt_extended import create_access_token, create_refresh_token

access_token = create_access_token(
    identity=user.id,
    additional_claims={"role": user.role, "username": user.username}
)
refresh_token = create_refresh_token(identity=user.id)

jwt_payload
{
    "sub": user.id,
    "role": "admin",
    "username": "alice",
    "type": "access",
    "iat": 1728463517,
    "exp": 1728467117,
    "jti": "...",
    "fresh": True
}
'''