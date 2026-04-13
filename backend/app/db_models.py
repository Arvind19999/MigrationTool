from datetime import datetime
from typing import Optional

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func
from sqlalchemy import Enum
from .enums import StatusEnum
from .constants import STATUS_VALUES

from .db import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    full_name: Mapped[str] = mapped_column(String(200), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=True, onupdate=func.now()
    )
    connection_tests: Mapped[list["ConnectionTest"]] = relationship(
        back_populates="user"
    )
    status: Mapped[str] = mapped_column(
        Enum(StatusEnum, name="status_enum"),
        nullable=False,
        default=STATUS_VALUES["ACTIVE"],          # ← use key, not hardcoded string
        server_default=STATUS_VALUES["ACTIVE"],
    )
    is_premimued: Mapped[bool] = mapped_column(
    Boolean, 
    nullable=False, 
    default=False,           # Python/ORM level default
    server_default="false"   # Database level default
)

class ConnectionTest(Base):
    __tablename__ = "connection_tests"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[Optional[int]] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="SET NULL"), index=True, nullable=True
    )
    db_type: Mapped[str] = mapped_column(String(32), nullable=False)
    host: Mapped[str] = mapped_column(String(255), nullable=False)
    port: Mapped[int] = mapped_column(Integer, nullable=False)
    database: Mapped[str] = mapped_column(String(255), nullable=False)
    username: Mapped[str] = mapped_column(String(255), nullable=False)
    table: Mapped[str] = mapped_column(String(255), nullable=False)
    schema: Mapped[str] = mapped_column(String(255), nullable=True)
    jdbc_url: Mapped[str] = mapped_column(Text, nullable=False)
    options: Mapped[dict] = mapped_column(JSONB, nullable=False, default=dict)
    success: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    message: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    error: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=True, onupdate=func.now()
    )
    user: Mapped[Optional[User]] = relationship(back_populates="connection_tests")
    
    status: Mapped[str] = mapped_column(
        Enum(StatusEnum, name="status_enum"),
        nullable=False,
        default=STATUS_VALUES["ACTIVE"],          # ← use key, not hardcoded string
        server_default=STATUS_VALUES["ACTIVE"],
    )
