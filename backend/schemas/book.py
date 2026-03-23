from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class BookCreate(BaseModel):
    title: str
    author: str
    description: Optional[str] = ""
    cover: Optional[str] = ""
    genre: Optional[str] = ""
    year: Optional[int] = 2024
    is_free: Optional[bool] = False
    tags: Optional[List[str]] = []


class BookUpdate(BaseModel):
    title: Optional[str] = None
    author: Optional[str] = None
    description: Optional[str] = None
    cover: Optional[str] = None
    genre: Optional[str] = None
    year: Optional[int] = None
    is_free: Optional[bool] = None
    tags: Optional[List[str]] = None


class BookOut(BaseModel):
    id: int
    title: str
    author: str
    description: str
    cover: str
    genre: str
    year: int
    is_free: bool
    rating: float
    reviews_count: int
    tags: List[str] = []
    created_at: datetime

    class Config:
        from_attributes = True


class BookListOut(BaseModel):
    books: List[BookOut]
    total: int
    page: int
    per_page: int
