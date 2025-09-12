from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from datetime import timedelta
from pathlib import Path
from dotenv import load_dotenv
import logging, os

app = Flask(__name__)
db = SQLAlchemy()
jwt = JWTManager(app)
bcrypt = Bcrypt(app)

env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

SQLITE = os.getenv("SQLITEDB")
FLASK_SECRET_KEY = os.getenv("FLASK_SECRET_KEY")
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")

FORMAT = "%(filename)s - %(asctime)s - %(levelname)s - %(message)s"
DATEFMT = "%Y-%m-%d %H:%M:%S"
logging.basicConfig(level=logging.INFO,
                    filename="Init.log",
                    filemode="w",
                    format=FORMAT,
                    datefmt=DATEFMT)
logger = logging.getLogger(__name__)

def run_app():

    app.config["SECRET_KEY"] = FLASK_SECRET_KEY

    app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{SQLITE}"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    app.config["JWT_TOKEN_LOCATIONS"] = ["cookies"]
    app.config["JWT_SECRET_KEY"] = JWT_SECRET_KEY
    app.config["JWT_COOKIE_SECURE"] = False
    app.config["JWT_COOKIE_CSRF_PROTECT"] = False
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes=15)
    app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=3)

    db.init_app(app)
    CORS(app, supports_credentials=True)

    sqlite_database(app)

    @app.teardown_appcontext
    def shut_down_sessions(Exceptions=None):
        db.session.remove()

    return app


def sqlite_database(app):
     db_path = Path(app.instance_path) / SQLITE
     if not db_path.exists():
        with app.app_context():
            db.create_all()
            logger.info("Database has been created")