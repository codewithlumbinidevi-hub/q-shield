import React from 'react';
import { ShieldCheck, CheckCircle2, ArrowRight, Hash } from 'lucide-react';
import { formatBsmMeasurement, formatPauliCorrection } from '../utils/formatters';

export default function QDSResultCard({ signatureData, onVerifySignature, loading }) {
  if (!signatureData) return null;

  const {
    signature_id,
    transaction_id,
    document_hash,
    signature_hash,
    signer,
    verifier,
    quantum_state,
    theta,
    phi,
    bell_measurement,
    bsm_bitstring,
    pauli_correction,
    teleportation_status,
    qds_status
  } = signatureData;

  const realHash = signature_hash || document_hash || "8f2a91c491cd...";
  const displayTheta = quantum_state?.theta ?? theta ?? 0.0;
  const displayPhi = quantum_state?.phi ?? phi ?? 0.0;
  const formattedBsm = formatBsmMeasurement(bell_measurement, bsm_bitstring);
  const formattedPauli = formatPauliCorrection(pauli_correction);

  return (
    <div className="bg-slate-950 border border-emerald-600/40 rounded-xl p-5 shadow-xl space-y-4 font-sans">
      
      {/* Header Badge */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h3 className="text-base font-bold text-white uppercase tracking-wide font-sans">
            QDS SIGNATURE GENERATED
          </h3>
        </div>
        <span className="px-3 py-1 text-xs font-bold rounded-md bg-emerald-950 text-emerald-300 border border-emerald-700 flex items-center gap-1 font-sans">
          <CheckCircle2 className="w-3.5 h-3.5" /> STATUS: {qds_status || "GENERATED"}
        </span>
      </div>

      {/* Grid of Attributes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-sans">
        
        {/* Signature ID */}
        <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 block font-sans uppercase font-bold">SIGNATURE ID</span>
          <span className="text-cyan-400 font-mono font-bold text-xs block truncate">
            {signature_id || transaction_id || "SIG-QDS-2026-001"}
          </span>
        </div>

        {/* Signer & Verifier */}
        <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 block font-sans uppercase font-bold">SIGNER & VERIFIER</span>
          <span className="text-slate-200 block text-[11px] font-sans">
            Signer: <strong className="text-emerald-400">{signer || "Alice"}</strong>
          </span>
          <span className="text-slate-200 block text-[11px] font-sans">
            Verifier: <strong className="text-emerald-400">{verifier || "Bob"}</strong>
          </span>
        </div>

        {/* Quantum State */}
        <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 block font-sans uppercase font-bold">QUANTUM STATE (θ, φ)</span>
          <span className="text-cyan-300 font-mono font-semibold block text-[11px]">
            θ = {displayTheta} rad
          </span>
          <span className="text-cyan-300 font-mono font-semibold block text-[11px]">
            φ = {displayPhi} rad
          </span>
        </div>

        {/* Bell Measurement & Correction */}
        <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 block font-sans uppercase font-bold">BSM & PAULI CORRECTION</span>
          <span className="text-amber-300 font-mono font-semibold block text-[11px]">
            Bell: {formattedBsm}
          </span>
          <span className="text-emerald-400 font-mono font-bold block text-[11px]">
            Gate: {formattedPauli}
          </span>
        </div>

      </div>

      {/* Actual SHA3-256 Hash Display */}
      <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-xs font-sans">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="flex items-center gap-1 text-cyan-400 font-bold font-sans">
            <Hash className="w-3.5 h-3.5" /> DOCUMENT SHA3-256 HASH
          </span>
          <span className="text-emerald-400 text-[10px] font-sans uppercase">TELEPORTATION: {teleportation_status || "COMPLETED"}</span>
        </div>
        <div className="text-xs text-emerald-400 break-all font-mono bg-slate-950 p-2 rounded border border-slate-800">
          {realHash}
        </div>
      </div>

      {/* Verify Button */}
      <div className="flex justify-end pt-1">
        <button
          onClick={onVerifySignature}
          disabled={loading}
          className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-slate-950 font-bold py-2.5 px-6 rounded-lg flex items-center gap-2 shadow-md transition-all font-sans text-xs uppercase tracking-wider cursor-pointer"
        >
          {loading ? (
            <span>Verifying Signature...</span>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" />
              <span>VERIFY QDS SIGNATURE</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

    </div>
  );
}
