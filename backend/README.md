# Q-SHIELD Backend (Team VELCODEX)
## Quantum-Inspired Cyber Threat Detection for Digital Signature Security

Backend microservice built with **FastAPI** and **Qiskit Aer Simulator**.

### Key Modules:
- `app/crypto/hashing.py`: Computes SHA3-256 document hashes and maps state parameters ($\theta, \phi$).
- `app/quantum/`: Constructs 3-qubit Bell pair entanglement ($|\Phi^+\rangle$), Bell State Measurements (BSM), dynamic Pauli gate corrections ($I, X, Z, XZ$), and projective measurements in $X, Y, Z$ bases.
- `app/detection/`: Deterministic threat engine (QBER <= 0.11, State Fidelity >= 0.85, Replay Cache, Identity Check, Hash Integrity).
- `app/api/`: REST endpoints for hashing, signing, verification, threat configuration, and attack simulations.

### Running Backend Service:
```bash
pip install -r requirements.txt
uvicorn app.main:app --port 8001 --reload
```

### Running Test Suite:
```bash
pytest tests/test_detection.py -v
```
