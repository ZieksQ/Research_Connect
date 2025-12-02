from App import limiter, mail
from flask import request, Blueprint
from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity
from flask_mail import Message
from smtplib import SMTPException
from secrets import token_hex
from functools import wraps
from datetime import datetime, timedelta, timezone
from sqlalchemy import select, and_
from secrets import token_hex
from App.database import db_session as db
from App.helper_methods import logger_setup, commit_session, jsonify_template_user
from App.helper_user_validation import handle_category_requirements, handle_date_auto_format
from App.models.model_enums import PostStatus
from App.models.model_enums import User_Roles
from App.models.model_post import Posts, Category, Rejected_Post
from App.models.model_users import Root_User, Users, Oauth_Users
from App.models.model_otp import Code

admin = Blueprint("admin", __name__)

logger = logger_setup(__name__, "admin.log")

generate_code = lambda: f"{token_hex(3)}"

who_user_query = lambda id, utype: db.get(Users, id) if utype == "local" else db.get(Oauth_Users, id)

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

@admin.route("/code/get", methods=["GET"])
@jwt_required()
@check_user_admin
@limiter.limit("20 per minute;300 per hour;5000 per day", key_func=get_jwt_identity)
def get_codes():

    stmt = select(Code).where(and_(Code.is_used == False,
                                   Code.expires_at > datetime.now(timezone.utc)))
    
    codes = db.scalars(stmt).all()

    data = [ c.get_data() for c in codes]

    return jsonify_template_user(200, True, data)

@admin.route("/post/get/not_approved", methods=["GET"])
@jwt_required()
@check_user_admin
@limiter.limit("20 per minute;300 per hour;5000 per day", key_func=get_jwt_identity)
def get_posts_not_approved():

    # posts = Posts.query.order_by(order).all()
    stmt = select(Posts).where(and_(Posts.approved == False,
                                    Posts.archived == False,
                                    Posts.status == PostStatus.OPEN.value,)
        ).order_by( Posts.date_created.desc())
    posts = db.scalars(stmt).all()

    data = [post.get_post() for post in posts]

    logger.info(f"{posts}")

    return jsonify_template_user(200, True, data)

@admin.route("/post/reject", methods=['PATCH'])
@jwt_required()
@check_user_admin
@limiter.limit("20 per minute;300 per hour;5000 per day", key_func=get_jwt_identity)
def post_reject():

    data: dict = request.get_json()
    user_id = get_jwt_identity()

    reject_msg: str = data.get("reject_msg").strip()
    post_id = data.get("post_id")

    post = db.get(Posts, int(post_id))

    user: Root_User = post.user
    who_user = who_user_query(user.id, user.user_type)

    if not post:
        logger.info(f"{user_id} tried to reject a non existent post")
        return jsonify_template_user(404, False, "The post you tried to reject is non existent")
    
    if not reject_msg:
        logger.info(f"{user_id} tried to reject a post without a message")
        return jsonify_template_user(400, False, "You must provide a reject message")
    
    if who_user.email:
        msg = Message(subject=f"From Inquira Admin",
                      recipients=[who_user.email])
        
        msg.html = f"""
            <html>
            <body style="font-family: Arial, sans-serif; background-color: #f6f6f6; padding: 20px;">
                <div style="max-width: 600px; margin: auto; background: white; padding: 30px; border-radius: 10px;">
                    <h2 style="color: #c0392b;">❌ Post Submission Rejected</h2>
                    <p>Hello {who_user.username},</p>

                    <p>We reviewed your recent post submission titled:</p>
                    <h3 style="color: #2c3e50; text-align: center; background-color: #f2f2f2; padding: 12px; border-radius: 7px;">
                        {post.title}
                    </h3>

                    <p>Unfortunately, your post has been <strong>rejected</strong> by an administrator for the following reason:</p>

                    <div style="background-color: #fdecea; border-left: 5px solid #e74c3c; padding: 15px; margin: 20px 0; border-radius: 5px;">
                        <p style="margin: 0; color: #c0392b; font-weight: bold;">Reason:</p>
                        <p style="margin-top: 5px; color: #444;">{reject_msg}</p>
                    </div>

                    <p>You may revise your post and resubmit it for review at any time.</p>

                    <p style="color: #999; font-size: 12px;">
                        If you believe this was a mistake, please contact support or reply to this email.
                    </p>
                </div>
            </body>
            </html>
        """

        try:
            mail.send(msg)
        except SMTPException as e:
            logger.exception(str(e))
            return jsonify_template_user(400, False, "Failed to send email", mail_error=str(e))

    reject_db = Rejected_Post(reject_msg=reject_msg)
    post.status = PostStatus.REJECTED.value
    post.reject_post = reject_db

    succ, err = commit_session()
    if not succ:
        logger.info(err)
        return jsonify_template_user(500, False, "Database Error")
    
    return jsonify_template_user(200, True, f"You have rejected {post_id}")

@admin.route("/generate/admin_acc/mass", methods=['GET'])
def create_admin_mass():

    HOW_MANY_ADMIN = 10

    for _ in range(HOW_MANY_ADMIN):
        user = Users(username=f"admin{token_hex(3)}")
        user.role = User_Roles.ADMIN.value
        user.set_password("1234")
        db.add(user)

    succ, err = commit_session()
    if not succ:
        logger.info(err)
        return jsonify_template_user(500, False, "Somehow the usernames got duplicated, since username is unique, just press it again")
    
    stmt = select(Users).where(Users.role == User_Roles.ADMIN.value)

    data = db.scalars(stmt).all()
        
    logger.info(f"You have created {len(data)} admin")
    logger.info(data)
    return jsonify_template_user(200,
                                 True,
                                 [f"{admin.username} : 1234" for admin in data])

@admin.route("/generate/admin_acc/solo", methods=['POST'])
def create_admin_solo():

    data: dict = request.get_json()

    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify_template_user(400, False, "Damn nigga at least fill in these inputs, you asked for these routes")
    
    stmt = select(Users).where(Users.username == username)
    if db.scalars(stmt).first():
        return jsonify_template_user(409, False, "Username already exists")
    
    user = Users(username=username)
    user.set_password(password)
    user.role = User_Roles.ADMIN.value

    db.add(user)

    succ, err = commit_session()
    if not succ:
        logger.info(err)
        return jsonify_template_user(500, False, err)
    
    stmt = select(Users).where(Users.role == User_Roles.ADMIN.value)

    data = db.scalars(stmt).all()
        
    logger.info(f"You have created {len(data)} admin")
    logger.info(data)
    return jsonify_template_user(200,
                                 True,
                                 f"You have created {username} : {password}")
