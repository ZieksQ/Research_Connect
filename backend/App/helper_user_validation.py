from .model import QuestionType
import os

# Dict to get the data of Enum
type_map = {
    "multiple_choice": QuestionType.MULTIPLE_CHOICE,
    "essay": QuestionType.ESSAY
}

def handle_user_input_exist(username: str, password: str) -> tuple[dict, bool]:
    """validate user input whether it exist or not

    Args:
        username (str): username input
        password (str): password input

    Returns:
        tuple (dict, bool):
            dictionary containing flag and message for clean reading and bool for easy flagging
    """

    result = {
        "username": {"ok" : True, "msg": None},
        "password": {"ok" : True, "msg": None},
    }
    extra_flag = []

    if not username:
        result["username"]["ok"] = False
        result["username"]["msg"] = "Missing username"
        extra_flag.append(True)

    if not password:
        result["password"]["ok"] = False
        result["password"]["msg"] = "Missing password"
        extra_flag.append(True)

    return result, any(extra_flag)

def handle_validate_requirements(username: str, password: str) -> tuple[dict, bool]:
    """validates the user input if it meets the requirements e.g. username must be x char long

    Args:
        username (str): username input
        password (str): password input

    Returns:
        tuple (dict, bool):
            dictionary containing flag and message for clean reading and bool for easy flagging
    """

    result = {
        "username" : {"ok": False, "msg": None},
        "password" : {"ok": False, "msg": None},
    }
    extra_flag = []

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
            extra_flag.append(True)
            break
    else:
        result["username"]["ok"] = True

    for check,msg in password_rules:
        if not check(password):
            result["password"]["msg"] = msg
            extra_flag.append(True)
            break
    else:
        result["password"]["ok"] = True

    return result, any(extra_flag)

def handle_post_input_exist(title: str, content: str) -> tuple[dict, bool]:
    """validate post input whether it exist or not

    Args:
        title (str): title input
        content (str): content input

    Returns:
        tuple (dict, bool):
            dictionary containing flag and message for clean reading and bool for easy flagging
    """
    
    result = {
        "title" : {"ok" : True, "msg" : None},
        "content" : {"ok" : True, "msg" : None},
    }
    extra_flag = []

    if not title:
        result["title"]["ok"] = False
        result["title"]["msg"] = "Missing Title"
        extra_flag.append(True)

    if not content:
        result["content"]["ok"] = False
        result["content"]["msg"] = "Missing content"
        extra_flag.append(True)

    return result, any(extra_flag)

def handle_post_requirements(title: str, content: str) -> tuple[dict, bool]:
    """validates the user input if it meets the requirements e.g. username must be x char long

    Args:
        title (str): title input
        content (str): content input

    Returns:
        tuple (dict, bool):
            dictionary containing flag and message for clean reading and bool for easy flagging
    """
    
    result = {
        "title" : {"ok": False, "msg": None},
        "content" : {"ok": False, "msg": None},
    }
    extra_flag = []

    title_rules = [
        (lambda title: len(title) >=10, "Title must at least be 10 characters"),
        (lambda title: len(title) <=128, "Title must not exceed 128 characters"),
    ]

    content_rules = [
        (lambda content: len(content) >= 30, "Content should be atleast 30 characters"),
    ]

    for check, msg in title_rules:
        if not check(title):
            result["title"]["msg"] = msg
            extra_flag.append(True)
            break
    else:
        result["title"]["ok"] = True

    for check, msg in content_rules:
        if not check(content):
            result["content"]["msg"] = msg
            extra_flag.append(True)
            break
    else:
        result["content"]["ok"] = True

    return result, any(extra_flag)

def handle_survey_input_exists(svy_questions: dict) -> tuple[list, bool]:
    """Method to check if each input in the dict of questionnaire exists.

    Args:
        svy_questions (dict): Suvey questionnaire

    Returns:
        tuple (bool, list): Returns a flag if it has a missing ouput and a message to indicate which is missing from each question
    """

    qflag = []
    each_qcheck = []

    if not svy_questions:
        return ["Survey Empty"], True

    for qcounter, (qkey, qvalue) in enumerate(svy_questions.items(), start=1):
        result = {}
        each_qdata = []
        q_type = type_map.get(qvalue.get("type", "").lower(), "")

        if not qkey:
            result[f"Question{qcounter}"] = False
            each_qdata.append(True)

        if not qvalue.get("question"):
            result["question"] = False
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
            qflag.append({f"Question {qcounter + 1}": result})

        each_qcheck.append(any(each_qdata))

    return qflag, any(each_qcheck)

def handle_survey_input_requirements(svy_question: dict) -> tuple[list, bool]:
    """validate each survey questionnaire so each data meets the desired output

    Args:
        svy_question (dict): The questionnaire

    Returns:
        tuple (list, bool): list to know whihc question was wrong and an easy flag to verify it
    """
    
    question_rules=[
        (lambda question: len(question) >= 10, "Question must be at least 10 characters long"),
    ]
    type_rules=[
        (lambda qtype: qtype in type_map, "Wrong question type, please choose within multiple_choice and essay"),
    ]

    qflag = []
    qcheck = [] 

    for qcounter, (_, qvalue) in enumerate(svy_question.items(), start=1):
        q_type = type_map.get(qvalue.get("type", "").lower(), "")
        result = {}
        q_each_flag = []

        for check, msg in question_rules:
            if not check(qvalue.get("question")):
                result["question"] = msg
                q_each_flag.append(True)
                break

        for check, msg in type_rules:
            if not check(qvalue.get("type")):
                result["type"] = msg
                q_each_flag.append(True)
                break

        if q_type == QuestionType.MULTIPLE_CHOICE:
            if qvalue.get("answer") not in qvalue.get("choice"):
                result["answer"] = "The answer is not within the choices"
                q_each_flag.append(True)

        if result:
            qflag.append({f"Question {qcounter}" : result})

        qcheck.append(any(q_each_flag))

    return qflag, any(qcheck)

def handle_profile_pic(file) -> tuple[list[str], bool]:
    """Helper method to validate the profile pic sent

    Args:
        file (_type_): the file

    Returns:
        tuple (list[str], bool): List of messages and a flag
    """
    
    result: list[str] = []
    flag: list[bool] = []
    allowed_extensions = ( "jpg", "jpeg", "png" )

    if not file:
        result.append("File does not exist, please upload a file.")
        flag.append(False)

    filename = file.filename
    if not filename:
        result.append("No filename provided.")
        flag.append(False)

    # Extract extension safely
    _, ext = os.path.splitext(filename)
    ext = ext.lower().lstrip(".")

    if ext not in allowed_extensions:
        result.append(f"Invalid file extension: .{ext}. Allowed: {', '.join(allowed_extensions)}")
        flag.append(False)

    return result, any(flag)


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
