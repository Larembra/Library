from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class BookmarkCreate(BaseModel):
    book_id: int
    paragraph_index: int
    name: str
    description: Optional[str] = ""

class BookmarkOut(BaseModel):
    id: int
    book_id: int
    paragraph_index: int
    name: str
    description: str
    created_at: datetime

    class Config:
        from_attributes = True
