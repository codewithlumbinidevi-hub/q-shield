"""
Q-SHIELD FastAPI Application Gateway
Team VELCODEX - Quantum-Inspired Cyber Threat Detection for Digital Signature Security
"""
from datetime import datetime
from typing import List, Dict, Any
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import qiskit

from app.config import settings
from app.api import api_router

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    description="Quantum-Inspired Cyber Threat Detection for Digital Signature Security Prototype"
)

# In-memory security audit log store
security_event_logs: List[Dict[str, Any]] = [
    {
        "timestamp": datetime.utcnow().strftime("%H:%M:%S"),
        "level": "INFO",
        "message": "Quantum Simulation Engine initialized (Qiskit Aer Simulator local instance)."
    }
]

# Enable CORS for React frontend integration (allowing http://localhost:3000, http://127.0.0.1:3000, etc.)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")

@app.get("/api/health", tags=["Health"])
async def health_check():
    """
    Health check endpoint returning system status and Qiskit engine metadata.
    """
    return {
        "status": "ok",
        "app_name": settings.APP_NAME,
        "version": settings.VERSION,
        "qiskit_version": getattr(qiskit, "__version__", "2.x"),
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "engine": "Qiskit Aer Simulator (Local Prototype)"
    }

@app.get("/api/logs", tags=["Logs"])
async def get_security_logs():
    """
    Returns security event logs recorded by backend engine.
    """
    return {
        "count": len(security_event_logs),
        "logs": security_event_logs
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8001, reload=True)
