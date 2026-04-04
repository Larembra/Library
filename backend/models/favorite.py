from datetime import datetime

from sqlalchemy import Column, Integer, DateTime, ForeignKey, UniqueConstraint

from backend.database import Base


from backend.utils.time_utils import get_moscow_now


class Favorite(Base):
    __tablename__ = "favorites"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    book_id = Column(Integer, ForeignKey("books.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime, default=get_moscow_now)

    __table_args__ = (
        UniqueConstraint("user_id", "book_id", name="uq_user_book_favorite"),
    )
