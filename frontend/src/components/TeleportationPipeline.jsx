import React from 'react';
import { Cpu, ArrowRight, CheckCircle2 } from 'lucide-react';
import { formatBsmMeasurement, formatPauliCorrection } from '../utils/formatters';

export default function TeleportationPipeline({ signatureData, activeStep = 7 }) {
  const bsmFormatted = signatureData ? formatBsmMeasurement(signatureData.bell_measurement, signatureData.bsm_bitstring) : "c0, c1 feedback";
  const pauliFormatted = signatureData ? formatPauliCorrection(signatureData.pauli_correction) : "Gate X^b2 Z^b1";

  const steps = [
    {
      step: 1,
      title: "SHA3-256 Hash",
      detail: signatureData ? (typeof signatureData.signature_hash === 'string' ? signatureData.signature_hash.substring(0, 10) + "..." : "Hash calculation") : "Hash calculation",
      icon: "🔑",
      color: "border-slate-800 text-cyan-400 bg-slate-950"
    },
    {
      step: 2,
      title: "State Prep |ψ⟩",
      detail: signatureData ? `θ=${signatureData.theta ?? 0}, φ=${signatureData.phi ?? 0}` : "RY(θ), RZ(φ)",
      icon: "⚛️",
      color: "border-slate-800 text-cyan-400 bg-slate-950"
    },
    {
      step: 3,
      title: "Bell Pair |Φ+⟩",
      detail: "(|00⟩ + |11⟩)/√2",
      icon: "🔗",
      color: "border-slate-800 text-slate-300 bg-slate-950"
    },
    {
      step: 4,
      title: "BSM Measurement",
      detail: "CX(0→1) + H(0)",
      icon: "🔬",
      color: "border-slate-800 text-slate-300 bg-slate-950"
    },
    {
      step: 5,
      title: "Classical Bits",
      detail: signatureData ? `Bits: ${bsmFormatted}` : "c0, c1 feedback",
      icon: "📡",
      color: "border-slate-800 text-amber-300 bg-slate-950"
    },
    {
      step: 6,
      title: "Pauli Correction",
      detail: signatureData ? `Applied: Gate ${pauliFormatted}` : "Gate X^b2 Z^b1",
      icon: "⚙️",
      color: "border-slate-800 text-emerald-400 bg-slate-950"
    },
    {
      step: 7,
      title: "Bob's State |ψ'⟩",
      detail: "Reconstructed State",
      icon: "🎯",
      color: "border-emerald-600/60 text-emerald-300 bg-emerald-950/40"
    }
  ];

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 shadow-lg font-sans">
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-cyan-400" />
          <h2 className="text-base font-bold text-white tracking-wide font-sans">
            2. Quantum Teleportation Pipeline (Alice → Bob)
          </h2>
        </div>
        {signatureData && (
          <span className="text-xs font-mono text-emerald-400 flex items-center gap-1 bg-slate-950 px-2.5 py-1 rounded border border-slate-800 font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" /> TX ID: {signatureData.transaction_id}
          </span>
        )}
      </div>

      {/* Pipeline Step Cards Horizontal Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {steps.map((s, idx) => (
          <div key={s.step} className="relative flex flex-col font-sans">
            <div className={`p-3 rounded-lg border flex flex-col justify-between h-full transition-all ${s.color}`}>
              <div>
                <div className="flex items-center justify-between text-xs font-sans mb-1.5 opacity-70">
                  <span className="font-mono text-[10px]">STEP 0{s.step}</span>
                  <span>{s.icon}</span>
                </div>
                <h3 className="text-xs font-bold font-sans text-white mb-1">
                  {s.title}
                </h3>
              </div>
              <p className="text-[11px] font-mono text-slate-300 truncate mt-2 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                {s.detail}
              </p>
            </div>
            {idx < steps.length - 1 && (
              <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-slate-600">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
