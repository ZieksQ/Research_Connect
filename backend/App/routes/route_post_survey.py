import json
from App import limiter, supabase_client
from flask import Blueprint, request
from sqlalchemy import select, and_, or_, func
from flask_jwt_extended import jwt_required, get_jwt_identity
from functools import wraps
from datetime import datetime, timezone
from typing import Any
from uuid import uuid4
from App.database import db_session as db
from App.models.model_post import Posts, Category
from App.models.model_survey_q_a import Surveys, Question, Answers, Choice, Question_Image, Section
from App.models.model_users import Root_User
from App.models.model_otp import Code
from App.models.model_enums import QuestionType, Question_type_inter, PostStatus
from App.models.model_association import RootUser_Survey
from App.helper_methods import ( jsonify_template_user, commit_session, flush_session,
                                logger_setup, datetime_return_tzinfo )
from App.helper_user_validation import (handle_post_input_exist, handle_post_requirements, handle_web_survey_input_exist, 
                                        handle_web_survey_input_requirements, handle_Mobile_survey_input_exist, 
                                        handle_mobile_survey_input_requirements, handle_survey_misc_input_requirements,
                                        handle_survey_misc_input_exists, handle_user_answer_required, handle_date_auto_format)


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
    stmt = select(Posts)#.where(Posts.approved == True)
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
    if not post:
        return jsonify_template_user(404, False, "Post or Survey does not exists")
    survey: Surveys = post.survey_posts

    logger.info(f"{post} {survey}")

    return jsonify_template_user(200, True, survey.get_survey())

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
        .where(or_(
            Posts.title.ilike(f"%{query}%"),
            Posts.category.ilike(f"%{query}%"),
            Posts.target_audience.ilike(f"%{query}%"),
            Posts.content.ilike(f"%{query}%"),
            ))
        .order_by(post_order)
        .limit(100)
        .offset(0)
        )
    posts = db.scalars(stmt).all()

    data = [post.get_post() for post in posts]

    if not data:
        logger.info("There is no post to be searched")
        return jsonify_template_user(404, True, "There is no such thing")
    
    logger.info("Search successful")
    return jsonify_template_user(200, True, data)

@survey_posting.route("/post/search/by_title", methods=["GET"])
@jwt_required()
@check_user
@limiter.limit("100 per minute;5000 per day", key_func=get_jwt_identity)
def search_by_title():
    query = request.args.get("query", "").strip()
    order = request.args.get("order", "asc").strip()

    post_order = Posts.id.asc() if order == "asc" else Posts.id.desc()

    stmt = (
        select(Posts)
        .where(or_(
            Posts.title.ilike(f"%{query}%"),
            ))
        .order_by(post_order)
        .limit(100)
        .offset(0)
        )
    posts = db.scalars(stmt).all()

    data = [{
            "post_title": post.title, 
             "username": post.user.username,
             "username": post.user.profile_pic_url
             } for post in posts]

    if not data:
        logger.info("There is no post to be searched")
        return jsonify_template_user(404, True, "There is no such thing")
    
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
        return jsonify_template_user(401, False, "Please log in to use this")

    if not survey_id:
        logger.info(f"User {user_id} tampered with the json")
        return jsonify_template_user(404, False, "Please do not tamper with the JSON")
    
    survey = db.get(Surveys, int(survey_id))

    if not survey:
        logger.info(f"User {user_id} search for a non existant survey")
        return jsonify_template_user(404, False, "the survey you have search for did not exists")
    
    stmt = select(RootUser_Survey).where(and_(RootUser_Survey.root_user_id == user.id ),
                                            RootUser_Survey.svy_surveys_id == survey.id)
    is_answered = db.scalars(stmt).first()

    if is_answered:
        logger.info(f"User {user_id} has already answered survey {survey_id}")
        return jsonify_template_user(409, False,
                                     "You have already answered this survey",
                                     is_answered=False)
    
    return jsonify_template_user(200, True, "You have not answered this yet", is_answered=False)

@survey_posting.route("/answer/questionnaire/<int:id>", methods=['POST'])
@jwt_required()
@limiter.limit("20 per minute;300 per hour;5000 per day", key_func=get_jwt_identity)
def answer_questionnaire(id):

    user_id = get_jwt_identity()
    user = db.get(Root_User, int(user_id))
    survey = db.get(Surveys, int(id))

    if not user:
        logger.info("User tried to answer questionnaire wihtout logging it")
        return jsonify_template_user(401, False, "You need to log in to access this")
    
    if not survey:
        logger.info("User tried to answer a questionnaire with no existing post")
        return jsonify_template_user(404, False, "There is no such post like that")
    
    data: dict = request.get_json()

    if not data:
        logger.info(f"{user_id} tried to answer a survey without providing any answer")
        return jsonify_template_user(400, False, "You must provide an answer")
    
    responses: dict[str, dict] = data.get("responses")
    
    stmt = select(RootUser_Survey).where(and_(RootUser_Survey.root_user_id == int(user_id),
                                              RootUser_Survey.svy_surveys_id == int(id)))
    user_survey = db.scalars(stmt).first()

    if user_survey:
        logger.info(f"User {user.id} already answered survey {survey.id}.")
        return jsonify_template_user(409, False, "You already answered this survey.")
    
    sections = survey.section_survey

    answer_msg, answer_flag = handle_user_answer_required(responses, sections)
    if answer_flag:
        logger.info(f"{user_id} tried to bypass a required answer or inputed a wrong date format")
        return jsonify_template_user(400, False, answer_msg, extra_msg="You know you are required to answer that")

    for section in sections:
        section_id = section.another_id
        resp_section = responses.get(section_id)

        if not resp_section:
            continue

        for question in section.question_section:

            resp_answer_text = resp_section.get(question.another_id)
            q_type = question.q_type

            if q_type in Question_type_inter.CHOICES_TYPE_WEB:
                for rqt in resp_answer_text:
                    answer = Answers(user=user, answer_text=rqt)
                    question.answers.append(answer)
                    
            elif q_type == QuestionType.DATE.value:
                ans = handle_date_auto_format(resp_answer_text)
                answer = Answers(user=user, answer_text=ans)
                question.answers.append(answer)

            else:
                answer = Answers(user=user, answer_text=resp_answer_text)
                question.answers.append(answer)

    user_survey_answered = RootUser_Survey(user=user, survey=survey)

    db.add(user_survey_answered)
    succ, err = commit_session()
    if not succ:
        logger.error(err)
        return jsonify_template_user(500, False, "Database Error")
        
    logger.info("Response saved")

    return jsonify_template_user(200, True, "You have succesfully answered this survey")

@survey_posting.route("/post/update_data", methods=['PATCH'])
@jwt_required()
@check_user
@limiter.limit("20 per minute;300 per hour;5000 per day", key_func=get_jwt_identity)
def post_update_data():
    data: dict = request.get_json()

    user_id = get_jwt_identity()
    post_id = data.get("id")

    if not post_id:
        logger.info(f"{user_id} is trying to updated a post without providing a post id")
        return jsonify_template_user(400, False, "You must provide a post ID or do not tamper with the JSON")

    post = db.get(Posts, int(post_id))

    if not post:
        logger.info("Someone tried to updated a non existant post")
        return jsonify_template_user(404, False, "This post is non existant")
    
    survey: Surveys = post.survey_posts
    
    post_title = data.get("title", post.title)
    post_content = data.get("post_content", post.content)
    post_desc = data.get("survey_description", survey.content)
    status = data.get("status", PostStatus.OPEN.value)

    post_requirements, post_req_flag = handle_post_requirements(post_title, post_content)
    if post_req_flag:
        logger.error(post_requirements)
        return jsonify_template_user(422, False, post_requirements)
    
    survey_requirements, survey_req_flag = handle_post_requirements(post_title, post_desc, False)
    if survey_req_flag:
        logger.error(survey_requirements)
        return jsonify_template_user(422, False, survey_requirements)
    
    if status not in (PostStatus.CLOSED.value, PostStatus.OPEN.value):
        logger.info(f"{user_id} tampered with the JSON")
        return jsonify_template_user(422, False, "Please do not tamper with the status JSON (open, closed)")
    
    post.title = post_title
    post.content = post_content
    survey.title = post_title
    survey.content = post_desc
    post.status = status

    succ, err = commit_session()
    if not succ: 
        logger.info(err)
        return jsonify_template_user(500, False, "Database Error")
    
    logger.info(f"{user_id} has successfully updated the survey")
    return jsonify_template_user(200, True, "You have successfully updated the survey")

@survey_posting.route("/post/respones/computed_data/<int:id>", methods=['GET'])
@jwt_required()
@check_user
@limiter.limit("20 per minute;300 per hour;5000 per day", key_func=get_jwt_identity)
def survey_responses(id):

    survey = db.get(Surveys, int(id))
    user_id = get_jwt_identity()

    if not survey:
        logger.info(f"{user_id} tried to get the a non existent survey")
        return jsonify_template_user(404, False, "The survey does not exists")
    
    text_data = {}
    choice_data = {}
    dates_data = {}

    for section in survey.section_survey:
        for question in section.question_section:

            q_id = question.id
            q_another_id = question.another_id
            q_text = question.question_text
            q_type = question.q_type

            if q_type in (Question_type_inter.CHOICES_TYPE_WEB):

                stmt = select( Answers.answer_text, func.count(Answers.id)
                                ).where(
                                    Answers.question_id == q_id
                                    ).group_by( Answers.answer_text )
                
                datas = db.execute(stmt).all()
                q_options_data = {data[0]: data[1] for data in datas}

                choice_data[q_another_id] = {
                    "question_text": q_text,
                    "type": q_type,
                    "answer_data": q_options_data,
                    }
            
            elif q_type == QuestionType.DATE.value:

                stmt = select( Answers.answer_text, func.count(Answers.id)
                                ).where(
                                    Answers.question_id == q_id
                                    ).group_by( Answers.answer_text )
                
                datas = db.execute(stmt).all()
                q_options_data = {data[0]: data[1] for data in datas}

                dates_data[q_another_id] = {
                    "question_text": q_text,
                    "type": q_type,
                    "answer_data": q_options_data,
                    }

            else:                
                stmt = select(Answers.answer_text
                            ).where( Answers.question_id == q_id )
                datas = db.scalars(stmt).all()

                text_data[q_another_id] = {
                    "question_text": q_text,
                    "type": q_type,
                    "answer_data": datas,
                }
            
    logger.info(f"{user_id} has fetch the data for survey No. {id}")

    data = {
        "survey_title": survey.title,
        "survey_content": survey.content,
        "survey_tags": survey.tags,
        "survey_approx_time": survey.approx_time,
        "survey_target_audience": survey.target_audience,
        "choices_data": choice_data if choice_data else "There is no data for choices type of queston",
        "dates_data": dates_data if dates_data else "There is no data for the dates type of question",
        "text_data": text_data if text_data else "There is no data for the other type of question",
    }

    return jsonify_template_user(200, False, data)

@survey_posting.route("/post/count_questions/<int:id>", methods=['GET'])
@jwt_required()
@check_user
@limiter.limit("20 per minute;300 per hour;5000 per day", key_func=get_jwt_identity)
def survey_count_questions(id):
    survey = db.get(Surveys, int(id))
    user_id = get_jwt_identity()

    if not survey:
        logger.info(f"{user_id} tried to get the a non existent survey")
        return jsonify_template_user(404, False, "The survey does not exists")
        
    stmt = select(Section.id, func.count(Question.id)
                  ).join(
                      Question
                  ).where(
                      Section.survey_id == survey.id
                  ).group_by(
                      Section.id
                  )
    datas = db.execute(stmt).all()

    data_dict = {
        "section_length": len(datas),
    }

    for counter, d in enumerate(datas, start=1):
        data_dict[f"section{counter}"] = d[1]

    return jsonify_template_user(200, True, data_dict)

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
    """Web: Use this instead of the two depracated method."""

    user_id = get_jwt_identity()
    user = db.get(Root_User, int(user_id))

    if not user:
        logger.error("Someone tried to post without signing in")
        return jsonify_template_user(401, False, "You must log in first in order to post here")
    
    # data: dict = request.get_json(silent=True) or {} # Gets the JSON from the frontend, returns None if its not JSON or in this case an empty dict
    raw_json = request.form.get("surveyData")
    
    if not raw_json:
        logger.info(f"{user_id} tried to create a survey with nothing on it")
        return jsonify_template_user(400, False, "You did not provide any data for the survey")

    data: dict = json.loads(raw_json)
    files_dict = request.files.to_dict()

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
        return jsonify_template_user(400, False, survey_input_validate)
    
    survey_requirements, survey_req_flag = handle_post_requirements(survey_title, survey_content, False)
    if survey_req_flag:
        logger.error(survey_requirements)
        return jsonify_template_user(422, False, survey_requirements)
    
    # Checks each question on the survey if it exist or not
    svy_exists_msg, svy_exists_flag = handle_web_survey_input_exist(svy_questions)
    if svy_exists_flag:
        msg = "Survey is missing data"
        logger.error(msg)
        return jsonify_template_user(400, False, svy_exists_msg, extra_msg="You must meet these requirements")
    
    # Checks each question on the survey if it reachers the requirements e.g. question must be at least x long
    svy_req_msg, svy_req_flag = handle_web_survey_input_requirements(svy_questions, files_dict)
    if svy_req_flag:
        logger.error(svy_req_msg)
        return jsonify_template_user(422, False, "You must meet the requirements for the survey", survey={"survey": svy_req_msg})
    
    svy_misc_msg, svy_misc_exists = handle_survey_misc_input_exists(approx_time, tags, target_audience)
    if svy_misc_exists:
        logger.info(svy_misc_msg)
        return jsonify_template_user(404, False, svy_misc_msg)
    
    svy_misc_msg_req, svy_misc_req = handle_survey_misc_input_requirements(approx_time, tags, target_audience)
    if svy_misc_req:
        logger.info(svy_misc_msg_req)
        return jsonify_template_user(422, False, svy_misc_msg_req)

    post = Posts( title=survey_title, content=survey_content, 
                 user=user, category=tags, target_audience = target_audience )
    
    survey = Surveys( title=survey_title, content=survey_content, tags=tags,
                     approx_time=approx_time, target_audience = target_audience )
    
    for scounter, svy_section in enumerate(svy_questions, start=1):

        section = Section(another_id=svy_section.get("id"),
                          title=svy_section.get("title"),
                          desc=svy_section.get("description"))
        svy_question_list: list[dict[str, Any]] = svy_section.get("questions")

        for qcounter, q_dict in enumerate(svy_question_list, start=1):
            question = Question(
                                another_id=f"{qcounter}{q_dict.get("id")}",
                                question_text=q_dict.get("title"), 
                                q_type=q_dict.get("type"), 
                                answer_required=q_dict.get("required", False),
                                question_number=qcounter, 
                                url=q_dict.get("video", None),
                                min_choice=q_dict.get("minChoices"),
                                max_choice=q_dict.get("maxChoices"),
                                max_rating=q_dict.get("maxRating", 1)
                                )

            if q_dict.get("type") in Question_type_inter.CHOICES_TYPE_WEB:
                for option in q_dict.get("options"):
                    choice = Choice(choice_text=option.get("text"))
                    question.choices_question.append(choice)
                
            if q_dict.get("image"):
                img_dict: dict[str, Any] = q_dict.get("image")
                img = files_dict.get(img_dict.get("fieldName"))

                question_img = Question_Image(name=img_dict.get("name"),
                                              img_type=img_dict.get("type"),
                                              size=img_dict.get("size"))
                filename = f"{uuid4()}_{img.filename}"
                try:
                    resp = supabase_client.storage.from_("question_img").upload(path=filename, file=img.read(), 
                                                                        file_options={"content-type": img.content_type})
                except Exception as e:
                    logger.exception(f"Exception type: {type(e).__name__}, message: {e}")
                    return jsonify_template_user(500, False, str(e))
                
                public_url = supabase_client.storage.from_("question_img").get_public_url(path=filename)
                question_img.img_url = public_url
                question.img_question = question_img
  
            section.question_section.append(question)
        survey.section_survey.append(section)

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
    """Mobile: Use this instead of the two depracated method"""

    user_id = get_jwt_identity()
    user = db.get(Root_User, int(user_id))

    if not user:
        logger.error("Someone tried to post without signing in")
        return jsonify_template_user(401, False, "You must log in first in order to post here")

    # data: dict = request.get_json(silent=True) or {} # Gets the JSON from the frontend, returns None if its not JSON or in this case an empty dict
    raw_json = request.form.get("surveyData")

    if not raw_json:
        logger.info(f"{user_id} tried to create a survey with nothing on it")
        return jsonify_template_user(400, False, "You did not provide any data for the survey")

    data: dict = json.loads(raw_json)
    files_dict = request.files.to_dict()
    logger.info(data)

    post_caption: str = data.get("caption")

    survey_title: str = data.get("title")
    survey_content: str = data.get("description")

    approx_time: str = data.get("timeToComplete")
    tags: list = data.get("tags")
    target_audience: list = data.get("targetAudience")
    
    post_code: str = data.get("post_code")
    svy_questions: list[dict[str, Any]] = data.get("data", [])
    svy_sections: list[dict[str, Any]] = data.get("sections", [])

    post_input_validate, post_exist_flag = handle_post_input_exist(survey_title, post_caption)
    if post_exist_flag:
        logger.error(post_input_validate)
        return jsonify_template_user(400, False, post_input_validate)
    
    post_requirements, post_req_flag = handle_post_requirements(survey_title, post_caption)
    if post_req_flag:
        logger.error(post_requirements)
        return jsonify_template_user(422, False, post_requirements)
    
    survey_input_validate, survey_exist_flag = handle_post_input_exist(survey_title, survey_content, False)
    if survey_exist_flag:
        logger.error(survey_input_validate)
        return jsonify_template_user(400, False, survey_input_validate)
    
    survey_requirements, survey_req_flag = handle_post_requirements(survey_title, survey_content, False)
    if survey_req_flag:
        logger.error(survey_requirements)
        return jsonify_template_user(422, False, survey_requirements)
    
    # Checks each question on the survey if it exist or not
    svy_exists_msg, svy_exists_flag = handle_Mobile_survey_input_exist(svy_questions, svy_sections)
    if svy_exists_flag:
        logger.error(svy_exists_msg)
        return jsonify_template_user(400, False, svy_exists_msg, extra_msg="Your survey is missing some data")
    
    # Checks each question on the survey if it reachers the requirements e.g. question must be at least x long
    svy_req_msg, svy_req_flag = handle_mobile_survey_input_requirements(svy_questions, svy_sections)
    if svy_req_flag:
        logger.error(svy_req_msg)
        return jsonify_template_user(422, False, svy_req_msg, extra_msg="You must meet the requirements for the survey")
    
    svy_misc_msg, svy_misc_exists = handle_survey_misc_input_exists(approx_time, tags, target_audience)
    if svy_misc_exists:
        logger.info(svy_misc_msg)
        return jsonify_template_user(404, False, svy_misc_msg)
    
    svy_misc_msg_req, svy_misc_req = handle_survey_misc_input_requirements(approx_time, tags, target_audience)
    if svy_misc_req:
        logger.info(svy_misc_msg_req)
        return jsonify_template_user(404, False, svy_misc_msg_req)
    
    post = Posts(title=survey_title, content=post_caption, 
                 user=user, category=tags, target_audience=target_audience)
    survey = Surveys(title=survey_title, content=survey_content, 
                     tags=tags, target_audience=target_audience,
                     posts_survey=post, approx_time=approx_time)
    
    for section in svy_sections:
        section_db = Section(another_id=section.get("id") ,title=section.get("title"), desc=section.get("description"))
        survey.section_survey.append(section_db)
        
    db.add(post)
    succ, err = flush_session()
    if not succ:
        logger.info(err)
        return jsonify_template_user(500, False, "Database Error")

    for qcounter, svy_question in enumerate(svy_questions, start=1):

        options: list = svy_question.get("options")
        img_file = files_dict.get(svy_question.get("imageKey"))

        question = Question(
            another_id=f"{qcounter}{svy_question.get("sectionId")}",
            question_text=svy_question.get("title"),
            question_number=qcounter,
            q_type=svy_question.get("type"),
            answer_required=svy_question.get("required", False),
            url=svy_question.get("videoUrl", None),
            max_rating=svy_question.get("maxRating", 1)
            )
        
        if svy_question.get("type") in Question_type_inter.Q_TYPE_MOBILE:
            question.min_choice = svy_question.get("minChoice", 1)
            question.max_choice = svy_question.get("maxChoice", len(options))
            for option in options:
                choice = Choice(choice_text=option)
                question.choices_question.append(choice)

        if img_file:
            question_img = Question_Image(name=img_file.filename)
            filename = f"{uuid4()}_{img_file.filename}"
            try:
                resp = supabase_client.storage.from_("question_img").upload(path=filename, file=img_file.read(), 
                                                                        file_options={"content-type": img_file.content_type})
            except Exception as e:
                    logger.exception(f"Exception type: {type(e).__name__}, message: {e}")
                    return jsonify_template_user(500, False, type(e).__name__)
                
            public_url = supabase_client.storage.from_("question_img").get_public_url(path=filename)
            question_img.img_url = public_url
            question.img_question = question_img

        for ss in survey.section_survey:
            if ss.another_id == svy_question.get("sectionId"):
                ss.question_section.append(question)
                break

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

    success, error = commit_session()
    if not success:
        logger.exception(error)
        return jsonify_template_user(500, False, "Database error")

    logger.info(f"{user.id} Succesfully added Post")

    return jsonify_template_user(200, True, "Post added successfully")