from fastapi import APIRouter, Query
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/elections", tags=["elections"])

CURRENT_ELECTION = {
    "id": "e2026",
    "name": "Eleições Municipais 2026",
    "name_en": "Municipal Elections 2026",
    "date": "2026-08-07",
    "type": "Autárquica",
    "type_en": "Municipal",
    "province": "Luanda",
    "active": True,
    "registration_deadline": "2026-04-30",
    "description_pt": "Eleições para os orgãos autárquicos do município de Luanda.",
    "description_en": "Elections for the municipal organs of the municipality of Luanda.",
}

CANDIDATES = [
    {
        "id": "c1", "election_id": "e2026",
        "party": "MPLA", "party_full": "Movimento Popular de Libertação de Angola",
        "candidate_name": "João Eduardo Silva",
        "position": "Presidente do Conselho de Administração Municipal",
        "bio_pt": "Engenheiro com 20 anos de experiência em administração pública.",
        "bio_en": "Engineer with 20 years of experience in public administration.",
    },
    {
        "id": "c2", "election_id": "e2026",
        "party": "UNITA", "party_full": "União Nacional para a Independência Total de Angola",
        "candidate_name": "Maria Conceição Fernandes",
        "position": "Presidente do Conselho de Administração Municipal",
        "bio_pt": "Economista e activista cívica reconhecida na comunidade.",
        "bio_en": "Economist and recognised civic activist in the community.",
    },
    {
        "id": "c3", "election_id": "e2026",
        "party": "PRS",  "party_full": "Partido de Renovação Social",
        "candidate_name": "António Mbumba Lopes",
        "position": "Presidente do Conselho de Administração Municipal",
        "bio_pt": "Advogado com foco em direitos dos cidadãos.",
        "bio_en": "Lawyer focused on citizens' rights.",
    },
    {
        "id": "c4", "election_id": "e2026",
        "party": "FNLA", "party_full": "Frente Nacional de Libertação de Angola",
        "candidate_name": "Rosa Dongo Kalandula",
        "position": "Presidente do Conselho de Administração Municipal",
        "bio_pt": "Professora universitária e líder comunitária.",
        "bio_en": "University professor and community leader.",
    },
]

POLLING_STATIONS = [
    {"id": "ps1", "name": "Escola Primária Maianga",   "district": "Maianga",    "address": "Av. Lenine, Maianga",          "lat": -8.814700, "lng": 13.230200},
    {"id": "ps2", "name": "Centro Cívico Ingombota",   "district": "Ingombota",  "address": "Rua Direita, Ingombota",       "lat": -8.819200, "lng": 13.234400},
    {"id": "ps3", "name": "Liceu Mutu-Ya-Kevela",      "district": "Sambizanga", "address": "Rua Ngola Kiluanje",           "lat": -8.798000, "lng": 13.242000},
    {"id": "ps4", "name": "Escola Rangel",             "district": "Rangel",     "address": "Av. do Brasil, Rangel",        "lat": -8.830000, "lng": 13.260000},
    {"id": "ps5", "name": "Complexo Escolar Viana",    "district": "Viana",      "address": "Rua Principal, Viana",         "lat": -8.905000, "lng": 13.374000},
    {"id": "ps6", "name": "Escola Kilamba Kiaxi",      "district": "Kilamba Kiaxi","address": "Bairro Kilamba",             "lat": -8.850000, "lng": 13.270000},
]

HOW_TO_VOTE_PT = [
    "Apresente o seu BI ou Passaporte válido no local de voto",
    "Dirija-se à mesa de voto correspondente ao seu recenseamento",
    "Receba o boletim de voto do presidente de mesa",
    "Entre na cabine de voto e marque a sua escolha com X",
    "Dobre o boletim e coloque na urna",
    "Assine o caderno eleitoral para confirmar a sua participação",
]

HOW_TO_VOTE_EN = [
    "Present your valid BI or Passport at the polling station",
    "Go to the voting table corresponding to your registration",
    "Receive your ballot paper from the table president",
    "Enter the voting booth and mark your choice with X",
    "Fold the ballot and place it in the ballot box",
    "Sign the electoral register to confirm your participation",
]


@router.get("/current")
async def current_election():
    return CURRENT_ELECTION


@router.get("/candidates")
async def list_candidates(election_id: str | None = None):
    if election_id:
        return [c for c in CANDIDATES if c["election_id"] == election_id]
    return CANDIDATES


@router.get("/stations")
async def polling_stations(district: str | None = None):
    if district:
        return [s for s in POLLING_STATIONS if s["district"].lower() == district.lower()]
    return POLLING_STATIONS


@router.get("/how-to-vote")
async def how_to_vote(lang: str = "pt"):
    return {"steps": HOW_TO_VOTE_PT if lang == "pt" else HOW_TO_VOTE_EN}
