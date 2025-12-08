from App import oauth, limiter
from flask import jsonify, redirect, make_response, url_for, Blueprint, current_app, request, session
from sqlalchemy import select, and_
from datetime import datetime, timezone
from App.database import db_session as db
from App.models.model_users import Oauth_Users, RefreshToken
from App.models.model_enums import User_Roles
from App.helper_methods import commit_session, logger_setup, create_access_refresh_tokens, flush_session
from App.env_config import GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CLIENT_ID_FLUTTER
from flask_jwt_extended import ( set_access_cookies, get_jti, set_refresh_cookies,
                                jwt_required, get_jwt_identity, unset_jwt_cookies )

logger = logger_setup(__name__, "user_oauth.log")

oauth_me = Blueprint("oauth_me", __name__)

google = oauth.register(
    name="google",
    client_id=GOOGLE_CLIENT_ID,
    client_secret=GOOGLE_CLIENT_SECRET,
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={"scope": "openid email profile"},
    # You basically need these 3 commented code, google is special since you can get theese using server_metadata_url
    # access_token_url="https://oauth2.googleapis.com/token",
    # authorize_url="https://accounts.google.com/o/oauth2/auth",
    # api_base_url="https://www.googleapis.com/oauth2/v1/",
)

ALLOWED_REDIRECTS = {
    "react": "http://localhost:5173/home",
    "flutter": "myapp://oauth-callback",
    }

is_valid_redirect = lambda url: url in ALLOWED_REDIRECTS
get_url = lambda url: ALLOWED_REDIRECTS.get(url)

@oauth_me.route("/login")
@limiter.limit("20 per minutes;100 per hour;200 per day")
def login():
    redirect_url = request.args.get("redirect_url")
    if not redirect_url or not is_valid_redirect(redirect_url):
        return redirect("http://localhost:5173?msg=invalid_redirect")

    session["redirect_url"] = get_url(redirect_url)
    redirect_uri = url_for("oauth_me.authorize", _external=True)
    return google.authorize_redirect(redirect_uri)

@oauth_me.route("/authorized/google")
@limiter.limit("20 per minutes;100 per hour;200 per day")
def authorize():
    # or store this using a variable, im not using it so im just initializing it
    _ = google.authorize_access_token()

    # user_info = google.get("userinfo").json()
    user_info = google.userinfo()

    url_redirect = session.get("redirect_url")

    stmt = select(Oauth_Users).where(and_(Oauth_Users.provider == "google", 
                                          Oauth_Users.provider_user_id == user_info["sub"]))
    user = db.execute(stmt).scalar_one_or_none()
    if not user:
        user = Oauth_Users(provider="google", username=user_info["name"], email=user_info["email"],
                        provider_user_id=user_info["sub"], profile_pic_url=user_info["picture"])
        user.role = User_Roles.USER.value
        db.add(user)
        success, error = flush_session()
        if not success:
            logger.exception(error)
            return redirect(f"{url_redirect}?msg=Database_error")
        logger.info("User added to the database")

    access_token, refresh_token = create_access_refresh_tokens(identity=user)

    jti = get_jti(refresh_token)

    expires: datetime = datetime.now(timezone.utc) + current_app.config["JWT_REFRESH_TOKEN_EXPIRES"]
    current_refresh_token = RefreshToken(jti=jti, user_token=user, expires_at=expires)

    db.add(current_refresh_token)
    success, error = commit_session()
    if not success:
        logger.exception(error)
        return redirect(f"{url_redirect}?msg=Database_error")
    
    # to pass data to the response you need to type a query params
    resp = make_response(redirect(f"{url_redirect}?msg=Login_successful&login_type=google"))

    set_access_cookies(resp,
                       access_token,
                       max_age=current_app.config["JWT_ACCESS_TOKEN_EXPIRES"])
    set_refresh_cookies(resp,
                        refresh_token,
                        max_age=current_app.config["JWT_REFRESH_TOKEN_EXPIRES"])

    logger.info(resp.headers)

    return resp

@oauth_me.route("/protected")
@jwt_required()
@limiter.limit("1 per day", key_func=get_jwt_identity)
def protected():
    current_user = get_jwt_identity()
    return jsonify({"message": current_user})


@oauth_me.route("/logout", methods=['POST'])
@jwt_required()
@limiter.limit("1 per day", key_func=get_jwt_identity)
def logout():
    """Deprecated dont use this"""
    resp = jsonify({"message": "You are logged out"})
    unset_jwt_cookies(resp)
    return resp 
    

# The data being sent by google.get("userinfo").json()
'''
{
  "sub": "110123456789012345678",
  "name": "John Doe",
  "given_name": "John",
  "family_name": "Doe",
  "picture": "https://lh3.googleusercontent.com/a-/AOh14Gh...",
  "email": "johndoe@gmail.com",
  "email_verified": true,
  "locale": "en"
}
'''