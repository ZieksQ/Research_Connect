from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from App import bcrypt, default_profile_pic
from .database import Base
from sqlalchemy import ( String, Integer, ForeignKey, Text, 
                        Boolean, DateTime, Enum, JSON )
import enum

# -----------------------------
# Root_User, User, Posts, RefreshToken, Oauth
# -----------------------------

# To unifiy both user since i have two way to log in
class Root_User(Base):
    __tablename__ = "users_root"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_type: Mapped[str] = mapped_column("type", String(64), nullable=False)

    posts: Mapped[list["Posts"]] = relationship("Posts",
                                                back_populates="user", 
                                                cascade="all, delete-orphan")
    
    refresh_token: Mapped[list["RefreshToken"]] = relationship("RefreshToken",
                                                               back_populates="user_token",
                                                               cascade="all, delete-orphan")
    
    answers: Mapped[list["Answers"]] = relationship("Answers",
                                                    back_populates="user",
                                                    cascade="all, delete-orphan")
    
    __mapper_args__ = {
        "polymorphic_on": user_type,
        "polymorphic_identity": "root",
    }

class Users(Root_User):
    __tablename__ = "users_local"

    id: Mapped[int] = mapped_column(ForeignKey("users_root.id"), primary_key=True)
    username: Mapped[str] = mapped_column(String(32), nullable=False, unique=True)
    _password: Mapped[str] = mapped_column("password" ,String(256), nullable=False)
    profile_pic_url: Mapped[str] = mapped_column(String(512), nullable=True,
                                                 default=default_profile_pic)
    
    __mapper_args__ = {"polymorphic_identity": "local"}

    def __repr__(self):
        return f"User {self.id}"

    def get_user(self):
        return {
            "id": self.id,
            "username": self.username,
            "profile_pic_url": self.profile_pic_url,
        }

    def check_password(self, password):
        return bcrypt.check_password_hash(self._password, password)

    def set_password(self, password):
        self._password = bcrypt.generate_password_hash(password).decode()

class Oauth_Users(Root_User):
    __tablename__ = "users_oauth"

    id: Mapped[int] = mapped_column(ForeignKey("users_root.id"), primary_key=True)
    provider: Mapped[str] = mapped_column(String(128), nullable=False)
    username: Mapped[str] = mapped_column(String(256), nullable=False)
    email: Mapped[str] = mapped_column(String(256), nullable=False)
    provider_user_id: Mapped[str] = mapped_column(String(512), nullable=False)
    profile_pic_url: Mapped[str] = mapped_column(String(512), nullable=False)

    __mapper_args__ = {"polymorphic_identity": "oauth"}

class Posts(Base):
    __tablename__ = "users_posts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String(128), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    date_created: Mapped[datetime] = mapped_column(DateTime, default=datetime.now)
    date_updated: Mapped[datetime] = mapped_column(DateTime, default=datetime.now, onupdate=datetime.now)

    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users_root.id"), nullable=True)
    user: Mapped["Root_User"] = relationship("Root_User", back_populates="posts")

    def __repr__(self):
        return f"Post: {self.id}"

    def get_post(self):
        return {
            "id": self.id,
            "title": self.title,
            "content": self.content,
            "user_id": self.user_id,
            "date_created": self.date_created,
            "date_updated": self.date_updated,
        }

class RefreshToken(Base):
    __tablename__ = "user_refreshtoken"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    jti: Mapped[str] = mapped_column(String(64), unique=True, nullable=False)
    revoked: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    expires_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)

    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users_root.id"), nullable=True)
    user_token: Mapped["Root_User"] = relationship("Root_User", back_populates="refresh_token")

    def __repr__(self):
        return f"No. {self.id}"


# -----------------------------
# Survey Models
# -----------------------------

class QuestionType(enum.Enum):
    MULTIPLE_CHOICE = "multiple_choice"
    ESSAY = "essay"

class Surveys(Base):
    __tablename__ = "svy_surveys"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    questions_survey: Mapped[list["Question"]] = relationship( "Question", back_populates="survey_question", 
                                                              cascade="all, delete-orphan", lazy="selectin")

    def __repr__(self):
        return f"Survey: {self.id}"

class Question(Base):
    __tablename__ = "svy_questions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    question_text: Mapped[str] = mapped_column(Text, nullable=False)
    q_type: Mapped[QuestionType] = mapped_column(Enum(QuestionType), nullable=False)
    answer_key: Mapped[str] = mapped_column(String(128), nullable=True)

    survey_id: Mapped[int] = mapped_column(Integer, ForeignKey("svy_surveys.id"), nullable=False)
    survey_question: Mapped["Surveys"] = relationship(back_populates="questions_survey")

    choices_question: Mapped["Choice"] = relationship( "Choice", back_populates="question_choices",
                                                      uselist=False, cascade="all, delete-orphan")
    
    answers: Mapped[list["Answers"]] = relationship( "Answers", back_populates="question", 
                                                    cascade="all, delete-orphan", uselist=True)

class Choice(Base):
    __tablename__ = "svy_choices"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    choice_text: Mapped[list[str]] = mapped_column(JSON, nullable=False)  # list of options

    question_id: Mapped[int] = mapped_column(Integer, ForeignKey("svy_questions.id"), nullable=False)
    question_choices: Mapped["Question"] = relationship( "Question", back_populates="choices_question")

class Answers(Base):
    __tablename__ = "svy_answers"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    answer_text: Mapped[str] = mapped_column(String(512), nullable=True)

    question_id: Mapped[int] = mapped_column(Integer, ForeignKey("svy_questions.id"), nullable=False)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users_root.id"), nullable=False)

    question: Mapped["Question"] = relationship("Question", back_populates="answers")
    user: Mapped["Root_User"] = relationship("Root_User", back_populates="answers")
