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
    date_created: Mapped[datetime] = mapped_column(DateTime, default=datetime.now)
    date_updated: Mapped[datetime] = mapped_column(DateTime, default=datetime.now, onupdate=datetime.now)
    archived: Mapped[bool] = mapped_column(Boolean, default=False)
    approved: Mapped[bool] = mapped_column(Boolean, default=False)

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
    
class Category(Base):
    __tablename__ = "users_posts_category"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    category_text: Mapped[str] = mapped_column(String(64), nullable=False)

