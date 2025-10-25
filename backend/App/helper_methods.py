from flask import jsonify
from pathlib import Path
from .database import db_session as db
import logging
# from .model import Users, Oauth_Users

# who_user = lambda user_type, id: db.get(Users, id) if user_type == "local" else db.get(Oauth_Users, id)

def commit_session() -> tuple[bool, str | None]:
    """Helper method to reduce try-except for database commit.

    Returns:
        tuple: Boolean flag indicating success, and an error message or None.
    """

    try:
        db.commit()
        return (True, None)
    except Exception as e:
        db.rollback()
        return (False, str(e))

def jsonify_template_user(status: int, ok: bool, message: str | dict, **extra_flag):
    """Helper method to simplify jsonify usage for endpoint responses. 

    Args:
        status (int): Http status code
        ok (bool): Boolean flag indicating success
        message (str | dict): Message for the frontend
        extra_flag (any): Extra message to send to the frontend e.g. tokenExpired=True

    Returns:
        tuple (Response, status): tuple of flask reponse and staus
    """
    
    resp = jsonify(
        { "status": status, 
         "ok": ok, 
         "message": message, 
         **extra_flag }
        )
    resp.status_code = status

    return resp

def logger_setup(name: str, filename: str, mode: str = "a"):
    """Helper method to set up global logging

    Args:{}
        name (str): dunder name
        filename (str): NAME_OF_FILE.log
        mode (str, optional): file mode. Defaults to "a".

    Returns:
        logging: Logger object
    """

    logger = logging.getLogger(name)
    FORMAT = "%(name)s - %(asctime)s - %(funcName)s - %(lineno)d -  %(levelname)s - %(message)s"
    DATEFMT = "%Y-%m-%d %H:%M:%S"
    log_path = Path(__file__).resolve().parent.parent / f"log_folder/{filename}"

    handler = logging.FileHandler(filename=log_path, mode=mode)
    formatter = logging.Formatter(fmt=FORMAT, datefmt=DATEFMT)

    handler.setFormatter(formatter)
    logger.addHandler(handler)

    return logger