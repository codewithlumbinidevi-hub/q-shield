"""
API package init
"""
from fastapi import APIRouter
from .document import router as document_router
from .qds import router as qds_router
from .threats import router as threats_router
from .attacks import router as attacks_router

api_router = APIRouter()
api_router.include_router(document_router, prefix="/document", tags=["Document"])
api_router.include_router(qds_router, prefix="/qds", tags=["Quantum Digital Signature"])
api_router.include_router(threats_router, prefix="/threats", tags=["Threat Engine"])
api_router.include_router(threats_router, prefix="/threat", tags=["Threat Engine Alias"])
api_router.include_router(attacks_router, prefix="/attack", tags=["Attack Simulation"])
