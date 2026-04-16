import uuid
from datetime import datetime, timezone

import httpx
from fastapi import APIRouter, Depends, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update

from database import get_db
from models import PushToken
from schemas import PushTokenRegister

router = APIRouter(prefix="/notifications", tags=["notifications"])

EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send"

STATUS_MESSAGES_PT = {
    "under_review": ("🔍 Reporte em Análise",      "A sua queixa está a ser analisada pela equipa técnica."),
    "in_progress":  ("🔧 Trabalhos em Curso",       "A equipa de obras está a trabalhar no problema que reportou."),
    "resolved":     ("✅ Problema Resolvido",       "O problema que reportou foi resolvido. Obrigado pela sua participação!"),
    "rejected":     ("❌ Reporte Rejeitado",        "O seu reporte não pôde ser processado. Entre em contacto para mais informações."),
}


async def _push(tokens: list[str], title: str, body: str, data: dict = {}):
    if not tokens:
        return
    messages = [{"to": t, "title": title, "body": body, "data": data, "sound": "default"} for t in tokens]
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            await client.post(EXPO_PUSH_URL, json=messages)
    except Exception as e:
        print(f"Push error: {e}")


@router.post("/register")
async def register_token(body: PushTokenRegister, db: AsyncSession = Depends(get_db)):
    from sqlalchemy.dialects.postgresql import insert as pg_insert
    stmt = pg_insert(PushToken).values(
        token=body.token,
        platform=body.platform,
        citizen_id=uuid.UUID(body.citizen_id) if body.citizen_id else None,
    ).on_conflict_do_update(
        index_elements=["token"],
        set_={"active": True, "citizen_id": uuid.UUID(body.citizen_id) if body.citizen_id else None},
    )
    await db.execute(stmt)
    return {"status": "ok"}


@router.post("/send/report-update")
async def notify_report_update(
    citizen_id: str,
    report_id: str,
    status: str,
    reference: str,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
):
    tokens_result = await db.execute(
        select(PushToken.token).where(
            PushToken.citizen_id == uuid.UUID(citizen_id),
            PushToken.active == True,
        )
    )
    tokens = [r[0] for r in tokens_result.fetchall()]

    if status in STATUS_MESSAGES_PT:
        title, body = STATUS_MESSAGES_PT[status]
        body = f"{reference}: {body}"
        background_tasks.add_task(_push, tokens, title, body, {"report_id": report_id, "status": status})

    return {"dispatched": len(tokens)}


@router.delete("/token/{token}")
async def deactivate_token(token: str, db: AsyncSession = Depends(get_db)):
    await db.execute(update(PushToken).where(PushToken.token == token).values(active=False))
    return {"status": "deactivated"}
