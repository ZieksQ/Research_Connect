from .model import QuestionType

type_map = {
    "multiple_choice": QuestionType.MULTIPLE_CHOICE,
    "essay": QuestionType.ESSAY
}

def handle_user_input_exist(username: str, password: str) -> dict:
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

def handle_validate_requirements(username: str, password: str) -> dict:
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

def handle_post_input_exist(title: str, content: str) -> dict:
    """validate post input whether it exist or not

    Args:
        title (str): title input
        content (str): content input

    Returns:
        dict: dictionary containing flag and message for clean reading
    """
    
    result = {
        "title" : {"ok" : True, "msg" : None},
        "content" : {"ok" : True, "msg" : None},
    }

    if not title:
        result["title"]["ok"] = False
        result["title"]["msg"] = "Missing Title"

    if not content:
        result["title"]["ok"] = False
        result["title"]["msg"] = "Missing content"

    return result

def handle_post_requirements(title: str, content: str) -> dict:
    """validates the user input if it meets the requirements e.g. username must be x char long

    Args:
        title (str): title input
        content (str): content input

    Returns:
        dict: dictionary containing flag and message for clean reading
    """
    
    result = {
        "title" : {"ok": False, "msg": None},
        "content" : {"ok": False, "msg": None},
    }

    title_rules = [
        (lambda title: len(title) >=10, "Title must at least be 10 characters"),
        (lambda title: len(title) <=128, "Title must not exceed 128 characters"),
    ]

    content_rules = [
        (lambda content: len(content) >= 30, "Title should be atleast 30 characters"),
    ]

    for check, msg in title_rules:
        if not check(title):
            result["title"]["msg"] = msg
            break
    else:
        result["title"]["ok"] = True

    for check, msg in content_rules:
        if not check(content):
            result["content"]["msg"] = msg
            break
    else:
        result["content"]["ok"] = True

    return result

def handle_survey_input_exists(svy_questions: dict) -> tuple[bool, list]:
    """Method to check if each input in the dict of questionnaire exists.

    Args:
        svy_questions (dict): Suvey questionnaire

    Returns:
        tuple (bool, list): Returns a flag if it has a missing ouput and a message to indicate which is missing from each question
    """

    qflag = []
    each_qcheck = []

    for qcounter, (qkey, qvalue) in enumerate(svy_questions.items(), start=1):
        result = {}
        each_qdata = []
        q_type = type_map.get(qvalue.get("type", "").lower(), "")

        if not qkey:
            result[f"Question{qcounter}"] = False
            each_qdata.append(True)

        if not qvalue.get("questionNum"):
            result["questionNum"] = False
            each_qdata.append(True)

        if not qvalue.get("type"):
            result["type"]= False
            each_qdata.append(True)

        if q_type == QuestionType.MULTIPLE_CHOICE:
            if not qvalue.get("choice"):
                result["choice"] = False
                each_qdata.append(True)

        if not qvalue.get("answer"):
            result["answer"] = False
            each_qdata.append(True)

        if result:
            qflag.append({f"Question {qcounter}": result})

        each_qcheck.append(any(each_qdata))
        qcounter +=1

    return any(each_qcheck), qflag


'''
Decided to review it and the badwords from the txt file contains words that are not actually bad and may hinder users from effectively using the app itself
Will add this if the txt file is fixed(will not too much word)

from pathlib import Path

BADWORD_PATH = Path(__file__).resolve().parent.parent / "badwords.txt"

def load_bad_words(filepath=BADWORD_PATH):
    """Load bad words from a .txt file (one per line)."""
    with open(filepath, "r", encoding="utf-8") as f:
        return [line.strip().lower() for line in f if line.strip()]

BAD_WORDS = set(load_bad_words())

def contains_bad_words(text: str, bad_words: set = BAD_WORDS) -> bool:
    """Check if text contains any bad word (no regex)."""
    words = text.lower().split()
    return any(word in bad_words for word in words)
'''
