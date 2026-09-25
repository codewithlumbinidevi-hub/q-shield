"""
Automated Test Suite for Q-SHIELD / Q-SHIELD Prototype
Tests cryptographic hashing, document upload, quantum teleportation, forgery, impersonation, replay, QBER, fidelity, decision engine, and FastAPI REST endpoints.
"""
import sys
import os
import io
import pytest
from fastapi.testclient import TestClient

# Add backend app to PYTHONPATH
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.main import app
from app.crypto.hashing import compute_sha3_256, verify_hash, derive_quantum_angles
from app.quantum.teleportation import run_teleportation
from app.quantum.measurements import calculate_theoretical_probabilities
from app.detection.forgery import check_document_forgery
from app.detection.impersonation import check_identity_impersonation
from app.detection.replay import check_replay_attack, reset_replay_cache
from app.detection.qber import calculate_qber
from app.detection.fidelity import calculate_fidelity
from app.detection.decision import evaluate_security_verdict

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["status"] == "ok"
    assert "version" in json_data
    assert "qiskit_version" in json_data

def test_document_upload_endpoint():
    file_content = b"Digital Signature Authorization: Transfer 10,000 Q-Tokens from Alice to Bob."
    file_name = "test_contract.txt"
    
    response = client.post(
        "/api/document/upload",
        files={"file": (file_name, io.BytesIO(file_content), "text/plain")}
    )
    
    assert response.status_code == 200
    res = response.json()
    assert res["filename"] == file_name
    assert res["status"] == "uploaded"
    assert res["sha3_256"] == compute_sha3_256(file_content)
    assert res["size_bytes"] == len(file_content)

def test_sha3_256_hashing():
    doc = "Digital Signature Authorization: Transfer ₹10,000 to Account A."
    hash1 = compute_sha3_256(doc)
    hash2 = compute_sha3_256(doc)
    assert len(hash1) == 64
    assert hash1 == hash2
    assert verify_hash(doc, hash1) is True
    assert verify_hash(doc + " Tampered", hash1) is False

def test_derive_quantum_angles():
    doc_hash = compute_sha3_256("Test Document")
    theta, phi = derive_quantum_angles(doc_hash)
    assert 0.0 <= theta <= 3.1416
    assert 0.0 <= phi <= 6.2832

def test_quantum_teleportation():
    theta, phi = 1.25, 2.30
    res = run_teleportation(theta=theta, phi=phi, mitm_attack=False, channel_noise=0.0)
    assert "bsm_bitstring" in res
    assert res["pauli_correction"] in ["I", "X", "Z", "XZ"]
    assert res["total_shots"] == 1024

def test_forgery_detection():
    doc = "Original Legal Contract"
    correct_hash = compute_sha3_256(doc)
    
    pass_res = check_document_forgery(doc, correct_hash)
    assert pass_res["valid"] is True

    fail_res = check_document_forgery(doc + " MUTATED", correct_hash)
    assert fail_res["valid"] is False
    assert fail_res["threat_flag"] == "FORGERY_ATTACK_DETECTED"

def test_impersonation_detection():
    valid_res = check_identity_impersonation("Alice", "Bob", ["Alice"], ["Bob"])
    assert valid_res["valid"] is True

    invalid_res = check_identity_impersonation("Mallory", "Bob", ["Alice"], ["Bob"])
    assert invalid_res["valid"] is False
    assert invalid_res["threat_flag"] == "IMPERSONATION_DETECTED"

def test_replay_attack_detection():
    reset_replay_cache()
    tx_id = "QDS-TX-TEST9999"

    first_attempt = check_replay_attack(tx_id, consume=True)
    assert first_attempt["valid"] is True

    second_attempt = check_replay_attack(tx_id, consume=True)
    assert second_attempt["valid"] is False
    assert second_attempt["threat_flag"] == "REPLAY_ATTACK_DETECTED"

def test_qber_calculation():
    theta, phi = 1.0, 1.5
    theo = calculate_theoretical_probabilities(theta, phi)
    
    ideal_obs = theo
    qber_ideal = calculate_qber(theo, ideal_obs, qber_threshold=0.11)
    assert qber_ideal["qber"] <= 0.05
    assert qber_ideal["exceeds_threshold"] is False

    noisy_obs = {
        "Z": {"0": 0.1, "1": 0.9},
        "X": {"+": 0.1, "-": 0.9},
        "Y": {"+i": 0.1, "-i": 0.9}
    }
    qber_noisy = calculate_qber(theo, noisy_obs, qber_threshold=0.11)
    assert qber_noisy["qber"] > 0.11
    assert qber_noisy["exceeds_threshold"] is True

def test_attack_endpoints():
    sign_payload = {
        "document_text": "Digital Signature Authorization: Transfer ₹10,000 to Account A.",
        "signer_id": "Alice",
        "verifier_id": "Bob"
    }
    sign_resp = client.post("/api/qds/sign", json=sign_payload)
    assert sign_resp.status_code == 200
    tx_id = sign_resp.json()["transaction_id"]

    # Test Forgery attack simulation
    forgery_resp = client.post("/api/attack/forgery", json={
        "transaction_id": tx_id,
        "document_text": "Digital Signature Authorization: Transfer ₹10,000 to Account A.",
        "signer_id": "Alice",
        "verifier_id": "Bob"
    })
    assert forgery_resp.status_code == 200
    assert forgery_resp.json()["verdict"] == "REJECT"

    # Test MITM attack simulation
    mitm_resp = client.post("/api/attack/mitm", json={
        "transaction_id": tx_id,
        "document_text": "Digital Signature Authorization: Transfer ₹10,000 to Account A.",
        "signer_id": "Alice",
        "verifier_id": "Bob"
    })
    assert mitm_resp.status_code == 200
    assert mitm_resp.json()["verdict"] == "REJECT"
