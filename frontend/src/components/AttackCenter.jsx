import React from 'react';
import {
  ShieldAlert,
  FileSignature,
  RotateCcw,
  UserX,
  Lock,
  Zap,
  Sliders,
  ArrowRight,
  ShieldCheck,
  Activity
} from 'lucide-react';

export default function AttackCenter({ onNavigate }) {

  const attackCards = [
    {
      id: 'forgery',
      path: '/attacks/forgery',
      title: 'FORGERY',
      subtitle: 'Document Tampering',
      icon: FileSignature,
      color: 'rose',
      buttonText: 'DETECT FORGERY →',
      badgeText: 'CRYPTOGRAPHIC INTEGRITY',
      status: 'THREAT VECTOR'
    },
    {
      id: 'replay',
      path: '/attacks/replay',
      title: 'REPLAY',
      subtitle: 'Transaction / State Reuse',
      icon: RotateCcw,
      color: 'rose',
      buttonText: 'DETECT REPLAY →',
      badgeText: 'STATE REGISTRY',
      status: 'THREAT VECTOR'
    },
    {
      id: 'impersonation',
      path: '/attacks/impersonation',
      title: 'IMPERSONATION',
      subtitle: 'Unauthorized Signer',
      icon: UserX,
      color: 'rose',
      buttonText: 'DETECT IMPERSONATION →',
      badgeText: 'IDENTITY KEY',
      status: 'THREAT VECTOR'
    },
    {
      id: 'unauthorized-verification',
      path: '/attacks/unauthorized-verification',
      title: 'UNAUTHORIZED VERIFICATION',
      subtitle: 'Unauthorized Verifier',
      icon: Lock,
      color: 'rose',
      buttonText: 'DETECT UNAUTHORIZED VERIFICATION →',
      badgeText: 'VERIFIER AUTH',
      status: 'THREAT VECTOR'
    },
    {
      id: 'mitm',
      path: '/attacks/mitm',
      title: 'MITM / EAVESDROPPING',
      subtitle: 'Quantum Channel Interception',
      icon: Zap,
      color: 'rose',
      buttonText: 'DETECT MITM →',
      badgeText: 'QBER & FIDELITY',
      status: 'THREAT VECTOR'
    },
    {
      id: 'noise',
      path: '/attacks/noise',
      title: 'CHANNEL NOISE',
      subtitle: 'Quantum Channel Disturbance',
      icon: Sliders,
      color: 'amber',
      buttonText: 'DETECT NOISE →',
      badgeText: 'DECOHERENCE SLIDER',
      status: 'INTERACTIVE'
    },
    {
      id: 'normal',
      path: '/attacks/normal',
      title: 'NORMAL TRANSMISSION',
      subtitle: 'Baseline Verification',
      icon: ShieldCheck,
      color: 'emerald',
      buttonText: 'RUN BASELINE →',
      badgeText: 'PRISTINE CHANNEL',
      status: 'BASELINE'
    }
  ];

  return (
    <section className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
      
      {/* SOC Section Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide font-mono">
              CYBER THREAT DETECTION
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Select a threat vector and run a live deterministic security simulation.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 font-mono text-xs">
          <Activity className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-300">SOC THREAT ENGINE READY</span>
        </div>
      </div>

      {/* Grid of Compact SOC Threat Detection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono">
        {attackCards.map((attack) => {
          const IconComponent = attack.icon;
          const isNormal = attack.id === 'normal';
          const isNoise = attack.id === 'noise';

          return (
            <div
              key={attack.id}
              className={`bg-slate-950 border ${
                isNormal
                  ? 'border-emerald-500/40 hover:border-emerald-400'
                  : isNoise
                  ? 'border-amber-500/40 hover:border-amber-400'
                  : 'border-slate-800 hover:border-rose-500/60'
              } rounded-xl p-5 shadow-lg flex flex-col justify-between group transition-all duration-200 hover:-translate-y-1`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg bg-slate-900 border border-slate-800 ${
                    isNormal ? 'text-emerald-400' : isNoise ? 'text-amber-400' : 'text-rose-400'
                  }`}>
                    <IconComponent className="w-5 h-5" />
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                    isNormal
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                      : isNoise
                      ? 'bg-amber-950 text-amber-300 border-amber-800'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}>
                    {attack.status}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors uppercase">
                    {attack.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5 font-sans">
                    {attack.subtitle}
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-900">
                <button
                  onClick={() => onNavigate(attack.path)}
                  className={`w-full py-2.5 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    isNormal
                      ? 'bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/80 text-emerald-300'
                      : isNoise
                      ? 'bg-amber-950/80 hover:bg-amber-900 border border-amber-700/80 text-amber-300'
                      : 'bg-rose-950/80 hover:bg-rose-900 border border-rose-700/80 text-rose-300'
                  }`}
                >
                  <span>{attack.buttonText}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
}
