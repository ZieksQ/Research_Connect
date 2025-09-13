from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from .model import Posts, Users
from App import db, jwt
from pathlib import Path
from .db_interaciton import jsonify_template_user, commit_session
from .user_validation import handle_post_input_exist, handle_post_requirements
import logging

# Formats how the logging should be in the log file
logger = logging.getLogger(__name__)
FORMAT = "%(name)s - %(asctime)s - %(funcName)s - %(lineno)d -  %(levelname)s - %(message)s"
log_path = Path(__file__).resolve().parent.parent / "log_folder/post_survey.log"

handler = logging.FileHandler(log_path, mode="a")
formatter = logging.Formatter(FORMAT)

handler.setFormatter(formatter)
logger.addHandler(handler) 

survey_posting = Blueprint("survey_posting", __name__)

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

    posts = Posts.query.order_by(order).all()

    data = [post.get_post() for post in posts]

    logger.info(f"{posts}")

    return jsonify_template_user(200, True, data), 200

@survey_posting.route("/posts/get/<int:id>", methods=["GET"])
@jwt_required()
def get_posts_solo(id):

    post = Posts.query.get_or_404(id)

    if not post:
        return jsonify_template_user(404, False, "Post not found")

    data = post.get_post()

    logger.info(f"{post} {data}")

    return jsonify_template_user(200, True, data), 200

@survey_posting.route("/posts/send", methods=["POST"])
@jwt_required
def send_post():

    user_id = get_jwt_identity()
    user = Users.query.get_or_404(user_id)

    data = request.get_json()

    title = data.get("title", "")
    content = data.get("content", "")

    post_input_validate = handle_post_input_exist(title, content)
    post_requirements = handle_post_requirements(title, content)

    if not post_input_validate["username"]["ok"] or not post_input_validate["password"]["ok"]:
        logger.error(post_input_validate)
        return jsonify_template_user(400, False, post_input_validate)
    
    if not post_requirements["username"]["ok"] or not post_requirements["username"]["ok"]:
        logger.error(post_requirements)
        return jsonify_template_user(422, False, post_requirements)
    
    post = Posts(title=title, content=content, user_id=user)

    db.session.add(post)
    success, error = commit_session()
    if not success:
        logger.exception(error)
        return jsonify_template_user(500, False, "Database Error"), 500
    
    return jsonify_template_user(200, True, f"Post created by {user.id}")
