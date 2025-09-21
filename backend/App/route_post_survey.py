from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from App import jwt
from .database import db_session as db
from sqlalchemy import select
from pathlib import Path
from sqlalchemy import select
from .db_interaction import jsonify_template_user, commit_session
import logging
from .model import ( Posts, Users, RefreshToken, QuestionType, 
                     Surveys, Question, Choice, Essay )
from .User_validation import (handle_post_input_exist, handle_post_requirements, 
                              handle_survey_input_exists, handle_survey_input_requirements)

# Formats how the logging should be in the log file
logger = logging.getLogger(__name__)
FORMAT = "%(name)s - %(asctime)s - %(funcName)s - %(lineno)d -  %(levelname)s - %(message)s"
log_path = Path(__file__).resolve().parent.parent / "log_folder/post_survey.log"

handler = logging.FileHandler(log_path, mode="a")
formatter = logging.Formatter(FORMAT)

handler.setFormatter(formatter)
logger.addHandler(handler) 

survey_posting = Blueprint("survey_posting", __name__)

type_map = {
    "multiple_choice": QuestionType.MULTIPLE_CHOICE,
    "essay": QuestionType.ESSAY
}

# Callback method to return as response to expired token
@jwt.expired_token_loader
def expired_token_response(jwt_header, jwt_payload):
    return jsonify_template_user(401, False, "You need to refresh the access token", token={"Expired Token" : True}), 401

# Callback method to check if the token is revoked
@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload):
    jti = jwt_payload["jti"]

    stmt = select(RefreshToken).where(RefreshToken.jti == jti)
    token = db.execute(stmt).scalars().first()  

    return token is not None and token.revoked

# Customize callback method to send a messaage to the frontend for any unauthorized access e.g. users accessing jwt_required()
@jwt.unauthorized_loader
def check_unauthorized_access(err_msg):
    logger.error(err_msg)

    return jsonify_template_user(401, False, "You need to log in to access this"), 401

@survey_posting.route("/post/get", methods=["GET"])
@jwt_required()
def get_posts():

    sort = request.args.get("sort", "asc")

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
    user = db.get(Users, user_id)

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
    data: dict = request.get_json(silent=True) or {}

    svy_exists_msg, svy_exists_flag = handle_survey_input_exists(data)
    if svy_exists_flag:
        logger.error("Survey does not exists")
        return jsonify_template_user(400, False, "Survey does not exists", survey={"survey": svy_exists_msg}), 400
    
    svy_req_msg, svy_req_flag = handle_survey_input_requirements(data)
    if svy_req_flag:
        logger.error(svy_req_msg)
        return jsonify_template_user(422, False, "You must meet the requirements for the survey", survey={"survey": svy_exists_msg}), 422

    survey = Surveys()

    for dkey, dvalue in data.items():
        q_type = type_map.get(dvalue["type"].lower(), "")
        
        question = Question(question_text=dkey, q_type=q_type)

        if q_type == QuestionType.MULTIPLE_CHOICE:
            choice = Choice(question=question, choice_text=dvalue["choice"], choice_answer=dvalue["answer"])
            question.choices = choice
        if q_type == QuestionType.ESSAY:
            essay = Essay(question=question, essay_answer=dvalue["answer"])
            question.essay = essay

        survey.questions.append(question)
    
    db.add(survey)

    success, error = commit_session()
    if not success:
        logger.exception(error)
        return jsonify_template_user(500, False, "Database error"), 500
    

    logger.info("Succesfully added survey")

    return jsonify_template_user(200, True, "Survey posted successfully"), 200

    