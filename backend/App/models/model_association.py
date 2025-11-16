from App.database import Base
from sqlalchemy import Table, Column, ForeignKey

rootUser_survey = Table("rootUser_survey", Base.metadata, 
                        Column("root_user_ID", ForeignKey("users_root.id"), primary_key=True),
                        Column("svy_surveys_ID", ForeignKey("svy_surveys.id"), primary_key=True),
)