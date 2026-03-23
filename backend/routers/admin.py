from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.dependencies import get_db, get_current_admin
from backend.models.user import User
from backend.models.book import Book
from backend.models.comment import Comment
from backend.models.review import Review
from backend.models.reading_history import ReadingHistory
from backend.schemas.user import UserOut, UserCreate
from backend.schemas.stats import StatsOut
from backend.services.auth_service import get_password_hash

router = APIRouter(prefix="/api/admin", tags=["admin"])


@router.get("/stats", response_model=StatsOut)
def get_stats(
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    return StatsOut(
        total_books=db.query(Book).count(),
        total_users=db.query(User).count(),
        total_comments=db.query(Comment).count() + db.query(Review).count(),
        total_readings=db.query(ReadingHistory).count(),
    )


@router.get("/users", response_model=List[UserOut])
def get_users(
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    users = db.query(User).order_by(User.created_at.desc()).all()
    return users


@router.post("/users", response_model=UserOut)
def create_user(
    data: UserCreate,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email уже зарегистрирован")

    user = User(
        username=data.username,
        email=data.email,
        hashed_password=get_password_hash(data.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.put("/users/{user_id}/block")
def block_user(
    user_id: int,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    if user.role == "admin":
        raise HTTPException(status_code=400, detail="Нельзя заблокировать администратора")
    user.is_active = False
    db.commit()
    return {"message": "Пользователь заблокирован"}


@router.put("/users/{user_id}/unblock")
def unblock_user(
    user_id: int,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    user.is_active = True
    user.violation_count = 0
    db.commit()
    return {"message": "Пользователь разблокирован"}
