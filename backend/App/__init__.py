from flask import Flask
from .db import db_session
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from datetime import timedelta
from pathlib import Path
from dotenv import load_dotenv
import logging, os

jwt = JWTManager()
bcrypt = Bcrypt()

env_path = Path(__file__).resolve().parent.parent / ".env"      # Gets the absolute file path of the .env file
load_dotenv(dotenv_path=env_path)                               # Loads the .env file using the its path

# Getting the secrets from the .env file
SQLITE = os.getenv("SQLITEDB")
FLASK_SECRET_KEY = os.getenv("FLASK_SECRET_KEY")
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")

def run_app():
    app = Flask(__name__)
    logging_set_up()

    app.config["SECRET_KEY"] = FLASK_SECRET_KEY

    app.config["JWT_TOKEN_LOCATION"] = ["cookies"]                  # Sets the location where the JWT will be sent, default is headers
    app.config["JWT_SECRET_KEY"] = JWT_SECRET_KEY
    app.config["JWT_COOKIE_SECURE"] = False                         # Requires the cookie to be send thorugh HTTPS, sets to false so we can send both HTTP and HTTPS
    app.config["JWT_COOKIE_CSRF_PROTECT"] = False                   # If True, requires the frontend to inlucde CSRF Token for every call
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes=15)  # Short lived token to increase security, use to make the users have access to jwt_redquired() API
    app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=3)  

    from .auth import user_auth
    from .post_survey import survey_posting

    app.register_blueprint( user_auth, url_prefix="/user" )         # Registers each route for different file for more organized project
    app.register_blueprint( survey_posting, url_prefix="/survey" )

    jwt.init_app(app)
    bcrypt.init_app(app)
    CORS(app, supports_credentials=True)                            # Enables CORS and lets you send JWT through cookie

    # Automatically closses DB sessions
    @app.teardown_appcontext
    def shut_down_sessions(exception=None):
        db_session.remove()

    return app

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
    logger = logging.getLogger(__name__)

# # Create a SQLITE database
# def sqlite_database(app):
#      db_path = Path(app.instance_path) / SQLITE

#      if not db_path.exists():
#         with app.app_context():
#             db.create_all()
#             logger.info("Database has been created")

# class Base(DeclarativeBase):
#     pass

    # app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{db_loc}"   # Location of the database
    # app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False            # Heps improve performance

    # app.config["JWT_TOKEN_LOCATION"] = ["cookies"]                 # Sets the location where the JWT will be sent, default is headers
    # app.config["JWT_SECRET_KEY"] = JWT_SECRET_KEY
    # app.config["JWT_COOKIE_SECURE"] = False                         # Requires the cookie to be send thorugh HTTPS, sets to false since we are using HTTP
    # app.config["JWT_COOKIE_CJWT_ACCESS_TOKENSRF_PROTECT"] = False                   # If True, requires the frontend to inlucde CSRF Token for every call
    # app.config["_EXPIRES"] = timedelta(minutes=15)  # Short lived token to increase security, use to make the users have access to jwt_redquired() API
    # app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=3)     # Long llved token to refresh the access token

# db_path = f"sqlite:///{SQLITE}"
# engine = create_engine(str(db_path), echo=True)
# Session = sessionmaker(bind=engine)
# session = Session()
