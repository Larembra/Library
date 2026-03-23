from typing import Optional, List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.dependencies import get_db, get_current_user, get_current_admin, get_optional_user
from backend.models.review import Review, ReviewReaction
from backend.models.book import Book
from backend.models.user import User
from backend.schemas.review import ReviewCreate, ReviewOut, ReactionRequest

router = APIRouter(prefix="/api", tags=["reviews"])


def _review_to_out(review: Review, db: Session, current_user: Optional[User] = None) -> ReviewOut:
    user = db.query(User).filter(User.id == review.user_id).first()
    liked = False
    disliked = False
    if current_user:
        reaction = db.query(ReviewReaction).filter(
            ReviewReaction.review_id == review.id,
            ReviewReaction.user_id == current_user.id,
        ).first()
        if reaction:
            liked = reaction.reaction_type == "like"
            disliked = reaction.reaction_type == "dislike"

    return ReviewOut(
        id=review.id,
        book_id=review.book_id,
        user_id=review.user_id,
        user_name=user.username if user else "",
        user_avatar=user.avatar if user else "",
        rating=review.rating,
        text=review.text,
        likes=review.likes,
        dislikes=review.dislikes,
        liked_by_user=liked,
        disliked_by_user=disliked,
        created_at=review.created_at,
    )


@router.get("/books/{book_id}/reviews", response_model=List[ReviewOut])
def get_reviews(
    book_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user),
):
    reviews = db.query(Review).filter(Review.book_id == book_id).order_by(Review.created_at.desc()).all()
    return [_review_to_out(r, db, current_user) for r in reviews]


@router.post("/books/{book_id}/reviews", response_model=ReviewOut)
def create_review(
    book_id: int,
    data: ReviewCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Книга не найдена")

    existing = db.query(Review).filter(Review.book_id == book_id, Review.user_id == user.id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Вы уже оставили отзыв на эту книгу")

    review = Review(
        book_id=book_id,
        user_id=user.id,
        rating=data.rating,
        text=data.text,
    )
    db.add(review)

    # Update book rating
    all_reviews = db.query(Review).filter(Review.book_id == book_id).all()
    total_rating = sum(r.rating for r in all_reviews) + data.rating
    count = len(all_reviews) + 1
    book.rating = round(total_rating / count, 1)
    book.reviews_count = count

    db.commit()
    db.refresh(review)
    return _review_to_out(review, db, user)


@router.delete("/reviews/{review_id}")
def delete_review(
    review_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Отзыв не найден")
    if review.user_id != user.id and user.role != "admin":
        raise HTTPException(status_code=403, detail="Нет прав на удаление")

    book = db.query(Book).filter(Book.id == review.book_id).first()
    db.delete(review)

    # Recalculate rating
    if book:
        remaining = db.query(Review).filter(Review.book_id == book.id, Review.id != review_id).all()
        if remaining:
            book.rating = round(sum(r.rating for r in remaining) / len(remaining), 1)
            book.reviews_count = len(remaining)
        else:
            book.rating = 0.0
            book.reviews_count = 0

    db.commit()
    return {"message": "Отзыв удален"}


@router.post("/reviews/{review_id}/react")
def react_to_review(
    review_id: int,
    data: ReactionRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Отзыв не найден")

    existing = db.query(ReviewReaction).filter(
        ReviewReaction.review_id == review_id,
        ReviewReaction.user_id == user.id,
    ).first()

    if existing:
        if existing.reaction_type == data.reaction_type:
            # Remove reaction
            if data.reaction_type == "like":
                review.likes = max(0, review.likes - 1)
            else:
                review.dislikes = max(0, review.dislikes - 1)
            db.delete(existing)
        else:
            # Switch reaction
            if existing.reaction_type == "like":
                review.likes = max(0, review.likes - 1)
                review.dislikes += 1
            else:
                review.dislikes = max(0, review.dislikes - 1)
                review.likes += 1
            existing.reaction_type = data.reaction_type
    else:
        # New reaction
        if data.reaction_type == "like":
            review.likes += 1
        else:
            review.dislikes += 1
        db.add(ReviewReaction(review_id=review_id, user_id=user.id, reaction_type=data.reaction_type))

    db.commit()
    return {"likes": review.likes, "dislikes": review.dislikes}
