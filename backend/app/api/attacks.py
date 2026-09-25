"""
Attack Simulation API Module
Provides dedicated endpoints to simulate specific cyber attack vectors and channel perturbations.
Returns rich visual comparative data for frontend side-by-side rendering.
"""
from typing import Optional, Dict, Any
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.crypto.hashing import compute_sha3_256
from app.api.qds import (
    signed_transactions_store,
    sign_document,
    verify_signature,
    QDSSignRequest,
    QDSVerifyRequest
)
from app.detection.replay import consumed_transactions, check_replay_attack

router = APIRouter()

class AttackSimulationRequest(BaseModel):
    transaction_id: Optional[str] = Field(None, description="Existing transaction ID or auto-generate if empty")
    document_text: str = Field("Digital Signature Authorization: Transfer ₹10,000 from Alice to Bob.", description="Document text")
    signer_id: str = Field("Alice", description="Signer identity")
    verifier_id: str = Field("Bob", description="Verifier identity")
    channel_noise: float = Field(0.0, ge=0.0, le=0.5, description="Channel noise rate for noise attack")

@router.post("/{attack_type}")
async def simulate_attack(attack_type: str, request: AttackSimulationRequest):
    """
    Simulates a targeted attack vector (normal, forgery, impersonation, replay, unauthorized-verification, mitm, noise).
    Applies real mutations and returns immediate visual comparative diagnosis.
    """
    valid_attacks = [
        "normal",
        "forgery", "forgery_tampering",
        "impersonation",
        "replay",
        "unauthorized-verification", "unauthorized_verification", "unauthorized",
        "mitm",
        "noise"
    ]
    
    attack_clean = attack_type.lower().replace("-", "_")

    # Baseline demo payload texts
    original_text = request.document_text or "Digital Signature Authorization: Transfer ₹10,000 from Alice to Bob."
    original_hash = compute_sha3_256(original_text)

    # Ensure baseline signature transaction exists or sign fresh
    tx_id = request.transaction_id or "QDS-001"
    if tx_id not in signed_transactions_store:
        sign_res = await sign_document(QDSSignRequest(
            document_text=original_text,
            signer_id="Alice",
            verifier_id="Bob"
        ))
        tx_id = sign_res["transaction_id"]

    # Base parameters for verification
    verify_doc_text = original_text
    verify_signer = request.signer_id or "Alice"
    verify_verifier = request.verifier_id or "Bob"
    mitm_flag = False
    noise_rate = 0.0

    # Specific Attack Mutations & Visual Metadata Setup
    attacker_action = ""
    tampered_text = ""
    tampered_hash = ""

    if attack_clean == "normal":
        attacker_action = "Pristine transmission over quantum channel — no tampering or eavesdropping."
        
    elif attack_clean in ["forgery", "forgery_tampering"]:
        if "₹10,000" in original_text:
            tampered_text = original_text.replace("₹10,000", "₹2,00,000")
            attacker_action = "Attacker modified document payload content after signing (₹10,000 -> ₹2,00,000)."
        elif "10,000" in original_text:
            tampered_text = original_text.replace("10,000", "2,00,000")
            attacker_action = "Attacker modified document payload content after signing (10,000 -> 2,00,000)."
        else:
            tampered_text = original_text + "\n[TAMPERED BY ATTACKER: Payload altered post-signing]"
            attacker_action = "Attacker modified document payload content after signing (Appended unauthorized tampered payload block)."
        tampered_hash = compute_sha3_256(tampered_text)
        verify_doc_text = tampered_text

    elif attack_clean == "impersonation":
        verify_signer = "Mallory"
        attacker_action = "Attacker (Mallory) submitted signature request using unauthorized signer identity keys."

    elif attack_clean in ["unauthorized_verification", "unauthorized"]:
        verify_verifier = "Mallory"
        attacker_action = "Unauthorized node (Mallory) attempted to invoke signature verification protocol."

    elif attack_clean == "replay":
        # Force current transaction ID into consumed registry
        consumed_transactions.add(tx_id)
        attacker_action = f"Attacker captured previously accepted QDS signature payload (ID: {tx_id}) and resubmitted it."

    elif attack_clean == "mitm":
        mitm_flag = True
        attacker_action = "Eavesdropper (Eve) intercepted quantum channel, introducing phase and bit-flip state disturbances."

    elif attack_clean == "noise":
        noise_rate = max(0.05, request.channel_noise) if request.channel_noise > 0.0 else 0.25
        attacker_action = f"Environmental decoherence noise injected on quantum channel at level (p={noise_rate:.2f})."

    # Execute verification with attack mutations applied
    verify_req = QDSVerifyRequest(
        transaction_id=tx_id,
        document_text=verify_doc_text,
        signer_id=verify_signer,
        verifier_id=verify_verifier,
        mitm_attack=mitm_flag,
        channel_noise=noise_rate
    )

    verify_res = await verify_signature(verify_req)
    verdict = verify_res["verdict"]

    # Construct rich comparative response object for UI visualization
    original_state = {
        "document_text": original_text,
        "hash": original_hash,
        "signer": "Alice",
        "verifier": "Bob",
        "transaction_id": tx_id,
        "status": "VALID / UNCONSUMED"
    }

    observed_state = {
        "document_text": verify_doc_text,
        "hash": compute_sha3_256(verify_doc_text),
        "signer": verify_signer,
        "verifier": verify_verifier,
        "transaction_id": tx_id,
        "status": "USED" if attack_clean == "replay" else ("MUTATED" if attack_clean in ["forgery", "forgery_tampering"] else "RECEIVED")
    }

    # Attack-specific evidence & explanations matching prompt requirements
    if attack_clean == "normal":
        primary_evidence = "All cryptographic, quantum channel, and identity checks passed."
        secondary_evidence = "QBER and state fidelity meet baseline verification thresholds."
        explanation = "The document and quantum signature were transmitted and verified without any channel disturbance or security rule violations."
    elif attack_clean in ["forgery", "forgery_tampering"]:
        primary_evidence = "SHA3-256 hash mismatch between signed document state and received payload."
        secondary_evidence = "Signature integrity failure resulting from payload content alteration."
        explanation = "The document content changed after signing, producing a different SHA3-256 hash."
    elif attack_clean == "replay":
        primary_evidence = f"Transaction ID {tx_id} already present in in-memory consumed state registry."
        secondary_evidence = "Quantum state non-reuse protection triggered."
        explanation = "The signature is valid, but the same transaction/state has already been accepted and cannot be reused."
    elif attack_clean == "impersonation":
        primary_evidence = f"Signer identity mismatch ('{verify_signer}' is not in authorized signers list)."
        secondary_evidence = "Identity authorization check failed."
        explanation = "The submitted signature request claims to originate from an unauthorized signer."
    elif attack_clean in ["unauthorized_verification", "unauthorized"]:
        primary_evidence = f"Verifier authorization failure ('{verify_verifier}' is not in authorized verifiers list)."
        secondary_evidence = "Unauthorized verification attempt blocked."
        explanation = "The verification request was made by an unauthorized verifier."
    elif attack_clean == "mitm":
        primary_evidence = f"Quantum Bit Error Rate (QBER: {verify_res['metrics']['qber_percentage']}) exceeded 11.0% prototype threshold."
        secondary_evidence = f"Quantum state fidelity ({verify_res['metrics']['fidelity_percentage']}) degraded below 85.0% threshold."
        explanation = "Quantum-channel disturbance changed the observed measurement statistics and reduced verification confidence."
    else: # noise
        qber_val = verify_res['metrics']['qber']
        primary_evidence = f"Measurement deviation observed across Pauli X, Y, Z bases (QBER: {verify_res['metrics']['qber_percentage']})."
        secondary_evidence = f"State fidelity: {verify_res['metrics']['fidelity_percentage']}."
        explanation = "Noise within acceptable quantum channel limits." if verdict == "ACCEPT" else "Excessive channel noise caused state fidelity degradation."

    return {
        "attack_type": attack_clean,
        "simulated_attack_type": attack_clean,
        "verdict": verdict,
        "verdict_message": verify_res["verdict_message"],
        "risk_score": verify_res["risk_score"],
        "attacker_action": attacker_action,
        "original_state": original_state,
        "observed_state": observed_state,
        "detection_evidence": {
            "hash_match": original_hash.lower() == compute_sha3_256(verify_doc_text).lower(),
            "signer_authorized": verify_signer in ["Alice", "velcodex-primary"],
            "verifier_authorized": verify_verifier in ["Bob", "velcodex-validator"],
            "replay_detected": attack_clean == "replay",
            "mitm_detected": mitm_flag or verify_res["metrics"]["qber"] > 0.11,
            "qber": verify_res["metrics"]["qber"],
            "fidelity": verify_res["metrics"]["fidelity"]
        },
        "primary_evidence": primary_evidence,
        "secondary_evidence": secondary_evidence,
        "explanation": explanation,
        "checklist": verify_res["checklist"],
        "threats": verify_res["threats"],
        "metrics": verify_res["metrics"],
        "measurements": verify_res["measurements"],
        "circuit": verify_res["circuit"]
    }

@router.post("/unauthorized-verification")
async def simulate_unauthorized_verification(request: AttackSimulationRequest):
    """
    Direct endpoint for unauthorized verification attack.
    """
    return await simulate_attack("unauthorized_verification", request)
