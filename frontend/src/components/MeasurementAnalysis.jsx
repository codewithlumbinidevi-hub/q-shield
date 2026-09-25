import React, { useState } from 'react';
import { BarChart3 } from 'lucide-react';

export default function MeasurementAnalysis({ measurementData }) {
  const [selectedBasis, setSelectedBasis] = useState('Z');

  const defaultTheoretical = {
    Z: { "0": 0.7081, "1": 0.2919 },
    X: { "+": 0.3804, "-": 0.6196 },
    Y: { "+i": 0.8145, "-i": 0.1855 }
  };

  const defaultObserved = {
    Z: { "0": 0.710, "1": 0.290 },
    X: { "+": 0.378, "-": 0.622 },
    Y: { "+i": 0.816, "-i": 0.184 }
  };

  const theoretical = measurementData?.theoretical || defaultTheoretical;
  const observed = measurementData?.observed || defaultObserved;

  const basesInfo = {
    Z: { name: "Z Basis (Computational |0⟩, |1⟩)", keys: ["0", "1"] },
    X: { name: "X Basis (Superposition |+⟩, |−⟩)", keys: ["+", "-"] },
    Y: { name: "Y Basis (Circular |+i⟩, |−i⟩)", keys: ["+i", "-i"] }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4 font-sans">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 font-sans">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-cyan-400" />
          <h2 className="text-base font-bold text-white tracking-wide font-sans">
            5. Pauli Projective Measurement & Statistical Analysis
          </h2>
        </div>

        {/* Pauli Basis Measurement Buttons */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 font-sans text-xs">
          {['X', 'Y', 'Z'].map((basis) => (
            <button
              key={basis}
              onClick={() => setSelectedBasis(basis)}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-colors cursor-pointer ${
                selectedBasis === basis ? 'bg-cyan-600 text-slate-950 font-sans font-extrabold' : 'text-slate-400 hover:text-white font-sans'
              }`}
            >
              Measure {basis}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Bases */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans">
        {['X', 'Y', 'Z'].map((basisKey) => {
          const info = basesInfo[basisKey];
          const isSelected = selectedBasis === basisKey;
          const theoVals = theoretical[basisKey] || {};
          const obsVals = observed[basisKey] || {};
          const k1 = info.keys[0];
          const k2 = info.keys[1];

          const p1_theo = (theoVals[k1] || 0) * 100;
          const p1_obs = (obsVals[k1] || 0) * 100;
          const p2_theo = (theoVals[k2] || 0) * 100;
          const p2_obs = (obsVals[k2] || 0) * 100;

          return (
            <div
              key={basisKey}
              onClick={() => setSelectedBasis(basisKey)}
              className={`p-4 rounded-lg border transition-all cursor-pointer font-sans ${
                isSelected
                  ? 'bg-slate-950 border-cyan-500 shadow-md'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="text-xs font-bold text-slate-200 border-b border-slate-900 pb-1.5 flex items-center justify-between font-sans">
                <span>{info.name}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded border font-mono ${
                  isSelected ? 'bg-cyan-950 text-cyan-300 font-bold border-cyan-700' : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}>
                  {basisKey}-Basis
                </span>
              </div>

              {/* State 1 Bar */}
              <div className="space-y-1 mt-3 font-sans">
                <div className="flex justify-between text-[11px] text-slate-300">
                  <span className="font-mono">Outcome [{k1}]</span>
                  <span className="font-mono text-[10px]">Exp: {p1_theo.toFixed(1)}% | Obs: {p1_obs.toFixed(1)}%</span>
                </div>
                {/* Theoretical Bar */}
                <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-800">
                  <div className="bg-slate-500 h-full" style={{ width: `${p1_theo}%` }} />
                </div>
                {/* Observed Bar */}
                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div className="bg-cyan-400 h-full" style={{ width: `${p1_obs}%` }} />
                </div>
              </div>

              {/* State 2 Bar */}
              <div className="space-y-1 pt-2 font-sans">
                <div className="flex justify-between text-[11px] text-slate-300">
                  <span className="font-mono">Outcome [{k2}]</span>
                  <span className="font-mono text-[10px]">Exp: {p2_theo.toFixed(1)}% | Obs: {p2_obs.toFixed(1)}%</span>
                </div>
                {/* Theoretical Bar */}
                <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-800">
                  <div className="bg-slate-500 h-full" style={{ width: `${p2_theo}%` }} />
                </div>
                {/* Observed Bar */}
                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div className="bg-indigo-400 h-full" style={{ width: `${p2_obs}%` }} />
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Selected Basis Explanation */}
      <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs font-sans text-slate-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <span>
          Active Basis View: <strong className="text-cyan-400 font-mono">{selectedBasis}-Basis Measurement</strong> (1024 Aer Shots)
        </span>
        <div className="flex items-center gap-4 text-[11px] font-sans">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-4 bg-slate-500 rounded-sm" /> Expected Pure State
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-4 bg-cyan-400 rounded-sm" /> Observed Aer Simulation
          </span>
        </div>
      </div>

    </div>
  );
}
