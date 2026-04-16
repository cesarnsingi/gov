import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from typing import Optional

from database import get_db

router = APIRouter(prefix="/services", tags=["services"])

SERVICES_LIST = [
    {"id": "pay_fee",      "name_pt": "Pagar Taxa",          "name_en": "Pay Fee",         "icon": "card",       "emoji": "💳"},
    {"id": "doc_request",  "name_pt": "Pedir Documento",      "name_en": "Request Document","icon": "document",   "emoji": "📄"},
    {"id": "id_wallet",    "name_pt": "BI Digital",          "name_en": "Digital ID",      "icon": "id-card",    "emoji": "🪪"},
    {"id": "elections",    "name_pt": "Eleições",            "name_en": "Elections",       "icon": "people",     "emoji": "🗳️"},
    {"id": "directory",    "name_pt": "Directório",          "name_en": "Directory",       "icon": "business",   "emoji": "🏛️"},
    {"id": "contact",      "name_pt": "Contacte-nos",        "name_en": "Contact Us",      "icon": "call",       "emoji": "📞"},
]

FEE_TYPES = [
    {"id": "commercial_license", "name_pt": "Licença Comercial",      "name_en": "Commercial Licence",  "amount": 15000},
    {"id": "land_registry",      "name_pt": "Registo Predial",        "name_en": "Land Registry",       "amount": 8500},
    {"id": "residence_cert",     "name_pt": "Certidão de Residência", "name_en": "Residence Certificate","amount": 2000},
    {"id": "birth_cert",         "name_pt": "Certidão de Nascimento", "name_en": "Birth Certificate",   "amount": 1500},
    {"id": "criminal_record",    "name_pt": "Registo Criminal",       "name_en": "Criminal Record",     "amount": 3000},
]

DOC_TYPES = [
    {"id": "residence_cert", "name_pt": "Certidão de Residência", "name_en": "Residence Certificate"},
    {"id": "birth_cert",     "name_pt": "Certidão de Nascimento", "name_en": "Birth Certificate"},
    {"id": "marriage_cert",  "name_pt": "Certidão de Casamento",  "name_en": "Marriage Certificate"},
    {"id": "criminal_record","name_pt": "Registo Criminal",       "name_en": "Criminal Record"},
]


@router.get("/")
async def list_services():
    return SERVICES_LIST


@router.get("/fees")
async def list_fee_types():
    return FEE_TYPES


@router.get("/doc-types")
async def list_doc_types():
    return DOC_TYPES


class PayFeeIn(BaseModel):
    fee_type: str
    amount_aoa: int
    reference: Optional[str] = None
    citizen_id: Optional[str] = None


@router.post("/payment", status_code=201)
async def pay_fee(body: PayFeeIn, db: AsyncSession = Depends(get_db)):
    """Submit a government fee payment."""
    import secrets
    ref = body.reference or f"LGF-{datetime.utcnow().year}-{secrets.token_hex(4).upper()}"
    return {
        "id": str(uuid.uuid4()),
        "fee_type": body.fee_type,
        "amount_aoa": body.amount_aoa,
        "reference": ref,
        "status": "pending",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }


@router.get("/payment/{payment_id}")
async def get_payment_status(payment_id: str):
    return {
        "id": payment_id,
        "status": "success",
        "message": "Pagamento processado com sucesso",
    }


class DocRequestIn(BaseModel):
    doc_type: str
    citizen_id: Optional[str] = None
    notes: Optional[str] = None


@router.post("/document", status_code=201)
async def request_document(body: DocRequestIn):
    import secrets
    ref = f"LGD-{datetime.utcnow().year}-{secrets.token_hex(4).upper()}"
    return {
        "id": str(uuid.uuid4()),
        "doc_type": body.doc_type,
        "reference": ref,
        "status": "submitted",
        "estimated_days": 5,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }


@router.get("/document/{request_id}")
async def get_document_status(request_id: str):
    return {
        "id": request_id,
        "status": "processing",
        "message": "Documento em processamento — pronto em 3-5 dias úteis",
    }


@router.get("/directory")
async def government_directory():
    return [
        {"name": "Câmara Municipal de Luanda",  "phone": "+244 222 331 000", "address": "Largo Luther King, Luanda"},
        {"name": "ENDE (Electricidade)",        "phone": "+244 222 392 111", "address": "Av. 4 de Fevereiro"},
        {"name": "EPAL (Água e Energia)",       "phone": "+244 222 330 212", "address": "Rua Rainha Ginga"},
        {"name": "Polícia Nacional de Angola",  "phone": "+244 923 001 111", "address": "Av. Comandante Valódia"},
        {"name": "Hospital Geral de Luanda",    "phone": "+244 222 323 456", "address": "Rua António Barroso, Ingombota"},
    ]
