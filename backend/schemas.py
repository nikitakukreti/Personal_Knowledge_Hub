from pydantic import BaseModel, EmailStr, HttpUrl, validator
from typing import List, Optional
from datetime import datetime


# Auth Schemas
class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str

    @validator("username")
    def username_alphanumeric(cls, v):
        if len(v) < 3:
            raise ValueError("Username must be at least 3 characters")
        return v

    @validator("password")
    def password_length(cls, v):
        if len(v) < 6:
            raise ValueError("Password must be at least 6 characters")
        return v


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    email: str
    username: str
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut


# Resource Schemas
class ResourceCreate(BaseModel):
    title: str
    url: str
    description: Optional[str] = None
    tags: List[str] = []

    @validator("title")
    def title_not_empty(cls, v):
        if not v.strip():
            raise ValueError("Title cannot be empty")
        return v.strip()

    @validator("tags")
    def tags_cleaned(cls, v):
        return [tag.strip().lower() for tag in v if tag.strip()]


class ResourceUpdate(BaseModel):
    title: Optional[str] = None
    url: Optional[str] = None
    description: Optional[str] = None
    tags: Optional[List[str]] = None

    @validator("tags", pre=True, always=True)
    def tags_cleaned(cls, v):
        if v is None:
            return v
        return [tag.strip().lower() for tag in v if tag.strip()]


class ResourceOut(BaseModel):
    id: int
    title: str
    url: str
    description: Optional[str]
    tags: List[str]
    created_at: datetime
    updated_at: Optional[datetime]
    owner_id: int

    class Config:
        from_attributes = True

    @classmethod
    def from_orm(cls, obj):
        data = {
            "id": obj.id,
            "title": obj.title,
            "url": obj.url,
            "description": obj.description,
            "tags": [t for t in obj.tags.split(",") if t] if obj.tags else [],
            "created_at": obj.created_at,
            "updated_at": obj.updated_at,
            "owner_id": obj.owner_id,
        }
        return cls(**data)
