from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase, scoped_session
from pathlib import Path
from dotenv import load_dotenv
from urllib.parse import quote_plus
import os, logging

def logging_set_up():
    FORMAT = "%(name)s - %(asctime)s - %(funcName)s - %(lineno)d - %(levelname)s - %(message)s"
    DATEFMT = "%Y-%m-%d %H:%M:%S"
    log_path = Path(__file__).resolve().parent.parent / "log_folder/sqlalchemy.log"

    logging.basicConfig(
        level=logging.INFO,
        filename=log_path,
        filemode="w",
        format=FORMAT,
        datefmt=DATEFMT
    )

    sqla_logger = logging.getLogger("sqlalchemy.engine")
    sqla_logger.setLevel(logging.INFO) 

    for handler in logging.getLogger().handlers:
        sqla_logger.addHandler(handler)

logging_set_up()

env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

SQLITE = os.environ.get("SQLITEDB")
DB_PATH = Path(__file__).resolve().parent.parent / f"instance/{SQLITE}"

SPBS_PASSWORD = os.environ.get("SPBS_PASSWORD")
SPBS_PORT = os.environ.get("SPBS_PORT")
SPBS_DATABASE = os.environ.get("SPBS_DATABASE")
PSSW_PARSED = quote_plus(SPBS_PASSWORD)

# IPv4 
SPBSV4_HOST = os.environ.get("SPBSV4_HOST")
SPBSV4_USER  = os.environ.get("SPBSV4_USER")

# Direct Connection
SPBSDR_HOST = os.environ.get("SPBSDR_HOST")
SPBSDR_USER = os.environ.get("SPBSDR_USER")


TESTING = True  # Used for unit testing
SQLDB = True    # For wanting to switch to a real DB instead of memory 
IPV4 = True     # True if you need IPv4 compatibility, however if not set it to false as it is recommended by Supabase

if TESTING == True:
    if SQLDB:
        DATABASE_URL = f"sqlite:///{DB_PATH}"
    else: 
        DATABASE_URL = "sqlite:///:memory:"

else:
    if IPV4 == True:
        # IPv4 Compatible
        DATABASE_URL = f"postgresql://{SPBSV4_USER}:{PSSW_PARSED}@{SPBSV4_HOST}:{SPBS_PORT}/{SPBS_DATABASE}"
    else:
        # Not IPv4 Compatible, Direct Connection
        DATABASE_URL = f"postgresql://{SPBSDR_USER}:{PSSW_PARSED}@{SPBSDR_HOST}:{SPBS_PORT}/{SPBS_DATABASE}"

# Set ups the database connection
engine = create_engine(
    DATABASE_URL,
    echo=False,
    future=True 
)

# Makes it possible to connect to the database
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    future=True
)

# Puts all the session intoi a global one so i cant use app teardown
db_session = scoped_session(SessionLocal)

# Class for all my table database to inherit form
class Base(DeclarativeBase):
    pass