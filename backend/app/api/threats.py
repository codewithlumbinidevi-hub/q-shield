"""
Threat Engine Configuration & Status API Module
Exposes current security thresholds, identity white-lists, and engine rules.
"""
from typing import Optional, Dict, Any
from fastapi import APIRouter
from pydantic import BaseModel, Field
from app.config import settings
from app.detection import (
    check_document_forgery,
    check_identity_impersonation,
    check_replay_attack,
    calculate_qber,
    calculate_fidelity,
    calculate_statistical_deviation,
    evaluate_security_verdict
)
from app.detection.replay import consumed_transactions

router = APIRouter()

class ThreatAnalysisRequest(BaseModel):
    document_text: str = Field("Digital Signature Authorization: Transfer ₹10,000 to Account A.")
    signature_hash: Optional[str] = None
    signer_id: str = Field("Alice")
    verifier_id: str = Field("Bob")
    qber: float = Field(0.02)
    fidelity: float = Field(0.98)
    transaction_id: Optional[str] = None

@router.get("/config")
async def get_threat_engine_config():
    """
    Returns current deterministic security thresholds and authorized identities.
    """
    return {
        "app_name": settings.APP_NAME,
        "version": settings.VERSION,
        "qber_threshold": settings.QBER_THRESHOLD,
        "qber_threshold_percent": f"{settings.QBER_THRESHOLD * 100:.1f}%",
        "fidelity_threshold": settings.FIDELITY_THRESHOLD,
        "fidelity_threshold_percent": f"{settings.FIDELITY_THRESHOLD * 100:.1f}%",
        "max_statistical_deviation": settings.MAX_STATISTICAL_DEVIATION,
        "authorized_signers": settings.AUTHORIZED_SIGNERS,
        "authorized_verifiers": settings.AUTHORIZED_VERIFIERS,
        "consumed_replay_transactions_count": len(consumed_transactions)
    }

@router.post("/analyze")
async def analyze_threat(request: ThreatAnalysisRequest):
    """
    Analyzes threat status deterministically based on input parameters.
    """
    ref_hash = request.signature_hash or settings.APP_NAME
    forgery_res = check_document_forgery(request.document_text, ref_hash)
    impersonation_res = check_identity_impersonation(request.signer_id, request.verifier_id)
    replay_res = check_replay_attack(request.transaction_id or "QDS-SIM", consume=False)
    
    qber_res = {"exceeds_threshold": request.qber > settings.QBER_THRESHOLD, "qber": request.qber, "qber_percentage": f"{request.qber * 100:.2f}%", "threshold_percentage": f"{settings.QBER_THRESHOLD * 100:.2f}%"}
    fidelity_res = {"below_threshold": request.fidelity < settings.FIDELITY_THRESHOLD, "fidelity": request.fidelity, "fidelity_percentage": f"{request.fidelity * 100:.2f}%", "threshold_percentage": f"{settings.FIDELITY_THRESHOLD * 100:.2f}%"}
    deviation_res = {"exceeds": False, "deviation": 0.02}

    verdict = evaluate_security_verdict(forgery_res, impersonation_res, replay_res, qber_res, fidelity_res, deviation_res)
    return verdict
