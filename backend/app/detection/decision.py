"""
Centralized Deterministic Decision Evaluator Module
Collates cryptographic, identity, replay, QBER, and fidelity checks to output security verdict (ACCEPT, ALERT, REJECT).
Strictly deterministic logic - Zero AI / ML.
"""
from typing import Dict, Any, List

def evaluate_security_verdict(
    forgery_res: Dict[str, Any],
    impersonation_res: Dict[str, Any],
    replay_res: Dict[str, Any],
    qber_res: Dict[str, Any],
    fidelity_res: Dict[str, Any],
    deviation_res: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Evaluates all security checks deterministically to output verdict and risk score.
    """
    detected_threats: List[Dict[str, Any]] = []
    
    # 1. Check Forgery
    if not forgery_res.get("valid", False):
        detected_threats.append({
            "code": forgery_res.get("threat_flag", "FORGERY_ATTACK_DETECTED"),
            "severity": "CRITICAL",
            "message": forgery_res.get("description")
        })
        
    # 2. Check Impersonation
    if not impersonation_res.get("valid", False):
        detected_threats.append({
            "code": impersonation_res.get("threat_flag", "IMPERSONATION_DETECTED"),
            "severity": "HIGH",
            "message": impersonation_res.get("description")
        })

    # 3. Check Replay
    if not replay_res.get("valid", False):
        detected_threats.append({
            "code": replay_res.get("threat_flag", "REPLAY_ATTACK_DETECTED"),
            "severity": "CRITICAL",
            "message": replay_res.get("description")
        })

    # 4. Check QBER (MITM Eavesdropping)
    if qber_res.get("exceeds_threshold", False):
        detected_threats.append({
            "code": qber_res.get("threat_flag", "HIGH_QBER_MITM_EAVESDROPPING"),
            "severity": "HIGH",
            "message": qber_res.get("description")
        })

    # 5. Check State Fidelity & Deviation
    if fidelity_res.get("below_threshold", False):
        detected_threats.append({
            "code": fidelity_res.get("threat_flag", "LOW_QUANTUM_STATE_FIDELITY"),
            "severity": "MEDIUM",
            "message": fidelity_res.get("description")
        })

    if deviation_res.get("exceeds", False):
        detected_threats.append({
            "code": deviation_res.get("threat_flag", "STATISTICAL_DEVIATION_ANOMALY"),
            "severity": "LOW",
            "message": deviation_res.get("description")
        })

    # Determine Verdict & Risk Score
    critical_or_high_threats = [t for t in detected_threats if t["severity"] in ["CRITICAL", "HIGH"]]
    medium_threats = [t for t in detected_threats if t["severity"] == "MEDIUM"]

    if len(critical_or_high_threats) > 0:
        verdict = "REJECT"
        risk_score = 95
        verdict_message = "TRANSACTION REJECTED: Malicious attack vector or severe quantum channel eavesdropping detected."
    elif len(medium_threats) > 0:
        verdict = "ALERT"
        risk_score = 45
        verdict_message = "TRANSACTION ALERT: Signature valid, but quantum state degradation observed due to channel noise."
    else:
        verdict = "ACCEPT"
        risk_score = 5
        verdict_message = "TRANSACTION ACCEPTED: Quantum digital signature verified successfully with optimal fidelity."

    checklist = [
        {
            "name": "SHA3-256 Hash Integrity",
            "status": "PASS" if forgery_res.get("valid") else "FAIL",
            "details": forgery_res.get("description")
        },
        {
            "name": "Signer & Verifier Identity",
            "status": "PASS" if impersonation_res.get("valid") else "FAIL",
            "details": impersonation_res.get("description")
        },
        {
            "name": "Replay Protection",
            "status": "PASS" if replay_res.get("valid") else "FAIL",
            "details": replay_res.get("description")
        },
        {
            "name": "Quantum Channel MITM Check",
            "status": "FAIL" if qber_res.get("exceeds_threshold") else "PASS",
            "details": f"QBER: {qber_res.get('qber_percentage')} (Threshold: {qber_res.get('threshold_percentage')})"
        },
        {
            "name": "State Fidelity Tolerance",
            "status": "FAIL" if fidelity_res.get("below_threshold") else "PASS",
            "details": f"Fidelity: {fidelity_res.get('fidelity_percentage')} (Threshold: {fidelity_res.get('threshold_percentage')})"
        }
    ]

    return {
        "verdict": verdict,
        "verdict_message": verdict_message,
        "risk_score": risk_score,
        "threats_count": len(detected_threats),
        "threats": detected_threats,
        "checklist": checklist,
        "metrics": {
            "qber": qber_res.get("qber"),
            "qber_percentage": qber_res.get("qber_percentage"),
            "fidelity": fidelity_res.get("fidelity"),
            "fidelity_percentage": fidelity_res.get("fidelity_percentage"),
            "deviation": deviation_res.get("deviation")
        }
    }
