"""
Quantum State Fidelity & Statistical Deviation Module
Calculates state fidelity F and total variation distance D against theoretical expectation.
"""
import math
from typing import Dict, Any
from app.config import settings

def calculate_fidelity(
    theoretical_probs: Dict[str, Dict[str, float]],
    observed_probs: Dict[str, Dict[str, float]],
    fidelity_threshold: float = None
) -> Dict[str, Any]:
    """
    Computes Quantum State Fidelity F = (sum sqrt(P_exp * P_obs))^2 across basis measurements.
    """
    if fidelity_threshold is None:
        fidelity_threshold = settings.FIDELITY_THRESHOLD

    fidelity_sum = 0.0
    terms_count = 0

    for basis, outcomes in theoretical_probs.items():
        if basis in observed_probs:
            obs = observed_probs[basis]
            for key, p_exp in outcomes.items():
                if key in obs and isinstance(obs[key], (int, float)):
                    p_obs = obs[key]
                    fidelity_sum += math.sqrt(max(0.0, p_exp) * max(0.0, p_obs))
                    terms_count += 1

    if terms_count > 0:
        avg_sqrt_product = fidelity_sum / (terms_count / 2.0) # 2 outcomes per basis
        fidelity = round(min(1.0, max(0.0, avg_sqrt_product ** 2)), 4)
    else:
        fidelity = 1.0

    below_threshold = fidelity < fidelity_threshold

    return {
        "fidelity": fidelity,
        "fidelity_percentage": f"{fidelity * 100:.2f}%",
        "threshold": fidelity_threshold,
        "threshold_percentage": f"{fidelity_threshold * 100:.2f}%",
        "below_threshold": below_threshold,
        "threat_flag": "LOW_QUANTUM_STATE_FIDELITY" if below_threshold else None,
        "description": f"State fidelity ({fidelity * 100:.1f}%) meets threshold" if not below_threshold
                       else f"WARNING: Quantum state fidelity ({fidelity * 100:.1f}%) degraded below {fidelity_threshold * 100:.1f}% threshold!"
    }

def calculate_statistical_deviation(
    theoretical_probs: Dict[str, Dict[str, float]],
    observed_probs: Dict[str, Dict[str, float]],
    max_deviation: float = None
) -> Dict[str, Any]:
    """
    Computes total statistical variation distance D = 0.5 * sum |P_exp - P_obs|.
    """
    if max_deviation is None:
        max_deviation = settings.MAX_STATISTICAL_DEVIATION

    total_diff = 0.0
    comparisons = 0

    for basis, outcomes in theoretical_probs.items():
        if basis in observed_probs:
            obs = observed_probs[basis]
            for key, p_exp in outcomes.items():
                if key in obs and isinstance(obs[key], (int, float)):
                    p_obs = obs[key]
                    total_diff += abs(p_exp - p_obs)
                    comparisons += 1

    deviation = round(0.5 * total_diff / max(1, comparisons / 2.0), 4)
    exceeds = deviation > max_deviation

    return {
        "deviation": deviation,
        "max_deviation": max_deviation,
        "exceeds": exceeds,
        "threat_flag": "STATISTICAL_DEVIATION_ANOMALY" if exceeds else None,
        "description": f"Statistical deviation ({deviation:.3f}) normal" if not exceeds
                       else f"ANOMALY: High statistical deviation ({deviation:.3f} > {max_deviation}) in basis measurements!"
    }
