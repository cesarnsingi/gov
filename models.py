import uuid
import enum
from datetime import datetime
from typing import Optional
from sqlalchemy import String, Text, Boolean, Integer, DateTime, ForeignKey, Numeric, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from database import Base


class ReportStatus(str, enum.Enum):
    submitted    = "submitted"
    under_review = "under_review"
    in_progress  = "in_progress"
    resolved     = "resolved"
    closed       = "closed"
    rejected     = "rejected"


class Citizen(Base):
    __tablename__ = "citizens"
    id:         Mapped[uuid.UUID]      = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    full_name:  Mapped[str]            = mapped_column(String(200), nullable=False)
    phone:      Mapped[str]            = mapped_column(String(20), unique=True, nullable=False)
    bi_number:  Mapped[Optional[str]]  = mapped_column(String(50), unique=True)
    ward:       Mapped[Optional[str]]  = mapped_column(String(100))
    password_hash: Mapped[str]         = mapped_column(String(255), nullable=False)
    is_active:  Mapped[bool]           = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime]       = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    reports:    Mapped[list["Report"]] = relationship(back_populates="citizen")
    push_tokens: Mapped[list["PushToken"]] = relationship(back_populates="citizen")


class Report(Base):
    __tablename__ = "reports"
    id:           Mapped[uuid.UUID]      = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    citizen_id:   Mapped[uuid.UUID]      = mapped_column(ForeignKey("citizens.id"))
    category:     Mapped[str]            = mapped_column(String(50), nullable=False)
    title:        Mapped[str]            = mapped_column(String(300), nullable=False)
    description:  Mapped[Optional[str]]  = mapped_column(Text)
    status:       Mapped[ReportStatus]   = mapped_column(SAEnum(ReportStatus), default=ReportStatus.submitted)
    lat:          Mapped[Optional[float]] = mapped_column(Numeric(9, 6))
    lng:          Mapped[Optional[float]] = mapped_column(Numeric(9, 6))
    address:      Mapped[Optional[str]]  = mapped_column(Text)
    district:     Mapped[Optional[str]]  = mapped_column(String(100))
    reference:    Mapped[str]            = mapped_column(String(50), unique=True)
    created_at:   Mapped[datetime]       = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at:   Mapped[datetime]       = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    citizen:      Mapped["Citizen"]      = relationship(back_populates="reports")
    photos:       Mapped[list["ReportPhoto"]] = relationship(back_populates="report", cascade="all, delete-orphan")
    updates:      Mapped[list["ReportUpdate"]] = relationship(back_populates="report", cascade="all, delete-orphan")


class ReportPhoto(Base):
    __tablename__ = "report_photos"
    id:         Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    report_id:  Mapped[uuid.UUID] = mapped_column(ForeignKey("reports.id", ondelete="CASCADE"))
    url:        Mapped[str]       = mapped_column(String(500), nullable=False)
    created_at: Mapped[datetime]  = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    report:     Mapped["Report"]  = relationship(back_populates="photos")


class ReportUpdate(Base):
    __tablename__ = "report_updates"
    id:         Mapped[uuid.UUID]        = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    report_id:  Mapped[uuid.UUID]        = mapped_column(ForeignKey("reports.id", ondelete="CASCADE"))
    status:     Mapped[ReportStatus]     = mapped_column(SAEnum(ReportStatus))
    note:       Mapped[Optional[str]]    = mapped_column(Text)
    updated_by: Mapped[Optional[str]]    = mapped_column(String(200))
    created_at: Mapped[datetime]         = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    report:     Mapped["Report"]         = relationship(back_populates="updates")


class PushToken(Base):
    __tablename__ = "push_tokens"
    id:          Mapped[uuid.UUID]          = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    citizen_id:  Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey("citizens.id", ondelete="CASCADE"))
    token:       Mapped[str]                = mapped_column(String(500), unique=True, nullable=False)
    platform:    Mapped[Optional[str]]      = mapped_column(String(20))
    active:      Mapped[bool]               = mapped_column(Boolean, default=True)
    created_at:  Mapped[datetime]           = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    citizen:     Mapped[Optional["Citizen"]] = relationship(back_populates="push_tokens")
