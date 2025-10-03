from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase, scoped_session
from pathlib import Path
from urllib.parse import quote_plus
from .env_config import ( SQLITE, SPBS_PASSWORD, SPBS_PORT, SPBS_DATABASE,
                         SPBSV4_HOST, SPBSV4_USER, SPBSDR_USER, SPBSDR_HOST )
import logging

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

DB_PATH = Path(__file__).resolve().parent.parent / f"instance/{SQLITE}"
PSSW_PARSED = quote_plus(SPBS_PASSWORD)

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

# Puts all the session into a global one so i cant use app teardown
db_session = scoped_session(SessionLocal)

# Class for all my table database to inherit form
class Base(DeclarativeBase):
    pass