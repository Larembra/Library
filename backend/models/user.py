from datetime import datetime

from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime

from backend.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    avatar = Column(String(500), default="")
    banner = Column(String(500), default="")
    about = Column(Text, default="")
    role = Column(String(20), default="reader")  # reader | admin
    is_active = Column(Boolean, default=True)
    violation_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
