"""
Q-SHIELD Configuration Module
Deterministic security thresholds and authorization settings.
"""
from typing import List
from pydantic_settings import BaseSettings
from pydantic import ConfigDict

class Settings(BaseSettings):
    APP_NAME: str = "Q-SHIELD Threat Detection Engine"
    VERSION: str = "1.0.0"
    DEBUG: bool = True
    
    # Deterministic Security Thresholds
    QBER_THRESHOLD: float = 0.11          # 11% error rate threshold
    FIDELITY_THRESHOLD: float = 0.85      # 85% minimum state fidelity
    MAX_STATISTICAL_DEVIATION: float = 0.15 # 15% maximum deviation
    
    # Quantum Simulation Settings
    DEFAULT_SHOTS: int = 1024
    
    # Identity Verification
    AUTHORIZED_SIGNERS: List[str] = ["Alice", "velcodex-primary", "signer-01"]
    AUTHORIZED_VERIFIERS: List[str] = ["Bob", "velcodex-validator", "verifier-01"]
    
    model_config = ConfigDict(
        env_file=".env",
        extra="ignore"
    )

settings = Settings()
