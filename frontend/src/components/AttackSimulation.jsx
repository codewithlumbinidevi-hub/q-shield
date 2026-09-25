import React, { useState } from 'react';
import { Skull, Sliders, Play, Check, X, AlertTriangle, Cpu, Layers } from 'lucide-react';

export default function AttackSimulation({ onRunAttack, attackResult, loading }) {
  const [selectedAttack, setSelectedAttack] = useState('normal');
  const [noiseLevel, setNoiseLevel] = useState(0.25);

  const attackVectors = [
    {
      id: 'normal',
      name: '1. Normal Transmission',
      badge: 'Baseline',
      desc: 'Valid QDS signature transmission over pristine channel (QBER ≈ 2%, Fidelity ≈ 98%+).'
    },
    {
      id: 'forgery',
      name: '2. Simulate Forgery',
      badge: 'Document Tampering',
      desc: 'Mutates text "Transfer ₹10,000" → "Transfer ₹10,00,000". Hash mismatch triggers FORGERY_ATTACK_DETECTED.'
    },
    {
      id: 'replay',
      name: '3. Simulate Replay',
      badge: 'State Reuse',
      desc: 'Resubmits previously accepted transaction ID (QDS-001). Replay cache blocks transaction reuse.'
    },
    {
      id: 'impersonation',
      name: '4. Simulate Impersonation',
      badge: 'Signer Hijack',
      desc: 'Unauthorized entity (Mallory) attempts signing using unapproved identity keys.'
    },
    {
      id: 'unauthorized-verification',
      name: '5. Simulate Unauthorized Verification',
      badge: 'Verifier Hijack',
      desc: 'Unauthorized node (Mallory) attempts to invoke signature verification protocol.'
    },
    {
      id: 'mitm',
      name: '6. Simulate MITM / Eavesdropping',
      badge: 'Quantum Phase/Bit Flip',
      desc: 'Eavesdropper (Eve) intercepts quantum channel. QBER spikes > 11% and Fidelity drops < 85%.'
    },
    {
      id: 'noise',
      name: '7. Simulate Channel Noise',
      badge: 'Decoherence Slider',
      desc: 'Simulates continuous environmental decoherence error on quantum channel.'
    }
  ];

  const handleExecute = () => {
    onRunAttack(selectedAttack, noiseLevel);
  };

  const renderComparisonCard = () => {
    if (!attackResult) {
      return (
        <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-6 text-center text-slate-500 font-mono text-xs">
          <Skull className="w-8 h-8 mx-auto mb-2 opacity-30 text-rose-400" />
          <p>Select an attack vector above and click "Execute Attack Simulation" to inspect the visual 5-step comparison.</p>
        </div>
      );
    }

    const {
      attack_type,
      simulated_attack_type,
      verdict = 'ACCEPT',
      verdict_message = '',
      risk_score = 0,
      attacker_action = 'Pristine transmission over quantum channel.',
      original_state = {},
      observed_state = {},
      detection_evidence = {},
      primary_evidence = 'All security checks passed.',
      secondary_evidence = '',
      explanation = 'Verification passed.'
    } = attackResult;

    const rawAttackType = attack_type || simulated_attack_type || attackResult.simulated_attack_type || 'normal';
    const displayAttackType = String(rawAttackType);
    const isAccept = verdict === 'ACCEPT';
    const isAlert = verdict === 'ALERT';

    return (
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-5 font-mono shadow-2xl">
        
        {/* Attack Analysis Banner Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-cyan-400 uppercase">
              ATTACK SIMULATION ANALYSIS: {displayAttackType.toUpperCase().replace(/_/g, ' ')}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 text-xs font-extrabold rounded font-mono ${
              isAccept ? 'bg-emerald-500 text-slate-950' : isAlert ? 'bg-amber-500 text-slate-950' : 'bg-rose-600 text-white'
            }`}>
              DECISION: {verdict}
            </span>
            <span className="text-xs text-slate-400">
              Risk Score: <strong className={isAccept ? 'text-emerald-400' : 'text-rose-400'}>{risk_score}/100</strong>
            </span>
          </div>
        </div>

        {/* 5-STEP VISUAL COMPARATIVE FLOW */}
        
        {/* STEP 1: ORIGINAL / EXPECTED vs ATTACKED / OBSERVED STATE */}
        <div>
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-cyan-400" />
            1. ORIGINAL / EXPECTED STATE vs ATTACKED / OBSERVED STATE
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Original Card */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3.5 space-y-2">
              <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 text-xs text-emerald-400 font-bold">
                <span>ORIGINAL / EXPECTED STATE</span>
                <Check className="w-4 h-4 text-emerald-400" />
              </div>

              <div className="space-y-1.5 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 block">DOCUMENT CONTENT:</span>
                  <span className="text-slate-200 bg-slate-950 p-1.5 rounded block text-[11px] border border-slate-800 break-words">
                    {original_state.document_text || "Digital Signature Authorization: Transfer ₹10,000 to Account A."}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-[10px] text-slate-500 block">SIGNER:</span>
                    <span className="text-cyan-400 font-bold">{original_state.signer || "Alice"} ✓</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">VERIFIER:</span>
                    <span className="text-cyan-400 font-bold">{original_state.verifier || "Bob"} ✓</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 block">SHA3-256 HASH:</span>
                  <span className="text-slate-400 font-mono text-[10px] truncate block">
                    {original_state.hash ? original_state.hash.substring(0, 24) + "..." : "8f2a91c4..."}
                  </span>
                </div>
              </div>
            </div>

            {/* Observed Card */}
            <div className={`border rounded-lg p-3.5 space-y-2 ${
              isAccept ? 'bg-slate-900/60 border-slate-800' : 'bg-rose-950/20 border-rose-600/50'
            }`}>
              <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 text-xs font-bold">
                <span className={isAccept ? 'text-emerald-400' : 'text-rose-400'}>
                  ATTACKED / OBSERVED STATE
                </span>
                {isAccept ? <Check className="w-4 h-4 text-emerald-400" /> : <X className="w-4 h-4 text-rose-400" />}
              </div>

              <div className="space-y-1.5 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 block">OBSERVED DOCUMENT:</span>
                  <span className={`p-1.5 rounded block text-[11px] border font-bold ${
                    displayAttackType.includes('forgery')
                      ? 'bg-rose-950/60 border-rose-500 text-rose-300'
                      : 'bg-slate-950 border-slate-800 text-slate-200'
                  }`}>
                    {observed_state.document_text || "Digital Signature Authorization: Transfer ₹10,000 to Account A."}
                    {displayAttackType.includes('forgery') && (
                      <span className="ml-2 text-[10px] text-rose-400 font-extrabold">⚠ MODIFIED VALUE</span>
                    )}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-[10px] text-slate-500 block">OBSERVED SIGNER:</span>
                    <span className={observed_state.signer === 'Alice' ? 'text-emerald-400 font-bold' : 'text-rose-400 font-extrabold'}>
                      {observed_state.signer || "Alice"} {observed_state.signer === 'Alice' ? '✓' : '✕ (FAIL)'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">OBSERVED VERIFIER:</span>
                    <span className={observed_state.verifier === 'Bob' ? 'text-emerald-400 font-bold' : 'text-rose-400 font-extrabold'}>
                      {observed_state.verifier || "Bob"} {observed_state.verifier === 'Bob' ? '✓' : '✕ (FAIL)'}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 block">OBSERVED HASH:</span>
                  <span className={`font-mono text-[10px] truncate block ${
                    detection_evidence.hash_match === false ? 'text-rose-400 font-bold' : 'text-slate-400'
                  }`}>
                    {observed_state.hash ? observed_state.hash.substring(0, 24) + "..." : "8f2a91c4..."}
                    {detection_evidence.hash_match === false && " ✕ HASH MISMATCH"}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* STEP 2: ATTACKER ACTION BANNER */}
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg flex items-center gap-3 text-xs">
          <div className="p-1.5 rounded bg-amber-500/10 text-amber-400 shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-bold">2. ATTACKER ACTION / PERTURBATION:</span>
            <span className="text-slate-200 font-bold">{attacker_action}</span>
          </div>
        </div>

        {/* STEP 3 & 4: DETECTION EVIDENCE & FAILED SECURITY CHECKS */}
        <div>
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-cyan-400" />
            3 & 4. DETECTION EVIDENCE & FAILED SECURITY CHECKS
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            
            {/* Check 1: Hash Integrity */}
            <div className={`p-3 rounded-lg border ${
              detection_evidence.hash_match !== false ? 'bg-slate-900/60 border-slate-800' : 'bg-rose-950/40 border-rose-600/60 text-rose-300'
            }`}>
              <div className="flex justify-between items-center text-[11px] mb-1 font-bold">
                <span>Hash Integrity</span>
                {detection_evidence.hash_match !== false ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <X className="w-3.5 h-3.5 text-rose-400" />}
              </div>
              <p className="text-[10px] text-slate-400">
                {detection_evidence.hash_match !== false ? "SHA3-256 Hash Match ✓" : "SHA3-256 Hash Mismatch ✕"}
              </p>
            </div>

            {/* Check 2: Signer / Verifier Identity */}
            <div className={`p-3 rounded-lg border ${
              (detection_evidence.signer_authorized !== false && detection_evidence.verifier_authorized !== false)
                ? 'bg-slate-900/60 border-slate-800'
                : 'bg-rose-950/40 border-rose-600/60 text-rose-300'
            }`}>
              <div className="flex justify-between items-center text-[11px] mb-1 font-bold">
                <span>Identity Authorization</span>
                {(detection_evidence.signer_authorized !== false && detection_evidence.verifier_authorized !== false)
                  ? <Check className="w-3.5 h-3.5 text-emerald-400" />
                  : <X className="w-3.5 h-3.5 text-rose-400" />}
              </div>
              <p className="text-[10px] text-slate-400">
                {(detection_evidence.signer_authorized !== false && detection_evidence.verifier_authorized !== false)
                  ? "Authorized Signer & Verifier ✓"
                  : "Unauthorized Identity ✕"}
              </p>
            </div>

            {/* Check 3: Replay Protection */}
            <div className={`p-3 rounded-lg border ${
              detection_evidence.replay_detected ? 'bg-rose-950/40 border-rose-600/60 text-rose-300' : 'bg-slate-900/60 border-slate-800'
            }`}>
              <div className="flex justify-between items-center text-[11px] mb-1 font-bold">
                <span>Replay Protection</span>
                {!detection_evidence.replay_detected ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <X className="w-3.5 h-3.5 text-rose-400" />}
              </div>
              <p className="text-[10px] text-slate-400">
                {!detection_evidence.replay_detected ? "Transaction Unconsumed ✓" : "Transaction ID Already Used ✕"}
              </p>
            </div>

            {/* Check 4: QBER & Quantum Channel */}
            <div className={`p-3 rounded-lg border ${
              detection_evidence.mitm_detected ? 'bg-rose-950/40 border-rose-600/60 text-rose-300' : 'bg-slate-900/60 border-slate-800'
            }`}>
              <div className="flex justify-between items-center text-[11px] mb-1 font-bold">
                <span>Quantum QBER / MITM</span>
                {!detection_evidence.mitm_detected ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <X className="w-3.5 h-3.5 text-rose-400" />}
              </div>
              <p className="text-[10px] text-slate-400">
                {!detection_evidence.mitm_detected
                  ? `QBER: ${((detection_evidence.qber || 0.02) * 100).toFixed(1)}% (Limit: 11%) ✓`
                  : `QBER: ${((detection_evidence.qber || 0.145) * 100).toFixed(1)}% > 11% Threshold ✕`}
              </p>
            </div>

          </div>
        </div>

        {/* STEP 5: SUMMARY CARD & EXPLANATION */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold border-b border-slate-800 pb-2">
            <span className="text-cyan-400">5. THREAT ANALYSIS & EXPLANATION</span>
            <span className={isAccept ? 'text-emerald-400' : 'text-rose-400'}>
              VERDICT: {verdict}
            </span>
          </div>

          <div className="space-y-1 text-xs">
            <p className="text-slate-300 font-bold">
              Primary Evidence: <span className="text-white font-normal">{primary_evidence}</span>
            </p>
            {secondary_evidence && (
              <p className="text-slate-400">
                Secondary Evidence: <span className="text-slate-300">{secondary_evidence}</span>
              </p>
            )}
            <p className="text-slate-300 pt-1 leading-relaxed bg-slate-950 p-2.5 rounded border border-slate-800">
              <strong className="text-cyan-400">Why Detected:</strong> {explanation}
            </p>
          </div>
        </div>

      </div>
    );
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 shadow-xl backdrop-blur-sm space-y-5">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Skull className="w-5 h-5 text-rose-400" />
          <h2 className="text-base font-semibold text-white font-mono uppercase tracking-wider">
            5. Cyber Attack Simulation & Visual Comparison Panel
          </h2>
        </div>
        <span className="text-xs font-mono text-slate-400">
          7 Live Attack Triggers
        </span>
      </div>

      {/* Grid of Attack Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {attackVectors.map((vector) => {
          const isSelected = selectedAttack === vector.id;
          return (
            <button
              key={vector.id}
              onClick={() => setSelectedAttack(vector.id)}
              className={`p-3 rounded-lg border text-left flex flex-col justify-between transition-all cursor-pointer font-mono ${
                isSelected
                  ? 'border-cyan-400 bg-cyan-500/10 ring-1 ring-cyan-400 shadow-lg'
                  : 'border-slate-800 bg-slate-950/60 hover:bg-slate-900'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-bold ${isSelected ? 'text-cyan-300' : 'text-white'}`}>
                    {vector.name}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                    {vector.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                  {vector.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Noise Slider controls if 'noise' is selected */}
      {selectedAttack === 'noise' && (
        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2 font-mono">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>QUANTUM CHANNEL NOISE LEVEL PARAMETER (p)</span>
            </span>
            <span className="text-cyan-400 font-bold">{(noiseLevel * 100).toFixed(0)}% Noise</span>
          </div>
          <input
            type="range"
            min="0.0"
            max="0.5"
            step="0.05"
            value={noiseLevel}
            onChange={(e) => setNoiseLevel(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>0% (Pristine Channel)</span>
            <span>11% (QBER Threshold)</span>
            <span>50% (Severe Noise)</span>
          </div>
        </div>
      )}

      {/* Trigger Button */}
      <div className="flex justify-between items-center pt-1">
        <span className="text-xs font-mono text-slate-400">
          Click button to run backend simulation & generate visual 5-step comparison:
        </span>
        <button
          onClick={handleExecute}
          disabled={loading}
          className="bg-gradient-to-r from-rose-500 to-amber-600 hover:from-rose-400 hover:to-amber-500 disabled:opacity-50 text-white font-bold py-2.5 px-6 rounded-lg flex items-center gap-2 shadow-lg glow-rose transition-all font-mono text-xs uppercase tracking-wider cursor-pointer"
        >
          {loading ? (
            <span>Executing Attack Simulation...</span>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Execute [{selectedAttack.toUpperCase().replace(/-/g, ' ')}] Attack Simulation</span>
            </>
          )}
        </button>
      </div>

      {/* ATTACK COMPARISON CARD RESULT */}
      {renderComparisonCard()}

    </div>
  );
}
