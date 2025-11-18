from sqlalchemy.orm import Mapped, mapped_column, relationship
from App.database import Base
from sqlalchemy import String, Integer, ForeignKey, Text, Boolean, JSON
from App.models.model_enums import QuestionType

CHOICES_TYPE = ("Multiple Choice", "Single Choice", "Dropdown", "multipleChoice", "checkboxes", "dropdown", "linearScale", "yesNo", "imageChoice")

class Surveys(Base):
    __tablename__ = "svy_surveys"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    posts_id: Mapped[int] = mapped_column(Integer, ForeignKey("users_posts.id"), nullable=False)

    title: Mapped[str] = mapped_column(String(256), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=True)

    tags: Mapped[list[str]] = mapped_column(JSON, default=[], nullable=False)
    approx_time: Mapped[str] = mapped_column(String(128), nullable=False)
    target_audience: Mapped[str] = mapped_column(String(256), nullable=False)

    posts_survey: Mapped["Posts"] = relationship("Posts", back_populates="survey_posts")
    section_survey: Mapped[list["Section"]] = relationship( "Section", back_populates="survey_section", uselist=True,
                                                              cascade="all, delete-orphan", lazy="selectin")
    
    link_user: Mapped["RootUser_Survey"] = relationship( "RootUser_Survey",
                                                        back_populates="survey",
                                                        cascade="all, delete-orphan")

    def __repr__(self):
        return f"Survey: {self.id}"
    
    def get_survey(self):
        return {
            "id": self.id,
            "title": self.title,
            "content": self.content,
            "approx_time": self.approx_time,
            "target_audience" : self.target_audience,
            "section" : [s.get_date() for s in self.section_survey],
            "tags" : [s for s in self.tags],
        }

class Section(Base):
    __tablename__ = "svy_section"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    another_id: Mapped[str] = mapped_column(String(256), nullable=False)
    title: Mapped[str] = mapped_column(String(256), nullable=False)
    desc: Mapped[str] = mapped_column(String(512), nullable=False )

    survey_id: Mapped[int] = mapped_column(ForeignKey("svy_surveys.id"), nullable=False)
    survey_section: Mapped["Surveys"] = relationship( "Surveys", back_populates="section_survey")

    question_section: Mapped[list["Question"]] = relationship( "Question", back_populates="section_question",
                                                        cascade="all, delete-orphan", lazy="selectin")
    
    def get_date(self):
        return {
            "id": self.id,
            "another_id": self.another_id,
            "title": self.title,
            "description": self.desc,
            "survey_id": self.survey_id,
            "questions": [q.get_questions() for q in self.question_section],
        }

class Question(Base):
    __tablename__ = "svy_questions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    another_id: Mapped[str] = mapped_column(String(128), nullable=False)
    question_number: Mapped[int] = mapped_column(Integer, nullable=False)
    question_text: Mapped[str] = mapped_column(String(512), nullable=False)
    q_type: Mapped[str] = mapped_column(String(64), nullable=False)
    answer_required = mapped_column(Boolean, default=False, nullable=False)
    url: Mapped[str] = mapped_column(String(512), nullable=True)
    min_choice: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    max_choice: Mapped[int] = mapped_column(Integer, nullable=False, default=1)

    survey_id: Mapped[int] = mapped_column(Integer, ForeignKey("svy_section.id"), nullable=False)
    section_question: Mapped["Section"] = relationship( "Section", back_populates="question_section")

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
                        if self.q_type in CHOICES_TYPE else []),
            "required": self.answer_required,
            "minChoice": self.min_choice if self.min_choice else 1,
            "maxChoice": self.max_choice if self.max_choice else 1,
            "image": self.img_question.get_data() if self.img_question else None,
            "url": self.url
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