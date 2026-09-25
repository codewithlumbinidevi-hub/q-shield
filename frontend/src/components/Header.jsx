import React from 'react';
import { ShieldCheck, Cpu, RefreshCw } from 'lucide-react';

export default function Header({ systemHealth, onRetryHealth }) {
  return (
    <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur-md sticky top-0 z-50 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        
        {/* Left Brand Info */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-extrabold tracking-tight text-white font-sans">
                Q-SHIELD
              </h1>
              <span className="text-xs text-slate-400 font-sans">| Quantum-Inspired Digital Signature Security</span>
              <span className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-slate-900 text-cyan-400 border border-slate-800 font-sans">
                Team VELCODEX
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans">
              Teleportation-Based QDS Threat Detection &bull; Quantum Security Research Prototype
            </p>
          </div>
        </div>

        {/* Right Badges & Status */}
        <div className="flex items-center gap-3 self-start md:self-auto font-sans">
          {/* Simulation Prototype Label */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300 text-xs font-sans font-medium">
            <Cpu className="w-3.5 h-3.5 text-amber-400" />
            <span>Quantum Simulation Prototype (Qiskit Aer)</span>
          </div>

          {/* Engine Health Status (Online / Offline) */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-slate-900 border border-slate-800 text-xs font-sans">
            <span className={`h-2.5 w-2.5 rounded-full ${systemHealth ? 'bg-emerald-400' : 'bg-rose-500'}`} />
            <span className={systemHealth ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
              {systemHealth ? '🟢 Online' : '🔴 Offline'}
            </span>
            {!systemHealth && onRetryHealth && (
              <button
                onClick={onRetryHealth}
                className="ml-1 p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded transition-colors cursor-pointer"
                title="Retry backend connection"
              >
                <RefreshCw className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

      </div>
    </header>
  );
}
