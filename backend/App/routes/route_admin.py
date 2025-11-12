from App import limiter
from flask import request, Blueprint
from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity
from secrets import token_hex
from functools import wraps
from datetime import datetime, timedelta, timezone
from App.database import db_session as db
from App.helper_methods import logger_setup, commit_session, jsonify_template_user
from App.helper_user_validation import handle_category_requirements
from App.model import User_Roles, Posts, Root_User, Code, Category

admin = Blueprint("admin", __name__)

logger = logger_setup(__name__, "admin.log")

generate_code = lambda: f"{token_hex(3)}"

def check_user_admin(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        jwt_payload = get_jwt()
        user_id = jwt_payload.get('sub')
        user_role = jwt_payload.get('role')
        user = db.get(Root_User, int(user_id))

        if not user:
            logger.info(f"Someone tried to access {func.__name__} without logging it")
            return jsonify_template_user(401, False, "You need to log in to access this")

        if user_role != User_Roles.ADMIN.value:
            logger.info(f"{user_id} tried to access {func.__name__} without being an admin")
            return jsonify_template_user(401, False, "Unauthorized access, please leave this alone")
        
        return func(*args, **kwargs)
    return wrapper

@admin.route("/approve_post", methods=['PATCH'])
@jwt_required()
@check_user_admin
@limiter.limit("20 per minute;300 per hour;5000 per day")
def approve_post():
    data: dict = request.get_json()

    user_id = get_jwt_identity()
    post_id = data.get("id")
    
    if not post_id:
        logger.info("Admin tried to tamper with the JSON body of approve post")
        return jsonify_template_user(400, False, "I know you are the admin but please do not tamper with the JSON body")
    
    post = db.get(Posts, int(post_id))

    if not post:
        logger.info("Admin tried to approve a non existent post")
        return jsonify_template_user(404, False, "The post does not exists")
    
    post.approved = True

    success, error = commit_session()
    if not success:
        logger.error(error)
        return jsonify_template_user(500, False, "Database Error")
    
    logger.info(f"{user_id} Approved the post {post.id}")

    return jsonify_template_user(200, True, f"You have approbed post number {post.id}")

@admin.route("/generate/post_code", methods=['GET'])
@jwt_required()
@check_user_admin
@limiter.limit("20 per minute;300 per hour;5000 per day")
def generate_post_code():
    user_id = get_jwt_identity()

    code_text = generate_code()
    expires_at = datetime.now(timezone.utc) + timedelta(days=3)

    code = Code( code_text=code_text, expires_at=expires_at )

    db.add(code)
    success, error = commit_session()
    if not success:
        logger.info(error)
        return jsonify_template_user(500, False, "Database error")
    
    logger.info(f"{user_id} has generated a new code")
    return jsonify_template_user(200, True, 
                                 "You have successfulyy generated the code", 
                                 generated_code=code.code_text)

@admin.route("/generate/post/category", methods=['POST'])
@jwt_required()
@check_user_admin
@limiter.limit("1 per minute;20 per hour;200 per day")
def generate_post_category():
    data: dict = request.get_json()
    user_id = get_jwt_identity()

    category_text: str = data.get("category")

    if not category_text:
        logger.info(f"Admin{user_id} failed to provide an input in category")
        return jsonify_template_user(404, False, "Please provide a category")
    
    category_msg, category_flag = handle_category_requirements(category_text)

    if category_flag:
        logger.info(f"{user_id}: {category_msg}")
        return jsonify_template_user(422, False, category_msg)
    
    category_db = Category( category_text=category_text )

    db.add(category_db)
    success, error = commit_session()
    if not success:
        logger.error(error)
        return jsonify_template_user(500, False, "Database Error")
    
    logger.info(f"{user_id} has added {category_text}")
    return jsonify_template_user(200, True, 
                                 f"You have added {category_text}")