"""
Quantum Digital Signature (QDS) API Module
Handles document signing via quantum teleportation and deterministic signature verification.
"""
import uuid
from datetime import datetime
from typing import Dict, Any, Optional, List
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.crypto.hashing import compute_sha3_256, derive_quantum_angles
from app.quantum.teleportation import run_teleportation
from app.quantum.measurements import perform_pauli_measurements
from app.quantum.circuit import get_circuit_ascii, get_circuit_dict
from app.detection import (
    check_document_forgery,
    check_identity_impersonation,
    check_replay_attack,
    calculate_qber,
    calculate_fidelity,
    calculate_statistical_deviation,
    evaluate_security_verdict
)

router = APIRouter()

# In-memory store for active signed quantum transactions
signed_transactions_store: Dict[str, Dict[str, Any]] = {}

class QDSSignRequest(BaseModel):
    document_text: str = Field(..., description="Content of document to sign")
    signer_id: str = Field("Alice", description="Identity of signer")
    verifier_id: str = Field("Bob", description="Identity of designated verifier")

class QDSVerifyRequest(BaseModel):
    transaction_id: str = Field(..., description="Unique transaction ID to verify")
    document_text: str = Field(..., description="Document text presented for verification")
    signer_id: str = Field("Alice", description="Signer ID presented")
    verifier_id: str = Field("Bob", description="Verifier ID presented")
    mitm_attack: bool = Field(False, description="Simulate channel MITM eavesdropping")
    channel_noise: float = Field(0.0, ge=0.0, le=0.5, description="Channel noise rate (0.0 - 0.5)")

@router.post("/sign")
async def sign_document(request: QDSSignRequest):
    """
    Generates a Quantum Digital Signature (QDS) for the document payload.
    - Hashes document using SHA3-256
    - Derives Bloch sphere state |psi> (theta, phi)
    - Executes Bell Teleportation protocol on Qiskit Aer
    - Stores transaction state for verification
    """
    if not request.document_text:
        raise HTTPException(status_code=400, detail="Document text payload cannot be empty.")

    hash_hex = compute_sha3_256(request.document_text)
    theta, phi = derive_quantum_angles(hash_hex)
    
    # Run Qiskit teleportation simulation
    try:
        teleport_res = run_teleportation(theta=theta, phi=phi, mitm_attack=False, channel_noise=0.0)
        ascii_circuit = get_circuit_ascii(theta=theta, phi=phi)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Quantum simulation engine error: {str(e)}")

    tx_id = f"QDS-TX-{uuid.uuid4().hex[:8].upper()}"
    sig_id = f"SIG-QDS-2026-{uuid.uuid4().hex[:4].upper()}"
    timestamp = datetime.utcnow().isoformat() + "Z"

    b1 = teleport_res["classical_bits"]["b1"]
    b2 = teleport_res["classical_bits"]["b2"]

    response_payload = {
        "success": True,
        "signature_id": sig_id,
        "transaction_id": tx_id,
        "document_hash": hash_hex,
        "signature_hash": hash_hex,
        "signer": request.signer_id,
        "signer_id": request.signer_id,
        "verifier": request.verifier_id,
        "verifier_id": request.verifier_id,
        "quantum_state": {
            "theta": theta,
            "phi": phi
        },
        "theta": theta,
        "phi": phi,
        "bell_measurement": {
            "m1": b1,
            "m2": b2,
            "bsm_bitstring": f"{b1}{b2}"
        },
        "bsm_bitstring": f"{b1}{b2}",
        "pauli_correction": teleport_res["pauli_correction"],
        "teleportation_status": "COMPLETED",
        "qds_status": "GENERATED",
        "circuit_ascii": ascii_circuit,
        "created_at": timestamp,
        "pipeline": {
            "hash": hash_hex,
            "state_preparation": "completed",
            "bell_pair": "generated",
            "bell_measurement": f"{b1}{b2}",
            "classical_bits": f"{b1}{b2}",
            "pauli_correction": teleport_res["pauli_correction"],
            "state_reconstruction": "completed"
        }
    }
    
    # Store for subsequent verification
    signed_transactions_store[tx_id] = {
        "transaction_id": tx_id,
        "document_text": request.document_text,
        "signature_hash": hash_hex,
        "signer_id": request.signer_id,
        "verifier_id": request.verifier_id,
        "theta": theta,
        "phi": phi,
        "bsm_bitstring": f"{b1}{b2}",
        "pauli_correction": teleport_res["pauli_correction"],
        "created_at": timestamp
    }

    return response_payload

@router.post("/teleport")
async def teleport_state(request: QDSSignRequest):
    """
    Alias endpoint for quantum teleportation simulation.
    """
    return await sign_document(request)

@router.post("/verify")
async def verify_signature(request: QDSVerifyRequest):
    """
    Verifies Quantum Digital Signature and evaluates security threats using deterministic logic.
    """
    # 1. Retrieve or reconstruct signature reference
    stored_tx = signed_transactions_store.get(request.transaction_id)
    if stored_tx:
        ref_hash = stored_tx["signature_hash"]
        theta = stored_tx["theta"]
        phi = stored_tx["phi"]
    else:
        # If transaction not found in active memory store, derive from document text
        ref_hash = compute_sha3_256(request.document_text)
        theta, phi = derive_quantum_angles(ref_hash)

    # 2. Perform Projective Measurements on Bob's end
    try:
        measure_res = perform_pauli_measurements(
            theta=theta,
            phi=phi,
            mitm_attack=request.mitm_attack,
            channel_noise=request.channel_noise
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Quantum measurement simulation error: {str(e)}")

    # 3. Deterministic Threat Detection Checks
    forgery_res = check_document_forgery(request.document_text, ref_hash)
    impersonation_res = check_identity_impersonation(request.signer_id, request.verifier_id)
    replay_res = check_replay_attack(request.transaction_id, consume=True)
    
    qber_res = calculate_qber(measure_res["theoretical"], measure_res["observed"])
    fidelity_res = calculate_fidelity(measure_res["theoretical"], measure_res["observed"])
    deviation_res = calculate_statistical_deviation(measure_res["theoretical"], measure_res["observed"])

    # 4. Centralized Verdict Evaluation
    decision = evaluate_security_verdict(
        forgery_res=forgery_res,
        impersonation_res=impersonation_res,
        replay_res=replay_res,
        qber_res=qber_res,
        fidelity_res=fidelity_res,
        deviation_res=deviation_res
    )

    circuit_info = get_circuit_dict(theta, phi, request.mitm_attack, request.channel_noise)

    return {
        "transaction_id": request.transaction_id,
        "signature_id": f"SIG-QDS-{request.transaction_id[-6:]}",
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "verdict": decision["verdict"],
        "verdict_message": decision["verdict_message"],
        "risk_score": decision["risk_score"],
        "checklist": decision["checklist"],
        "threats": decision["threats"],
        "metrics": decision["metrics"],
        "checks_detail": {
            "forgery": forgery_res,
            "impersonation": impersonation_res,
            "replay": replay_res,
            "qber": qber_res,
            "fidelity": fidelity_res,
            "deviation": deviation_res
        },
        "measurements": measure_res,
        "circuit": circuit_info
    }
