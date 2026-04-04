from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.dependencies import get_db, get_current_user
from backend.models.report import Report
from backend.models.user import User
from backend.schemas.report import ReportCreate

router = APIRouter(prefix="/api/reports", tags=["reports"])


@router.post("")
def create_report(
    data: ReportCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if data.target_type not in ("comment", "review", "forum_topic", "forum_message"):
        raise HTTPException(status_code=400, detail="Неверный тип объекта")

    # Check if user already reported this target
    existing = db.query(Report).filter(
        Report.reporter_id == user.id,
        Report.target_type == data.target_type,
        Report.target_id == data.target_id,
        Report.status == "pending",
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Вы уже отправили жалобу на этот объект")

    report = Report(
        reporter_id=user.id,
        target_type=data.target_type,
        target_id=data.target_id,
        reason=data.reason,
    )
    db.add(report)
    db.commit()
    return {"message": "Жалоба отправлена"}
