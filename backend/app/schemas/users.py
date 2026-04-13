from datetime import datetime

from pydantic import BaseModel


class UserCreate(BaseModel):
    full_name: str
    email: str
    password: str


class UserOut(BaseModel):
    id: int
    full_name: str
    email: str
    created_at: datetime

    class Config:
        from_attributes = True
