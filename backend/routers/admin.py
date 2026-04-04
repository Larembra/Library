from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.dependencies import get_db, get_current_admin
from backend.models.user import User
from backend.models.book import Book
from backend.models.comment import Comment
from backend.models.review import Review
from backend.models.reading_history import ReadingHistory
from backend.models.report import Report
from backend.models.forum import ForumTopic, ForumMessage
from backend.schemas.user import UserOut, UserCreate
from backend.schemas.report import ReportOut
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


# ── Moderation (Reports) ──────────────────────────────────────

def _get_target_preview(report: Report, db: Session) -> str:
    """Get a short content preview for the reported target."""
    if report.target_type == "comment":
        obj = db.query(Comment).filter(Comment.id == report.target_id).first()
        return (obj.content[:120] + "…") if obj else "[удалён]"
    elif report.target_type == "review":
        obj = db.query(Review).filter(Review.id == report.target_id).first()
        return (obj.text[:120] + "…") if obj else "[удалён]"
    elif report.target_type == "forum_topic":
        obj = db.query(ForumTopic).filter(ForumTopic.id == report.target_id).first()
        return obj.title if obj else "[удалён]"
    elif report.target_type == "forum_message":
        obj = db.query(ForumMessage).filter(ForumMessage.id == report.target_id).first()
        return (obj.content[:120] + "…") if obj else "[удалён]"
    return ""


def _report_to_out(report: Report, db: Session) -> ReportOut:
    reporter = db.query(User).filter(User.id == report.reporter_id).first()
    return ReportOut(
        id=report.id,
        reporter_id=report.reporter_id,
        reporter_name=reporter.username if reporter else "",
        target_type=report.target_type,
        target_id=report.target_id,
        target_content_preview=_get_target_preview(report, db),
        reason=report.reason,
        status=report.status,
        created_at=report.created_at,
    )


@router.get("/reports", response_model=List[ReportOut])
def get_reports(
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    reports = db.query(Report).filter(Report.status == "pending").order_by(Report.created_at.desc()).all()
    return [_report_to_out(r, db) for r in reports]


@router.put("/reports/{report_id}/resolve")
def resolve_report(
    report_id: int,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Жалоба не найдена")

    # Delete the target object
    if report.target_type == "comment":
        obj = db.query(Comment).filter(Comment.id == report.target_id).first()
        if obj:
            db.delete(obj)
    elif report.target_type == "review":
        obj = db.query(Review).filter(Review.id == report.target_id).first()
        if obj:
            # Recalculate book rating
            book = db.query(Book).filter(Book.id == obj.book_id).first()
            db.delete(obj)
            if book:
                remaining = db.query(Review).filter(Review.book_id == book.id, Review.id != obj.id).all()
                if remaining:
                    book.rating = round(sum(r.rating for r in remaining) / len(remaining), 1)
                    book.reviews_count = len(remaining)
                else:
                    book.rating = 0.0
                    book.reviews_count = 0
    elif report.target_type == "forum_topic":
        obj = db.query(ForumTopic).filter(ForumTopic.id == report.target_id).first()
        if obj:
            db.delete(obj)
    elif report.target_type == "forum_message":
        obj = db.query(ForumMessage).filter(ForumMessage.id == report.target_id).first()
        if obj:
            db.delete(obj)

    # Mark all pending reports for the same target as resolved
    db.query(Report).filter(
        Report.target_type == report.target_type,
        Report.target_id == report.target_id,
        Report.status == "pending",
    ).update({"status": "resolved"})

    db.commit()
    return {"message": "Объект удалён, жалоба обработана"}


@router.put("/reports/{report_id}/dismiss")
def dismiss_report(
    report_id: int,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Жалоба не найдена")
    report.status = "dismissed"
    db.commit()
    return {"message": "Жалоба отклонена"}
