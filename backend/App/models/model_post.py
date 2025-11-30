from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from App.database import Base
from sqlalchemy import String, Integer, ForeignKey, Text, Boolean, DateTime, JSON

class Posts(Base):
    __tablename__ = "users_posts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String(512), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)

    category: Mapped[list[str]] = mapped_column(JSON, default=[], nullable=False)
    target_audience: Mapped[list[str]] = mapped_column(JSON, nullable=False)

    date_created: Mapped[datetime] = mapped_column(DateTime, default=datetime.now)
    date_updated: Mapped[datetime] = mapped_column(DateTime, default=datetime.now, onupdate=datetime.now)

    archived: Mapped[bool] = mapped_column(Boolean, default=False)
    approved: Mapped[bool] = mapped_column(Boolean, default=False)
    status: Mapped[str] = mapped_column(String(16), nullable=False, default="open")

    num_of_responses: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users_root.id"), nullable=False)

    user: Mapped["Root_User"] = relationship("Root_User", back_populates="posts")
    survey_posts: Mapped["Surveys"] = relationship("Surveys", back_populates="posts_survey",
                                                   cascade="all, delete-orphan", uselist=False)

    def __repr__(self):
        return f"Post: {self.id}"

    def get_post(self):
        return {
            "pk_survey_id": self.id,
            "survey_title": self.title,
            "survey_content": self.content,
            "survey_category": self.category,
            "survey_target_audience": self.target_audience,
            "survey_date_created": self.date_created,
            "survey_date_updated": self.date_updated,
            "user_username": self.user.username,
            "user_profile": self.user.profile_pic_url,
            "approx_time": self.survey_posts.approx_time,
            "num_of_responses": self.num_of_responses
        }
    
class Category(Base):
    __tablename__ = "users_posts_category"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    category_text: Mapped[str] = mapped_column(String(64), nullable=False)

