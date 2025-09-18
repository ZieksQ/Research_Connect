from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Integer, ForeignKey, Text, Boolean, DateTime, Enum, JSON
from datetime import datetime
from App import bcrypt
from .db import Base
import enum

# -----------------------------
# User, Posts, RefreshToken
# -----------------------------

class Users(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    username: Mapped[str] = mapped_column(String(32), nullable=False, unique=True)
    _password: Mapped[str] = mapped_column(String(256), nullable=False)

    post: Mapped[list["Posts"]] = relationship(back_populates="user")
    refresh_token: Mapped["RefreshToken"] = relationship(back_populates="user", cascade="all, delete-orphan")

    def __repr__(self):
        return f"User {self.id}"

    def get_user(self):
        return {
            "id": self.id,
            "username": self.username,
        }

    def check_password(self, password):
        return bcrypt.check_password_hash(self._password, password)

    def set_password(self, password):
        self._password = bcrypt.generate_password_hash(password).decode("utf-8")


class Posts(Base):
    __tablename__ = "users_posts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String(128), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"))

    user: Mapped[Users] = relationship(back_populates="post")

    def __repr__(self):
        return f"Post: {self.id}"

    def get_post(self):
        return {
            "id": self.id,
            "title": self.title,
            "content": self.content,
            "user_id": self.user_id,
        }


class RefreshToken(Base):
    __tablename__ = "user_refreshtoken"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    jti: Mapped[str] = mapped_column(String(64), unique=True, nullable=False)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    revoked: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    expires_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)

    user: Mapped["Users"] = relationship(back_populates="refresh_token")

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

    questions: Mapped[list["Question"]] = relationship(back_populates="survey", cascade="all, delete-orphan")

    def __repr__(self):
        return f"Survey: {self.id}"


class Question(Base):
    __tablename__ = "svy_questions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    question_text: Mapped[str] = mapped_column(Text, nullable=False)
    q_type: Mapped[QuestionType] = mapped_column(Enum(QuestionType), nullable=False)
    survey_id: Mapped[int] = mapped_column(Integer, ForeignKey("svy_surveys.id"), nullable=False)

    survey: Mapped["Surveys"] = relationship(back_populates="questions")

    choices: Mapped[list["Choice"]] = relationship(back_populates="question", cascade="all, delete-orphan")
    essay: Mapped["Essay"] = relationship(back_populates="question", uselist=False, cascade="all, delete-orphan")


class Choice(Base):
    __tablename__ = "svy_choices"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    question_id: Mapped[int] = mapped_column(Integer, ForeignKey("svy_questions.id"), nullable=False)
    choice_text: Mapped[list[str]] = mapped_column(JSON, nullable=False)  # list of options
    choice_answer: Mapped[str] = mapped_column(String(64), nullable=False)

    question: Mapped["Question"] = relationship(back_populates="choices")


class Essay(Base):
    __tablename__ = "svy_essays"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    question_id: Mapped[int] = mapped_column(Integer, ForeignKey("svy_questions.id"), nullable=False)
    essay_answer: Mapped[str] = mapped_column(Text, nullable=False)

    question: Mapped["Question"] = relationship(back_populates="essay")
