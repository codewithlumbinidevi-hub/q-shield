import React, { useState, useEffect } from 'react';
import AttackPageLayout from './AttackPageLayout';
import RequirementGuard from './RequirementGuard';
import { triggerAttack } from '../../services/api';
import { RotateCcw, CheckCircle2, XCircle } from 'lucide-react';

export default function ReplayAttackPage({
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

    async function loadReplaySimulation() {
      setLoading(true);
      try {
        const payloadText = uploadedFile ? (uploadedFile.text_preview || documentText) : documentText;
        const res = await triggerAttack('replay', {
          transaction_id: signatureData?.transaction_id || 'QDS-001',
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
    loadReplaySimulation();
  }, [documentText, uploadedFile, signerId, verifierId, signatureData]);

  const txId = signatureData?.transaction_id || data?.original_state?.transaction_id || 'QDS-001';

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
        title="REPLAY DETECTION"
        subtitle="/attacks/replay"
        explanation="Demonstrates interception and unauthorized re-transmission of a previously verified quantum digital signature payload. The Q-SHIELD state registry detects state reuse and blocks the transaction."
        attackType="replay"
        systemHealth={systemHealth}
        onRetryHealth={onRetryHealth}
        onBack={onBack}
        loading={loading}
        verdict="REJECT"
        riskScore={90}
        evidenceText={data?.primary_evidence || `Transaction ID ${txId} already present in in-memory consumed state registry.`}
        secondaryEvidence={data?.secondary_evidence || "Quantum state non-reuse protection triggered."}
      >
        {/* Workflow Graphic: First vs Replayed Transmission */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-lg space-y-6 font-sans">
          <h3 className="text-xs font-bold uppercase text-cyan-400 tracking-wider flex items-center gap-2 font-sans">
            <RotateCcw className="w-4 h-4" />
            <span>REPLAY ATTACK TIMELINE COMPARISON</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
            
            {/* Step 1: First Transaction */}
            <div className="bg-slate-950 p-4 rounded-xl border border-emerald-600/40 space-y-3 font-sans">
              <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider bg-emerald-950 px-2 py-0.5 rounded border border-emerald-700/60 inline-block font-sans">
                STEP 1: INITIAL TRANSMISSION (VALID)
              </div>
              
              <div className="flex items-center justify-between text-xs pt-2 font-sans">
                <span className="text-slate-400">TRANSACTION ID:</span>
                <span className="text-cyan-300 font-mono font-bold">{txId}</span>
              </div>

              <div className="flex items-center justify-between text-xs font-sans">
                <span className="text-slate-400">SIGNER & VERIFIER:</span>
                <span className="text-slate-200">{signerId || 'Alice'} → {verifierId || 'Bob'}</span>
              </div>

              <div className="bg-emerald-950/60 border border-emerald-700/60 p-2.5 rounded text-xs text-emerald-300 flex items-center justify-between font-bold font-sans">
                <span>VERIFICATION STATUS:</span>
                <span className="flex items-center gap-1 font-sans">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ACCEPTED ✓
                </span>
              </div>
            </div>

            {/* Step 2: Attacker Replays Transaction */}
            <div className="bg-slate-950 p-4 rounded-xl border border-rose-600/60 space-y-3 font-sans">
              <div className="text-[10px] text-rose-400 font-bold uppercase tracking-wider bg-rose-950 px-2 py-0.5 rounded border border-rose-700/60 inline-block font-sans">
                STEP 2: SECOND VERIFICATION REQUEST (ATTACKER)
              </div>

              <div className="flex items-center justify-between text-xs pt-2 font-sans">
                <span className="text-slate-400">ATTACK ACTION:</span>
                <span className="text-rose-400 font-bold flex items-center gap-1 font-sans">
                  <RotateCcw className="w-3.5 h-3.5" /> REUSES SAME STATE ({txId})
                </span>
              </div>

              <div className="flex items-center justify-between text-xs font-sans">
                <span className="text-slate-400">STATE REGISTRY CHECK:</span>
                <span className="text-rose-400 font-bold font-sans">STATE ALREADY CONSUMED</span>
              </div>

              <div className="bg-rose-950/60 border border-rose-700/60 p-2.5 rounded text-xs text-rose-300 flex items-center justify-between font-bold font-sans">
                <span>VERIFICATION STATUS:</span>
                <span className="flex items-center gap-1 font-sans">
                  <XCircle className="w-4 h-4 text-rose-400" />
                  REPLAY DETECTED ✕
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* State Registry Diagnosis Details */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-lg space-y-4 font-sans">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-2 font-sans">
            IN-MEMORY TRANSACTION STATE REGISTRY
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-sans">
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-sans">
              <div className="text-[10px] text-slate-400 font-bold uppercase">TRANSACTION ID</div>
              <div className="text-cyan-300 font-mono font-bold mt-1">{txId}</div>
              <div className="text-[10px] text-slate-400 font-sans mt-0.5">First Verification: ACCEPTED ✓</div>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-sans">
              <div className="text-[10px] text-slate-400 font-bold uppercase">CURRENT ATTEMPT</div>
              <div className="text-rose-400 font-bold mt-1 font-sans">ATTEMPT #2 (REUSED)</div>
              <div className="text-[10px] text-slate-400 font-sans mt-0.5">Replay Count: 2</div>
            </div>

            <div className="bg-rose-950 text-rose-300 p-3 rounded-lg border border-rose-700 font-bold font-sans">
              <div className="text-[10px] font-sans">STATE REUSE DIAGNOSIS</div>
              <div className="mt-1 flex items-center gap-1 font-sans font-extrabold uppercase">
                <XCircle className="w-3.5 h-3.5 text-rose-400" /> REPLAY DETECTED
              </div>
            </div>
          </div>
        </div>
      </AttackPageLayout>
    </RequirementGuard>
  );
}
