from typing import Optional, List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.dependencies import get_db, get_current_user, get_optional_user
from backend.models.comment import Comment, CommentReaction
from backend.models.user import User
from backend.models.book import Book
from backend.schemas.comment import CommentCreate, CommentOut
from backend.schemas.review import ReactionRequest

router = APIRouter(prefix="/api", tags=["comments"])


def _comment_to_out(comment: Comment, db: Session, current_user: Optional[User] = None) -> CommentOut:
    user = db.query(User).filter(User.id == comment.user_id).first()
    book = db.query(Book).filter(Book.id == comment.book_id).first()
    liked = False
    disliked = False
    if current_user:
        reaction = db.query(CommentReaction).filter(
            CommentReaction.comment_id == comment.id,
            CommentReaction.user_id == current_user.id,
        ).first()
        if reaction:
            liked = reaction.reaction_type == "like"
            disliked = reaction.reaction_type == "dislike"

    # Get replies
    replies_db = db.query(Comment).filter(Comment.parent_id == comment.id).order_by(Comment.created_at.asc()).all()
    replies = [_comment_to_out(r, db, current_user) for r in replies_db]

    return CommentOut(
        id=comment.id,
        book_id=comment.book_id,
        book_title=book.title if book else "",
        user_id=comment.user_id,
        user_name=user.username if user else "",
        user_avatar=user.avatar if user else "",
        parent_id=comment.parent_id,
        content=comment.content,
        likes=comment.likes,
        dislikes=comment.dislikes,
        liked_by_user=liked,
        disliked_by_user=disliked,
        created_at=comment.created_at,
        replies=replies,
    )


@router.get("/books/{book_id}/comments", response_model=List[CommentOut])
def get_comments(
    book_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user),
):
    # Only top-level comments (no parent)
    comments = db.query(Comment).filter(
        Comment.book_id == book_id,
        Comment.parent_id.is_(None),
    ).order_by(Comment.created_at.desc()).all()
    return [_comment_to_out(c, db, current_user) for c in comments]


@router.post("/books/{book_id}/comments", response_model=CommentOut)
def create_comment(
    book_id: int,
    data: CommentCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    comment = Comment(
        book_id=book_id,
        user_id=user.id,
        parent_id=data.parent_id,
        content=data.content,
    )
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return _comment_to_out(comment, db, user)


@router.delete("/comments/{comment_id}")
def delete_comment(
    comment_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Комментарий не найден")
    if comment.user_id != user.id and user.role != "admin":
        raise HTTPException(status_code=403, detail="Нет прав на удаление")
    db.delete(comment)
    db.commit()
    return {"message": "Комментарий удален"}


@router.post("/comments/{comment_id}/react")
def react_to_comment(
    comment_id: int,
    data: ReactionRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Комментарий не найден")

    existing = db.query(CommentReaction).filter(
        CommentReaction.comment_id == comment_id,
        CommentReaction.user_id == user.id,
    ).first()

    if existing:
        if existing.reaction_type == data.reaction_type:
            if data.reaction_type == "like":
                comment.likes = max(0, comment.likes - 1)
            else:
                comment.dislikes = max(0, comment.dislikes - 1)
            db.delete(existing)
        else:
            if existing.reaction_type == "like":
                comment.likes = max(0, comment.likes - 1)
                comment.dislikes += 1
            else:
                comment.dislikes = max(0, comment.dislikes - 1)
                comment.likes += 1
            existing.reaction_type = data.reaction_type
    else:
        if data.reaction_type == "like":
            comment.likes += 1
        else:
            comment.dislikes += 1
        db.add(CommentReaction(comment_id=comment_id, user_id=user.id, reaction_type=data.reaction_type))

    db.commit()
    return {"likes": comment.likes, "dislikes": comment.dislikes}
