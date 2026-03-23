from datetime import datetime

from sqlalchemy import Column, Integer, String, Text, Boolean, Float, DateTime, ForeignKey

from backend.database import Base


class Book(Base):
    __tablename__ = "books"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(300), nullable=False)
    author = Column(String(200), nullable=False)
    description = Column(Text, default="")
    cover = Column(String(500), default="")
    genre = Column(Text, default="")
    year = Column(Integer, default=2024)
    is_free = Column(Boolean, default=False)
    rating = Column(Float, default=0.0)
    reviews_count = Column(Integer, default=0)
    content = Column(Text, default="")  # Book text for reader
    created_at = Column(DateTime, default=datetime.utcnow)


class BookTag(Base):
    __tablename__ = "book_tags"

    id = Column(Integer, primary_key=True, index=True)
    book_id = Column(Integer, ForeignKey("books.id", ondelete="CASCADE"), nullable=False)
    tag = Column(String(100), nullable=False)
