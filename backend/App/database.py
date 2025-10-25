from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase, scoped_session
from pathlib import Path
from .env_config import ( SQLITE, SPBS_PASSWORD, SPBS_PORT, SPBS_DATABASE, SPBS_TP_PORT,
                         SPBSV4_HOST, SPBSV4_USER, SPBSDR_USER, SPBSDR_HOST )
from urllib.parse import quote_plus
import logging


# Ignore the two methods, i cant move this to helper_methods.py since it wil create a circular import 
# and i dont want to create another file just for these two. it will be too modular
# ---------------------------------------------------------------------------------------------------------------------------------------------------------       

def set_up_db_url( IPV4: bool, TPOOLER: bool, TESTING: bool = True, SQLDB: bool = True ):
    """Helper method to set up databse url

    Args:
        TESTING (bool): Used for unit testing
        SQLDB (bool): For wanting to switch to a real DB instead of memory 
        IPV4 (bool): True if you need IPv4 compatibility, however if not set it to false as it is recommended by Supabase
        TPOOLER (bool): If True you need transaction pooler, else Session Pooler 

    Returns:
        String: String URL of database
    """

    DB_PATH = Path(__file__).resolve().parent.parent / f"instance/{SQLITE}"
    PSSW_PARSED = quote_plus(SPBS_PASSWORD)

    if TESTING == True:
        if SQLDB:
            return f"sqlite:///{DB_PATH}"
        else: 
            return "sqlite:///:memory:"
    else:
        if IPV4 == True:

            if TPOOLER:
                '''
                - Transaction Pooler Coonection 
                Ideal for stateless applications like serverless functions where each interaction with Postgres is brief and isolated.
                '''
                return f"postgresql://{SPBSV4_USER}:{PSSW_PARSED}@{SPBSV4_HOST}:{SPBS_TP_PORT}/{SPBS_DATABASE}"
            else:
                '''
                - Sessoon Pooler Connection
                Only recommended as an alternative to Direct Connection, when connecting via an IPv4 network.
                '''
                return f"postgresql://{SPBSV4_USER}:{PSSW_PARSED}@{SPBSV4_HOST}:{SPBS_PORT}/{SPBS_DATABASE}"
        else:
            '''
            - Direct Connection
            Ideal for applications with persistent, long-lived connections, such as those running on virtual machines or long-standing containers.
            '''
            return f"postgresql://{SPBSDR_USER}:{PSSW_PARSED}@{SPBSDR_HOST}:{SPBS_PORT}/{SPBS_DATABASE}"

def logger_setup_sqla():
    """Helper method to set up logging for sqlalchemy"""

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



# ---------------------------------------------------------------------------------------------------------------------------------------------------------       
# Ignore the top, if i try to move this, it creates a circular import



logger_setup_sqla()

TESTING = True  # Used for unit testing
SQLDB = True    # If testing is True, decide if you want to switch to a sqlite(True) instead of memory 
IPV4 = True     # True if you need IPv4 compatibility, however if not set it to false as it is recommended by Supabase
TPOOLER = True  # If IPV4 is True, then decide if you need Transaction_Pooler(True) or Session_Pooler(False)

DATABASE_URL = set_up_db_url(TESTING=TESTING, SQLDB=SQLDB,
                             IPV4=IPV4, TPOOLER=TPOOLER)

# Set ups the database connection
engine = create_engine(
    DATABASE_URL,
    echo=False,
    future=True 
)

# Makes it possible to connect to the database e.g. interact with it
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    future=True
)

# Puts all the session into a global one so i can use app teardown
db_session = scoped_session(SessionLocal)

# Class for all my table database to inherit from
class Base(DeclarativeBase):
    pass