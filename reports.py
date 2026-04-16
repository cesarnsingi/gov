import uuid
import secrets
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc

from database import get_db
from models import Report, ReportUpdate, ReportPhoto, ReportStatus, Citizen
from schemas import ReportCreate, ReportUpdateIn, ReportOut, ReportUpdateOut
from jose import jwt, JWTError
from database import settings

router = APIRouter(prefix="/reports", tags=["reports"])

ALGORITHM = "HS256"


def _gen_ref():
    return f"LG-{datetime.utcnow().year}-{secrets.token_hex(3).upper()}"


async def _get_citizen_id(token: str) -> str:
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[ALGORITHM])
        return payload.get("sub")
    except JWTError:
        raise HTTPException(401, "Invalid token")


@router.get("/", response_model=list[ReportOut])
async def list_reports(
    category: str | None = None,
    status: ReportStatus | None = None,
    district: str | None = None,
    limit: int = 50,
    db: AsyncSession = Depends(get_db),
):
    q = select(Report)
    if category:
        q = q.where(Report.category == category)
    if status:
        q = q.where(Report.status == status)
    if district:
        q = q.where(Report.district == district)
    result = await db.execute(q.order_by(desc(Report.created_at)).limit(limit))
    return result.scalars().all()


@router.get("/mine", response_model=list[ReportOut])
async def my_reports(token: str, db: AsyncSession = Depends(get_db)):
    citizen_id = await _get_citizen_id(token)
    result = await db.execute(
        select(Report)
        .where(Report.citizen_id == uuid.UUID(citizen_id))
        .order_by(desc(Report.created_at))
    )
    return result.scalars().all()


@router.get("/{report_id}", response_model=ReportOut)
async def get_report(report_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Report).where(Report.id == uuid.UUID(report_id)))
    report = result.scalar_one_or_none()
    if not report:
        raise HTTPException(404, "Report not found")
    return report


@router.post("/", response_model=ReportOut, status_code=201)
async def create_report(
    body: ReportCreate,
    token: str,
    db: AsyncSession = Depends(get_db),
):
    citizen_id = await _get_citizen_id(token)
    report = Report(
        citizen_id=uuid.UUID(citizen_id),
        reference=_gen_ref(),
        **body.model_dump(),
    )
    db.add(report)

    # Auto-create initial update
    update = ReportUpdate(
        report=report,
        status=ReportStatus.submitted,
        note="Reporte recebido pelo sistema",
        updated_by="Sistema",
    )
    db.add(update)
    await db.flush()
    await db.refresh(report)
    return report


@router.patch("/{report_id}/status", response_model=ReportUpdateOut)
async def update_status(
    report_id: str,
    body: ReportUpdateIn,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Report).where(Report.id == uuid.UUID(report_id)))
    report = result.scalar_one_or_none()
    if not report:
        raise HTTPException(404, "Report not found")

    report.status = body.status
    report.updated_at = datetime.now(timezone.utc)

    update = ReportUpdate(
        report_id=report.id,
        status=body.status,
        note=body.note,
        updated_by="Admin",
    )
    db.add(update)
    await db.flush()
    await db.refresh(update)
    return update


@router.get("/map/geojson")
async def reports_geojson(db: AsyncSession = Depends(get_db)):
    """GeoJSON endpoint for map display"""
    result = await db.execute(
        select(Report)
        .where(Report.lat.isnot(None))
        .order_by(desc(Report.created_at))
        .limit(200)
    )
    reports = result.scalars().all()

    features = []
    for r in reports:
        features.append({
            "type": "Feature",
            "geometry": {"type": "Point", "coordinates": [float(r.lng), float(r.lat)]},
            "properties": {
                "id": str(r.id),
                "title": r.title,
                "category": r.category,
                "status": r.status.value,
                "district": r.district,
                "reference": r.reference,
            },
        })
    return {"type": "FeatureCollection", "features": features}
