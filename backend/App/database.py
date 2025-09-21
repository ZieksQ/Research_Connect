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
SQLITE = os.getenv("SQLITEDB")

SPBS_PASSWORD = os.getenv("SPBS_PASSWORD")
SPBS_PORT = os.getenv("SPBS_PORT")
SPBS_DATABASE = os.getenv("SPBS_DATABASE")

# IPv4 
SPBSV4_HOST = os.getenv("SPBSV4_HOST")
SPBSV4_USER  = os.getenv("SPBSV4_USER")

# Direct Connection
SPBSDR_HOST = os.getenv("SPBSDR_HOST")
SPBSDR_USER = os.getenv("SPBSDR_USER")

PSSW_PARSED = quote_plus(SPBS_PASSWORD)  

TESTING = True
IPV4 = True

if TESTING == True:
    DATABASE_URL = "sqlite:///:memory:"
else:
    if IPV4 == True:
        # IPv4 Compatible
        DATABASE_URL = f"postgresql://{SPBSV4_USER}:{PSSW_PARSED}@{SPBSV4_HOST}:{SPBS_PORT}/{SPBS_DATABASE}"
    else:
        # Not IPv4 Compatible, Direct Connection
        DATABASE_URL = f"postgresql://{SPBSDR_USER}:{PSSW_PARSED}@{SPBSDR_HOST}:{SPBS_PORT}/{SPBS_DATABASE}"

engine = create_engine(
    DATABASE_URL,
    echo=False,
    future=True 
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    future=True
)

db_session = scoped_session(SessionLocal)

class Base(DeclarativeBase):
    pass
