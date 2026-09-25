"""
Bell Pair Generation Module
Creates maximally entangled Bell state |Phi+> = (|00> + |11>) / sqrt(2).
"""
from qiskit import QuantumCircuit

def create_bell_pair(qc: QuantumCircuit, q1: int = 1, q2: int = 2) -> QuantumCircuit:
    """
    Generates Bell state |Phi+> on specified qubits (q1, q2).
    - H on q1 places it in equal superposition (|0> + |1>)/sqrt(2)
    - CX from q1 to q2 entangles q2 with q1
    """
    qc.h(q1)
    qc.cx(q1, q2)
    return qc
