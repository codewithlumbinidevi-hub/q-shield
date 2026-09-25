"""
Identity Impersonation Detection Module
Checks signer and verifier identities against authorized registry.
"""
from typing import Dict, Any, List
from app.config import settings

def check_identity_impersonation(
    signer_id: str,
    verifier_id: str,
    authorized_signers: List[str] = None,
    authorized_verifiers: List[str] = None
) -> Dict[str, Any]:
    """
    Validates signer and verifier identities against deterministic authorization set.
    """
    if authorized_signers is None:
        authorized_signers = settings.AUTHORIZED_SIGNERS
    if authorized_verifiers is None:
        authorized_verifiers = settings.AUTHORIZED_VERIFIERS

    signer_authorized = signer_id in authorized_signers
    verifier_authorized = verifier_id in authorized_verifiers

    is_valid = signer_authorized and verifier_authorized
    
    threat_flags = []
    if not signer_authorized:
        threat_flags.append(f"UNAUTHORIZED_SIGNER:{signer_id}")
    if not verifier_authorized:
        threat_flags.append(f"UNAUTHORIZED_VERIFIER:{verifier_id}")

    return {
        "valid": is_valid,
        "signer_id": signer_id,
        "verifier_id": verifier_id,
        "signer_authorized": signer_authorized,
        "verifier_authorized": verifier_authorized,
        "threat_flag": "IMPERSONATION_DETECTED" if not is_valid else None,
        "threat_details": threat_flags,
        "description": "Signer and verifier identities authorized" if is_valid else f"HIGH: Identity impersonation detected! ({', '.join(threat_flags)})"
    }
