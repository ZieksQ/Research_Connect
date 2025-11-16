from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from App import bcrypt, default_profile_pic
from App.database import Base
from sqlalchemy import String, Integer, ForeignKey, Boolean, DateTime
from App.models.model_association import rootUser_survey

# To unifiy both user since i have two way to log in
class Root_User(Base):
    __tablename__ = "users_root"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_type: Mapped[str] = mapped_column("type", String(64), nullable=False)

    posts: Mapped[list["Posts"]] = relationship("Posts", uselist=True,
                                                back_populates="user", 
                                                cascade="all, delete-orphan")
    
    refresh_token: Mapped[list["RefreshToken"]] = relationship("RefreshToken", uselist=True,
                                                               back_populates="user_token",
                                                               cascade="all, delete-orphan")
    
    answers: Mapped[list["Answers"]] = relationship("Answers", uselist=True,
                                                    back_populates="user",
                                                    cascade="all, delete-orphan")
    
    otp: Mapped["OTP"] = relationship("OTP", uselist=False,
                                       back_populates="user",
                                       cascade="all, delete-orphan")
    
    survey: Mapped[list["Surveys"]] = relationship("Surveys", uselist=True,
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
    role: Mapped[str] = mapped_column(String(64), nullable=False)
    
    __mapper_args__ = {"polymorphic_identity": "local"}

    def __repr__(self):
        return f"User {self.id}"

    def get_user(self):
        return {
            "id": self.id,
            "username": self.username,
            "profile_pic_url": self.profile_pic_url,
            "role": self.role,
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
    role: Mapped[str] = mapped_column(String(64), nullable=False)
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
            "role": self.role,
        }


class RefreshToken(Base):
    __tablename__ = "user_refreshtoken"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    jti: Mapped[str] = mapped_column(String(64), unique=True, nullable=False)
    revoked: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)

    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users_root.id"), nullable=False)
    user_token: Mapped["Root_User"] = relationship("Root_User", back_populates="refresh_token")

    def __repr__(self):
        return f"No. {self.id}"
