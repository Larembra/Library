from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ReportCreate(BaseModel):
    target_type: str  # comment | review | forum_topic | forum_message
    target_id: int
    reason: str


class ReportOut(BaseModel):
    id: int
    reporter_id: int
    reporter_name: str
    target_type: str
    target_id: int
    target_content_preview: str
    reason: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
