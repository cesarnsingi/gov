import uuid
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from passlib.context import CryptContext
from jose import jwt, JWTError

from database import get_db, settings
from models import Citizen
from schemas import RegisterIn, LoginIn, TokenOut, CitizenOut

router = APIRouter(prefix="/auth", tags=["auth"])
pwd_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")
ALGORITHM = "HS256"


def make_token(citizen_id: str, minutes: int) -> str:
    exp = datetime.now(timezone.utc) + timedelta(minutes=minutes)
    return jwt.encode({"sub": citizen_id, "exp": exp}, settings.secret_key, algorithm=ALGORITHM)


@router.post("/register", response_model=TokenOut, status_code=201)
async def register(body: RegisterIn, db: AsyncSession = Depends(get_db)):
    existing = await db.execute(select(Citizen).where(Citizen.phone == body.phone))
    if existing.scalar_one_or_none():
        raise HTTPException(400, "Phone already registered")

    citizen = Citizen(
        full_name=body.full_name,
        phone=body.phone,
        password_hash=pwd_ctx.hash(body.password),
        bi_number=body.bi_number,
        ward=body.ward,
    )
    db.add(citizen)
    await db.flush()
    await db.refresh(citizen)

    return TokenOut(
        access_token=make_token(str(citizen.id), settings.access_token_expire_minutes),
        refresh_token=make_token(str(citizen.id), settings.refresh_token_expire_days * 24 * 60),
    )


@router.post("/login", response_model=TokenOut)
async def login(body: LoginIn, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Citizen).where(Citizen.phone == body.phone))
    citizen = result.scalar_one_or_none()
    if not citizen or not pwd_ctx.verify(body.password, citizen.password_hash):
        raise HTTPException(401, "Invalid phone or password")
    if not citizen.is_active:
        raise HTTPException(403, "Account inactive")

    return TokenOut(
        access_token=make_token(str(citizen.id), settings.access_token_expire_minutes),
        refresh_token=make_token(str(citizen.id), settings.refresh_token_expire_days * 24 * 60),
    )


@router.get("/me", response_model=CitizenOut)
async def me(token: str, db: AsyncSession = Depends(get_db)):
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[ALGORITHM])
        citizen_id = payload.get("sub")
    except JWTError:
        raise HTTPException(401, "Invalid token")
    result = await db.execute(select(Citizen).where(Citizen.id == uuid.UUID(citizen_id)))
    citizen = result.scalar_one_or_none()
    if not citizen:
        raise HTTPException(404, "Citizen not found")
    return citizen
