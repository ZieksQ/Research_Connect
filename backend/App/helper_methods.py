from flask import jsonify
from pathlib import Path
from flask_jwt_extended import create_access_token, create_refresh_token, get_jwt_identity
from datetime import datetime, timezone
from flask_limiter.util import get_remote_address
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
    
def flush_session() -> tuple[bool, str | None]:
    """Helper method to reduce try-except for database flush.

    Returns:
        tuple: Boolean flag indicating success, and an error message or None.
    """

    try:
        db.flush()
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
         **extra_flag, }
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

def create_access_refresh_tokens(identity):
    """helper method to create access and refresh tokens

    Args:
        identity (sqlalchemy object): sqlalchemy object of the user

    Returns:
        tuple (str, str): Tuple strings of access and refresh tokens
    """
    access_token = create_access_token(identity=identity, 
                                       additional_claims={
                                           "username": getattr(identity, "username", "acob"),
                                           "role": getattr(identity, "role", "user"),
                                           "type": getattr(identity, "user_type", "local")
                                       })
    refresh_token = create_refresh_token(identity=identity)

    return access_token, refresh_token

def datetime_return_tzinfo(date: datetime):
    """Helper method to convert timezone utc since even storing the date as utc in database and comparing it to utc still raises a naive error

    Args:
        date (datetime): datetime you want to convert to utc

    Returns:
        datetime: converted utc time
    """
    if date.tzinfo is None:
        date = date.replace(tzinfo=timezone.utc)
    return date

def limter_key_func():
    """Use in routes where i have @jwt_required(optional=True)"""
    try:
        identity = get_jwt_identity()
        if identity:
            return identity
    except Exception:
        pass
    return get_remote_address()


def get_top_tags(posts_tags: list[list[str]]) -> tuple[dict[str, int], int]:
    """Helper method to get the top 5 most liked tags, from highest to lowest

    Args:
        posts_tags (list[list[str]]): the collected tags from sql query

    Returns:
        tuple(dict[str, int], int): the sorted tags from highest to lowert. Only 5. and a total count of tags occurence
    """

    posts_tags_stats = {}
    results = {}
    total_num_tag_occur = 0

    for l_t in posts_tags:
        for t in l_t:
            if t not in posts_tags_stats:
                posts_tags_stats[t] = 1
            else:
                posts_tags_stats[t] += 1

    sorted_data = { d[0]: d[1] for d in sorted(posts_tags_stats.items(), key=lambda k: k[1], reverse=True)}

    for counter, (k, v) in enumerate(sorted_data.items()):
        if counter >= 5:
            break
        total_num_tag_occur += v
        results[k] = v
    
    return (results, total_num_tag_occur)
