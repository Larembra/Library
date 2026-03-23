from typing import Optional, List

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, func

from backend.dependencies import get_db, get_current_admin
from backend.models.book import Book, BookTag
from backend.models.user import User
from backend.schemas.book import BookCreate, BookUpdate, BookOut, BookListOut

router = APIRouter(prefix="/api/books", tags=["books"])


def _book_to_out(book: Book, db: Session) -> BookOut:
    tags = db.query(BookTag.tag).filter(BookTag.book_id == book.id).all()
    return BookOut(
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
        content=book.content,
        created_at=book.created_at,
    )


@router.get("", response_model=BookListOut)
def get_books(
    search: Optional[str] = Query(None),
    genre: Optional[str] = Query(None),
    sort: Optional[str] = Query("popular"),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    query = db.query(Book)

    if search:
        query = query.filter(
            or_(
                Book.title.ilike(f"%{search}%"),
                Book.author.ilike(f"%{search}%"),
            )
        )
    if genre and genre != "Все":
        query = query.filter(Book.genre.ilike(f"%{genre}%"))

    if sort == "rating":
        query = query.order_by(Book.rating.desc())
    elif sort == "new":
        query = query.order_by(Book.year.desc(), Book.created_at.desc())
    else:
        query = query.order_by(Book.reviews_count.desc())

    total = query.count()
    books = query.offset((page - 1) * per_page).limit(per_page).all()

    return BookListOut(
        books=[_book_to_out(b, db) for b in books],
        total=total,
        page=page,
        per_page=per_page,
    )


@router.get("/{book_id}", response_model=BookOut)
def get_book(book_id: int, db: Session = Depends(get_db)):
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Книга не найдена")
    return _book_to_out(book, db)


@router.get("/{book_id}/content")
def get_book_content(book_id: int, db: Session = Depends(get_db)):
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Книга не найдена")
    return {"content": book.content, "title": book.title}


@router.post("", response_model=BookOut)
def create_book(
    data: BookCreate,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    book = Book(
        title=data.title,
        author=data.author,
        description=data.description or "",
        cover=data.cover or "",
        genre=data.genre or "",
        year=data.year or 2024,
        is_free=data.is_free or False,
        content=data.content or "",
    )
    db.add(book)
    db.commit()
    db.refresh(book)

    if data.tags:
        for tag_name in data.tags:
            db.add(BookTag(book_id=book.id, tag=tag_name))
        db.commit()

    return _book_to_out(book, db)


@router.put("/{book_id}", response_model=BookOut)
def update_book(
    book_id: int,
    data: BookUpdate,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Книга не найдена")

    if data.title is not None:
        book.title = data.title
    if data.author is not None:
        book.author = data.author
    if data.description is not None:
        book.description = data.description
    if data.cover is not None:
        book.cover = data.cover
    if data.genre is not None:
        book.genre = data.genre
    if data.year is not None:
        book.year = data.year
    if data.is_free is not None:
        book.is_free = data.is_free
    if data.content is not None:
        book.content = data.content

    if data.tags is not None:
        db.query(BookTag).filter(BookTag.book_id == book.id).delete()
        for tag_name in data.tags:
            db.add(BookTag(book_id=book.id, tag=tag_name))

    db.commit()
    db.refresh(book)
    return _book_to_out(book, db)


@router.delete("/{book_id}")
def delete_book(
    book_id: int,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Книга не найдена")
    db.delete(book)
    db.commit()
