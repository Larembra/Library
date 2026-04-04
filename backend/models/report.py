from datetime import datetime

from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey

from backend.database import Base
from backend.utils.time_utils import get_moscow_now


class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    reporter_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    target_type = Column(String(20), nullable=False)  # comment | review | forum_topic | forum_message
    target_id = Column(Integer, nullable=False)
    reason = Column(Text, nullable=False)
    status = Column(String(20), default="pending")  # pending | resolved | dismissed
    created_at = Column(DateTime, default=get_moscow_now)
