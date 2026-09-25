"""
Quantum Circuit Rendering Module
Generates ASCII text representation and dynamic structured gate metadata of the teleportation circuit.
"""
from typing import Dict, Any, List
from .teleportation import create_teleportation_circuit

def get_circuit_ascii(theta: float, phi: float, mitm: bool = False, noise: float = 0.0) -> str:
    """
    Returns ASCII text representation of the Qiskit quantum teleportation circuit.
    """
    qc, _ = create_teleportation_circuit(theta, phi, mitm_attack=mitm, channel_noise=noise)
    try:
        ascii_art = str(qc.draw(output='text'))
    except Exception:
        ascii_art = f"q_0: --[RY({theta:.2f})]--[RZ({phi:.2f})]--.--[H]--M------\n" \
                    f"q_1: -------------------[H]--+-----|---|--M---\n" \
                    f"q_2: ------------------------|-----+---|---|---[X_if]--[Z_if]--"
    return ascii_art

def get_circuit_dict(theta: float, phi: float, mitm: bool = False, noise: float = 0.0) -> Dict[str, Any]:
    """
    Returns detailed circuit structure and gate sequence list for UI rendering.
    """
    qc, metadata = create_teleportation_circuit(theta, phi, mitm_attack=mitm, channel_noise=noise)
    
    gates: List[Dict[str, Any]] = []
    for instr in qc.data:
        gate_name = instr.operation.name.upper()
        qubits = [qc.find_bit(q).index for q in instr.qubits]
        params = [round(p, 3) for p in instr.operation.params if isinstance(p, (int, float))]
        gates.append({
            "gate": gate_name,
            "qubits": qubits,
            "params": params
        })

    return {
        "ascii": get_circuit_ascii(theta, phi, mitm, noise),
        "qubit_count": qc.num_qubits,
        "clbit_count": qc.num_clbits,
        "depth": qc.depth(),
        "gates": gates,
        "metadata": metadata
    }
