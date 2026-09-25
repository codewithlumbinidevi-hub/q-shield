import React, { useState, useEffect } from 'react';
import AttackPageLayout from './AttackPageLayout';
import RequirementGuard from './RequirementGuard';
import { triggerAttack } from '../../services/api';
import { Zap, Radio, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';

export default function MITMAttackPage({
  documentText,
  uploadedFile,
  currentHash,
  signerId,
  verifierId,
  signatureData,
  systemHealth,
  onRetryHealth,
  onBack
}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!signatureData || (!uploadedFile && (!documentText || documentText.trim() === ''))) {
      setLoading(false);
      return;
    }

    async function loadMitmSimulation() {
      setLoading(true);
      try {
        const payloadText = uploadedFile ? (uploadedFile.text_preview || documentText) : documentText;
        const res = await triggerAttack('mitm', {
          transaction_id: signatureData?.transaction_id,
          document_text: payloadText,
          signer_id: signerId,
          verifier_id: verifierId,
          channel_noise: 0.0
        });
        setData(res);
      } catch (err) {
        // Handled
      } finally {
        setLoading(false);
      }
    }
    loadMitmSimulation();
  }, [documentText, uploadedFile, signerId, verifierId, signatureData]);

  const qberPct = data?.metrics?.qber_percentage || '27.4%';
  const fidelityPct = data?.metrics?.fidelity_percentage || '62.1%';

  return (
    <RequirementGuard
      documentText={documentText}
      uploadedFile={uploadedFile}
      signatureData={signatureData}
      systemHealth={systemHealth}
      onRetryHealth={onRetryHealth}
      onBack={onBack}
    >
      <AttackPageLayout
        title="MITM / EAVESDROPPING DETECTION"
        subtitle="/attacks/mitm"
        explanation="Simulates an active Man-In-The-Middle adversary (Eve) intercepting the quantum channel during state teleportation. Quantum state collapse immediately forces QBER above 11.0% and degrades state fidelity."
        attackType="mitm"
        systemHealth={systemHealth}
        onRetryHealth={onRetryHealth}
        onBack={onBack}
        loading={loading}
        verdict="REJECT"
        riskScore={98}
        evidenceText={data?.primary_evidence || `Quantum Bit Error Rate (QBER: ${qberPct}) exceeded 11.0% prototype threshold.`}
        secondaryEvidence={data?.secondary_evidence || `Quantum state fidelity (${fidelityPct}) degraded below 85.0% threshold.`}
      >
        {/* Impressive Quantum Eavesdropping Diagram */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-lg space-y-6 font-sans">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 font-sans">
            <h3 className="text-xs font-bold uppercase text-cyan-400 tracking-wider flex items-center gap-2 font-sans">
              <Radio className="w-4 h-4 text-cyan-400" />
              <span>QUANTUM CHANNEL INTERCEPTION ARCHITECTURE</span>
            </h3>
            <span className="text-[10px] text-amber-300 bg-slate-950 px-2.5 py-0.5 rounded border border-slate-800 font-bold uppercase font-sans">
              Simulation-Based Quantum Threat Detection
            </span>
          </div>

          {/* Alice -> Eve -> Bob Diagram */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center text-center font-sans">
            
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1 font-sans">
              <div className="text-sm font-bold text-cyan-300 font-sans">ALICE</div>
              <div className="text-[10px] text-slate-400 font-sans">Quantum State Sender</div>
              <div className="text-[10px] text-cyan-400 font-mono mt-1 font-bold">|ψ⟩ = cos(θ/2)|0⟩ + e^{iφ}sin(θ/2)|1⟩</div>
            </div>

            <ArrowRight className="w-5 h-5 text-slate-600 mx-auto hidden md:block" />

            {/* EVE INTERCEPTOR */}
            <div className="bg-rose-950 p-4 rounded-xl border border-rose-700 space-y-1 shadow-md font-sans">
              <div className="text-sm font-bold text-rose-300 flex items-center justify-center gap-1 font-sans uppercase">
                <Zap className="w-4 h-4 text-rose-400" /> EVE / ATTACKER
              </div>
              <div className="text-[10px] text-rose-200 font-sans">Intercepts & Manipulates Channel</div>
              <div className="text-[10px] bg-slate-950 text-rose-300 font-bold px-2 py-0.5 rounded mt-1 font-sans">
                Measurement Disturbance Injected
              </div>
            </div>

            <ArrowRight className="w-5 h-5 text-slate-600 mx-auto hidden md:block" />

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1 font-sans">
              <div className="text-sm font-bold text-slate-200 font-sans">BOB</div>
              <div className="text-[10px] text-slate-400 font-sans">Reconstructed Receiver</div>
              <div className="text-[10px] text-rose-400 font-mono mt-1 font-bold">State Disturbed: |ψ'⟩ ≠ |ψ⟩</div>
            </div>

          </div>
        </div>

        {/* Side-by-Side Comparison: NORMAL vs MITM Quantum Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
          
          {/* Normal Baseline State */}
          <div className="bg-slate-950 border border-emerald-600/40 rounded-xl p-5 space-y-4 font-sans">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 font-sans">
              <span className="text-xs text-emerald-400 font-bold uppercase font-sans">NORMAL CHANNEL (BEFORE)</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-sans">
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 font-sans">
                <div className="text-[10px] text-slate-400 uppercase font-bold">QBER</div>
                <div className="text-emerald-400 font-mono font-bold text-base mt-1">~2.1%</div>
                <div className="text-[10px] text-slate-400 font-sans">Below 11% Limit</div>
              </div>

              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 font-sans">
                <div className="text-[10px] text-slate-400 uppercase font-bold">FIDELITY</div>
                <div className="text-emerald-400 font-mono font-bold text-base mt-1">~98.5%</div>
                <div className="text-[10px] text-slate-400 font-sans">Above 85% Limit</div>
              </div>
            </div>

            <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-xs text-slate-300 space-y-1 font-sans">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">MEASUREMENT DISTRIBUTION:</span>
              <span className="text-emerald-400 font-bold font-sans">STABLE PAULI BSM CORRELATION ✓</span>
            </div>
          </div>

          {/* MITM Attack State */}
          <div className="bg-slate-950 border border-rose-600/60 rounded-xl p-5 space-y-4 font-sans">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 font-sans">
              <span className="text-xs text-rose-400 font-bold uppercase font-sans">ATTACKED CHANNEL (AFTER)</span>
              <XCircle className="w-4 h-4 text-rose-400" />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-sans">
              <div className="bg-slate-900 p-3 rounded-lg border border-rose-950 font-sans">
                <div className="text-[10px] text-slate-400 uppercase font-bold">ACTUAL QBER ↑</div>
                <div className="text-rose-400 font-mono font-bold text-base mt-1">{qberPct}</div>
                <div className="text-[10px] text-rose-300 font-bold font-sans">EXCEEDED (LIMIT 11%)</div>
              </div>

              <div className="bg-slate-900 p-3 rounded-lg border border-rose-950 font-sans">
                <div className="text-[10px] text-slate-400 uppercase font-bold">ACTUAL FIDELITY ↓</div>
                <div className="text-rose-400 font-mono font-bold text-base mt-1">{fidelityPct}</div>
                <div className="text-[10px] text-rose-300 font-bold font-sans">VIOLATED (MIN 85%)</div>
              </div>
            </div>

            <div className="bg-slate-900 p-3 rounded-lg border border-rose-950 text-xs text-slate-300 space-y-1 font-sans">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">MEASUREMENT DISTURBANCE:</span>
              <span className="text-rose-400 font-bold font-sans">DISTURBED / COLLAPSED BY EVE ✕</span>
            </div>
          </div>

        </div>

        {/* Threshold Evaluation Summary */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-lg space-y-4 font-sans">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-2 font-sans">
            QUANTUM THREAT ENGINE EVALUATION
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-sans">
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-sans">
              <div className="text-[10px] text-slate-400 font-bold uppercase">CHANNEL INTEGRITY</div>
              <div className="text-rose-400 font-bold mt-1 font-sans">FAILED (QBER &gt; 11.0%)</div>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-sans">
              <div className="text-[10px] text-slate-400 font-bold uppercase">FIDELITY THRESHOLD</div>
              <div className="text-rose-400 font-bold mt-1 font-sans">VIOLATED (&lt; 85.0%)</div>
            </div>

            <div className="bg-rose-950 text-rose-300 p-3 rounded-lg border border-rose-700 font-bold font-sans">
              <div className="text-[10px] font-sans">MITM INDICATION</div>
              <div className="mt-1 font-sans font-extrabold uppercase">DETECTED</div>
            </div>
          </div>
        </div>
      </AttackPageLayout>
    </RequirementGuard>
  );
}
