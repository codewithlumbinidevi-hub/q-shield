# Q-SHIELD (Team VELCODEX)
## Quantum-Inspired Cyber Threat Detection for Digital Signature Security
### Quantum Security Research Prototype

Q-SHIELD is a complete, working software prototype designed to protect digital signatures against cyber threats using quantum teleportation mechanics (simulated via Qiskit Aer), SHA3-256 cryptographic hashing, and a deterministic threat evaluation engine.

---

## 🚀 Key Features

1. **Cryptographic SHA3-256 Hashing**: Binds document payload integrity to single-qubit Bloch sphere parameters ($\theta, \phi$).
2. **Qiskit Aer Quantum Engine**:
   - Generates 3-qubit Bell states $|\Phi^+\rangle = \frac{|00\rangle+|11\rangle}{\sqrt{2}}$.
   - Executes Bell State Measurement (BSM) on Alice's end.
   - Applies conditional Pauli gate corrections ($I, X, Z, XZ$) on Bob's end.
   - Performs projective measurements in $X, Y, Z$ Pauli bases across 1024 shots.
3. **Deterministic Threat Detection Engine (NO ML/AI)**:
   - **QBER Evaluation**: Detects quantum channel MITM eavesdropping when $QBER > 11\%$.
   - **State Fidelity Analysis**: Validates state overlap $\mathcal{F}$ against the $85\%$ threshold.
   - **Replay Protection**: Thread-safe in-memory cache blocks transaction ID reuse.
   - **Document Forgery**: Detects payload tampering via SHA3-256 hash mismatch.
   - **Identity Impersonation**: Validates signers and verifiers against authorized registries.
4. **Attack Simulation Control Panel**:
   - Triggers for `Normal Transmission`, `Simulate Forgery`, `Simulate Impersonation`, `Simulate Replay`, `Simulate MITM`, and `Simulate Channel Noise (Slider)`.
5. **Dark Cybersecurity Dashboard**: Built with React, Vite, and Tailwind CSS.

---

## 🛠️ Quick Start & Running Instructions

### Prerequisites
- **Python 3.10+**
- **Node.js 18+** & **npm**

### Step 1: Launch Backend (FastAPI + Qiskit)
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --port 8001 --reload
```
The FastAPI backend API docs will be available at [http://localhost:8001/docs](http://localhost:8001/docs).

### Step 2: Run Automated Test Suite
```bash
cd backend
pytest tests/test_detection.py -v
```

### Step 3: Launch Frontend (React + Vite + Tailwind)
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Repository Hierarchy

```
qds-threat-detection/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── api/
│   │   ├── quantum/
│   │   ├── detection/
│   │   └── crypto/
│   ├── tests/
│   │   └── test_detection.py
│   ├── requirements.txt
│   └── README.md
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── .env
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       ├── api.js
│       └── components/
└── README.md
```
