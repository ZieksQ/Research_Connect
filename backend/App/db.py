from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase, scoped_session
from pathlib import Path
from dotenv import load_dotenv
import os

env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)
SQLITE = os.getenv("SQLITEDB")

TESTING = True

if TESTING == True:
    DATABASE_URL = "sqlite:///:memory:"
else:
    path = Path(__file__).resolve().parent.parent / "instance" / f"{SQLITE}"
    DATABASE_URL = f"sqlite:///{path}"

engine = create_engine(
    DATABASE_URL,
    echo=False,
    future=True  # Important for SQLAlchemy 2.x style
)

# SessionLocal for dependency injection
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    future=True
)

# Optional scoped session for Flask global access
db_session = scoped_session(SessionLocal)

class Base(DeclarativeBase):
    pass