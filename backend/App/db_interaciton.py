from flask import jsonify
from App import db

def commit_session() -> tuple[bool, str | None]:
    """Helper method to reduce try-except for database commit.

    Returns:
        tuple: Boolean flag indicating success, and an error message or None.
    """

    try:
        db.session.commit()
        return (True, None)
    except Exception as e:
        db.session.rollback()
        return (False, str(e))

def jsonify_template_user(status: int, ok: bool, message: str | dict):
    """Helper method to reduce jsonify typing for each methods 

    Args:
        status (int): Http status code
        ok (bool): Boolean flag indicating success
        message (str | dict): Message for the frontend

    Returns:
        json: jsonified dictionary
    """
    return jsonify({ "status": status, "ok": ok, "message": message })
