/**
 * Utility formatters for Q-SHIELD UI rendering.
 * Safely converts string, number, object, or null/undefined API response values into renderable strings.
 */

/**
 * Safely formats Bell State Measurement (BSM) data.
 * Handles objects `{ m1, m2, bsm_bitstring }`, strings, numbers, or null/undefined.
 * Example output: "M1=0, M2=0 (00)"
 */
export function formatBsmMeasurement(bsm, fallbackBitstring = "") {
  if (bsm === null || bsm === undefined) {
    if (fallbackBitstring) {
      const b1 = fallbackBitstring[0] || '0';
      const b2 = fallbackBitstring[1] || '0';
      return `M1=${b1}, M2=${b2} (${fallbackBitstring})`;
    }
    return "M1=0, M2=0 (00)";
  }

  if (typeof bsm === 'object') {
    const m1 = bsm.m1 ?? (bsm.bsm_bitstring ? bsm.bsm_bitstring[0] : (fallbackBitstring ? fallbackBitstring[0] : '0'));
    const m2 = bsm.m2 ?? (bsm.bsm_bitstring ? bsm.bsm_bitstring[1] : (fallbackBitstring ? fallbackBitstring[1] : '0'));
    const bits = bsm.bsm_bitstring || fallbackBitstring || `${m1}${m2}`;
    return `M1=${m1}, M2=${m2} (${bits})`;
  }

  if (typeof bsm === 'string' || typeof bsm === 'number') {
    return String(bsm);
  }

  return "M1=0, M2=0 (00)";
}

/**
 * Safely formats Pauli Correction gate metadata.
 * Handles objects `{ gate, pauli, correction }`, strings, numbers, or null/undefined.
 * Example output: "I (Identity)" or "X" or "Z"
 */
export function formatPauliCorrection(pauli) {
  if (pauli === null || pauli === undefined) {
    return "I (Identity)";
  }

  if (typeof pauli === 'object') {
    return String(pauli.gate || pauli.pauli || pauli.correction || pauli.name || "I (Identity)");
  }

  return String(pauli);
}

/**
 * Safely formats Quantum State metadata (theta, phi).
 * Handles objects `{ theta, phi }` or primitive values.
 */
export function formatQuantumState(state, thetaFallback = 0.0, phiFallback = 0.0) {
  if (typeof state === 'object' && state !== null) {
    const theta = state.theta ?? thetaFallback;
    const phi = state.phi ?? phiFallback;
    return { theta, phi, display: `θ=${theta} rad, φ=${phi} rad` };
  }
  return {
    theta: thetaFallback,
    phi: phiFallback,
    display: `θ=${thetaFallback} rad, φ=${phiFallback} rad`
  };
}

/**
 * Generic safe text formatter to prevent any object from being rendered as a React child.
 */
export function safeRender(val, fallback = "") {
  if (val === null || val === undefined) return fallback;
  if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') {
    return String(val);
  }
  if (typeof val === 'object') {
    if (val.m1 !== undefined || val.bsm_bitstring !== undefined) {
      return formatBsmMeasurement(val);
    }
    if (val.message) return String(val.message);
    if (val.text) return String(val.text);
    if (val.detail) return String(val.detail);
    return JSON.stringify(val);
  }
  return fallback;
}
