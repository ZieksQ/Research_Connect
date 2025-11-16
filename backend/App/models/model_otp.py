from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from App.database import Base
from sqlalchemy import String, Integer, ForeignKey, Boolean, DateTime


class OTP(Base):
    __tablename__ = "otp"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    otp_text: Mapped[str] = mapped_column(String(32), nullable=False)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.now)
    is_used: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users_root.id"), nullable=False)

    user: Mapped["Root_User"] = relationship("Root_User", back_populates="otp")

class Code(Base):
    __tablename__ = "post_code"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    code_text: Mapped[str] = mapped_column(String(32), nullable=False)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.now)
    is_used: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
