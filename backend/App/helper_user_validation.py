from flask import request
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
    who_content = "post description" if post else "survey description"

    result = {}
    extra_flag = [False]

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
        (lambda content: len(content) >= 5,                f"{who_content} should be atleast 5 words"),
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

def handle_web_survey_input_exist(svy_questions: list[dict[str, Any]]) -> tuple[dict, bool]:
    """Web version: Method to check if each input in the dict of questionnaire exists.

    Args:
        svy_questions (dict): Suvey questionnaire

    Returns:
        tuple (list, bool): Returns a list of missing fields and a flag indicating if any are missing.
    """

    qflag = {}
    each_qcheck_bool = [False]

    if not svy_questions:
        return ["Survey is empty"], True
    
    for scounter, svy_section in enumerate(svy_questions, start=1):
        result = {}
        each_qdata_bool = []

        if not svy_section:
            return ["Survey questions is missing"], True
        
        if not svy_section.get("title"):
            result[f"description"] = f"Section {scounter}: Title is missing"
            each_qdata_bool.append(True)

        if not svy_section.get("description"):
            result[f"description"] = f"Section {scounter}: Description is missing"
            each_qdata_bool.append(True)

        if not svy_section.get("questions"):
            result[f"questions"] = f"Section {scounter}: Quesitons is missing"
            each_qdata_bool.append(True)
            continue

        for qcounter, q_dict in enumerate(svy_section.get("questions"), start=1):
            
            if not q_dict:
                result[f"question{qcounter}"] = f"Question {qcounter} is missing"
                each_qdata_bool.append(True)
                continue

            if not q_dict.get("title"):
                result[f"title"] = f"Question {qcounter}: Title is missing"
                each_qdata_bool.append(True)

            if not q_dict.get("minChoices"):
                result[f"minChoices"] = f"Question {qcounter}: Min Choices is missing"
                each_qdata_bool.append(True)
                
            if not q_dict.get("maxChoices"):
                result[f"maxChoices"] = f"Question {qcounter}: Max Choices is missing"
                each_qdata_bool.append(True)

            if not q_dict.get("type"):
                result[f"type"] = f"Question {qcounter}: Type is missing"
                each_qdata_bool.append(True)

            if q_dict.get("type") in Question_type_inter.CHOICES_TYPE_WEB:
                if not q_dict.get("options"):
                    result[f"options"] = f"Question {qcounter}: Options is missing"
                    each_qdata_bool.append(True)

        if result:
            qflag[f"Section{scounter}"] = result
            each_qcheck_bool.append(any(each_qdata_bool))

    return (qflag, any(each_qcheck_bool))


def handle_Mobile_survey_input_exist(svy_questions: list[dict[str, Any]]) -> tuple[dict, bool]:
    """Mobiloe version: Method to check if each input in the dict of questionnaire exists.

    Args:
        svy_questions (dict): Suvey questionnaire

    Returns:
        tuple (list, bool): Returns a list of missing fields and a flag indicating if any are missing.
    """

    qflag = {}
    each_qcheck_bool = []

    if not svy_questions:
        return ["Survey is empty"], True
    
    for qcounter, svy_question in enumerate(svy_questions, start=1):
        result = {}
        each_qdata_bool = []

        if not svy_question:
            return ["Survey Questions is missing"], True

        if not svy_question.get("title"):
            result[f"title"] = f"Question {qcounter}: Title is missing"
            each_qdata_bool.append(True)

        if not svy_question.get("type"):
            result[f"type"] = f"Question {qcounter}: Type is missing"
            each_qdata_bool.append(True)

        if svy_question.get("type") in Question_type_inter.CHOICES_TYPE_MOBILE:
            if not svy_question.get("options"):
                result[f"options"] = f"Question {qcounter}: Options is missing"
                each_qdata_bool.append(True)

        if not svy_question.get("sectionId"): 
            result[f"sectionId"] = f"Question {qcounter}: Seciton ID is missing"

        if result:
            qflag[f"Question{qcounter}"] = result
            each_qcheck_bool.append(any(each_qdata_bool))

    return qflag, any(each_qcheck_bool)


def handle_web_survey_input_requirements(svy_questions: list[dict[str, Any]], files_dict: dict = None) -> tuple[list, bool]:
    """Web version: validate each survey questionnaire so each data meets the desired output

    Args:
        svy_question (dict): The questionnaire

    Returns:
        tuple (list, bool): (violations, has_violations_flag)
    """
    
    question_text_rules=[
        (lambda question: len(question) >= 4,               "Question text must be at least 4 words"),
        (lambda question: len(question) <= 150,             "Question text must not exceed 150 words"),
        (lambda question: len(" ".join(question)) <= 2000,  "Question text must not exceed 2000 characters"),
    ]
    type_rules=[
        (lambda qtype: qtype in Question_type_inter.Q_TYPE_WEB, f"Wrong question type, please choose within [{", ".join(Question_type_inter.Q_TYPE_WEB)}]"),
    ]

    choices_text_rules = [
        (lambda c_text: len(c_text) >= 1, "Choice text must be at least 1 character long"),
        (lambda ctext: len(ctext) <= 500, "Choice text must not exceed 500 character")
    ]

    section_title_rules = [
        (lambda text: len(text) >= 5, "Section title must be at least 5 characters long"),
        (lambda text: len(text) <= 256, "Section title must not exceed 256 characters"),
    ]

    section_desc_rules = [  
        (lambda text: len(text) >= 5, "Section description must be at least 5 characters long"),
        (lambda text: len(text) <= 512, "Section description must not exceed 512 characters"),
    ]

    qflag = {}
    qcheck = [False] 

    for scounter, svy_section in enumerate(svy_questions, start=1):
        result = {}
        each_qdata_bool = []

        for check, msg in section_title_rules:
            if not check(svy_section.get("title")):
                result[f"title{scounter}"] = msg
                each_qdata_bool.append(True)

        for check, msg in section_desc_rules:
            if not check(svy_section.get("description")):
                result[f"description{scounter}"] = msg
                each_qdata_bool.append(True)

        for qcounter, q_dict in enumerate(svy_section.get("questions"), start=1):
            
            if not q_dict:
                result[f"question{qcounter}"] = f"Question {qcounter} is missing"
                each_qdata_bool.append(True)
                continue
            
            for check, msg in question_text_rules:
                if not check(q_dict.get("title")):
                    result[f"title"] = msg
                    each_qdata_bool.append(True)
                    break

            for check, msg in type_rules:
                if not check(q_dict.get("type")):
                    result[f"type"] = msg
                    each_qdata_bool.append(True)
                    break

            if q_dict.get("type") in Question_type_inter.Q_TYPE_WEB:
                for op_counter, option in enumerate(q_dict.get("options")):
                    for check, msg in choices_text_rules:
                        if not check(option):
                            result[f"option{op_counter}"] = msg
                            each_qdata_bool.append(True)
                            break

            if q_dict.get("image"):
                # img_file = q_dict["image"]["fieldName"]
                img_name = q_dict["image"]["fieldName"]
                img_file = files_dict.get(img_name)
                img_msg, img_flag = handle_profile_pic(img_file)
                if img_flag:
                    result[f"img"] = img_msg
                    each_qdata_bool.append(True)

        if result:
            qflag[f"Section{scounter}"] = result
            qcheck.append(any(each_qdata_bool))

    return qflag, any(qcheck)

def handle_mobile_survey_input_requirements(svy_questions: list[dict[str, Any]]) -> tuple[list, bool]:
    """Mobile version: validate each survey questionnaire so each data meets the desired output

    Args:
        svy_question (dict): The questionnaire

    Returns:
        tuple (list, bool): (violations, has_violations_flag)
    """
    
    question_text_rules=[
        (lambda question: len(question) >= 4, "Question must be at least 4 words"),
        (lambda question: len(question) <= 150, "Question must not exceed 150 words"),
        (lambda question: len(" ".join(question)) <= 2000, "Question must not exceed 2000 characters"),
    ]
    type_rules=[
        (lambda qtype: qtype in Question_type_inter.Q_TYPE_MOBILE, f"Wrong question type, please choose within [{", ".join(Question_type_inter.Q_TYPE_MOBILE)}]"),
    ]

    choices_text_rules = [
        (lambda c_text: len(c_text) >= 1, "Choice text must be at least 1 character long"),
        (lambda ctext: len(ctext) <= 500, "Choice text must not exceed 500 character")
    ]

    section_title_rules = [
        (lambda text: len(text) >= 5, "Section title must be at least 5 characters long"),
        (lambda text: len(text) <= 256, "Section title must not exceed 256 characters"),
    ]

    section_desc_rules = [  
        (lambda text: len(text) >= 5, "Section title must be at least 5 characters long"),
        (lambda text: len(text) <= 512, "Section title must not exceed 512 characters"),
    ]

    qflag = {}
    qcheck = []

    for qcounter, svy_question in enumerate(svy_questions, start=1):
        result = {}
        each_qdata_bool = []

        for check, msg in question_text_rules:
            if not check(svy_question.get("title")):
                result[f"title{qcounter}"] = msg
                each_qdata_bool.append(True)
                break

        for check, msg in type_rules:
            if not check(svy_question.get("type")):
                result[f"type{qcounter}"] = msg
                each_qdata_bool.append(True)
                break

        if svy_question.get("type") in Question_type_inter.CHOICES_TYPE_MOBILE:
            for check, msg in choices_text_rules:
                if not svy_question.get("options"):
                    result[f"options{qcounter}"] = msg
                    each_qdata_bool.append(True)
                    break

        for check, msg in section_title_rules:
            if not check(svy_question.get("sectionId")): 
                result[f"sectionId{qcounter}"] = msg
                each_qdata_bool.append(True)
                break

        if result:
            qflag[f"Question{qcounter}"] = result
            qcheck.append(any(each_qdata_bool))

    return qflag, any(qcheck)

def handle_survey_misc_input_exists(approx_time: str, tags: str, target_audicne: str) -> tuple[dict, bool]:
    result = {}
    extra_flag = []

    if not approx_time:
        result["approx_time"] = "Missing approx time"
        extra_flag.append(True)

    if not tags:
        result["tags"] = "Missing tags"
        extra_flag.append(True)

    if not target_audicne:
        result["target_audicne"] = "Missing target audicne"
        extra_flag.append(True)

    return result, any(extra_flag)

def handle_survey_misc_input_requirements(approx_time: str, tags: str, target_audicne: str) -> tuple[dict, bool]:
    result = {}
    extra_flag = []

    approx_time_rules = [
        (lambda at: len(at) >= 1, "Approx time must be at least 1 character long"),
        (lambda at: len(at) <= 128, "Approx time must must not exceed 128 character"),
    ]

    tags_rules = [
        (lambda at: len(at) >= 1, "Approx time must be at least 1 character long"),
        (lambda at: len(at) <= 128, "Approx time must must not exceed 128 character"),
    ]

    target_audience_rules = [
        (lambda at: len(at) >= 1, "Approx time must be at least 1 character long"),
        (lambda at: len(at) <= 256, "Approx time must must not exceed 256 character"),
    ]

    for check, msg in approx_time_rules:
        if not check(approx_time):
            result["approx_time"] = msg
            extra_flag.append(True)
            break
    for check, msg in tags_rules:
        if not check(tags):
            result["tags"] = msg
            extra_flag.append(True)
            break
    for check, msg in target_audience_rules:
        if not check(target_audicne):
            result["target_audicne"] = "Missing target audicne"
            extra_flag.append(True)
            break

    return result, any(extra_flag)

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

def handle_user_info_requirements(username: str, school: str, program: str) -> tuple[dict, bool]:

    result = {}
    flag = []

    useranme_rules = [
        (lambda usnm: len(usnm) >= 4,  "Username must be at least 4 characters"),
        (lambda usnm: len(usnm) <= 36, "Username must not exceed 36 characters"),
    ]

    school_rules = [
        (lambda school: len(school) >= 5, "School must be at least 5 character"),
        (lambda school: len(school) <= 256, "School must not exceed 256 character")
    ]

    program_rules = [
        (lambda program: len(program) <= 5, "Program must be at least 5 characters"),
        (lambda program: len(program) >= 256, "Program must must not exceed 256 characters"),
    ]

    for check, msg in useranme_rules:
        if not check(username):
            result["username"] = msg
            flag.append(True)
            break

    for check, msg in school_rules:
        if not check(school):
            result["school"] = msg
            flag.append(True)
            break

    for check, msg in program_rules:
        if not check(program):
            result["program"] = msg
            flag.append(True)
            break

    return result, any(flag)