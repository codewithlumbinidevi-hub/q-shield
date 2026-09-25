import React, { useState } from 'react';
import { Terminal, Trash2 } from 'lucide-react';

export default function LiveSecurityLog({ logs, onClearLogs }) {
  const [filter, setFilter] = useState('ALL');

  const filteredLogs = logs.filter((log) => {
    if (filter === 'ALL') return true;
    return log.level === filter;
  });

  const levelStyles = {
    INFO: "text-slate-300 border-slate-800 bg-slate-950",
    SUCCESS: "text-emerald-400 border-emerald-950 bg-slate-950",
    WARN: "text-amber-400 border-amber-950 bg-slate-950",
    CRITICAL: "text-rose-400 border-rose-950 bg-slate-950"
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 shadow-lg space-y-3 font-sans">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 font-sans">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-cyan-400" />
          <h2 className="text-base font-bold text-white tracking-wide font-sans">
            6. Live Security Audit Trail & Event Log
          </h2>
        </div>

        <div className="flex items-center gap-3 font-sans">
          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 font-sans text-xs">
            {['ALL', 'INFO', 'WARN', 'CRITICAL'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setFilter(lvl)}
                className={`px-2.5 py-0.5 rounded text-[11px] font-bold transition-colors cursor-pointer ${
                  filter === lvl ? 'bg-cyan-600 text-slate-950 font-sans font-extrabold' : 'text-slate-400 hover:text-white font-sans'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* Clear Logs Button */}
          <button
            onClick={onClearLogs}
            className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-sans text-slate-300 rounded-lg transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Terminal Viewport */}
      <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-xs h-56 overflow-y-auto space-y-1.5 shadow-inner">
        {filteredLogs.length === 0 ? (
          <div className="text-slate-500 text-center py-10 font-sans text-xs">No security audit logs recorded.</div>
        ) : (
          filteredLogs.map((log, idx) => (
            <div
              key={idx}
              className={`p-2 rounded border flex items-start gap-2.5 text-[11px] leading-relaxed transition-all ${
                levelStyles[log.level] || levelStyles.INFO
              }`}
            >
              <span className="text-slate-500 shrink-0 font-mono">[{log.timestamp}]</span>
              <span className="font-bold px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800 text-[10px] uppercase shrink-0 font-sans">
                {log.level}
              </span>
              <span className="break-all font-mono">{log.message}</span>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
