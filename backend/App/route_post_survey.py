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

# So i can store Enum to ng DB
type_map = {
    "multiple_choice": QuestionType.MULTIPLE_CHOICE,
    "essay": QuestionType.ESSAY
}

@survey_posting.route("/post/get", methods=["GET"])
@jwt_required()
def get_posts():

    user_id = get_jwt_identity()
    user = db.get(Root_User, int(user_id))
    sort = request.args.get("sort", "asc")

    if not user:
        logger.error("Someone tried to post wihtout signing in")
        return jsonify_template_user(401, False, "You must log in first in order to post here"), 401

    order = Posts.id.asc() if sort == "asc" else Posts.id.desc()

    # posts = Posts.query.order_by(order).all()
    stmt = select(Posts).order_by(order)
    posts = db.execute(stmt).scalars().all()

    data = [post.get_post() for post in posts]

    logger.info(f"{posts}")

    return jsonify_template_user(200, True, data), 200

@survey_posting.route("/post/get/<int:id>", methods=["GET"])
@jwt_required()
def get_posts_solo(id):

    user_id = get_jwt_identity()
    user = db.get(Root_User, int(user_id))

    if not user:
        logger.error("Someone tried to post wihtout signing in")
        return jsonify_template_user(401, False, "You must log in first in order to post here"), 401

    post = db.get(Posts, id)

    if not post:
        return jsonify_template_user(404, False, "Post not found"), 404

    data = post.get_post()

    logger.info(f"{post} {data}")

    return jsonify_template_user(200, True, data), 200

@survey_posting.route("/post/send", methods=["POST"])
@jwt_required()
def send_post():

    user_id = get_jwt_identity()
    user = db.get(Root_User, int(user_id))

    if not user:
        logger.error("Someone tried to post wihtout signing in")
        return jsonify_template_user(401, False, "You must log in first in order to post here"), 401

    data: dict = request.get_json(silent=True) or {} # Gets the JSON from the frontend, returns None if its not JSON or in this case an empty dict

    title = data.get("title", "")
    content = data.get("content", "")

    post_input_validate, exist_flag = handle_post_input_exist(title, content)
    if exist_flag:
        logger.error(post_input_validate)
        return jsonify_template_user(400, False, post_input_validate), 400
    
    post_requirements, req_flag = handle_post_requirements(title, content)
    if req_flag:
        logger.error(post_requirements)
        return jsonify_template_user(422, False, post_requirements), 422
    
    post = Posts(title=title, content=content, user=user)

    db.add(post)
    success, error = commit_session()
    if not success:
        logger.exception(error)
        return jsonify_template_user(500, False, "Database Error"), 500
    
    logger.info(f"{user.username} posted")
    
    return jsonify_template_user(200, True, f"Post created by {user.id}"), 200

@survey_posting.route("/post/questionnaire", methods=['POST'])
@jwt_required()
def send_survey():

    user_id = get_jwt_identity()
    user = db.get(Root_User, int(user_id))

    if not user:
        logger.error("Someone tried to post wihtout signing in")
        return jsonify_template_user(401, False, "You must log in first in order to post here"), 401

    data: dict = request.get_json(silent=True) or {}

    svy_exists_msg, svy_exists_flag = handle_survey_input_exists(data)
    if svy_exists_flag:
        msg = "Survey is missing data"
        logger.error(msg)
        return jsonify_template_user(400, False, msg, survey={"survey": svy_exists_msg}), 400
    
    svy_req_msg, svy_req_flag = handle_survey_input_requirements(data)
    if svy_req_flag:
        logger.error(svy_req_msg)
        return jsonify_template_user(422, False, "You must meet the requirements for the survey", survey={"survey": svy_exists_msg}), 422

    survey = Surveys()

    for _, dvalue in data.items():
        q_type = type_map.get(dvalue["type"].lower(), "")
        
        question = Question(question_text=dvalue["question"], q_type=q_type, 
                            answer_key=dvalue["answer"])

        if q_type == QuestionType.MULTIPLE_CHOICE:
            Choice(question_choices=question, choice_text=dvalue["choice"])
        
        survey.questions_survey.append(question)
    
    db.add(survey)

    success, error = commit_session()
    if not success:
        logger.exception(error)
        return jsonify_template_user(500, False, "Database error"), 500

    logger.info("Succesfully added survey")

    return jsonify_template_user(200, True, "Survey posted successfully"), 200

@survey_posting("/post/send/questionnaire", methods=["POAT"])
def send_post_survey():
    user_id = get_jwt_identity()
    user = db.get(Root_User, int(user_id))

    if not user:
        logger.error("Someone tried to post wihtout signing in")
        return jsonify_template_user(401, False, "You must log in first in order to post here"), 401

    data: dict = request.get_json(silent=True) or {} # Gets the JSON from the frontend, returns None if its not JSON or in this case an empty dict

    title = data.get("title", "")
    content = data.get("content", "")
    survey = data.get("survey", "")

    post_input_validate, exist_flag = handle_post_input_exist(title, content)
    if exist_flag:
        logger.error(post_input_validate)
        return jsonify_template_user(400, False, post_input_validate), 400
    
    post_requirements, req_flag = handle_post_requirements(title, content)
    if req_flag:
        logger.error(post_requirements)
        return jsonify_template_user(422, False, post_requirements), 422
    
    svy_exists_msg, svy_exists_flag = handle_survey_input_exists(survey)
    if svy_exists_flag:
        msg = "Survey is missing data"
        logger.error(msg)
        return jsonify_template_user(400, False, msg, survey={"survey": svy_exists_msg}), 400
    
    svy_req_msg, svy_req_flag = handle_survey_input_requirements(survey)
    if svy_req_flag:
        logger.error(svy_req_msg)
        return jsonify_template_user(422, False, "You must meet the requirements for the survey", survey={"survey": svy_exists_msg}), 422
    
    # pass this is where i need to configure it
    post = Posts(title=title, content=content, user=user)

    db.add(post)
    success, error = commit_session()
    if not success:
        logger.exception(error)
        return jsonify_template_user(500, False, "Database Error"), 500
    
    logger.info(f"{user.username} posted")
    
    return jsonify_template_user(200, True, f"Post created by {user.id}"), 200

    survey = Surveys()

    for _, dvalue in data.items():
        q_type = type_map.get(dvalue["type"].lower(), "")
        
        question = Question(question_text=dvalue["question"], q_type=q_type, 
                            answer_key=dvalue["answer"])

        if q_type == QuestionType.MULTIPLE_CHOICE:
            Choice(question_choices=question, choice_text=dvalue["choice"])
        
        survey.questions_survey.append(question)
    
    db.add(survey)

    success, error = commit_session()
    if not success:
        logger.exception(error)
        return jsonify_template_user(500, False, "Database error"), 500

    logger.info("Succesfully added survey")

    return jsonify_template_user(200, True, "Survey posted successfully"), 200

@survey_posting("/answer/questionnaire")
def answer_questionnaire():
    pass