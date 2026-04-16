from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from database import engine, Base
from routers import auth, reports, services, map_, elections, notifications


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield


app = FastAPI(
    title="LuandaGov API",
    description="Civic App for Luanda, Angola — Inspired by Smart City Apps",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

app.include_router(auth.router)
app.include_router(reports.router)
app.include_router(services.router)
app.include_router(map_.router)
app.include_router(elections.router)
app.include_router(notifications.router)


@app.get("/health")
async def health():
    return {"status": "ok", "service": "LuandaGov API", "version": "1.0.0"}
