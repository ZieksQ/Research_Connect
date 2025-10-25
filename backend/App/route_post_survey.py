from flask import Blueprint, request
from sqlalchemy import select
from flask_jwt_extended import jwt_required, get_jwt_identity
from .database import db_session as db
from .helper_methods import jsonify_template_user, commit_session, logger_setup
from .model import ( Posts, QuestionType, Root_User,
                     Surveys, Question, Choice, Answers )
from .helper_user_validation import (handle_post_input_exist, handle_post_requirements, 
                              handle_survey_input_exists, handle_survey_input_requirements)


# Sets up the logger from my helper file
logger = logger_setup(__name__, "post_survey.log")
# Set up a route for each file so it is more organized
survey_posting = Blueprint("survey_posting", __name__)

@survey_posting.route("/post/get", methods=["GET"])
@jwt_required()
def get_posts():

    user_id = get_jwt_identity()
    user = db.get(Root_User, int(user_id))

    if not user:
        logger.error("Someone tried to post wihtout signing in")
        return jsonify_template_user(401, False, "You must log in first in order to post here")

    # posts = Posts.query.order_by(order).all()
    stmt = select(Posts)
    posts = db.scalars(stmt).all()

    data = [post.get_post() for post in posts]

    logger.info(f"{posts}")

    return jsonify_template_user(200, True, data)

@survey_posting.route("/post/get/<int:id>", methods=["GET"])
@jwt_required()
def get_posts_solo(id):

    user_id = get_jwt_identity()
    user = db.get(Root_User, int(user_id))

    if not user:
        logger.error("Someone tried to post wihtout signing in")
        return jsonify_template_user(401, False, "You must log in first in order to post here")

    post = db.get(Posts, int(id))

    if not post:
        return jsonify_template_user(404, False, "Post not found")

    data = post.get_post()

    logger.info(f"{post} {data}")

    return jsonify_template_user(200, True, data)

# Don not use this
# Use send_post_survey() instead
@survey_posting.route("/post/send", methods=["POST"])
@jwt_required()
def send_post():
    """Deprecated, use /post/send/questionnaire instead"""

    user_id = get_jwt_identity()
    user = db.get(Root_User, int(user_id))

    if not user:
        logger.error("Someone tried to post wihtout signing in")
        return jsonify_template_user(401, False, "You must log in first in order to post here")

    data: dict = request.get_json(silent=True) or {} # Gets the JSON from the frontend, returns None if its not JSON or in this case an empty dict

    title = data.get("title", "")
    content = data.get("content", "")

    post_input_validate, exist_flag = handle_post_input_exist(title, content)
    if exist_flag:
        logger.error(post_input_validate)
        return jsonify_template_user(400, False, post_input_validate)
    
    post_requirements, req_flag = handle_post_requirements(title, content)
    if req_flag:
        logger.error(post_requirements)
        return jsonify_template_user(422, False, post_requirements)
    
    post = Posts(title=title, content=content, user=user)

    db.add(post)
    success, error = commit_session()
    if not success:
        logger.exception(error)
        return jsonify_template_user(500, False, "Database Error")
    
    logger.info(f"{user.id} posted")
    
    return jsonify_template_user(200, True, f"Post created by {user.id}")

# Don not use this
# Use send_post_survey() instead
@survey_posting.route("/post/questionnaire", methods=['POST'])
@jwt_required()
def send_survey():
    """Deprecated, use /post/send/questionnaire instead"""

    user_id = get_jwt_identity()
    user = db.get(Root_User, int(user_id))

    if not user:
        logger.error("Someone tried to post wihtout signing in")
        return jsonify_template_user(401, False, "You must log in first in order to post here")

    data: dict = request.get_json(silent=True) or {}

    svy_exists_msg, svy_exists_flag = handle_survey_input_exists(data)
    if svy_exists_flag:
        msg = "Survey is missing data"
        logger.error(msg)
        return jsonify_template_user(400, False, msg, survey={"survey": svy_exists_msg})
    
    svy_req_msg, svy_req_flag = handle_survey_input_requirements(data)
    if svy_req_flag:
        logger.error(svy_req_msg)
        return jsonify_template_user(422, False, "You must meet the requirements for the survey", survey={"survey": svy_exists_msg})

    survey = Surveys()

    for _, dvalue in data.items():
        
        question = Question(question_text=dvalue["question"], q_type=dvalue["type"], 
                            answer_key=dvalue["answer"])

        if dvalue["type"] == QuestionType.MULTIPLE_CHOICE.value:
            Choice(question_choices=question, choice_text=dvalue["choice"])
        
        survey.questions_survey.append(question)
    
    db.add(survey)

    success, error = commit_session()
    if not success:
        logger.exception(error)
        return jsonify_template_user(500, False, "Database error")

    logger.info("Succesfully added survey")

    return jsonify_template_user(200, True, "Survey posted successfully")

@survey_posting.route("/post/send/questionnaire", methods=["POST"])
@jwt_required()
def send_post_survey():
    user_id = get_jwt_identity()
    user = db.get(Root_User, int(user_id))

    if not user:
        logger.error("Someone tried to post wihtout signing in")
        return jsonify_template_user(401, False, "You must log in first in order to post here")

    data: dict = request.get_json(silent=True) or {} # Gets the JSON from the frontend, returns None if its not JSON or in this case an empty dict

    post_title: str = data.get("post_title", "")
    post_content: str = data.get("post_content", "")
    survey_title: str = data.get("survey_title", "")
    survey_content: str = data.get("survey_content", "")
    dsurvey: dict[str, dict] = data.get("survey_questions", {})

    # Checks if the post and survey title content exists
    post_input_validate, post_exist_flag = handle_post_input_exist(post_title, post_content)
    survey_input_validate, survey_exist_flag = handle_post_input_exist(survey_title, survey_content, False)
    if post_exist_flag:
        logger.error(post_input_validate)
        return jsonify_template_user(400, False, post_input_validate)
    if survey_exist_flag:
        logger.error(survey_input_validate)
        return jsonify_template_user(400, False, survey_requirements)
    
    # Checks if the post and survey title content is wihtin the requirements
    post_requirements, post_req_flag = handle_post_requirements(post_title, post_content)
    survey_requirements, survey_req_flag = handle_post_requirements(survey_title, survey_content, False)
    if post_req_flag:
        logger.error(post_requirements)
        return jsonify_template_user(422, False, post_requirements)
    if survey_req_flag:
        logger.error(survey_requirements)
        return jsonify_template_user(422, False, survey_requirements)
    
    svy_exists_msg, svy_exists_flag = handle_survey_input_exists(dsurvey)
    if svy_exists_flag:
        msg = "Survey is missing data"
        logger.error(msg)
        return jsonify_template_user(400, False, msg, survey={"survey": svy_exists_msg})
    
    svy_req_msg, svy_req_flag = handle_survey_input_requirements(survey)
    if svy_req_flag:
        logger.error(svy_req_msg)
        return jsonify_template_user(422, False, "You must meet the requirements for the survey", survey={"survey": svy_exists_msg})
    
    post = Posts(title=post_title, content=post_content, user=user)
    survey = Surveys()

    for counter, (_, dvalue) in enumerate(dsurvey.items(), start=1):
        
        question = Question(question_text=dvalue.get("question"), q_type=dvalue.get("type"), answer_required=dvalue.get("required"),
                            answer_key=dvalue.get("answer"), question_number=counter)

        if dvalue["type"] == QuestionType.MULTIPLE_CHOICE.value:
            for data_choice in dvalue.get("choice"):
                question.choices_question.append( Choice(choice_text=data_choice) )
        
        survey.questions_survey.append(question)
    
    post.survey_posts = survey
    db.add(post)

    success, error = commit_session()
    if not success:
        logger.exception(error)
        return jsonify_template_user(500, False, "Database error")

    logger.info(f"{user.id} Succesfully added Post")

    return jsonify_template_user(200, True, "Post added successfully")

@survey_posting.route("/post/get/questionnaire/<int:id>", methods=["GET"])
@jwt_required()
def get_questionnaire(id):
    user_id = get_jwt_identity()
    user = db.get(Root_User, int(user_id))

    if not user:
        logger.error("User tried to access get questionnaire without logging in")
        return jsonify_template_user(401, False, "You need to log in to access this")
    
    post = db.get(Posts, int(id))
    survey = post.survey_posts

    sorted_question = sorted(survey.questions_survey, key=lambda x: x.question_number)
    questions = [question.get_questions() for question in sorted_question]

    logger.info(f"{post} {survey}")

    return jsonify_template_user(200, True, {"survey" : survey.id, "questions": questions})

@survey_posting.route("/post/search", methods=["GET"])
@jwt_required()
def search():
    query = request.args.get("query", "").strip()
    order = request.args.get("order", "asc").strip()

    post_order = Posts.id.asc() if order == "asc" else Posts.id.desc()

    user_id = get_jwt_identity()
    user = db.get(Root_User, int(user_id))

    if not user:
        logger.info("User tried to access search route wihtout logging in")
        return jsonify_template_user(401, False, "You need to log in to access this")

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

@survey_posting.route("/answer/questionnaire/<int:id>", methods=['POST'])
@jwt_required()
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