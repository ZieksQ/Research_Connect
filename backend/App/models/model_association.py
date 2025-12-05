from App.database import Base
from sqlalchemy import ForeignKey
from sqlalchemy import DateTime, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime

class RootUser_Survey(Base):
    __tablename__ = "rootUser_survey"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    root_user_id: Mapped[int] = mapped_column(ForeignKey("users_root.id"))
    svy_surveys_id: Mapped[int] = mapped_column(ForeignKey("svy_surveys.id"))

    answered_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now)

    user: Mapped["Root_User"] = relationship( "Root_User", back_populates="link_survey")
    survey: Mapped["Surveys"] = relationship( "Surveys", back_populates="link_user")

class RootUser_Post_Liked(Base):
    __tablename__ = "rootUser_post_liked"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    root_user_id: Mapped[int] = mapped_column(ForeignKey("users_root.id"))
    post_id: Mapped[int] = mapped_column(ForeignKey("users_posts.id"))

    liked_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now)

    user: Mapped["Root_User"] = relationship( "Root_User", back_populates="link_post_liked")
    post: Mapped["Posts"] = relationship( "Posts", back_populates="link_user_liked")
