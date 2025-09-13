def validate_user_input_exist(username: str, password: str) -> dict:
    """validate user input whether it exist or not

    Args:
        username (str): username input
        password (str): password input

    Returns:
        dict: dictionary containing flag and message for clean reading
    """

    result = {
        "username": {"ok" : True, "msg": None},
        "password": {"ok" : True, "msg": None},
    }

    if not username:
        result["username"]["ok"] = False
        result["username"]["msg"] = "Missing username"

    if not password:
        result["password"]["ok"] = False
        result["password"]["msg"] = "Missing password"

    return result

def validate_username_password(username: str, password: str) -> dict:
    """validates the user input if it meets the requirements e.g. username must be x char long

    Args:
        username (str): username input
        password (str): password input

    Returns:
        dict: dictionary containing flag and message for clean reading
    """

    result = {
        "username" : {"ok": False, "msg": None},
        "password" : {"ok": False, "msg": None},
    }

    useranme_rules = [
        (lambda usnm: len(usnm) >= 4,  "Username must be at least 4 characters"),
        (lambda usnm: len(usnm) <= 36, "Username must not exceed 36 characters"),
    ]

    password_rules = [
        (lambda psww: len(psww) >= 8,                   "Password must be at least 8 characters"),
        (lambda psww: len(psww) <= 36,                  "Password must not exceed 36 characters"),
        (lambda psww: any(c.isupper() for c in psww),   "Password must contain at least 1 uppercase letter"),
        (lambda psww: any(c.islower() for c in psww),   "Password must contain at least 1 lowercase letter"),
        (lambda psww: any(c.isdigit() for c in psww),   "Password must contain at least 1 digit"),
    ]

    for check,msg in useranme_rules:
        if not check(username):
            result["username"]["msg"] = msg
            break
    else:
        result["username"]["ok"] = True

    for check,msg in password_rules:
        if not check(password):
            result["password"]["msg"] = msg
            break
    else:
        result["password"]["ok"] = True

    return result