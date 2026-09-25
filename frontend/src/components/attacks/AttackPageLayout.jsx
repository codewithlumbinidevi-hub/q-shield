import React from 'react';
import Header from '../Header';
import { ArrowLeft, ShieldCheck, ShieldAlert, Activity, Terminal, RefreshCw } from 'lucide-react';

export default function AttackPageLayout({
  title,
  subtitle,
  explanation,
  attackType,
  systemHealth,
  onRetryHealth,
  onBack,
  loading = false,
  verdict = 'REJECT',
  riskScore = 85,
  evidenceText = '',
  secondaryEvidence = '',
  children
}) {
  const isAccept = verdict === 'ACCEPT';
  const isAlert = verdict === 'ALERT';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Top System Header */}
      <Header systemHealth={systemHealth} onRetryHealth={onRetryHealth} />

      {/* Breadcrumb / Back Navigation Bar */}
      <div className="border-b border-slate-800 bg-slate-900/60 backdrop-blur sticky top-0 z-20 px-4 sm:px-6 lg:px-8 py-3 font-sans">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-sans text-xs font-bold bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer shadow-sm group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>← BACK TO THREAT DETECTION</span>
          </button>

          <div className="flex items-center gap-3">
            <span className="text-[11px] font-sans text-slate-400 hidden sm:inline">LIVE SIMULATION ROUTE:</span>
            <span className="font-mono text-xs text-slate-200 bg-slate-950 px-2.5 py-1 rounded border border-slate-800 font-bold uppercase tracking-wider">
              /attacks/{attackType}
            </span>
          </div>
        </div>
      </div>

      {/* Main Page Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
        
        {/* Loading Overlay / Banner when Backend Detection is running */}
        {loading && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 font-sans text-xs text-cyan-300 flex items-center justify-center gap-3 shadow-lg">
            <RefreshCw className="w-5 h-5 text-cyan-400 animate-spin" />
            <span className="font-bold text-sm">RUNNING DETERMINISTIC DETECTION ENGINE...</span>
          </div>
        )}

        {/* Title & Short Explanation Header */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden font-sans">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold tracking-widest text-cyan-400 uppercase bg-slate-950 border border-slate-800 px-3 py-1 rounded-full">
                SECURITY OPERATIONS CONTROL &bull; SIMULATION ROUTE
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-3 font-sans">
                {title}
              </h1>
              <p className="text-xs text-slate-300 mt-2 max-w-3xl leading-relaxed font-sans">
                {explanation}
              </p>
            </div>

            <div className={`shrink-0 px-4 py-3 rounded-xl border flex items-center gap-3 font-sans ${
              isAccept 
                ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-300' 
                : isAlert
                ? 'bg-amber-950/60 border-amber-500/60 text-amber-300'
                : 'bg-rose-950/60 border-rose-500/60 text-rose-300'
            }`}>
              {isAccept ? <ShieldCheck className="w-7 h-7 text-emerald-400" /> : <ShieldAlert className="w-7 h-7 text-rose-400" />}
              <div>
                <div className="text-[10px] uppercase tracking-wider opacity-80 font-sans">VERDICT</div>
                <div className="text-lg font-black tracking-wide font-sans">{verdict}</div>
              </div>
            </div>
          </div>

          {/* General 5-Step Pipeline Banner */}
          <div className="mt-8 pt-6 border-t border-slate-800 font-sans">
            <div className="text-[11px] text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2 font-bold">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>DETERMINISTIC DIAGNOSTIC PIPELINE FLOW</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs font-sans">
              <div className="bg-slate-950 border border-slate-800 p-3 rounded-lg text-center">
                <div className="text-[10px] text-cyan-400 font-bold uppercase">1. EXPECTED STATE</div>
                <div className="text-slate-200 mt-1 font-semibold truncate">Baseline Rules</div>
              </div>
              <div className="bg-slate-950 border border-slate-800 p-3 rounded-lg text-center">
                <div className="text-[10px] text-amber-400 font-bold uppercase">2. MANIPULATION</div>
                <div className="text-slate-200 mt-1 font-semibold truncate">Attack Injected</div>
              </div>
              <div className="bg-slate-950 border border-slate-800 p-3 rounded-lg text-center">
                <div className="text-[10px] text-purple-400 font-bold uppercase">3. OBSERVED STATE</div>
                <div className="text-slate-200 mt-1 font-semibold truncate">Quantum / Crypto Payload</div>
              </div>
              <div className="bg-slate-950 border border-slate-800 p-3 rounded-lg text-center">
                <div className="text-[10px] text-blue-400 font-bold uppercase">4. DETECTION RULE</div>
                <div className="text-slate-200 mt-1 font-semibold truncate">Integrity / State Checks</div>
              </div>
              <div className={`border p-3 rounded-lg text-center font-bold ${
                isAccept ? 'bg-emerald-950/40 border-emerald-700/60 text-emerald-300' : 'bg-rose-950/40 border-rose-700/60 text-rose-300'
              }`}>
                <div className="text-[10px] uppercase">5. DECISION</div>
                <div className="mt-1">{verdict}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Page Specific Attack Content */}
        <div className="space-y-6 font-sans">
          {children}
        </div>

        {/* Standard Final Result & Evidence Panel */}
        <div className={`border rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden font-sans ${
          isAccept
            ? 'bg-slate-900/90 border-emerald-600/60'
            : 'bg-slate-900/90 border-rose-600/60'
        }`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl font-sans">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase ${
                  isAccept ? 'bg-emerald-950 text-emerald-300 border border-emerald-600/80' : 'bg-rose-950 text-rose-300 border border-rose-600/80'
                }`}>
                  {isAccept ? '✓ LEGITIMATE TRANSMISSION' : '⚠ THREAT DETECTED'}
                </span>
                <span className="text-xs text-slate-400">Attack: <strong className="text-slate-200 uppercase">{title}</strong></span>
              </div>
              
              <h3 className="text-xl font-bold text-white font-sans">
                {isAccept ? 'Signature Verified & Entanglement State Intact' : `Security Rule Violation Detected: ${title}`}
              </h3>
              
              {evidenceText && (
                <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-lg font-sans leading-relaxed border border-slate-800">
                  <strong className="text-cyan-400 font-sans uppercase">PRIMARY EVIDENCE:</strong> <span className="font-mono text-slate-200">{evidenceText}</span>
                </p>
              )}

              {secondaryEvidence && (
                <p className="text-xs text-slate-400 font-sans">
                  <strong className="text-slate-300 uppercase">SECONDARY EVIDENCE:</strong> <span className="font-mono text-slate-300">{secondaryEvidence}</span>
                </p>
              )}
            </div>

            <div className="shrink-0 flex flex-col items-end gap-3 w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0 border-slate-800 font-sans">
              <div className="text-right font-sans">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">DETERMINISTIC RISK SCORE</div>
                <div className={`text-2xl font-black font-mono ${isAccept ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {riskScore} <span className="text-xs text-slate-500 font-normal">/ 100</span>
                </div>
              </div>

              <div className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold font-sans text-center text-sm tracking-wider uppercase flex items-center justify-center gap-2 ${
                isAccept ? 'bg-emerald-600 text-slate-950 shadow-md' : 'bg-rose-600 text-white shadow-md'
              }`}>
                {isAccept ? <ShieldCheck className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
                <span>DECISION: {verdict}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-sans">
            <span className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>Deterministic cryptographic verification — No AI/ML involved.</span>
            </span>
            <span className="hidden sm:inline text-slate-500">Q-SHIELD Threat Engine</span>
          </div>
        </div>

        {/* Bottom Back Button */}
        <div className="flex justify-center pt-4 font-sans">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-cyan-300 hover:text-white bg-slate-900 border border-slate-800 px-6 py-3 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← BACK TO THREAT DETECTION</span>
          </button>
        </div>

      </main>
    </div>
  );
}
