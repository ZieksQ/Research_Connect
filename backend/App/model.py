from App import db, bcrypt
import enum

'''
    get_ methods are just helper method to convert SQLALCHEMY object to Python dict
'''

# Creates a table for the Users
class Users(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(32), nullable=False, unique=True)
    __password = db.Column("password" ,db.String(256), nullable=False)
    post = db.relationship("Posts", backref="author", lazy=True)

    def __repr__(self):
        return f"User {self.id}"
    
    def get_user(self):
        return {
            "id" : self.id,
            "username" : self.username,
        } 
    
    def check_password(self, password):
        return bcrypt.check_password_hash(self.__password, password)
    
    def set_password(self, password):
        self.__password = bcrypt.generate_password_hash(password).decode("utf-8")

# Creates a table for the Posts
class Posts(db.Model):
    __tablename__ = "users_posts"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(128), nullable=False)
    content = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)

    def __repr__(self):
        return f"Post: {self.id}"
    
    def get_post(self):
        return {
            "id" : self.id,
            "title" : self.title,
            "content" : self.content,
            "user_id" : self.user_id,
        }

# Creates a table for the Survey to keep track of the revoked tokens
class RefreshToken(db.Model):
    __tablename__ = "users_refreshtoken"
    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(64), unique=True, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    revoked = db.Column(db.Boolean, default=False, nullable=False)
    expires_at = db.Column(db.DateTime, nullable=False)

    def __repr__(self):
        return f"No. {self.id}"

'''
Wala pa to, para to sa survey questions di pa gagamitin
tetesting ko muna
'''

# Enum for question type
class QuestionType(enum.Enum):
    MULTIPLE_CHOICE = "multiple_choice"
    ESSAY = "essay"

# Creates a table for the Survey
class Surveys(db.Model):
    __tablename__ = "svy_surveys"
    id = db.Column(db.Integer, primary_key=True)

    questions = db.relationship("Question", back_populates="survey", 
                                cascade="all, delete-orphan")

    def __repr__(self):
        return f"Survey: {self.id}"

# Question table
class Question(db.Model):
    __tablename__ = "svy_questions"

    id = db.Column(db.Integer, primary_key=True)
    question_text = db.Column(db.Text, nullable=False)                          # Allows long questions
    q_type = db.Column(db.Enum(QuestionType), nullable=False)
    survey_id = db.Column(db.Integer, db.ForeignKey("svy_surveys.id"), nullable=False)
    
    survey = db.relationship("Surveys", back_populates="questions")
    
    choices = db.relationship("Choice", back_populates="question", 
                              cascade="all, delete-orphan")              # back_populate to automatically link both tables
    essay = db.relationship("Essay", back_populates="question", 
                            cascade="all, delete-orphan", uselist=False)  # uselist=False to prevent having multiple essay in it, I want a one to one relationship

# Choice table (only for multiple-choice questions)
class Choice(db.Model):
    __tablename__ = "svy_choices"

    id = db.Column(db.Integer, primary_key=True)
    question_id = db.Column(db.Integer, db.ForeignKey("svy_questions.id"))
    choice_text = db.Column(db.JSON, nullable=False)
    choice_answer = db.Column(db.String(64), nullable=False)

    question = db.relationship("Question", back_populates="choices")            # Helpful for automatically inserting the foreignKey, usually its question_id=question.id

# Essay table to store answer for questions that requirees use input and not multiple choice e.g. essay
class Essay(db.Model):
    __tablename__ = "svy_essays"

    id = db.Column(db.Integer, primary_key=True)
    question_id = db.Column(db.Integer, db.ForeignKey("svy_questions.id"))
    essay_answer = db.Column(db.Text, nullable=False)

    question = db.relationship("Question", back_populates="essay")

'''
Usage
----------------------------------------------------------------------------------------------------

with app.app_context():
    # Multiple choice question
    q1 = Question(question_text="What is your favorite color?", type=QuestionType.MULTIPLE_CHOICE)
    q1.choices = [
        Choice(choice_text="Red"),
        Choice(choice_text="Blue"),
        Choice(choice_text="Green"),
        Choice(choice_text="Yellow")
    ]
    db.session.add(q1)

    # Essay question
    q2 = Question(question_text="Explain why you like programming.", type=QuestionType.ESSAY)
    db.session.add(q2)

    db.session.commit()
'''

'''
Can do this
-------------------------------------------------------------------------
type_map = {
    "multiple_choice": QuestionType.MULTIPLE_CHOICE,
    "essay": QuestionType.ESSAY
}

q_type = type_map.get(data["type"].lower())  # normalize to lowercase
if not q_type:
    return {"error": "Invalid question type"}, 400

q = Question(question_text=data["question_text"], type=q_type)

'''