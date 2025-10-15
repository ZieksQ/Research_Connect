from flask import jsonify
from pathlib import Path
from .database import db_session as db
import logging

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
    
    response = jsonify(
        { "status": status, 
         "ok": ok, 
         "message": message, 
         **extra_flag }
        )
    response.status_code = status

    return response

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
        
"""
if TESTING == True:
    if SQLDB:
        DATABASE_URL = f"sqlite:///{DB_PATH}"
    else: 
        DATABASE_URL = "sqlite:///:memory:"

else:
    if IPV4 == True:

        if TPOOLER:

            '''
            Ideal for stateless applications like serverless functions
            where each interaction with Postgres is brief and isolated.
            '''
            DATABASE_URL = f"postgresql://{SPBSV4_USER}:{PSSW_PARSED}@{SPBSV4_HOST}:{SPBS_TP_PORT}/{SPBS_DATABASE}"
        else:

            '''
            Sessoon Pooler Connection
            Only recommended as an alternative to Direct Connection, 
            when connecting via an IPv4 network.
            '''
            DATABASE_URL = f"postgresql://{SPBSV4_USER}:{PSSW_PARSED}@{SPBSV4_HOST}:{SPBS_PORT}/{SPBS_DATABASE}"
    else:

        '''
        Direct Connection
        Ideal for applications with persistent, long-lived connections, 
        such as those running on virtual machines or long-standing containers.
        '''
        DATABASE_URL = f"postgresql://{SPBSDR_USER}:{PSSW_PARSED}@{SPBSDR_HOST}:{SPBS_PORT}/{SPBS_DATABASE}"
"""