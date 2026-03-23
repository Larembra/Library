from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class ForumTopicCreate(BaseModel):
    title: str
    content: str  # First message content
    tag: Optional[str] = "Обсуждение"


class ForumTopicOut(BaseModel):
    id: int
    title: str
    author_id: int
    author_name: str = ""
    is_pinned: bool
    is_locked: bool
    tag: str
    replies_count: int = 0
    last_activity: datetime
    created_at: datetime

    class Config:
        from_attributes = True


class ForumMessageCreate(BaseModel):
    content: str
    parent_id: Optional[int] = None


class ForumMessageOut(BaseModel):
    id: int
    topic_id: int
    author_id: int
    author_name: str = ""
    author_avatar: str = ""
    author_role: str = "reader"
    content: str
    likes: int
    dislikes: int
    liked_by_user: bool = False
    disliked_by_user: bool = False
    parent_id: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True
