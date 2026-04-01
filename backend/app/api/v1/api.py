from fastapi import APIRouter
from app.api.v1.endpoints import upload, process, ask

api_router = APIRouter()
api_router.include_router(upload.router, prefix="/upload", tags=["upload"])
api_router.include_router(process.router, prefix="/process", tags=["process"])
api_router.include_router(ask.router, prefix="/ask", tags=["ask"])
