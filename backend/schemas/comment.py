from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class CommentCreate(BaseModel):
    content: str
    parent_id: Optional[int] = None


class CommentOut(BaseModel):
    id: int
    book_id: int
    user_id: int
    user_name: str = ""
    user_avatar: str = ""
    parent_id: Optional[int] = None
    content: str
    likes: int
    dislikes: int
    liked_by_user: bool = False
    disliked_by_user: bool = False
    created_at: datetime
    replies: List["CommentOut"] = []

    class Config:
        from_attributes = True
