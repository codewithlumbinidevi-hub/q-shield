"""
Quantum Bit Error Rate (QBER) Evaluation Module
Computes QBER across measurement bases and evaluates against QKD threshold (0.11 / 11%).
"""
from typing import Dict, Any
from app.config import settings

def calculate_qber(
    theoretical_probs: Dict[str, Dict[str, float]],
    observed_probs: Dict[str, Dict[str, float]],
    qber_threshold: float = None
) -> Dict[str, Any]:
    """
    Computes Quantum Bit Error Rate (QBER) across X, Y, Z bases.
    QBER = total_probability_error / number_of_outcomes
    """
    if qber_threshold is None:
        qber_threshold = settings.QBER_THRESHOLD

    total_error = 0.0
    total_comparisons = 0

    for basis, outcomes in theoretical_probs.items():
        if basis in observed_probs:
            obs_outcomes = observed_probs[basis]
            for outcome, p_exp in outcomes.items():
                if outcome in obs_outcomes and isinstance(obs_outcomes[outcome], (int, float)):
                    p_obs = obs_outcomes[outcome]
                    total_error += abs(p_exp - p_obs)
                    total_comparisons += 1

    # QBER normalized bounded error rate
    if total_comparisons > 0:
        raw_qber = (total_error / total_comparisons)
        # Scale to standard 0-1 error rate
        qber = round(min(1.0, max(0.0, raw_qber)), 4)
    else:
        qber = 0.0

    exceeds_threshold = qber > qber_threshold

    return {
        "qber": qber,
        "qber_percentage": f"{qber * 100:.2f}%",
        "threshold": qber_threshold,
        "threshold_percentage": f"{qber_threshold * 100:.2f}%",
        "exceeds_threshold": exceeds_threshold,
        "threat_flag": "HIGH_QBER_MITM_EAVESDROPPING" if exceeds_threshold else None,
        "description": f"QBER ({qber * 100:.1f}%) within acceptable quantum channel limits" if not exceeds_threshold
                       else f"HIGH: Quantum channel eavesdropping detected! QBER ({qber * 100:.1f}%) exceeds {qber_threshold * 100:.1f}% threshold."
    }
