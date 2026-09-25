"""
SHA3-256 Cryptographic Hashing Module
Computes SHA3-256 hashes and derives quantum state parameters theta & phi from document hash.
"""
import hashlib
import math
from typing import Tuple, Union

def compute_sha3_256(data: Union[str, bytes]) -> str:
    """
    Computes SHA3-256 hash of provided string or bytes.
    """
    if isinstance(data, str):
        data_bytes = data.encode('utf-8')
    else:
        data_bytes = data
    return hashlib.sha3_256(data_bytes).hexdigest()

def verify_hash(data: Union[str, bytes], expected_hash: str) -> bool:
    """
    Verifies if SHA3-256 hash of data matches expected hash.
    """
    actual_hash = compute_sha3_256(data)
    return actual_hash.lower() == expected_hash.lower()

def derive_quantum_angles(hash_hex: str) -> Tuple[float, float]:
    """
    Deterministically maps a 64-character SHA3-256 hex string
    to Bloch sphere angles theta in [0, pi] and phi in [0, 2*pi).
    
    |psi> = cos(theta/2)|0> + e^(i*phi)*sin(theta/2)|1>
    """
    if len(hash_hex) < 64:
        hash_hex = compute_sha3_256(hash_hex)
        
    part1 = int(hash_hex[:32], 16)
    part2 = int(hash_hex[32:], 16)
    
    # Normalize part1 to theta in range [0, pi]
    # Avoiding extreme poles 0 and pi for clear superposition test visualization
    raw_theta = (part1 % 10000) / 10000.0 * math.pi
    # Bound away from exact 0 or pi to retain rich superposition characteristics
    theta = max(0.2, min(math.pi - 0.2, raw_theta))
    
    # Normalize part2 to phi in range [0, 2*pi)
    phi = (part2 % 10000) / 10000.0 * 2 * math.pi
    
    return round(theta, 4), round(phi, 4)
