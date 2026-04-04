from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.dependencies import get_db, get_current_user
from backend.models.user import User
from backend.models.book import Book
from backend.schemas.user import UserOut, UserUpdate, PasswordChange, UserPublicOut
from backend.schemas.review import ReviewOut
from backend.schemas.comment import CommentOut
from backend.schemas.forum import ForumTopicOut
from backend.models.review import Review
from backend.models.comment import Comment
from backend.models.forum import ForumTopic, ForumMessage
from typing import List, Optional
from backend.services.auth_service import verify_password, get_password_hash

router = APIRouter(prefix="/api/users", tags=["users"])


@router.get("/me", response_model=UserOut)
def get_profile(user: User = Depends(get_current_user)):
    return user


@router.put("/me", response_model=UserOut)
def update_profile(
    data: UserUpdate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if data.username is not None:
        user.username = data.username
    if data.email is not None:
        existing = db.query(User).filter(User.email == data.email, User.id != user.id).first()
        if existing:
            raise HTTPException(status_code=400, detail="Email уже используется")
        user.email = data.email
    if data.about is not None:
        user.about = data.about
    if data.avatar is not None:
        user.avatar = data.avatar
    if data.banner is not None:
        user.banner = data.banner
    db.commit()
    db.refresh(user)
    return user


@router.put("/me/password")
def change_password(
    data: PasswordChange,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not verify_password(data.current_password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Неверный текущий пароль")
    user.hashed_password = get_password_hash(data.new_password)
    db.commit()
    return {"message": "Пароль успешно изменен"}


@router.get("/me/reviews", response_model=List[ReviewOut])
def get_my_reviews(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    from backend.routers.reviews import _review_to_out
    reviews = db.query(Review).filter(Review.user_id == user.id).order_by(Review.created_at.desc()).all()
    return [_review_to_out(r, db, user) for r in reviews]


@router.get("/me/comments", response_model=List[CommentOut])
def get_my_comments(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Get book comments
    comments = db.query(Comment).filter(Comment.user_id == user.id).all()
    
    # Get forum messages
    forum_messages = db.query(ForumMessage).filter(ForumMessage.author_id == user.id).all()
    
    combined = []
    
    for c in comments:
        book = db.query(Book).filter(Book.id == c.book_id).first()
        combined.append(CommentOut(
            id=c.id,
            book_id=c.book_id,
            book_title=book.title if book else "",
            user_id=c.user_id,
            user_name=user.username,
            user_avatar=user.avatar,
            parent_id=c.parent_id,
            content=c.content,
            likes=c.likes,
            dislikes=c.dislikes,
            created_at=c.created_at,
        ))
        
    for m in forum_messages:
        topic = db.query(ForumTopic).filter(ForumTopic.id == m.topic_id).first()
        combined.append(CommentOut(
            id=m.id,
            # Assign a dummy book_id for forum messages since the frontend Comment type expects it
            book_id=0,
            topic_id=m.topic_id,
            topic_title=topic.title if topic else "",
            user_id=m.author_id,
            user_name=user.username,
            user_avatar=user.avatar,
            content=m.content,
            likes=m.likes,
            dislikes=m.dislikes,
            created_at=m.created_at,
        ))
        
    # Sort combined by date descending
    combined.sort(key=lambda x: x.created_at, reverse=True)
    return combined


@router.get("/me/topics", response_model=List[ForumTopicOut])
def get_my_topics(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    from backend.routers.forum import _topic_to_out
    topics = db.query(ForumTopic).filter(ForumTopic.author_id == user.id).order_by(ForumTopic.created_at.desc()).all()
    return [_topic_to_out(t, db) for t in topics]


@router.get("/{user_id}")
def get_user_public_profile(
    user_id: int,
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    # Reviews
    from backend.routers.reviews import _review_to_out
    reviews = db.query(Review).filter(Review.user_id == user_id).order_by(Review.created_at.desc()).all()

    # Comments
    comments_db = db.query(Comment).filter(Comment.user_id == user_id).order_by(Comment.created_at.desc()).all()
    comments_out = []
    for c in comments_db:
        book = db.query(Book).filter(Book.id == c.book_id).first()
        comments_out.append(CommentOut(
            id=c.id,
            book_id=c.book_id,
            book_title=book.title if book else "",
            user_id=c.user_id,
            user_name=user.username,
            user_avatar=user.avatar,
            parent_id=c.parent_id,
            content=c.content,
            likes=c.likes,
            dislikes=c.dislikes,
            created_at=c.created_at,
        ))
        
    # Get user forum messages as well
    forum_messages_db = db.query(ForumMessage).filter(ForumMessage.author_id == user_id).order_by(ForumMessage.created_at.desc()).all()
    for m in forum_messages_db:
        topic = db.query(ForumTopic).filter(ForumTopic.id == m.topic_id).first()
        comments_out.append(CommentOut(
            id=m.id,
            book_id=0,
            topic_id=m.topic_id,
            topic_title=topic.title if topic else "",
            user_id=m.author_id,
            user_name=user.username,
            user_avatar=user.avatar,
            content=m.content,
            likes=m.likes,
            dislikes=m.dislikes,
            created_at=m.created_at,
        ))
    
    comments_out.sort(key=lambda x: x.created_at, reverse=True)

    # Forum topics
    from backend.routers.forum import _topic_to_out
    topics = db.query(ForumTopic).filter(ForumTopic.author_id == user_id).order_by(ForumTopic.created_at.desc()).all()

    return {
        "user": UserPublicOut.model_validate(user),
        "reviews": [_review_to_out(r, db) for r in reviews],
        "comments": comments_out,
        "topics": [_topic_to_out(t, db) for t in topics],
    }
