import React, { useState } from 'react';
import { Terminal, Copy, Check, Layers } from 'lucide-react';

export default function QuantumCircuitView({ circuitData, asciiCircuit }) {
  const [copied, setCopied] = useState(false);

  const displayAscii = asciiCircuit || (circuitData && circuitData.ascii) || 
    `q_0: ──[RY(1.25)]──[RZ(2.30)]──■──────[H]──M───────────────────
q_1: ───────────────────────────[H]──■──┼──────|──M────────────────
q_2: ──────────────────────────────────[CX]────|──|──[X_if]──[Z_if]─`;

  const handleCopy = () => {
    navigator.clipboard.writeText(displayAscii);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 shadow-lg font-sans">
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-cyan-400" />
          <h2 className="text-base font-bold text-white tracking-wide font-sans">
            3. Dynamic Qiskit Quantum Teleportation Circuit Diagram
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {circuitData && (
            <div className="hidden sm:flex items-center gap-3 text-xs font-sans text-slate-400">
              <span className="bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
                Qubits: <strong className="text-cyan-400 font-mono">{circuitData.qubit_count || 3}</strong>
              </span>
              <span className="bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
                Clbits: <strong className="text-cyan-400 font-mono">{circuitData.clbit_count || 2}</strong>
              </span>
              <span className="bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
                Circuit Depth: <strong className="text-cyan-400 font-mono">{circuitData.depth || 6}</strong>
              </span>
            </div>
          )}

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-sans text-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy ASCII'}</span>
          </button>
        </div>
      </div>

      {/* ASCII Circuit Diagram Display */}
      <div className="relative bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono text-xs overflow-x-auto shadow-inner">
        <div className="flex items-center gap-2 text-slate-400 mb-2 pb-1 border-b border-slate-900 text-[11px] font-sans">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span>QISKIT AER CIRCUIT REPRESENTATION (TEXTUAL DIAGRAM)</span>
        </div>
        <pre className="text-cyan-300 leading-relaxed font-mono whitespace-pre selection:bg-cyan-900 selection:text-white">
          {displayAscii}
        </pre>
      </div>

      {/* Qubit Allocation Legend */}
      <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2 font-sans text-xs text-slate-400">
        <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-cyan-400" />
          <span><strong className="text-slate-200">Qubit 0 (Alice):</strong> Payload State |ψ⟩</span>
        </div>
        <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-indigo-400" />
          <span><strong className="text-slate-200">Qubit 1 (Alice):</strong> Bell Pair Half</span>
        </div>
        <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <span><strong className="text-slate-200">Qubit 2 (Bob):</strong> Reconstructed State</span>
        </div>
      </div>
    </div>
  );
}
