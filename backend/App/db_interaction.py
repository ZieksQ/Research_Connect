from flask import jsonify
from .database import db_session as db

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

def jsonify_template_user(status: int, ok: bool, message: str | dict, **extra_flag: dict):
    """Helper method to reduce jsonify typing for each methods 

    Args:
        status (int): Http status code
        ok (bool): Boolean flag indicating success
        message (str | dict): Message for the frontend
        extra_flag (dict): Extra message to send to the frontend, easy flaging e.g. tokenExpired=True

    Returns:
        json: jsonified dictionary
    """
    
    response = { "status": status, "ok": ok, "message": message }
    response.update(extra_flag)

    return jsonify(response)
