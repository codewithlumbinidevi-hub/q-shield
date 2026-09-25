"""
Quantum Teleportation Module (Qiskit Aer Simulator)
Encodes document state |psi> onto qubit 0, teleports to Bob's qubit 2 via Bell pair (qubits 1, 2),
applies Bell State Measurement (BSM) and conditional Pauli corrections (I, X, Z, XZ).
"""
import math
from typing import Dict, Any, Tuple
from qiskit import QuantumCircuit, QuantumRegister, ClassicalRegister, transpile
from qiskit_aer import AerSimulator
from .bell_pair import create_bell_pair

def create_teleportation_circuit(
    theta: float,
    phi: float,
    mitm_attack: bool = False,
    channel_noise: float = 0.0
) -> Tuple[QuantumCircuit, Dict[str, Any]]:
    """
    Constructs the 3-qubit Quantum Teleportation Circuit.
    - Qubit 0: Payload state |psi> prepared via RY(theta) and RZ(phi)
    - Qubits 1, 2: Entangled Bell Pair |Phi+>
    - BSM on Qubits 0 & 1 -> Classical Bits c0, c1
    - Channel Attack / Noise on Qubit 2 (in-transit channel)
    - Conditional Pauli Corrections on Qubit 2
    """
    qr = QuantumRegister(3, name="q")
    cr = ClassicalRegister(2, name="c_bsm")
    qc = QuantumCircuit(qr, cr)

    # Step 1: Payload State Preparation on Qubit 0
    qc.ry(theta, qr[0])
    qc.rz(phi, qr[0])
    qc.barrier()

    # Step 2: Bell Pair Entanglement on Qubits 1 & 2
    create_bell_pair(qc, 1, 2)
    qc.barrier()

    # Step 3: Bell State Measurement (BSM) on Alice's Qubits 0 & 1
    qc.cx(qr[0], qr[1])
    qc.h(qr[0])
    qc.barrier()
    qc.measure(qr[0], cr[0]) # b1 (Z-correction bit)
    qc.measure(qr[1], cr[1]) # b2 (X-correction bit)
    qc.barrier()

    # Step 4: Channel Attacks / Eavesdropping Noise Injection on Qubit 2
    noise_info = {"mitm": mitm_attack, "noise_level": channel_noise}
    if mitm_attack:
        # MITM eavesdropping introduces bit-flip (X) and phase-flip (Z) disturbances
        qc.x(qr[2])
        qc.z(qr[2])
    
    if channel_noise > 0.0:
        # Quantum channel depolarizing noise modeled via continuous rotation error
        rotation_err = channel_noise * math.pi
        qc.rx(rotation_err, qr[2])
        qc.rz(rotation_err / 2.0, qr[2])
        
    qc.barrier()

    # Step 5: Conditional Pauli Corrections on Bob's Qubit 2
    with qc.if_test((cr[1], 1)):
        qc.x(qr[2])
    with qc.if_test((cr[0], 1)):
        qc.z(qr[2])

    metadata = {
        "theta": theta,
        "phi": phi,
        "mitm": mitm_attack,
        "noise_level": channel_noise,
        "qubits_used": 3,
        "classical_bits": 2
    }

    return qc, metadata

def run_teleportation(
    theta: float,
    phi: float,
    mitm_attack: bool = False,
    channel_noise: float = 0.0,
    shots: int = 1024
) -> Dict[str, Any]:
    """
    Executes the teleportation circuit and returns classical bit outcomes,
    Pauli correction applied, and execution metadata.
    """
    qc, metadata = create_teleportation_circuit(theta, phi, mitm_attack, channel_noise)
    backend = AerSimulator()
    transpiled = transpile(qc, backend)
    job = backend.run(transpiled, shots=shots)
    result = job.result()
    counts = result.get_counts()

    # Determine predominant BSM measurement outcome
    # Counts keys are formatted as 'c1 c0' or 'c_bsm' string
    most_frequent_bsm = max(counts.items(), key=lambda x: x[1])[0]
    bsm_clean = most_frequent_bsm.replace(" ", "")
    
    # Parse classical bits c0 (bit 1) and c1 (bit 0)
    # Note: Qiskit orders bitstring from right-to-left: c1 c0
    if len(bsm_clean) >= 2:
        b1 = int(bsm_clean[-1]) # c0 -> Z bit
        b2 = int(bsm_clean[-2]) # c1 -> X bit
    else:
        b1 = 0
        b2 = 0

    # Map Pauli correction gate string
    if b1 == 0 and b2 == 0:
        pauli_correction = "I"
    elif b1 == 0 and b2 == 1:
        pauli_correction = "X"
    elif b1 == 1 and b2 == 0:
        pauli_correction = "Z"
    else:
        pauli_correction = "XZ"

    return {
        "metadata": metadata,
        "bsm_bitstring": f"{b1}{b2}",
        "classical_bits": {"b1": b1, "b2": b2},
        "pauli_correction": pauli_correction,
        "counts": counts,
        "total_shots": shots
    }
