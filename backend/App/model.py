from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from App import bcrypt, default_profile_pic
from .database import Base
from sqlalchemy import (Table, Column, String, Integer, ForeignKey,
                        Text, Boolean, DateTime, Enum)
from enum import Enum

# -----------------------------
# Table connecting root_user and answer
# -----------------------------

rootUser_survey = Table("rootUser_survey", Base.metadata, 
                        Column("root_user_ID", ForeignKey("users_root.id"), primary_key=True),
                        Column("svy_surveys_ID", ForeignKey("svy_surveys.id"), primary_key=True),
)

# -----------------------------
# User & Post Models 
# -----------------------------

class User_Roles(Enum):
    USER = "user"
    ADMIN = "admin"

# To unifiy both user since i have two way to log in
class Root_User(Base):
    __tablename__ = "users_root"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_type: Mapped[str] = mapped_column("type", String(64), nullable=False)
    role: Mapped[str] = mapped_column(String(64), nullable=False)

    posts: Mapped[list["Posts"]] = relationship("Posts",
                                                back_populates="user", 
                                                cascade="all, delete-orphan")
    
    refresh_token: Mapped[list["RefreshToken"]] = relationship("RefreshToken",
                                                               back_populates="user_token",
                                                               cascade="all, delete-orphan")
    
    answers: Mapped[list["Answers"]] = relationship("Answers",
                                                    back_populates="user",
                                                    cascade="all, delete-orphan")
    
    otp: Mapped["OTP"] = relationship("OTP", uselist=False,
                                       back_populates="user",
                                       cascade="all, delete-orphan")
    
    bypass_code: Mapped["Code"] = relationship("Code", uselist=False,
                                               back_populates="user",
                                               cascade="all, delete-orphan")
    
    survey: Mapped[list["Surveys"]] =relationship("Surveys",
                                                  secondary=rootUser_survey,
                                                  back_populates="root_user")
    
    def __repr__(self):
        return f"User {self.id}"
    
    __mapper_args__ = {
        "polymorphic_on": user_type,
        "polymorphic_identity": "root",
    }

class Users(Root_User):
    __tablename__ = "users_local"

    id: Mapped[int] = mapped_column(ForeignKey("users_root.id"), primary_key=True)
    username: Mapped[str] = mapped_column(String(64), nullable=False, unique=True)
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

    def __repr__(self):
        return F"User {self.id}"
    
    def get_user(self):
        return {
            "id": self.id,
            "username": self.username,
            "profile_pic_url": self.profile_pic_url,
        }

class Posts(Base):
    __tablename__ = "users_posts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String(512), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    date_created: Mapped[datetime] = mapped_column(DateTime, default=datetime.now)
    date_updated: Mapped[datetime] = mapped_column(DateTime, default=datetime.now, onupdate=datetime.now)

    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users_root.id"), nullable=False)

    user: Mapped["Root_User"] = relationship("Root_User", back_populates="posts")
    survey_posts: Mapped["Surveys"] = relationship("Surveys", back_populates="posts_survey",
                                                   cascade="all, delete-orphan", uselist=False)

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

class QuestionType(Enum):
    MULTIPLE_CHOICE = "multiple_choice"
    ESSAY = "essay"

class Surveys(Base):
    __tablename__ = "svy_surveys"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    posts_id: Mapped[int] = mapped_column(Integer, ForeignKey("users_posts.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(256), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=True)

    posts_survey: Mapped["Posts"] = relationship("Posts", back_populates="survey_posts")
    questions_survey: Mapped[list["Question"]] = relationship( "Question", back_populates="survey_question", uselist=True,
                                                              cascade="all, delete-orphan", lazy="selectin")
    
    root_user: Mapped[list["Root_User"]] = relationship("Root_User",
                                                        secondary=rootUser_survey,
                                                        back_populates="survey")

    def __repr__(self):
        return f"Survey: {self.id}"
    
    def get_survey(self):
        return {
            "id": self.id,
            "title": self.title,
            "content": self.content,
        }

class Question(Base):
    __tablename__ = "svy_questions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    question_number: Mapped[str] = mapped_column(Integer, nullable=False)
    question_text: Mapped[str] = mapped_column(Text, nullable=False)
    q_type: Mapped[str] = mapped_column(String(64), nullable=False)
    answer_required = mapped_column(Boolean, default=False, nullable=False)
    answer_key: Mapped[str] = mapped_column(String(128), nullable=True)

    survey_id: Mapped[int] = mapped_column(Integer, ForeignKey("svy_surveys.id"), nullable=False)
    survey_question: Mapped["Surveys"] = relationship(back_populates="questions_survey")

    choices_question: Mapped[list["Choice"]] = relationship( "Choice", back_populates="question_choices",
                                                      uselist=True, cascade="all, delete-orphan")
    
    answers: Mapped[list["Answers"]] = relationship( "Answers", back_populates="question", 
                                                    cascade="all, delete-orphan", uselist=True)
    
    def __repr__(self):
        return f"Question {self.id}"
    
    def get_questions(self):
        return {
            "id": self.id,
            "q_number": self.question_number,
            "question_text": self.question_text,
            "q_type": self.q_type,
            "choices": ([c.choice_text for c in self.choices_question] 
                        if self.q_type == QuestionType.MULTIPLE_CHOICE.value else []),
            "answer_key": self.answer_key,
            "required": self.answer_required,
        }
    
class Choice(Base):
    __tablename__ = "svy_choices"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    choice_text: Mapped[list[str]] = mapped_column(Text, nullable=False)  # list of options

    question_id: Mapped[int] = mapped_column(Integer, ForeignKey("svy_questions.id"), nullable=False)
    question_choices: Mapped["Question"] = relationship( "Question", back_populates="choices_question")

    def __repr__(self):
        return f"Choice {self.id}"

class Answers(Base):
    __tablename__ = "svy_answers"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    answer_text: Mapped[str] = mapped_column(Text, nullable=True)

    question_id: Mapped[int] = mapped_column(Integer, ForeignKey("svy_questions.id"), nullable=False)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users_root.id"), nullable=False)

    question: Mapped["Question"] = relationship("Question", back_populates="answers")
    user: Mapped["Root_User"] = relationship("Root_User", back_populates="answers")

    def __repr__(self):
        return f"Answer {self.id}"
    

# -----------------------------
# OTP
# -----------------------------

class OTP(Base):
    __tablename__ = "otp"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    otp_text: Mapped[str] = mapped_column(String(32), nullable=False)
    expires_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now)
    is_used: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users_root.id"), nullable=False)

    user: Mapped["Root_User"] = relationship("Root_User", back_populates="otp")

class Code(Base):
    __tablename__ = "post_code"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    otp_text: Mapped[str] = mapped_column(String(32), nullable=False)
    expires_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now)
    is_used: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users_root.id"), nullable=False)

    user: Mapped["Root_User"] = relationship("Root_User", back_populates="bypass_code")