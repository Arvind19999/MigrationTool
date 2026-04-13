from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class ConnectionTestOut(BaseModel):
    id: int
    user_id: Optional[int]
    db_type: str
    host: str
    port: int
    database: str
    username: str
    table: str
    jdbc_url: str
    driver: str
    jdbc_package: Optional[str]
    options: dict
    success: bool
    message: Optional[str]
    error: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True
