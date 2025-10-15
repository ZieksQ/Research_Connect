from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from datetime import timedelta
from authlib.integrations.flask_client import OAuth
from supabase import create_client
from .database import db_session
from .helper_methods import logger_setup
from .env_config import ( FLASK_SECRET_KEY, JWT_SECRET_KEY,
                         SPBS_PROJECT_URL, SPBS_SERVICE_ROLE_KEY )
jwt = JWTManager()
bcrypt = Bcrypt()
oauth = OAuth()

def run_app():
    app = Flask(__name__)
    
    logger_setup(__name__, "dunder_init.log")

    app.config["SECRET_KEY"] = FLASK_SECRET_KEY

    app.config["JWT_TOKEN_LOCATION"] = ["cookies"]                  # Sets the location where the JWT will be sent, default is headers
    app.config["JWT_SECRET_KEY"] = JWT_SECRET_KEY
    app.config["JWT_COOKIE_SECURE"] = False                         # Requires the cookie to be send thorugh HTTPS, sets to false so we can send both HTTP and HTTPS
    app.config["JWT_COOKIE_CSRF_PROTECT"] = False                   # If True, requires the frontend to inlucde CSRF Token for every call
    app.config["JWT_COOKIE_SAMESITE"] = "Lax"                       # To allow cookies to be send on cross origins, use Lax for dev, use None for production
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes=15)  # Short lived token to increase security, use to make the users have access to jwt_redquired() API
    app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=3)

    from .route_auth import user_auth
    from .route_post_survey import survey_posting
    from .route_oauth import oauth_me

    app.register_blueprint( user_auth, url_prefix="/user" )         # Registers each route for different file for more organized project
    app.register_blueprint( survey_posting, url_prefix="/survey" )
    app.register_blueprint( oauth_me, url_prefix="/oauth" )

    jwt.init_app(app)                                               # Initializes Each library
    bcrypt.init_app(app)
    oauth.init_app(app)
    CORS(app, supports_credentials=True)                            # Enables CORS and lets you send JWT through cookie

    # Automatically closses DB sessions
    @app.teardown_appcontext
    def shut_down_sessions(exception=None):
        db_session.remove()

    return app

# To connect to supabase to host my users profile pic
supabase_client = create_client(SPBS_PROJECT_URL, SPBS_SERVICE_ROLE_KEY)
default_profile_pic = "https://siqejctaztvawzceuhrw.supabase.co/storage/v1/object/public/profile_pic/Jane_Silksong.jpg"

'''
def logging_set_up():
    # Formats how the logging should be in the log file
    FORMAT = "%(filename)s - %(asctime)s - %(levelname)s - %(message)s"
    DATEFMT = "%Y-%m-%d %H:%M:%S"
    log_path = Path(__file__).resolve().parent.parent / "log_folder/dunder_init.log"
    logging.basicConfig(level=logging.INFO,
                        filename=log_path,
                        filemode="w",
                        format=FORMAT,
                        datefmt=DATEFMT)
    logging.getLogger(__name__)
'''