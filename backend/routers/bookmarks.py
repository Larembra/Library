from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from backend.dependencies import get_db, get_current_user
from backend.models.bookmark import Bookmark
from backend.schemas.bookmark import BookmarkCreate, BookmarkOut
from backend.models.user import User

router = APIRouter(prefix="/api/bookmarks", tags=["bookmarks"])

@router.get("/{book_id}", response_model=List[BookmarkOut])
def get_bookmarks(
    book_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return db.query(Bookmark).filter(
        Bookmark.user_id == user.id,
        Bookmark.book_id == book_id
    ).order_by(Bookmark.paragraph_index).all()

@router.post("", response_model=BookmarkOut)
def create_bookmark(
    data: BookmarkCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    bookmark = Bookmark(
        user_id=user.id,
        book_id=data.book_id,
        paragraph_index=data.paragraph_index,
        name=data.name,
        description=data.description
    )
    db.add(bookmark)
    db.commit()
    db.refresh(bookmark)
    return bookmark

@router.delete("/{bookmark_id}")
def delete_bookmark(
    bookmark_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    bookmark = db.query(Bookmark).filter(
        Bookmark.id == bookmark_id,
        Bookmark.user_id == user.id
    ).first()
    if not bookmark:
        raise HTTPException(status_code=404, detail="Закладка не найдена")
    db.delete(bookmark)
    db.commit()
    return {"message": "Закладка удалена"}
