from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    about: Optional[str] = None
    avatar: Optional[str] = None
    banner: Optional[str] = None


class PasswordChange(BaseModel):
    current_password: str
    new_password: str


class UserPublicOut(BaseModel):
    id: int
    username: str
    avatar: Optional[str] = None
    banner: Optional[str] = None
    about: Optional[str] = None
    role: str
    created_at: datetime

    class Config:
        from_attributes = True


class UserOut(BaseModel):
    id: int
    username: str
    email: str
    avatar: Optional[str] = None
    banner: Optional[str] = None
    about: Optional[str] = None
    role: str
    is_active: bool
    violation_count: int
    created_at: datetime

    class Config:
        from_attributes = True


class UserBrief(BaseModel):
    id: int
    username: str
    avatar: Optional[str] = None
    role: str

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    user_id: Optional[int] = None
