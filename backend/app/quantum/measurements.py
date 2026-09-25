"""
Projective Pauli Measurements & Theoretical Expectation Module
Performs measurement simulations in X, Y, and Z bases on Bob's reconstructed qubit using Qiskit Aer.
Computes exact theoretical probabilities vs observed experimental distributions.
"""
import math
from typing import Dict, Any, Tuple
from qiskit import QuantumCircuit, QuantumRegister, ClassicalRegister, transpile
from qiskit_aer import AerSimulator
from .teleportation import create_teleportation_circuit

def calculate_theoretical_probabilities(theta: float, phi: float) -> Dict[str, Dict[str, float]]:
    """
    Computes exact quantum analytical probabilities for pure state |psi> = cos(theta/2)|0> + e^(i*phi)*sin(theta/2)|1>
    across X, Y, and Z Pauli measurement bases.
    """
    cos_half = math.cos(theta / 2.0)
    sin_half = math.sin(theta / 2.0)
    sin_theta = math.sin(theta)
    cos_phi = math.cos(phi)
    sin_phi = math.sin(phi)

    # Z basis: |0> and |1>
    pz_0 = cos_half ** 2
    pz_1 = sin_half ** 2

    # X basis: |+> and |->
    px_plus = 0.5 * (1.0 + sin_theta * cos_phi)
    px_minus = 0.5 * (1.0 - sin_theta * cos_phi)

    # Y basis: |+i> and |-i>
    py_plus = 0.5 * (1.0 + sin_theta * sin_phi)
    py_minus = 0.5 * (1.0 - sin_theta * sin_phi)

    return {
        "Z": {"0": round(pz_0, 4), "1": round(pz_1, 4)},
        "X": {"+": round(px_plus, 4), "-": round(px_minus, 4)},
        "Y": {"+i": round(py_plus, 4), "-i": round(py_minus, 4)}
    }

def perform_pauli_measurements(
    theta: float,
    phi: float,
    mitm_attack: bool = False,
    channel_noise: float = 0.0,
    shots: int = 1024
) -> Dict[str, Any]:
    """
    Simulates projective measurements on Bob's reconstructed qubit (Qubit 2)
    in Z, X, and Y bases over specified AerSimulator shots.
    """
    theoretical = calculate_theoretical_probabilities(theta, phi)
    backend = AerSimulator()
    observed_distributions = {}

    for basis in ["Z", "X", "Y"]:
        # Recreate base teleportation circuit
        qc, _ = create_teleportation_circuit(theta, phi, mitm_attack, channel_noise)
        
        # Add additional classical register for Bob's final measurement (Qubit 2)
        cr_bob = ClassicalRegister(1, name=f"c_{basis.lower()}")
        qc.add_register(cr_bob)
        
        # Apply basis transformation on Qubit 2 before measuring
        if basis == "X":
            qc.h(2)
        elif basis == "Y":
            qc.sdg(2)
            qc.h(2)
        # Z basis requires no transformation (computational basis)
        
        qc.measure(2, cr_bob[0])

        transpiled = transpile(qc, backend)
        job = backend.run(transpiled, shots=shots)
        counts = job.result().get_counts()

        # Parse counts for Bob's final classical bit (cr_bob is the last measurement in classical registers)
        # In Qiskit multiregister output string, format is: "c_bob c_bsm" e.g. "0 11"
        count_0 = 0
        count_1 = 0

        for bitstring, count in counts.items():
            parts = bitstring.split()
            if len(parts) > 1:
                bob_bit = parts[0]
            else:
                bob_bit = bitstring[0]
                
            if bob_bit == "0":
                count_0 += count
            else:
                count_1 += count

        p0_obs = round(count_0 / shots, 4)
        p1_obs = round(count_1 / shots, 4)

        if basis == "Z":
            observed_distributions["Z"] = {"0": p0_obs, "1": p1_obs, "counts": {"0": count_0, "1": count_1}}
        elif basis == "X":
            observed_distributions["X"] = {"+": p0_obs, "-": p1_obs, "counts": {"+": count_0, "-": count_1}}
        elif basis == "Y":
            observed_distributions["Y"] = {"+i": p0_obs, "-i": p1_obs, "counts": {"+i": count_0, "-i": count_1}}

    return {
        "theoretical": theoretical,
        "observed": observed_distributions,
        "shots": shots,
        "mitm": mitm_attack,
        "noise_level": channel_noise
    }
