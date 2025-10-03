from flask import jsonify, redirect, make_response, url_for, Blueprint
from App import oauth
from sqlalchemy import select, and_
from .database import db_session as db
from .model import Oauth_Users
from .helper_methods import commit_session, logger_setup
from .env_config import GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
from flask_jwt_extended import ( create_access_token, set_access_cookies, 
                                jwt_required, get_jwt_identity, unset_jwt_cookies )


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

logger = logger_setup(__name__, "user_oauth.log")

oauth_me = Blueprint("oauth_me", __name__)

@oauth_me.route("/login")
def login():
    redirect_uri = url_for("oauth_me.authorize", _external=True)
    return google.authorize_redirect(redirect_uri)

@oauth_me.route("/authorized/google")
def authorize():
    # or store this using a variable, im not using it so im just initializing it
    _ = google.authorize_access_token()

    # user_info = google.get("userinfo").json()
    user_info = google.userinfo()

    stmt = select(Oauth_Users).where(and_(Oauth_Users.provider == "google", Oauth_Users.provider_user_id == user_info["sub"]))
    user = db.execute(stmt).scalar_one_or_none()
    if not user:
        user = Oauth_Users(provider="google", username=user_info["name"], email=user_info["email"],
                        provider_user_id=user_info["sub"], profile_pic_url=user_info["picture"])
        db.add(user)
        success, error = commit_session()
        if not success:
            logger.error(error)
            return redirect("http://localhost:5173?msg=Database_error")
        logger.info("User added to the database")

    access_token = create_access_token(identity=str(user.id))

    # to pass data to the response you need to type a query params
    resp = make_response(redirect("http://localhost:5173?msg=Login_successful"))
    set_access_cookies(resp, access_token)

    logger.info("User successfully logged in as google")

    return resp

@oauth_me.route("/protected")
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify({"message": current_user})

@oauth_me.route("/logout")
@jwt_required()
def logout():
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