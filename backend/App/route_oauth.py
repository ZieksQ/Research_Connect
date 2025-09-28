from flask import jsonify, redirect, make_response, url_for, Blueprint
from flask_jwt_extended import create_access_token, set_access_cookies, jwt_required, get_jwt_identity, unset_jwt_cookies
from dotenv import load_dotenv
from pathlib import Path
from App import oauth
from .database import db_session as db
from .model import Oauth_Users
from .helper_db_interaction import commit_session, logger_setup
import os

env_path = Path(__file__).resolve().parent.parent / ".env"      # Gets the absolute file path of the .env file
load_dotenv(dotenv_path=env_path)  

GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.environ.get("GOOGLE_CLIENT_SECRET")

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

    user = Oauth_Users(provider="google", username=user_info["name"], 
                       provider_user_id=user_info["sub"], picture=user_info["picture"])

    access_token = create_access_token(identity=f"{user.provider}_{user.provider_user_id}")

    db.add(user)
    success, error = commit_session()
    if not success:
        logger.error(error)
        return redirect("http://localhost:5173?message=Database_error")

    # to pass data to the response you need to type a query parameter
    resp = make_response(redirect("http://localhost:5173?message=Login_successful"))
    set_access_cookies(resp, access_token)
    
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