from datetime import datetime

from sqlalchemy import Column, Integer, DateTime, ForeignKey, UniqueConstraint

from backend.database import Base


from backend.utils.time_utils import get_moscow_now


class ReadingHistory(Base):
    __tablename__ = "reading_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    book_id = Column(Integer, ForeignKey("books.id", ondelete="CASCADE"), nullable=False)
    progress_percent = Column(Integer, default=0)
    current_page = Column(Integer, default=1)
    last_read_at = Column(DateTime, default=get_moscow_now)

    __table_args__ = (
        UniqueConstraint("user_id", "book_id", name="uq_user_book_history"),
    )
