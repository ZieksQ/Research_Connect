from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase, scoped_session
from pathlib import Path
from .helper_methods import logger_setup_sqla, set_up_db_url

logger_setup_sqla()

TESTING = False  # Used for unit testing
SQLDB = True     # If testing is True, decide if you want to switch to a sqlite(True) instead of memory 
IPV4 = False     # True if you need IPv4 compatibility, however if not set it to false as it is recommended by Supabase
TPOOLER = False  # If IPV4 is True, then decide if you need Transaction_Pooler(True) or Session_Pooler(False)

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