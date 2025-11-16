from sqlalchemy.orm import Mapped, mapped_column, relationship
from App.database import Base
from sqlalchemy import String, Integer, ForeignKey, Text, Boolean, JSON
from App.models.model_association import rootUser_survey
from App.models.model_enums import QuestionType

class Surveys(Base):
    __tablename__ = "svy_surveys"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    posts_id: Mapped[int] = mapped_column(Integer, ForeignKey("users_posts.id"), nullable=False)

    title: Mapped[str] = mapped_column(String(256), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=True)

    tags: Mapped[list[str]] = mapped_column(JSON, nullable=False)
    approx_time: Mapped[str] = mapped_column(String(512), nullable=False)
    target_audience: Mapped[str] = mapped_column(String(256), nullable=False)
    section: Mapped[list[str]] = mapped_column(JSON, nullable=False)

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
    question_text: Mapped[str] = mapped_column(String(512), nullable=False)
    q_type: Mapped[str] = mapped_column(String(64), nullable=False)
    answer_required = mapped_column(Boolean, default=False, nullable=False)
    url: Mapped[str] = mapped_column(String(512), nullable=True)
    min_choice: Mapped[int] = mapped_column(Integer, nullable=True)
    max_choice: Mapped[int] = mapped_column(Integer, nullable=True)
    section_title: Mapped[str] = mapped_column(String(256), nullable=False)
    section_desc: Mapped[str] = mapped_column(String(512), nullable=False)


    survey_id: Mapped[int] = mapped_column(Integer, ForeignKey("svy_surveys.id"), nullable=False)
    survey_question: Mapped["Surveys"] = relationship( "Surveys", back_populates="questions_survey")

    img_question: Mapped["Question_Image"] = relationship( "Question_Image", back_populates="question_img",
                                                      uselist=False, cascade="all, delete-orphan")

    choices_question: Mapped[list["Choice"]] = relationship( "Choice", back_populates="question_choices",
                                                      uselist=True, cascade="all, delete-orphan")
  
    answers: Mapped[list["Answers"]] = relationship( "Answers", back_populates="question", 
                                                    cascade="all, delete-orphan", uselist=True)
    
    
    
    # Next patch/update
    # answer_key: Mapped[str] = mapped_column(String(128), nullable=True)
    
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
    __tablename__ = "svy_question_choices"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    choice_text: Mapped[str] = mapped_column(Text, nullable=False)

    question_id: Mapped[int] = mapped_column(Integer, ForeignKey("svy_questions.id"), nullable=False)
    question_choices: Mapped["Question"] = relationship( "Question", back_populates="choices_question")

    def __repr__(self):
        return f"Choice {self.id}"
    
class Question_Image(Base):
    __tablename__ = "svy_question_img"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    img_url: Mapped[str] = mapped_column(String(512), nullable=False)
    name: Mapped[str] = mapped_column(Text, nullable=True)
    img_type: Mapped[str] = mapped_column(String(128), nullable=True)
    size: Mapped[int] = mapped_column(Integer, nullable=True)

    question_id: Mapped[int] = mapped_column(Integer, ForeignKey("svy_questions.id"), nullable=False)
    question_img: Mapped["Question"] = relationship( "Question", back_populates="img_question")
    
    def get_data(self):
        return {
            "id": self.id,
            "img_url": self.img_url,
            "name": self.name,
            "img_type": self.img_type,
            "size": self.size,
        }

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