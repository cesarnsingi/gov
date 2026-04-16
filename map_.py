from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc

from database import get_db
from models import Report

router = APIRouter(prefix="/map", tags=["map"])

GOVERNMENT_OFFICES = [
    {"name": "Câmara Municipal de Luanda",  "lat": -8.838333, "lng": 13.234444, "type": "city_hall",    "address": "Largo Luther King"},
    {"name": "Governo Provincial de Luanda","lat": -8.820000, "lng": 13.234000, "type": "provincial",   "address": "Av. Comandante Valódia"},
    {"name": "ENDE Maianga",               "lat": -8.815000, "lng": 13.231000, "type": "utility",      "address": "Av. Lenine, Maianga"},
    {"name": "Esquadra Maianga",           "lat": -8.816000, "lng": 13.229000, "type": "police",       "address": "Av. 4 de Fevereiro"},
    {"name": "EPAL Central",               "lat": -8.823000, "lng": 13.238000, "type": "utility",      "address": "Rua Rainha Ginga"},
    {"name": "Hospital Geral de Luanda",   "lat": -8.817000, "lng": 13.226000, "type": "hospital",     "address": "Rua António Barroso"},
]

POLLING_STATIONS = [
    {"name": "Escola Primária Maianga",        "district": "Maianga",    "lat": -8.814700, "lng": 13.230200, "address": "Av. Lenine"},
    {"name": "Centro Cívico Ingombota",        "district": "Ingombota",  "lat": -8.819200, "lng": 13.234400, "address": "Rua Direita"},
    {"name": "Liceu Mutu-Ya-Kevela",           "district": "Sambizanga", "lat": -8.798000, "lng": 13.242000, "address": "Rua Ngola Kiluanje"},
    {"name": "Escola Primária Rangel",         "district": "Rangel",     "lat": -8.830000, "lng": 13.260000, "address": "Av. do Brasil"},
    {"name": "Complexo Escolar Viana",         "district": "Viana",      "lat": -8.905000, "lng": 13.374000, "address": "Rua Principal Viana"},
]


@router.get("/reports")
async def map_reports(
    category: str | None = None,
    db: AsyncSession = Depends(get_db),
):
    """GeoJSON FeatureCollection of all reports with coordinates."""
    q = select(Report).where(Report.lat.isnot(None))
    if category:
        q = q.where(Report.category == category)
    result = await db.execute(q.order_by(desc(Report.created_at)).limit(500))
    reports = result.scalars().all()

    features = []
    for r in reports:
        features.append({
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [float(r.lng), float(r.lat)],
            },
            "properties": {
                "id":        str(r.id),
                "title":     r.title,
                "category":  r.category,
                "status":    r.status.value,
                "district":  r.district,
                "reference": r.reference,
                "address":   r.address,
                "created_at": r.created_at.isoformat(),
            },
        })
    return {"type": "FeatureCollection", "features": features}


@router.get("/offices")
async def government_offices(
    lat: float | None = None,
    lng: float | None = None,
    type_filter: str | None = None,
):
    """List government offices, optionally filtered by type."""
    offices = GOVERNMENT_OFFICES
    if type_filter:
        offices = [o for o in offices if o["type"] == type_filter]
    return offices


@router.get("/polling-stations")
async def polling_stations(district: str | None = None):
    """List polling stations for elections."""
    stations = POLLING_STATIONS
    if district:
        stations = [s for s in stations if s["district"].lower() == district.lower()]
    return stations


@router.get("/stats")
async def map_stats(db: AsyncSession = Depends(get_db)):
    """Summary stats for the dashboard."""
    from sqlalchemy import func
    from models import ReportStatus

    total_result = await db.execute(select(func.count(Report.id)))
    open_result  = await db.execute(
        select(func.count(Report.id)).where(
            Report.status.in_([ReportStatus.submitted, ReportStatus.under_review, ReportStatus.in_progress])
        )
    )
    resolved_result = await db.execute(
        select(func.count(Report.id)).where(Report.status == ReportStatus.resolved)
    )

    return {
        "total_reports":    total_result.scalar_one() or 0,
        "open_reports":     open_result.scalar_one() or 0,
        "resolved_reports": resolved_result.scalar_one() or 0,
    }
