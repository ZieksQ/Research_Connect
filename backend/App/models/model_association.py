from App.database import Base
from sqlalchemy import ForeignKey
from sqlalchemy import DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime

# rootUser_survey = Table("rootUser_survey", Base.metadata, 
#                         Column("root_user_ID", ForeignKey("users_root.id"), primary_key=True),
#                         Column("svy_surveys_ID", ForeignKey("svy_surveys.id"), primary_key=True),
# )

class RootUser_Survey(Base):
    __tablename__ = "rootUser_survey"

    root_user_id: Mapped[int] = mapped_column(ForeignKey("users_root.id"), primary_key=True)
    svy_surveys_id: Mapped[int] = mapped_column(ForeignKey("svy_surveys.id"), primary_key=True)

    answered_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now)

    user: Mapped["Root_User"] = relationship( "Root_User", back_populates="link_survey", uselist=False)
    survey: Mapped["Surveys"] = relationship( "Surveys", back_populates="link_user", uselist=False)