from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from backend.database import Base

from backend.utils.time_utils import get_moscow_now

class Bookmark(Base):
    __tablename__ = "bookmarks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    book_id = Column(Integer, ForeignKey("books.id", ondelete="CASCADE"), nullable=False)
    paragraph_index = Column(Integer, nullable=False)
    name = Column(String(200), nullable=False)
    description = Column(Text, default="")
    created_at = Column(DateTime, default=get_moscow_now)
