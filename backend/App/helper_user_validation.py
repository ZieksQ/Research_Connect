from typing import Any
import os, string
from App.models.model_enums import QuestionType, Question_type_inter

def handle_profile_pic(file) -> tuple[str | None, bool]:
    """Helper method to validate the profile pic sent

    Args:
        file (_type_): the file

    Returns:
        tuple (list[str], bool): List of messages and a flag
    """
    
    allowed_extensions = ( "jpg", "jpeg", "png" )

    if not file:
        return "File does not exist, please upload a file.", True

    filename = file.filename
    if not filename:
        return "No filename provided.", True

    # Extract extension safely
    _, ext = os.path.splitext(filename)
    ext = ext.lower().lstrip(".")

    if ext not in allowed_extensions:
        return f"Invalid file extension: .{ext}. Allowed: {', '.join(allowed_extensions)}", True

    return None, False


def handle_user_input_exist(username: str, password: str) -> tuple[dict, bool]:
    """validate user input whether it exist or not

    Args:
        username (str): username input
        password (str): password input

    Returns:
        tuple (dict, bool):
            dictionary containing flag and message for clean reading and bool for easy flagging
    """

    result = {}
    extra_flag = []

    if not username:
        result["username"] = "Missing username"
        extra_flag.append(True)

    if not password:
        result["password"] = "Missing password"
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

    result = {}
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
        (lambda psww: any(c in string.punctuation 
                          for c in psww),               "Password must contain at least 1 special character"),
    ]

    for check,msg in useranme_rules:
        if not check(username):
            result["username"] = msg
            extra_flag.append(True)
            break

    for check,msg in password_rules:
        if not check(password):
            result["password"] = msg
            extra_flag.append(True)
            break

    return result, any(extra_flag)

def handle_post_input_exist(title: str, content: str, post: bool = True) -> tuple[dict, bool]:
    """validate post input whether it exist or not

    Args:
        title (str): title input
        content (str): content input

    Returns:
        tuple (dict, bool):
            dictionary containing flag and message for clean reading and bool for easy flagging
    """
    
    who_title = "post title" if post else "survey title"
    who_content = "post content" if post else "survey content"

    result = {}
    extra_flag = []

    if not title:
        result["title"] = f"Missing {who_title}"
        extra_flag.append(True)

    if not content:
        result["content"] = f"Missing {who_content}"
        extra_flag.append(True)

    return result, any(extra_flag)

def handle_post_requirements(title: str, content: str, post = True) -> tuple[dict, bool]:
    """validates the user input if it meets the requirements e.g. username must be x char long

    Args:
        title (str): title input
        content (str): content input

    Returns:
        tuple (dict, bool):
            dictionary containing flag and message for clean reading and bool for easy flagging
    """
    
    result = {}
    extra_flag = []

    who_title = "Post title" if post else "Survey title"
    who_content = "Post description" if post else "Survey description"
    who_limit = 400 if post else 100

    title = title.split()
    content = content.split()

    title_rules = [
        (lambda title: len(title) >=4,              f"{who_title} must at least be 4 words"),
        (lambda title: len(title) <= 40,            f"{who_title} must not exceed 40 words"),
        (lambda title: len(" ".join(title)) <= 512, f"{who_title} must not exceed 512 characters"),
    ]

    content_rules = [
        (lambda content: len(content) >= 20,                f"{who_content} should be atleast 20 words"),
        (lambda content: len(content) <= who_limit,         f"{who_content} must not exceed {who_limit} words"),
        (lambda content: len(" ".join(content)) <= 5000,    f"{who_content} must not exceed 5000 characters"),
    ]



    for check, msg in title_rules:
        if not check(title):
            result["title"] = msg
            extra_flag.append(True)
            break

    for check, msg in content_rules:
        if not check(content):
            result["content"] = msg
            extra_flag.append(True)
            break

    return result, any(extra_flag)

def handle_survey_input_exists(svy_questions: dict[str, dict | Any]) -> tuple[list, bool]: # deprecated
    """Deprecated: Method to check if each input in the dict of questionnaire exists.

    Args:
        svy_questions (dict): Suvey questionnaire

    Returns:
        tuple (list, bool): Returns a list of missing fields and a flag indicating if any are missing.
    """

    qflag = []
    each_qcheck = []

    if not svy_questions:
        return ["Survey Empty"], True

    for qcounter, (qkey, qvalue) in enumerate(svy_questions.items(), start=1):
        result = {}
        each_qdata = []

        if not qkey:
            result[f"Question{qcounter}"] = False
            each_qdata.append(True)

        if not qvalue.get("question"):
            result["question"] = False
            each_qdata.append(True)

        if not qvalue.get("type"):
            result["type"]= False
            each_qdata.append(True)

        if qvalue.get("type") == QuestionType.MULTIPLE_CHOICE.value:
            choices = qvalue.get("choice")

            if not isinstance(choices, list) or not choices:
                result["choice"] = False
                each_qdata.append(True)
            if qvalue.get("required") and qvalue.get("answer") not in (choices or []):
                result["answer"] = False
                each_qdata.append(True)

        if result:
            qflag.append({f"Question {qcounter}": result})

        each_qcheck.append(any(each_qdata))

    return qflag, any(each_qcheck)

def handle_web_survey_input_exist(svy_questions: dict[str, dict | Any]) -> tuple[list, bool]:
    """Web version: Method to check if each input in the dict of questionnaire exists.

    Args:
        svy_questions (dict): Suvey questionnaire

    Returns:
        tuple (list, bool): Returns a list of missing fields and a flag indicating if any are missing.
    """

    qflag = {}
    each_qcheck_bool = []

    if not svy_questions:
        return ["Survey is empty"], True
    
    for scounter, (skey, svalue) in enumerate(svy_questions.items(), start=1):
        result = {}
        each_qdata_bool = []

        if not skey:
            result[f"section{scounter}"] =  f"Section {scounter} is missing"
            each_qdata_bool.append(True)
            continue
        
        if not svalue.get("description"):
            result[f"description{scounter}"] = f"Section {scounter}: Description is missing"
            each_qdata_bool.append(True)

        if not svalue.get("questions"):
            result[f"questions{scounter}"] = f"Section {scounter}: Quesitons is missing"
            each_qdata_bool.append(True)
            continue

        for qcounter, (qkey, qvalue) in enumerate(svalue.get("questions").items(), start=1):
            
            if not qkey:
                result[f"question{qcounter}"] = f"Question {qcounter} is missing"
                each_qdata_bool.append(True)
                continue

            if not qvalue.get("title"):
                result[f"title{qcounter}"] = f"Question {qcounter}: Title is missing"
                each_qdata_bool.append(True)

            if not qvalue.get("type"):
                result[f"type{qcounter}"] = f"Question {qcounter}: Type is missing"

            if qvalue.get("type") in Question_type_inter.CHOICES_TYPE:
                if not qvalue.get("options"):
                    result[f"options{qcounter}"] = f"Question {qcounter}: Options is missing"
                    each_qdata_bool.append(True)

        if result:
            qflag[f"Section{scounter}"] = result
            each_qcheck_bool.append(any(each_qdata_bool))

    return qflag, any(each_qcheck_bool)


def handle_survey_input_requirements(svy_question: dict) -> tuple[list, bool]:
    """validate each survey questionnaire so each data meets the desired output

    Args:
        svy_question (dict): The questionnaire

    Returns:
        tuple (list, bool): (violations, has_violations_flag)
    """
    
    qtype_list = [qt.value for qt in QuestionType]
    question_rules=[
        (lambda question: len(question) >= 4, "Question must be at least 4 words"),
        (lambda question: len(question) <= 150, "Question must not exceed 150 words"),
        (lambda question: len(" ".join(question)) <= 2000, "Question must not exceed 2000 characters"),
    ]
    type_rules=[
        (lambda qtype: qtype in qtype_list, f"Wrong question type, please choose within [{", ".join(qtype_list)}]"),
    ]

    choices_text_rules = [
        (lambda c_text: len(c_text) >= 1, "Choise text must be at least 1 character long"),
    ]

    qflag = []
    qcheck = [] 

    for qcounter, (_, qvalue) in enumerate(svy_question.items(), start=1):
        result = {}
        q_each_flag = []
        
        question_text: str = qvalue.get("question")
        question_text_list = question_text.split()

        for check, msg in question_rules:
            if not check(question_text_list):
                result["question"] = msg
                q_each_flag.append(True)
                break

        for check, msg in type_rules:
            if not check(qvalue.get("type")):
                result["type"] = msg
                q_each_flag.append(True)
                break
        
        # I will need to re check this again after the survey JSON updates
        if qvalue.get("type") == QuestionType.MULTIPLE_CHOICE.value:
            choices = qvalue.get("choice")
            for choice in choices:
                for check, msg in choices_text_rules:
                    if not check(choice):
                        result["choices"] = msg
                        q_each_flag.append(True)
                        break
            
        if result:
            qflag.append({f"Question {qcounter}" : result})

        qcheck.append(any(q_each_flag))

    return qflag, any(qcheck)


def handle_password_reset_user(user):
    """Helper method for password reset to only change it when the user is signed it within local login. 
    It compares the type of the current user to the sqlalchemy name of the 'Users' e.g.  '<class 'App.model.Users'>'

    Args:
        user (Users | Oauth_Users): _description_

    Returns:
        Bool: returns true if the user is signed in using local, otherwise false
    """
    user_type = str(type(user))
    user_type_list = user_type.split(".")
    user_striped = user_type_list[-1].rstrip("'>")
    return "Users" == user_striped

def handle_category_requirements(category: str) -> tuple[str, bool]:
    """Helper method to check category requirements e.g. category must be at least x char long

    Args:
        category (str): category input of the admin e.g. technology

    Returns:
        tuple(str, bool): message and bool checker, if bool is True trhere will be a message
    """

    category_rules = [
        (lambda ctgry: len(ctgry) >= 3,     "Category must be at least 3 characters long"),
        (lambda ctgry: len(ctgry) <= 64,    "Category must not exceed 64 characters"),
        (lambda ctgry: ctgry.split() <= 5),  "Category must not exceed 5 words"
    ]

    message: str = ""
    flag: bool = False

    for check, msg in category_rules:
        if not check(category):
            message = msg
            flag = True

    return message, flag

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
