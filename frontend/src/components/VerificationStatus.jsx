import React from 'react';
import { ShieldCheck, ShieldAlert, ShieldX, Activity, CheckCircle2, XCircle } from 'lucide-react';

export default function VerificationStatus({ verificationData, loading }) {
  if (loading) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 text-center animate-pulse font-sans">
        <Activity className="w-8 h-8 text-cyan-400 animate-spin mx-auto mb-2" />
        <p className="text-sm font-sans text-slate-300 font-bold">Evaluating Deterministic Quantum Security Rules...</p>
      </div>
    );
  }

  if (!verificationData) {
    return (
      <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 text-center text-slate-500 font-sans text-xs">
        <ShieldCheck className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
        <p>No active verification performed yet. Click "Generate QDS Signature" or execute an Attack Simulation below.</p>
      </div>
    );
  }

  const { verdict, verdict_message, risk_score, checklist } = verificationData;

  const verdictStyles = {
    ACCEPT: {
      bg: "bg-slate-950 border-emerald-600/60",
      badgeBg: "bg-emerald-950 text-emerald-300 border border-emerald-700",
      text: "text-emerald-400",
      icon: <ShieldCheck className="w-8 h-8 text-emerald-400" />
    },
    ALERT: {
      bg: "bg-slate-950 border-amber-600/60",
      badgeBg: "bg-amber-950 text-amber-300 border border-amber-700",
      text: "text-amber-400",
      icon: <ShieldAlert className="w-8 h-8 text-amber-400" />
    },
    REJECT: {
      bg: "bg-slate-950 border-rose-600/60",
      badgeBg: "bg-rose-950 text-rose-300 border border-rose-700",
      text: "text-rose-400",
      icon: <ShieldX className="w-8 h-8 text-rose-400" />
    }
  };

  const currentStyle = verdictStyles[verdict] || verdictStyles.ACCEPT;

  return (
    <div className={`border rounded-xl p-5 shadow-lg font-sans transition-all ${currentStyle.bg}`}>
      
      {/* Header Verdict Card */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-4">
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
            {currentStyle.icon}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 text-sm font-bold font-sans rounded uppercase tracking-wider ${currentStyle.badgeBg}`}>
                VERDICT: {verdict}
              </span>
              <span className="text-xs font-sans text-slate-400">
                Risk Score: <strong className={`font-mono ${currentStyle.text}`}>{risk_score}/100</strong>
              </span>
            </div>
            <p className={`text-xs font-sans mt-1.5 font-semibold ${currentStyle.text}`}>
              {verdict_message}
            </p>
          </div>
        </div>

        {/* Risk Level Meter */}
        <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 w-full md:w-56 font-sans">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span className="font-bold uppercase">RISK LEVEL</span>
            <span className="font-mono font-bold">{risk_score}%</span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
            <div
              className={`h-full transition-all duration-500 ${
                risk_score > 70 ? 'bg-rose-500' : risk_score > 30 ? 'bg-amber-400' : 'bg-emerald-400'
              }`}
              style={{ width: `${risk_score}%` }}
            />
          </div>
        </div>
      </div>

      {/* Verification Checklist */}
      {checklist && (
        <div className="mt-4 font-sans">
          <h3 className="text-xs font-sans font-bold text-slate-300 uppercase tracking-wider mb-2.5">
            DETERMINISTIC VERIFICATION CHECKLIST
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
            {checklist.map((item, i) => (
              <div
                key={i}
                className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-sans text-slate-200 font-semibold truncate">
                    {item.name}
                  </span>
                  {item.status === 'PASS' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  )}
                </div>
                <p className="text-[10px] font-sans text-slate-400 truncate">
                  {item.details}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
