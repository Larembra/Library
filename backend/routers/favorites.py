from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.dependencies import get_db, get_current_user
from backend.models.favorite import Favorite
from backend.models.book import Book, BookTag
from backend.models.user import User
from backend.schemas.book import BookOut

router = APIRouter(prefix="/api/favorites", tags=["favorites"])


@router.get("", response_model=List[BookOut])
def get_favorites(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    favs = db.query(Favorite).filter(Favorite.user_id == user.id).order_by(Favorite.created_at.desc()).all()
    result = []
    for fav in favs:
        book = db.query(Book).filter(Book.id == fav.book_id).first()
        if book:
            tags = db.query(BookTag.tag).filter(BookTag.book_id == book.id).all()
            result.append(BookOut(
                id=book.id,
                title=book.title,
                author=book.author,
                description=book.description,
                cover=book.cover,
                genre=book.genre,
                year=book.year,
                is_free=book.is_free,
                rating=book.rating,
                reviews_count=book.reviews_count,
                tags=[t[0] for t in tags],
                created_at=book.created_at,
            ))
    return result


@router.post("/{book_id}")
def add_favorite(
    book_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Книга не найдена")

    existing = db.query(Favorite).filter(
        Favorite.user_id == user.id,
        Favorite.book_id == book_id,
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Книга уже в избранном")

    db.add(Favorite(user_id=user.id, book_id=book_id))
    db.commit()
    return {"message": "Добавлено в избранное"}


@router.delete("/{book_id}")
def remove_favorite(
    book_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    fav = db.query(Favorite).filter(
        Favorite.user_id == user.id,
        Favorite.book_id == book_id,
    ).first()
    if not fav:
        raise HTTPException(status_code=404, detail="Книга не в избранном")
    db.delete(fav)
    db.commit()
    return {"message": "Удалено из избранного"}


@router.get("/check/{book_id}")
def check_favorite(
    book_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    fav = db.query(Favorite).filter(
        Favorite.user_id == user.id,
        Favorite.book_id == book_id,
    ).first()
    return {"is_favorite": fav is not None}
