import React from 'react';
import { Gauge, ShieldAlert, CheckCircle } from 'lucide-react';

export default function ThreatEngine({ verificationData }) {
  const metrics = verificationData?.metrics || {
    qber: 0.02,
    qber_percentage: "2.00%",
    fidelity: 0.98,
    fidelity_percentage: "98.00%",
    deviation: 0.03
  };

  const threats = verificationData?.threats || [];

  const qberVal = (metrics.qber || 0) * 100;
  const fidelityVal = (metrics.fidelity || 1) * 100;
  const deviationVal = (metrics.deviation || 0) * 100;

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 shadow-lg space-y-5 font-sans">
      
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Gauge className="w-5 h-5 text-cyan-400" />
          <h2 className="text-base font-bold text-white tracking-wide font-sans">
            4. Real-Time Deterministic Threat Detection Engine
          </h2>
        </div>
        <span className="text-xs font-sans text-cyan-400 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
          Strict Rules Engine (No AI/ML)
        </span>
      </div>

      {/* Metric Gauges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans">
        
        {/* QBER Metric Card */}
        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex flex-col justify-between font-sans">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1 font-sans">
              <span className="font-bold text-slate-200">QUANTUM BIT ERROR RATE (QBER)</span>
              <span className="text-slate-400 font-mono">Limit: 11.0%</span>
            </div>
            <div className="text-2xl font-extrabold text-white my-1 flex items-baseline gap-2">
              <span className={`font-mono ${qberVal > 11 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {metrics.qber_percentage || `${qberVal.toFixed(2)}%`}
              </span>
              <span className="text-xs text-slate-500 font-sans">eavesdropping threshold</span>
            </div>
          </div>
          <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800 mt-2">
            <div
              className={`h-full transition-all duration-500 ${qberVal > 11 ? 'bg-rose-500' : 'bg-emerald-400'}`}
              style={{ width: `${Math.min(100, (qberVal / 20) * 100)}%` }}
            />
          </div>
        </div>

        {/* State Fidelity Card */}
        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex flex-col justify-between font-sans">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1 font-sans">
              <span className="font-bold text-slate-200">QUANTUM STATE FIDELITY (F)</span>
              <span className="text-slate-400 font-mono">Min: 85.0%</span>
            </div>
            <div className="text-2xl font-extrabold text-white my-1 flex items-baseline gap-2">
              <span className={`font-mono ${fidelityVal < 85 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {metrics.fidelity_percentage || `${fidelityVal.toFixed(2)}%`}
              </span>
              <span className="text-xs text-slate-500 font-sans">state overlap</span>
            </div>
          </div>
          <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800 mt-2">
            <div
              className={`h-full transition-all duration-500 ${fidelityVal < 85 ? 'bg-rose-500' : 'bg-emerald-400'}`}
              style={{ width: `${fidelityVal}%` }}
            />
          </div>
        </div>

        {/* Statistical Deviation Card */}
        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex flex-col justify-between font-sans">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1 font-sans">
              <span className="font-bold text-slate-200">STATISTICAL DEVIATION (D)</span>
              <span className="text-slate-400 font-mono">Max: 15.0%</span>
            </div>
            <div className="text-2xl font-extrabold text-white my-1 flex items-baseline gap-2">
              <span className={`font-mono ${deviationVal > 15 ? 'text-rose-400' : 'text-cyan-400'}`}>
                {deviationVal.toFixed(2)}%
              </span>
              <span className="text-xs text-slate-500 font-sans">basis variation</span>
            </div>
          </div>
          <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800 mt-2">
            <div
              className={`h-full transition-all duration-500 ${deviationVal > 15 ? 'bg-rose-500' : 'bg-cyan-400'}`}
              style={{ width: `${Math.min(100, (deviationVal / 30) * 100)}%` }}
            />
          </div>
        </div>

      </div>

      {/* Flagged Threat Cards */}
      <div className="font-sans">
        <h3 className="text-xs font-sans font-bold text-slate-300 uppercase tracking-wider mb-2.5">
          FLAGGED THREAT VECTOR ALERTS ({threats.length})
        </h3>
        {threats.length === 0 ? (
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-sans text-emerald-400 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>ZERO THREAT VECTORS FLAGGED — Quantum Signature payload verified clean with optimal fidelity.</span>
          </div>
        ) : (
          <div className="space-y-2 font-sans">
            {threats.map((t, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg border flex items-start gap-3 font-sans text-xs ${
                  t.severity === 'CRITICAL'
                    ? 'bg-rose-950/50 border-rose-600/60 text-rose-300'
                    : t.severity === 'HIGH'
                    ? 'bg-amber-950/50 border-amber-600/60 text-amber-300'
                    : 'bg-slate-950 border-slate-800 text-slate-300'
                }`}
              >
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="flex-1 font-sans">
                  <div className="flex items-center justify-between mb-1 font-sans">
                    <span className="font-bold tracking-wide uppercase font-mono">{t.code}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 font-bold font-sans">
                      SEVERITY: {t.severity}
                    </span>
                  </div>
                  <p className="text-slate-300 leading-snug font-sans">{t.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
