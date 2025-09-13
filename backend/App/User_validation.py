import logging

logger = logging.getLogger(__name__)
FORMAT = "%(name)s - %(asctime)s - %(funcName)s - %(lineno)d -  %(levelname)s - %(message)s"

handler = logging.FileHandler("Users.log", mode="a")
formatter = logging.Formatter(FORMAT)

handler.setFormatter(formatter)
logger.addHandler(handler)

def validate_user_input_exist(username: str, password: str):
    username_ok = bool(username)
    password_ok = bool(password)

    return username_ok, password_ok

def validate_username(username: str):
    
    rules =[
        (lambda usnm: usnm >= 3 ),  "Username must be at least 4 characters"
        (lambda usnm: usnm <= 36 ), "Username must not exceed 36 characters"
    ]

    for check, msg in rules:
        if not check(username):
            logger.error(msg)
            return False, msg
    
    return True, None

def validate_password(password: str):
    rules = [
        (lambda psww: len(psww) >= 8,                   "Password must be at least 8 characters"),
        (lambda psww: len(psww) <= 36,                  "Password must not exceed 36 characters"),
        (lambda psww: any(c.isupper() for c in psww),   "Password must contain at least 1 uppercase letter"),
        (lambda psww: any(c.islower() for c in psww),   "Password must contain at least 1 lowercase letter"),
        (lambda psww: any(c.isdigit() for c in psww),   "Password must contain at least 1 digit"),
    ]

    for check, msg in rules:
        if not check(password):
            logger.error(msg)
            return False, msg

    return True, None