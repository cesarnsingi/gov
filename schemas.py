import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field
from models import ReportStatus


class RegisterIn(BaseModel):
    full_name: str
    phone: str
    password: str = Field(min_length=6)
    bi_number: Optional[str] = None
    ward: Optional[str] = None


class LoginIn(BaseModel):
    phone: str
    password: str


class TokenOut(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class CitizenOut(BaseModel):
    id: uuid.UUID
    full_name: str
    phone: str
    bi_number: Optional[str]
    ward: Optional[str]
    created_at: datetime
    model_config = {"from_attributes": True}


class ReportCreate(BaseModel):
    category: str
    title: str
    description: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None
    address: Optional[str] = None
    district: Optional[str] = None


class ReportUpdateIn(BaseModel):
    status: ReportStatus
    note: Optional[str] = None


class ReportPhotoOut(BaseModel):
    id: uuid.UUID
    url: str
    created_at: datetime
    model_config = {"from_attributes": True}


class ReportUpdateOut(BaseModel):
    id: uuid.UUID
    status: ReportStatus
    note: Optional[str]
    updated_by: Optional[str]
    created_at: datetime
    model_config = {"from_attributes": True}


class ReportOut(BaseModel):
    id: uuid.UUID
    category: str
    title: str
    description: Optional[str]
    status: ReportStatus
    lat: Optional[float]
    lng: Optional[float]
    address: Optional[str]
    district: Optional[str]
    reference: str
    created_at: datetime
    photos: list[ReportPhotoOut] = []
    updates: list[ReportUpdateOut] = []
    model_config = {"from_attributes": True}


class PushTokenRegister(BaseModel):
    token: str
    platform: Optional[str] = None
    citizen_id: Optional[str] = None
