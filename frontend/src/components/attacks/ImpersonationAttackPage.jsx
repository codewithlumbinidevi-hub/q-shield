import React, { useState, useEffect } from 'react';
import AttackPageLayout from './AttackPageLayout';
import RequirementGuard from './RequirementGuard';
import { triggerAttack } from '../../services/api';
import { UserX, UserCheck, XCircle, Key } from 'lucide-react';

export default function ImpersonationAttackPage({
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

    async function loadImpersonationSimulation() {
      setLoading(true);
      try {
        const payloadText = uploadedFile ? (uploadedFile.text_preview || documentText) : documentText;
        const res = await triggerAttack('impersonation', {
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
    loadImpersonationSimulation();
  }, [documentText, uploadedFile, signerId, verifierId, signatureData]);

  const observedSigner = data?.observed_state?.signer || 'Mallory';

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
        title="IMPERSONATION DETECTION"
        subtitle="/attacks/impersonation"
        explanation="Demonstrates identity fraud where an unauthorized entity (Mallory) attempts to sign a quantum digital signature payload pretending to be an authorized signer (Alice)."
        attackType="impersonation"
        systemHealth={systemHealth}
        onRetryHealth={onRetryHealth}
        onBack={onBack}
        loading={loading}
        verdict="REJECT"
        riskScore={95}
        evidenceText={data?.primary_evidence || `Signer identity mismatch ('${observedSigner}' is not in authorized signers list).`}
        secondaryEvidence={data?.secondary_evidence || "Identity authorization check failed."}
      >
        {/* Visual Identity Mismatch Flow */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-lg space-y-6 font-sans">
          <h3 className="text-xs font-bold uppercase text-cyan-400 tracking-wider flex items-center gap-2 font-sans">
            <UserX className="w-4 h-4" />
            <span>SIGNER IDENTITY VERIFICATION COMPARISON</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
            
            {/* Expected Authorized Signer */}
            <div className="bg-slate-950 p-5 rounded-xl border border-emerald-600/40 space-y-3 font-sans">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider font-sans">
                  EXPECTED AUTHORIZED SIGNER
                </span>
                <UserCheck className="w-5 h-5 text-emerald-400" />
              </div>

              <div className="text-lg font-bold text-emerald-300 font-sans">
                {signerId || 'Alice'}
              </div>

              <div className="space-y-1 text-xs text-slate-300 font-sans">
                <div className="flex justify-between">
                  <span className="text-slate-400">AUTHORIZATION:</span>
                  <span className="text-emerald-400 font-bold">APPROVED ✓</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">KEY PAIR:</span>
                  <span className="text-slate-300 font-mono">QDS-KEY-ALICE</span>
                </div>
              </div>
            </div>

            {/* Attacker Impersonator */}
            <div className="bg-slate-950 p-5 rounded-xl border border-rose-600/60 space-y-3 font-sans">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-[10px] text-rose-400 font-bold uppercase tracking-wider font-sans">
                  OBSERVED SIGNER IN PAYLOAD
                </span>
                <UserX className="w-5 h-5 text-rose-400" />
              </div>

              <div className="text-lg font-bold text-rose-400 flex items-center justify-between font-sans">
                <span>{observedSigner}</span>
                <span className="text-[10px] bg-rose-950 text-rose-300 border border-rose-700 px-2 py-0.5 rounded font-bold uppercase font-sans">
                  UNAUTHORIZED
                </span>
              </div>

              <div className="space-y-1 text-xs text-slate-300 font-sans">
                <div className="flex justify-between">
                  <span className="text-slate-400">IDENTITY MATCH:</span>
                  <span className="text-rose-400 font-bold flex items-center gap-1 font-sans">
                    <XCircle className="w-3.5 h-3.5" /> FAILED
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">AUTHORIZATION:</span>
                  <span className="text-rose-400 font-bold font-sans">DENIED ✕</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Identity Security Rules Grid */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-lg space-y-4 font-sans">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center gap-2 font-sans">
            <Key className="w-4 h-4 text-cyan-400" />
            <span>CRYPTOGRAPHIC IDENTITY DISAGREEMENT SUMMARY</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-sans">
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-sans">
              <div className="text-[10px] text-slate-400 font-bold uppercase">IDENTITY MATCH</div>
              <div className="text-rose-400 font-bold mt-1 font-sans">FAILED ({signerId || 'ALICE'} != MALLORY)</div>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-sans">
              <div className="text-[10px] text-slate-400 font-bold uppercase">SIGNER AUTHORIZATION</div>
              <div className="text-rose-400 font-bold mt-1 font-sans">REJECTED BY RULE ENGINE</div>
            </div>

            <div className="bg-rose-950 text-rose-300 p-3 rounded-lg border border-rose-700 font-bold font-sans">
              <div className="text-[10px] font-sans">FINAL THREAT DIAGNOSIS</div>
              <div className="mt-1 font-sans font-extrabold uppercase">IMPERSONATION DETECTED</div>
            </div>
          </div>
        </div>
      </AttackPageLayout>
    </RequirementGuard>
  );
}
