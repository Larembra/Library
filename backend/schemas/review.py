from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ReviewCreate(BaseModel):
    rating: int
    text: str


class ReviewOut(BaseModel):
    id: int
    book_id: int
    book_title: Optional[str] = None
    user_id: int
    user_name: str = ""
    user_avatar: str = ""
    rating: int
    text: str
    likes: int
    dislikes: int
    liked_by_user: bool = False
    disliked_by_user: bool = False
    created_at: datetime

    class Config:
        from_attributes = True


class ReactionRequest(BaseModel):
    reaction_type: str  # "like" | "dislike"
