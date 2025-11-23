from flask import request
from typing import Any
from dateutil import parser
import os, string
from App.models.model_enums import QuestionType, Question_type_inter
from App.models.model_survey_q_a import Section

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

def handle_date_auto_format(date_str: str) -> str | None:
    """Helper method to unify date format from different frontend

    Args:
        date_str (str): date format from the frontend

    Returns:
        (str | None): Returns a string date format of YYYY-MM-DD or none if the date is unacceptable
    """
    try:
        parsed_date = parser.parse(date_str)

        normalized_date = parsed_date.strftime("%Y-%m-%d")

        return normalized_date
    except Exception as e:
        return None
    

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
        (lambda usnm: usnm.split() <= 1, "Username must be 1 word only"),
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
    each_qcheck_bool = []

    if not svy_questions:
        return ["Survey is empty"], True
    
    for scounter, svy_section in enumerate(svy_questions, start=1):
        result = []

        if not svy_section:
            result.append(f"Section {scounter} is missing")
        
        if not svy_section.get("id"):
            result.append(f"Section {scounter}: Id is missing")

        if not svy_section.get("title"):
            result.append(f"Section {scounter}: Title is missing")

        if not svy_section.get("questions"):
            result.append(f"Section {scounter}: Quesitons is missing")

        for qcounter, q_dict in enumerate(svy_section.get("questions"), start=1):
            question_result = []
            
            if not q_dict:
                question_result.append(f"Question {qcounter} is missing")

            if not q_dict.get("title"):
                question_result.append(f"Question {qcounter}: Title is missing")

            if not q_dict.get("minChoices"):
                question_result.append(f"Question {qcounter}: Min Choices is missing")
                
            if not q_dict.get("maxChoices"):
                question_result.append(f"Question {qcounter}: Max Choices is missing")

            if not q_dict.get("type"):
                question_result.append(f"Question {qcounter}: Type is missing")

            if q_dict.get("type") in Question_type_inter.CHOICES_TYPE_WEB:
                if not q_dict.get("options"):
                    question_result.append(f"Question {qcounter}: Options is missing")

            if q_dict.get("type") == QuestionType.RATING.value:
                if not q_dict.get("maxRating"):
                    question_result.append(f"Quesiton {qcounter}: Max rating is missing")

            if question_result: 
                result.append(question_result)
                each_qcheck_bool.append(True)

        if result:
            qflag[f"Section{scounter}"] = result
            each_qcheck_bool.append(True)

    return (qflag, any(each_qcheck_bool))


def handle_Mobile_survey_input_exist(svy_questions: list[dict[str, Any]], sections: list[dict[str, Any]]) -> tuple[dict, bool]:
    """Mobile version: Method to check if each input in the dict of questionnaire exists.

    Args:
        svy_questions (dict): Suvey questionnaire

    Returns:
        tuple (list, bool): Returns a list of missing fields and a flag indicating if any are missing.
    """

    qflag = {
        "sections": {},
        "questions": {},
    }
    each_qcheck_bool = []

    if not sections:
        return ["Sections is empty"], True
    
    if not svy_questions:
        return ["Survey is empty"], True
    
    for scounter, svy_section in enumerate(sections, start=1):
        result = []

        if not svy_section.get("id"):
            result.append("ID is missing")

        if not svy_section.get("title"):
            result.append("Title is missing")

        if result:
            qflag["sections"][f"Section{scounter}"] = result
            each_qcheck_bool.append(True)
    
    for qcounter, svy_question in enumerate(svy_questions, start=1):
        result = []

        if not svy_question.get("questionId"):
            result.append("ID is missing")

        if not svy_question.get("title"):
            result.append("Title is missing")

        if not svy_question.get("type"):
            result.append("Type is missing")

        if not svy_question.get("sectionId"): 
            result.append("Seciton ID is missing")

        if svy_question.get("type") in Question_type_inter.CHOICES_MAX_MIN_TYPE_MOBILE:
            if not svy_question.get("options"):
                result.append("Options is missing")
            if not svy_question.get("minChoice"):
                result.append("Min choice is missing")
            if not svy_question.get("maxChoice"):
                result.append("Max choice is missing")
            
        if svy_question.get("type") == QuestionType.RATING.value:
            if not svy_question.get("maxRating"):
                result.append("Max rating is missing")

        if result:
            qflag["questions"][f"Question{qcounter}"] = result
            each_qcheck_bool.append(True)

    return qflag, any(each_qcheck_bool)


def handle_web_survey_input_requirements(svy_questions: list[dict[str, Any]], files_dict: dict = None) -> tuple[list, bool]:
    """Web version: validate each survey questionnaire so each data meets the desired output

    Args:
        svy_question (dict): The questionnaire

    Returns:
        tuple (list, bool): (violations, has_violations_flag)
    """
    
    section_title_rules = [
        (lambda text: len(text) >= 5,   "Section title must be at least 5 characters long"),
        (lambda text: len(text) <= 256, "Section title must not exceed 256 characters"),
    ]

    section_desc_rules = [  
        (lambda text: len(text) <= 512, "Section description must not exceed 512 characters"),
    ]

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
        (lambda ctext: len(ctext) <= 1024, "Choice text must not exceed 1024 character")
    ]


    qflag = {}
    qcheck = [False] 

    for scounter, svy_section in enumerate(svy_questions, start=1):
        result = []

        for check, msg in section_title_rules:
            if not check(svy_section.get("title")):
                result.append(msg)
                break

        if svy_section.get("description"):
            for check, msg in section_desc_rules:
                if not check(svy_section.get("description")):
                    result.append(msg)
                    break

        for qcounter, q_dict in enumerate(svy_section.get("questions"), start=1):
            question_result = []
            
            for check, msg in question_text_rules:
                if not check(q_dict.get("title")):
                    question_result.append(f"Question{qcounter}: {msg}")
                    break

            for check, msg in type_rules:
                if not check(q_dict.get("type")):
                    question_result.append(f"Question{qcounter}: {msg}")
                    break

            if q_dict.get("type") in Question_type_inter.Q_TYPE_WEB:
                for option in q_dict.get("options"):
                    for check, msg in choices_text_rules:
                        if not check(option):
                            question_result.append(f"Question{qcounter}: {msg}")
                            break

            if q_dict.get("image"):
                # img_file = q_dict["image"]["fieldName"]
                img_name = q_dict["image"]["fieldName"]
                img_file = files_dict.get(img_name)
                img_msg, img_flag = handle_profile_pic(img_file)
                if img_flag:
                    question_result.append(f"Question{qcounter}: {img_msg}")

            if question_result:
                result.append(question_result)
                qcheck.append(True)

        if result:
            qflag[f"Section{scounter}"] = result
            qcheck.append(True)

    return qflag, any(qcheck)

def handle_mobile_survey_input_requirements(svy_questions: list[dict[str, Any]], sections: list[dict[str, Any]]) -> tuple[list, bool]:
    """Mobile version: validate each survey questionnaire so each data meets the desired output

    Args:
        svy_question (dict): The questionnaire

    Returns:
        tuple (list, bool): (violations, has_violations_flag)
    """
    
    question_text_rules=[
        (lambda question: len(question) >= 3,               "Question must be at least 3 words"),
        (lambda question: len(question) <= 150,             "Question must not exceed 150 words"),
        (lambda question: len(" ".join(question)) <= 2000,  "Question must not exceed 2000 characters"),
    ]

    type_rules=[
        (lambda qtype: qtype in Question_type_inter.Q_TYPE_MOBILE, f"Wrong question type, please choose within [{", ".join(Question_type_inter.Q_TYPE_MOBILE)}]"),
    ]

    choices_text_rules = [
        (lambda c_text: len(c_text) >= 1,   "Choice text must be at least 1 character long"),
        (lambda ctext: len(ctext) <= 500,   "Choice text must not exceed 500 character")
    ]

    section_title_rules = [
        (lambda text: len(text) >= 5,   "Section title must be at least 5 characters long"),
        (lambda text: len(text) <= 256, "Section title must not exceed 256 characters"),
    ]

    section_desc_rules = [  
        (lambda text: len(text) <= 512, "Section title must not exceed 512 characters"),
    ]

    qflag = {
        "sections": {},
        "questions": {},
    }
    each_qcheck_bool = []

    if not sections:
        return ["Sections is empty"], True
    
    if not svy_questions:
        return ["Survey is empty"], True
    
    for scounter, svy_section in enumerate(sections, start=1):
        result = []

        for check, msg in section_title_rules:
            if not check(svy_section.get("title")):
                result.append(msg)
                break

        for check, msg in section_desc_rules:
            if not check(svy_section.get("description")):
                result.append(msg)
                break

        if result:
            qflag["sections"][f"Section{scounter}"] = result
            each_qcheck_bool.append(True)
    
    for qcounter, svy_question in enumerate(svy_questions, start=1):
        result = []

        for check, msg in question_text_rules:
            if not check(svy_question.get("title")):
                result.append(msg)
                break

        for check, msg in type_rules:
            if not check(svy_question.get("type")):
                result.append(msg)
                break

        if svy_question.get("type") in Question_type_inter.CHOICES_MAX_MIN_TYPE_MOBILE:
            for option in svy_question.get("options"):
                for check, msg in choices_text_rules:
                    if not check(option):
                        result.append(msg)
                        break

        if result:
            qflag["questions"][f"Question{qcounter}"] = result
            each_qcheck_bool.append(True)

    return qflag, any(each_qcheck_bool)

def handle_survey_misc_input_exists(approx_time: str, tags: list, target_audicne: list) -> tuple[dict, bool]:
    result = {}
    extra_flag = []

    if not approx_time:
        result["approx_time"] = "Missing approx time"
        extra_flag.append(True)

    if not tags:
        result["tags"] = "Missing tags"
        extra_flag.append(True)

    if not target_audicne:
        result["target_audience"] = "Missing target audience"
        extra_flag.append(True)

    return result, any(extra_flag)

def handle_survey_misc_input_requirements(approx_time: str, tags: list, target_audiences: list) -> tuple[dict, bool]:
    result = {}
    extra_flag = []

    list_length_rules = lambda lenths: len(lenths) <= 5

    approx_time_rules = [
        (lambda at: len(at) >= 1,       "Approx time must be at least 1 character long"),
        (lambda at: len(at) <= 128,     "Approx time must must not exceed 128 character"),
    ]

    tags_rules = [
        (lambda tr: len(tr) >= 1,           "Tags text must be at least 1 character long"),
        (lambda tr: len(tr) <= 32,          "Tags text must must not exceed 32 character"),
        (lambda tr: len(tr.split()) <= 2,   "Tags text words must must not exceed 2 words"),
    ]

    target_audience_rules = [
        (lambda ta: len(ta) >= 1,           "target audeience text must be at least 1 character long"),
        (lambda ta: len(ta) <= 32,          "target audeience text must must not exceed 32 character"),
        (lambda ta: len(ta.split()) <= 2,   "target audeience words must must not exceed 2 words"),
    ]

    if not list_length_rules(tags):
        result["length_tags"] = "Chosen tags are limited to 5 choices"
        extra_flag.append(True)
    
    if not list_length_rules(target_audiences):
        result["length_target_audience"] = "Chosen target audience are limited to 5 choices"
        extra_flag.append(True)

    for check, msg in approx_time_rules:
        if not check(approx_time):
            result["approx_time"] = msg
            extra_flag.append(True)
            break

    for tcounter, tag in enumerate(tags):    
        for check, msg in tags_rules:
            if not check(tag):
                result[f"tags{tcounter}"] = msg
                extra_flag.append(True)
                break
            
    for tcounter, ta in enumerate(target_audiences):
        for check, msg in target_audience_rules:
            if not check(ta):
                result[f"target_audience{tcounter}"] = msg
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
    """Helper method to validate user info update requirements e.g. school msut be x characters long

    Args:
        username (str): username
        school (str): school e.g. LSPU
        program (str): program/course e.g. BSIT

    Returns:
        tuple[dict, bool]: _description_
    """

    result = {}
    flag = []

    useranme_rules = [
        (lambda usnm: len(usnm) >= 4,  "Username must be at least 4 characters"),
        (lambda usnm: len(usnm) <= 36, "Username must not exceed 36 characters"),
        (lambda usnm: usnm.split() <= 1, "Username must be 1 word only"),
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

def handle_user_answer_required(responses: dict[str, dict], sections_db: list[Section]) -> tuple[dict, bool]:
    """Helper method to check if answer is missing on required questions

    Args:
        responses (dict[str, dict]): JSON response of the user
        sections_db (list[Section]): sections of the survey database

    Returns:
        tuple[dict, bool]: message and flag to check, True if its missing - false otherwise
    """

    result = []

    for scounter, section in enumerate(sections_db, start=1):
        
        section_id = section.another_id
        resp_section = responses.get(section_id)

        if not resp_section:
            result.append(f"Section {scounter} is missing")
            continue

        for qcounter, question in enumerate(section.question_section):

            resp_answer_text = resp_section.get(question.another_id)

            if question.answer_required and not resp_answer_text:
                result.append(f"Section{scounter} - Question{qcounter}: Answer is missing")

            if question.q_type == QuestionType.DATE.value:
                if not handle_date_auto_format(resp_answer_text):
                    result.append(f"Section{scounter} - Question{qcounter}: Wrong date format")

    return result, bool(result)
