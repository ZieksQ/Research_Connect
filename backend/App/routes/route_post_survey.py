from App import limiter, supabase_client
from flask import Blueprint, request
from sqlalchemy import select, and_
from flask_jwt_extended import jwt_required, get_jwt_identity
from functools import wraps
from datetime import datetime, timezone
from typing import Any
from uuid import uuid4
from App.database import db_session as db
from App.models.model_post import Posts, Category
from App.models.model_survey_q_a import Surveys, Question, Answers, Choice, Question_Image
from App.models.model_users import Root_User
from App.models.model_otp import Code
from App.models.model_enums import QuestionType, Question_type_inter
from App.helper_methods import ( jsonify_template_user, commit_session, 
                                logger_setup, datetime_return_tzinfo )
from App.helper_user_validation import (handle_post_input_exist, handle_post_requirements, handle_web_survey_input_exist, 
                                        handle_web_survey_input_requirements, handle_Mobile_survey_input_exist, handle_mobile_survey_input_requirements)


# Sets up the logger from my helper file
logger = logger_setup(__name__, "post_survey.log")
# Set up a route for each file so it is more organized
survey_posting = Blueprint("survey_posting", __name__)

def check_user(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        user_id = get_jwt_identity()
        user = db.get(Root_User, int(user_id))

        if not user:
            logger.info(f"{user_id} tried to access {func.__name__}  without logging in")
            return jsonify_template_user(401, False, "You must log in first in order to post here")
        
        return func(*args, **kwargs)
    return wrapper

@survey_posting.route("/post/get", methods=["GET"])
@jwt_required()
@check_user
@limiter.limit("20 per minute;300 per hour;5000 per day", key_func=get_jwt_identity)
def get_posts():

    # posts = Posts.query.order_by(order).all()
    stmt = select(Posts).where(Posts.approved == True)
    posts = db.scalars(stmt).all()

    data = [post.get_post() for post in posts]

    logger.info(f"{posts}")

    return jsonify_template_user(200, True, data)

@survey_posting.route("/post/get/<int:id>", methods=["GET"])
@jwt_required()
@check_user
@limiter.limit("20 per minute;300 per hour;5000 per day", key_func=get_jwt_identity)
def get_posts_solo(id):

    post = db.get(Posts, int(id))

    if not post:
        return jsonify_template_user(404, False, "Post not found")

    data = post.get_post()

    logger.info(f"{post} {data}")

    return jsonify_template_user(200, True, data)

@survey_posting.route("/post/archive", methods=['PATCH'])
@jwt_required()
@check_user
@limiter.limit("20 per minute;300 per hour;5000 per day", key_func=get_jwt_identity)
def archive_post():
    data: dict = request.get_json()
    post_id = data.get("id")

    post = db.get(Posts, int(post_id))
    if not post:
        logger.info("User tried to archive as non exixtent post")
        return jsonify_template_user(404, False, "Post does not exists")
    
    post.archived = True

    success, error = commit_session()
    if not success:
        logger.error(error)
        return jsonify_template_user(500, False, "Database Error")
    
    logger.info(f"User has archived post No.{post_id}")

    return jsonify_template_user(200, True, f"You have archived post No.{post_id}")

@survey_posting.route("/post/get/questionnaire/<int:id>", methods=["GET"])
@jwt_required()
@check_user
@limiter.limit("20 per minute;300 per hour;5000 per day", key_func=get_jwt_identity)
def get_questionnaire(id):
    
    post = db.get(Posts, int(id))
    survey = post.survey_posts

    sorted_question = sorted(survey.questions_survey, key=lambda x: x.question_number)
    questions = [question.get_questions() for question in sorted_question]

    logger.info(f"{post} {survey}")

    return jsonify_template_user(200, True, {"survey" : survey.get_survey(), "questions": questions})

@survey_posting.route("/post/search", methods=["GET"])
@jwt_required()
@check_user
@limiter.limit("100 per minute;5000 per day", key_func=get_jwt_identity)
def search():
    query = request.args.get("query", "").strip()
    order = request.args.get("order", "asc").strip()

    post_order = Posts.id.asc() if order == "asc" else Posts.id.desc()

    stmt = (
        select(Posts)
        .where(Posts.title.ilike(f"%{query}%"))
        .order_by(post_order)
        .limit(100)
        .offset(0)
        )
    posts = db.scalars(stmt).all()

    data = [post.get_post() for post in posts]

    if not data:
        logger.info("There is no post to be searched")
        return jsonify_template_user(204, True, "There is no such thing")
    
    logger.info("Search successful")
    return jsonify_template_user(200, True, data)

@survey_posting.route("/category/get", methods=['GET'])
@jwt_required()
@check_user
@limiter.limit("20 per minute;300 per hour;5000 per day", key_func=get_jwt_identity)
def get_category():
    stmt = select(Category)
    categories = db.scalars(stmt).all()

    data = [ category.category_text for category in categories]

    return jsonify_template_user(200, True, data)

@survey_posting.route("/questionnaire/is_answered", methods=['POST'])
@jwt_required()
@limiter.limit("20 per minute;300 per hour;5000 per day")
def survey_is_answered():
    data: dict = request.get_json()

    user_id = get_jwt_identity()
    user = db.get(Root_User, int(user_id))

    survey_id = data.get("survey_id")

    if not user:
        logger.info("User tried to access survey_is_answered without registering")
        return jsonify_template_user(404, False, "Please log in to use this")

    if not survey_id:
        logger.info(f"User {user_id} tampered with the json")
        return jsonify_template_user(404, False, "Please do not tamper with the JSON")
    
    survey = db.get(Surveys, int(survey_id))

    if not survey:
        logger.info(f"User {user_id} search for a non existant survey")
        return jsonify_template_user(404, False, "the survey you have search for did not exists")
    
    if user in survey.root_user:
        logger.info(f"User {user_id} has already answered survey {survey_id}")
        return jsonify_template_user(409, False, "You have already answered this survey")
    
    return jsonify_template_user(200, True, "You have not answered this yet")


@survey_posting.route("/answer/questionnaire/<int:id>", methods=['POST'])
@jwt_required()
@limiter.limit("20 per minute;300 per hour;5000 per day", key_func=get_jwt_identity)
def answer_questionnaire(id):
    data: dict = request.get_json()

    user_id = get_jwt_identity()
    user = db.get(Root_User, int(user_id))
    post = db.get(Posts, int(id))

    if not user:
        logger.info("User tried to answer questionnaire wihtout logging it")
        return jsonify_template_user(401, False, "You need to log in to access this")
    
    if not post:
        logger.info("User tried to answer a questionnaire with no existing post")
        return jsonify_template_user(400, False, "There is no such post like that")
    
    survey = post.survey_posts

    if user in survey.root_user:
        logger.info(f"User {user.id} already answered survey {survey.id}.")
        return jsonify_template_user(409, False, "You already answered this survey.")

    survey.root_user.append(user)

    q_sorted = sorted(survey.questions_survey, key=lambda x: x.question_number)

    for question in q_sorted:
        answer = Answers(answer_text=data.get(f"{question.question_number}"), 
                                   user=user)
        question.answers.append(answer)
        
    logger.info("Response saved")

    return jsonify_template_user(200, True, "You have succesfully answered this survey")

# ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

# ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

# ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

# ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

# ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

# ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

# ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

# ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

# ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

# ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

# ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

# ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


@survey_posting.route("/post/send/questionnaire/web", methods=["POST"])
@jwt_required()
@limiter.limit("1 per minute;20 per hour;100 per day", key_func=get_jwt_identity)
def send_post_survey_web():
    """Web: Use this instead of the two depracated method. I commented the validatation for post title and content since im catering this for the web for now"""

    user_id = get_jwt_identity()
    user = db.get(Root_User, int(user_id))

    if not user:
        logger.error("Someone tried to post without signing in")
        return jsonify_template_user(401, False, "You must log in first in order to post here")

    data: dict = request.get_json(silent=True) or {} # Gets the JSON from the frontend, returns None if its not JSON or in this case an empty dict

    survey_title: str = data.get("surveyTitle", "")
    survey_content: str = data.get("surveyDescription", "")

    approx_time: str = data.get("surveyApproxTime")
    tags: list = data.get("surveyTags")
    target_audience: list = data.get("target")
    
    post_code: str = data.get("post_code")
    svy_questions: list[dict[str, Any]] = data.get("data", {})

    survey_input_validate, survey_exist_flag = handle_post_input_exist(survey_title, survey_content, False)
    if survey_exist_flag:
        logger.error(survey_input_validate)
        return jsonify_template_user(400, False, survey_requirements)
    
    survey_requirements, survey_req_flag = handle_post_requirements(survey_title, survey_content, False)
    if survey_req_flag:
        logger.error(survey_requirements)
        return jsonify_template_user(422, False, survey_requirements)
    
    # Checks each question on the survey if it exist or not
    svy_exists_msg, svy_exists_flag = handle_web_survey_input_exist(svy_questions)
    if svy_exists_flag:
        msg = "Survey is missing data"
        logger.error(msg)
        return jsonify_template_user(400, False, msg, survey={"survey": svy_exists_msg})
    
    # Checks each question on the survey if it reachers the requirements e.g. question must be at least x long
    svy_req_msg, svy_req_flag = handle_web_survey_input_requirements(svy_questions)
    if svy_req_flag:
        logger.error(svy_req_msg)
        return jsonify_template_user(422, False, "You must meet the requirements for the survey", survey={"survey": svy_exists_msg})
    
    post = Posts(title=survey_title, content=survey_content, user=user)
    survey = Surveys(title=survey_title, content=survey_content, 
                     approx_time=approx_time, target_audience=target_audience)

    for scounter, svy_section in enumerate(svy_questions, start=1):

        survey.section.append(svy_questions.get("title"))
        svy_question_list: dict = svy_section.get("questions")

        for qcounter, q_dict in enumerate(svy_question_list, start=1):
            question = Question(
                                question_text=q_dict.get("title"), 
                                q_type=q_dict.get("type"), 
                                answer_required=q_dict.get("required", False),
                                question_number=qcounter, 
                                url=q_dict.get("video", None),
                                min_choice=q_dict.get("minChoices"),
                                max_choice=q_dict.get("maxChoices"),
                                section_title=svy_questions.get("title"),
                                section_desc=svy_questions.get("description") )

            if q_dict.get("type") in Question_type_inter.CHOICES_TYPE_WEB:
                for option in q_dict.get("options"):
                    choice = Choice(choice_text=option.get("text"))
                    question.choices_question.append(choice)
                
            if q_dict.get("image"):
                img_dict = q_dict.get("image")
                img = request.files.get(img_dict.get("fieldName"))

                question_img = Question_Image(name=img_dict.get("name"),
                                              img_type=img_dict.get("type"),
                                              size=img_dict.get("size"))
                filename = f"{uuid4()}_{img.filename}"
                try:
                    resp = supabase_client.storage.from_("profile_pic").upload(path=filename, file=img.read(), 
                                                                        file_options={"content-type": img.content_type})
                except Exception as e:
                    logger.exception(f"Exception type: {type(e).__name__}, message: {e}")
                    return jsonify_template_user(500, False, type(e).__name__)
                
                question.img_question = question_img
        
            survey.questions_survey.append(question)

    if post_code:
        stmt = select(Code).where(
            and_( Code.code_text == post_code, 
                 Code.is_used == False ))
        code_db = db.scalars(stmt).first()

        if not code_db:
            logger.info(f"{user_id} has inputed a used or non existent code")
            return jsonify_template_user(404, False, "The code you have entered is either used or non-existent")

        expires_at = datetime_return_tzinfo(code_db.expires_at)
        if expires_at < datetime.now(timezone.utc):
            logger.info("User tried to use an expired code")
            return jsonify_template_user(400, False, "The code you have entered is expired")

        post.approved = True
        code_db.is_used = True
        logger.info(f"{user_id} has entered the code and approved the post")

    for t in tags:
        post.category.append(t)
        survey.tags.append(t)

    post.survey_posts = survey
    db.add(post)

    success, error = commit_session()
    if not success:
        logger.exception(error)
        return jsonify_template_user(500, False, "Database error")

    logger.info(f"{user.id} Succesfully added Post")

    return jsonify_template_user(200, True, "Post added successfully")

@survey_posting.route("/post/send/questionnaire/mobile", methods=["POST"])
@jwt_required()
@limiter.limit("1 per minute;20 per hour;100 per day", key_func=get_jwt_identity)
def send_post_survey_mobile():
    """Mobile: Use this instead of the two depracated method. I commented the validatation for post title and content since im catering this for the web for now"""

    user_id = get_jwt_identity()
    user = db.get(Root_User, int(user_id))

    if not user:
        logger.error("Someone tried to post without signing in")
        return jsonify_template_user(401, False, "You must log in first in order to post here")

    data: dict = request.get_json(silent=True) or {} # Gets the JSON from the frontend, returns None if its not JSON or in this case an empty dict

    survey_caption: str = data.get("caption", "")

    survey_title: str = data.get("title", "")
    survey_content: str = data.get("description", "")

    approx_time: str = data.get("timeToComplete")
    tags: list = data.get("tags")
    target_audience: list = data.get("targetAudience")
    
    post_code: str = data.get("post_code")
    svy_questions: list[dict[str, Any]] = data.get("data", {})

    survey_input_validate, survey_exist_flag = handle_post_input_exist(survey_title, survey_content, False)
    if survey_exist_flag:
        logger.error(survey_input_validate)
        return jsonify_template_user(400, False, survey_requirements)
    
    survey_requirements, survey_req_flag = handle_post_requirements(survey_title, survey_content, False)
    if survey_req_flag:
        logger.error(survey_requirements)
        return jsonify_template_user(422, False, survey_requirements)
    
    # Checks each question on the survey if it exist or not
    svy_exists_msg, svy_exists_flag = handle_Mobile_survey_input_exist(svy_questions)
    if svy_exists_flag:
        msg = "Survey is missing data"
        logger.error(msg)
        return jsonify_template_user(400, False, msg, survey={"survey": svy_exists_msg})
    
    # Checks each question on the survey if it reachers the requirements e.g. question must be at least x long
    svy_req_msg, svy_req_flag = handle_mobile_survey_input_requirements(svy_questions)
    if svy_req_flag:
        logger.error(svy_req_msg)
        return jsonify_template_user(422, False, "You must meet the requirements for the survey", survey={"survey": svy_exists_msg})
    
    post = Posts(title=survey_title, content=survey_caption, user=user)
    survey = Surveys(title=survey_title, content=survey_content, 
                     approx_time=approx_time, target_audience=target_audience)

    list_section = []
    for qcounter, svy_questions in enumerate(svy_questions, start=1):
        question = Question(
            question_text=svy_questions.get("text"),
            question_number=svy_questions.get("order"),
            q_type=svy_questions.get("rype"),
            answer_required=svy_questions.get("required"),
            section_title=svy_questions.get("sectionId"),
            section_desc="Empty",
            url=svy_questions.get("videoUrl", None)
            )
        
        if svy_questions.get("type") in Question_type_inter.CHOICES_TYPE_WEB:
            for option in svy_questions.get("options"):
                choice = Choice(choice_text=option)
                question.choices_question.append(choice)

        if svy_questions.get("sectionId") not in list_section:
            list_section.append(svy_questions.get("sectionId"))

        survey.questions_survey.append(question)

    survey.section.extend(list_section)

    if post_code:
        stmt = select(Code).where(
            and_( Code.code_text == post_code, 
                 Code.is_used == False ))
        code_db = db.scalars(stmt).first()

        if not code_db:
            logger.info(f"{user_id} has inputed a used or non existent code")
            return jsonify_template_user(404, False, "The code you have entered is either used or non-existent")

        expires_at = datetime_return_tzinfo(code_db.expires_at)
        if expires_at < datetime.now(timezone.utc):
            logger.info("User tried to use an expired code")
            return jsonify_template_user(400, False, "The code you have entered is expired")

        post.approved = True
        code_db.is_used = True
        logger.info(f"{user_id} has entered the code and approved the post")

    for t in tags:
        post.category.append(t)
        survey.tags.append(t)

    post.survey_posts = survey
    db.add(post)

    success, error = commit_session()
    if not success:
        logger.exception(error)
        return jsonify_template_user(500, False, "Database error")

    logger.info(f"{user.id} Succesfully added Post")

    return jsonify_template_user(200, True, "Post added successfully")


@survey_posting.route("/post/send/questionnaire", methods=["POST"])
@jwt_required()
@limiter.limit("1 per minute;20 per hour;100 per day", key_func=get_jwt_identity)
def send_post_survey():
    """Use this instead of the two depracated method. I commented the validatation for post title and content since im catering this for the web for now"""
    user_id = get_jwt_identity()
    user = db.get(Root_User, int(user_id))

    if not user:
        logger.error("Someone tried to post without signing in")
        return jsonify_template_user(401, False, "You must log in first in order to post here")

    data: dict = request.get_json(silent=True) or {} # Gets the JSON from the frontend, returns None if its not JSON or in this case an empty dict

    # post_title: str = data.get("post_title", "")
    # post_content: str = data.get("post_content", "")

    survey_title: str = data.get("surveyTitle", "")
    survey_content: str = data.get("surveyDescription", "")

    approx_time: str = data.get("surveyApproxTime")
    tags: list = data.get("surveyTags")
    target_audience: list = data.get("target")
    
    post_code: str = data.get("post_code")
    svy_questions: dict[str, dict] = data.get("data", {})

    # Checks if the post and survey title content exists
    # post_input_validate, post_exist_flag = handle_post_input_exist(post_title, post_content)
    survey_input_validate, survey_exist_flag = handle_post_input_exist(survey_title, survey_content, False)
    # if post_exist_flag:
    #     logger.error(post_input_validate)
    #     return jsonify_template_user(400, False, post_input_validate)
    if survey_exist_flag:
        logger.error(survey_input_validate)
        return jsonify_template_user(400, False, survey_requirements)
    
    # Checks if the post and survey title content is wihtin the requirements
    # post_requirements, post_req_flag = handle_post_requirements(post_title, post_content)
    survey_requirements, survey_req_flag = handle_post_requirements(survey_title, survey_content, False)
    # if post_req_flag:
    #     logger.error(post_requirements)
    #     return jsonify_template_user(422, False, post_requirements)
    if survey_req_flag:
        logger.error(survey_requirements)
        return jsonify_template_user(422, False, survey_requirements)
    
    # Checks each question on the survey if it exist or not
    svy_exists_msg, svy_exists_flag = handle_survey_input_exists(svy_questions)
    if svy_exists_flag:
        msg = "Survey is missing data"
        logger.error(msg)
        return jsonify_template_user(400, False, msg, survey={"survey": svy_exists_msg})
    
    # Checks each question on the survey if it reachers the requirements e.g. question must be at least x long
    svy_req_msg, svy_req_flag = handle_survey_input_requirements(survey)
    if svy_req_flag:
        logger.error(svy_req_msg)
        return jsonify_template_user(422, False, "You must meet the requirements for the survey", survey={"survey": svy_exists_msg})
    
    post = Posts(title=survey_title, content=survey_content, user=user)
    survey = Surveys(title=survey_title, content=survey_content)

    for counter, (_, dvalue) in enumerate(svy_questions.items(), start=1):
        
        question = Question(question_text=dvalue.get("question"), q_type=dvalue.get("type"), answer_required=dvalue.get("required"),
                            answer_key=dvalue.get("answer"), question_number=counter)

        if dvalue["type"] == QuestionType.MULTIPLE_CHOICE.value:
            for data_choice in dvalue.get("choice"):
                question.choices_question.append( Choice(choice_text=data_choice) )
        
        survey.questions_survey.append(question)

    if post_code:
        stmt = select(Code).where(
            and_( Code.code_text == post_code, 
                 Code.is_used == False ))
        code_db = db.scalars(stmt).first()

        if not code_db:
            logger.info(f"{user_id} has inputed a used or non existent code")
            return jsonify_template_user(404, False, "The code you have entered is either used or non-existent")

        expires_at = datetime_return_tzinfo(code_db.expires_at)
        if expires_at < datetime.now(timezone.utc):
            logger.info("User tried to use an expired code")
            return jsonify_template_user(400, False, "The code you have entered is expired")

        post.approved = True
        code_db.is_used = True
        logger.info(f"{user_id} has entered the code and approved the post")

    if tags:
        stmt = select(Category).where(Category.category_text == tags)
        category_db = db.scalars(stmt).first()
        if not category_db:
            logger.info(f"User{user_id} tampered with the JSON category")
            return jsonify_template_user(400, False, "Please do not tamper with the JSON of the category")
        
        post.category = category_db.category_text
    
    post.survey_posts = survey
    db.add(post)

    success, error = commit_session()
    if not success:
        logger.exception(error)
        return jsonify_template_user(500, False, "Database error")

    logger.info(f"{user.id} Succesfully added Post")

    return jsonify_template_user(200, True, "Post added successfully")
