import React from 'react';
import { Lock, AlertTriangle, ShieldCheck, Cpu } from 'lucide-react';

export default function SecurityContext() {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 shadow-lg font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            QUANTUM-SECURITY APPROACH
          </h3>
        </div>
        <p className="text-xs text-slate-400">
          Uses Bell-state entanglement, Bell-state measurement and Pauli corrections for simulation-based quantum state verification.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
        {/* Card 1: Classical Vulnerability */}
        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-1.5">
          <div className="flex items-center gap-1.5 text-rose-400 font-bold text-xs uppercase">
            <AlertTriangle className="w-4 h-4" />
            <span>CLASSICAL SIGNATURES (RSA / ECC)</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            Classical public-key signatures such as RSA and ECC are vulnerable to Shor's algorithm on sufficiently capable quantum computers.
          </p>
        </div>

        {/* Card 2: Quantum Teleportation QDS */}
        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-1.5">
          <div className="flex items-center gap-1.5 text-cyan-400 font-bold text-xs uppercase">
            <ShieldCheck className="w-4 h-4" />
            <span>PROPOSED TELEPORTATION QDS</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            Simulation-based verification using Bell pairs, Bell-state measurement (BSM), and Pauli gate corrections.
          </p>
        </div>

        {/* Card 3: SHA3-256 Integrity Layer */}
        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-1.5">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs uppercase">
            <Cpu className="w-4 h-4" />
            <span>SHA3-256 INTEGRITY LAYER</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            Uses SHA3-256 to provide document integrity checking before quantum-state verification.
          </p>
        </div>
      </div>
    </div>
  );
}
