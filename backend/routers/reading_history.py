from typing import List
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from backend.dependencies import get_db, get_current_user
from backend.models.reading_history import ReadingHistory
from backend.models.book import Book
from backend.models.user import User

router = APIRouter(prefix="/api/reading-history", tags=["reading-history"])


class ReadingHistoryOut(BaseModel):
    book_id: int
    book_title: str = ""
    book_cover: str = ""
    progress_percent: int
    current_page: int
    last_read_at: datetime

    class Config:
        from_attributes = True


class ProgressUpdate(BaseModel):
    progress_percent: int
    current_page: int


@router.get("", response_model=List[ReadingHistoryOut])
def get_history(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    entries = db.query(ReadingHistory).filter(
        ReadingHistory.user_id == user.id
    ).order_by(ReadingHistory.last_read_at.desc()).all()

    result = []
    for entry in entries:
        book = db.query(Book).filter(Book.id == entry.book_id).first()
        result.append(ReadingHistoryOut(
            book_id=entry.book_id,
            book_title=book.title if book else "",
            book_cover=book.cover if book else "",
            progress_percent=entry.progress_percent,
            current_page=entry.current_page,
            last_read_at=entry.last_read_at,
        ))
    return result


@router.put("/{book_id}", response_model=ReadingHistoryOut)
def update_progress(
    book_id: int,
    data: ProgressUpdate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Книга не найдена")

    entry = db.query(ReadingHistory).filter(
        ReadingHistory.user_id == user.id,
        ReadingHistory.book_id == book_id,
    ).first()

    if entry:
        entry.progress_percent = data.progress_percent
        entry.current_page = data.current_page
        entry.last_read_at = datetime.utcnow()
    else:
        entry = ReadingHistory(
            user_id=user.id,
            book_id=book_id,
            progress_percent=data.progress_percent,
            current_page=data.current_page,
        )
        db.add(entry)

    db.commit()
    db.refresh(entry)
    return ReadingHistoryOut(
        book_id=entry.book_id,
        book_title=book.title,
        book_cover=book.cover,
        progress_percent=entry.progress_percent,
        current_page=entry.current_page,
        last_read_at=entry.last_read_at,
    )
