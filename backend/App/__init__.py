from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from flask_mail import Mail
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_limiter.errors import RateLimitExceeded
from datetime import timedelta
from authlib.integrations.flask_client import OAuth
from supabase import create_client
from .database import db_session
from .helper_methods import logger_setup, jsonify_template_user
from .env_config import ( FLASK_SECRET_KEY, JWT_SECRET_KEY, GOOGLE_APP_PSSW,
                         SPBS_PROJECT_URL, SPBS_SERVICE_ROLE_KEY, REDIS_HOST, REDIS_PSSW )

jwt = JWTManager()
bcrypt = Bcrypt()
oauth = OAuth()
mail = Mail()
limiter = Limiter(key_func=get_remote_address, enabled=True)

def run_app():
    app = Flask(__name__)
    
    logger = logger_setup(__name__, "dunder_init.log")

    app.config["SECRET_KEY"] = FLASK_SECRET_KEY

    # flask-jwt-extended config
    app.config["JWT_TOKEN_LOCATION"] = ["cookies"]                  # Sets the location where the JWT will be sent, default is headers
    app.config["JWT_SECRET_KEY"] = JWT_SECRET_KEY
    app.config["JWT_COOKIE_CSRF_PROTECT"] = False                   # If True, requires the frontend to inlucde CSRF Token for every call
    app.config["JWT_COOKIE_SECURE"] = False                         # Requires the cookie to be send thorugh HTTPS, sets to false so we can send both HTTP and HTTPS
    app.config["JWT_COOKIE_SAMESITE"] = "Lax"                       # To allow cookies to be send on cross origins, use Lax for dev, use None for production
    app.config["JWT_ACCESS_COOKIE_PATH"] = "/"                      # sent with all requests to your API (/, /users, /posts, etc.)
    app.config["JWT_REFRESH_COOKIE_PATH"] = "/api/user/refresh"     # sent only to /api/user/refresh endpoint    
    app.config["JWT_SESSION_COOKIE"] = False                        # False to have persistent cookies intead of session one, see users_auth.log for cookies, it now has expiration
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes=15)  # Short lived token to increase security, use to make the users have access to jwt_redquired() API
    app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=3)

    # flask-mail config
    app.config['MAIL_SERVER'] = 'smtp.gmail.com'
    app.config['MAIL_PORT'] = 587
    app.config['MAIL_USE_TLS'] = True
    app.config['MAIL_USE_SSL'] = False
    app.config['MAIL_USERNAME'] = 'cas092125@gmail.com'
    app.config['MAIL_DEFAULT_SENDER'] = 'cas092125@gmail.com'
    app.config['MAIL_PASSWORD'] = GOOGLE_APP_PSSW

    # flask-limiter and redis ipstash
    app.config["RATELIMIT_DEFAULT"] = "10 per minute"
    app.config["RATELIMIT_STORAGE_URI"] = F"rediss://default:{REDIS_PSSW}@{REDIS_HOST}:6379" if REDIS_HOST and REDIS_PSSW else "memory://"

    jwt.init_app(app)                                                   # Initializes Each library
    bcrypt.init_app(app)
    oauth.init_app(app)
    mail.init_app(app)
    limiter.init_app(app)

    from App import models
    from App import helper_jwt_callback                                 # is like this so i can initialize my global jwt callback messages
    from .routes.route_auth import user_auth
    from .routes.route_post_survey import survey_posting
    from .routes.route_oauth import oauth_me
    from .routes.route_otp import otp_route
    from .routes.route_admin import admin
    from .routes.route_mass_produce_data import mass_data

    app.register_blueprint( user_auth, url_prefix="/api/user" )         # Registers each route for different file for more organized project
    app.register_blueprint( survey_posting, url_prefix="/api/survey" )
    app.register_blueprint( oauth_me, url_prefix="/api/oauth" )
    app.register_blueprint( otp_route, url_prefix="/api/otp")
    app.register_blueprint( admin, url_prefix="/api/admin")
    app.register_blueprint( mass_data, url_prefix="/api/mass")

    CORS(app, supports_credentials=True)                                # Enables CORS and lets you send JWT through cookie

    # Automatically closses DB sessions
    @app.teardown_appcontext
    def shut_down_sessions(exception=None):
        db_session.remove()

    @app.errorhandler(RateLimitExceeded)
    def handle_rate_limit(e):
        error_msg = str(e).split(":")
        _, msg = error_msg
        return jsonify_template_user(429, False, f"Too many request, you can only try{msg}")

    return app

# To connect to supabase to host my users profile pic
supabase_client = create_client(SPBS_PROJECT_URL, SPBS_SERVICE_ROLE_KEY)


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