"""
Document Forgery Detection Module
Validates document text integrity against signed SHA3-256 hash.
"""
from typing import Dict, Any
from app.crypto.hashing import compute_sha3_256

def check_document_forgery(document_text: str, signature_hash: str) -> Dict[str, Any]:
    """
    Recomputes SHA3-256 hash from incoming document text and compares with expected signature hash.
    Deterministic check: Any mismatch indicates message tampering / forgery.
    """
    recomputed_hash = compute_sha3_256(document_text)
    is_valid = (recomputed_hash.lower() == signature_hash.lower())
    
    return {
        "valid": is_valid,
        "recomputed_hash": recomputed_hash,
        "expected_hash": signature_hash,
        "threat_flag": None if is_valid else "FORGERY_ATTACK_DETECTED",
        "description": "Hash matches signed document state" if is_valid else "CRITICAL: Document text has been mutated after QDS signing!"
    }
