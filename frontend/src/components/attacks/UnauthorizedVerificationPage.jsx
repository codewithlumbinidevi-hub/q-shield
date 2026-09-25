import React, { useState, useEffect } from 'react';
import AttackPageLayout from './AttackPageLayout';
import RequirementGuard from './RequirementGuard';
import { triggerAttack } from '../../services/api';
import { Lock, XCircle, CheckCircle2, AlertOctagon, HelpCircle } from 'lucide-react';

export default function UnauthorizedVerificationPage({
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

    async function loadUnauthorizedSimulation() {
      setLoading(true);
      try {
        const payloadText = uploadedFile ? (uploadedFile.text_preview || documentText) : documentText;
        const res = await triggerAttack('unauthorized-verification', {
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
    loadUnauthorizedSimulation();
  }, [documentText, uploadedFile, signerId, verifierId, signatureData]);

  const observedVerifier = data?.observed_state?.verifier || 'Mallory';

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
        title="UNAUTHORIZED VERIFICATION DETECTION"
        subtitle="/attacks/unauthorized-verification"
        explanation="Demonstrates protocol misuse where an untrusted entity (Mallory) attempts to trigger verification on a quantum digital signature intended strictly for an authorized verifier (Bob)."
        attackType="unauthorized-verification"
        systemHealth={systemHealth}
        onRetryHealth={onRetryHealth}
        onBack={onBack}
        loading={loading}
        verdict="REJECT"
        riskScore={90}
        evidenceText={data?.primary_evidence || `Verifier authorization failure ('${observedVerifier}' is not in authorized verifiers list).`}
        secondaryEvidence={data?.secondary_evidence || "Unauthorized verification attempt blocked."}
      >
        {/* Visual Distinction Banner: Impersonation vs Unauthorized Verification */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs font-sans text-slate-300 flex items-start gap-3">
          <HelpCircle className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <div className="font-sans">
            <h4 className="font-bold text-white uppercase font-sans">ATTACK VECTOR DISTINCTION:</h4>
            <p className="mt-0.5 leading-relaxed font-sans">
              <strong>Impersonation Attack:</strong> Fraudulent <em>signer</em> identity (Mallory claiming to be Alice).<br />
              <strong>Unauthorized Verification:</strong> Fraudulent <em>verifier</em> node (Mallory trying to consume/verify Bob's quantum signature).
            </p>
          </div>
        </div>

        {/* Visual Verifier Mismatch Flow */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-lg space-y-6 font-sans">
          <h3 className="text-xs font-bold uppercase text-cyan-400 tracking-wider flex items-center gap-2 font-sans">
            <Lock className="w-4 h-4" />
            <span>VERIFIER NODE AUTHORIZATION COMPARISON</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
            
            {/* Expected Authorized Verifier */}
            <div className="bg-slate-950 p-5 rounded-xl border border-emerald-600/40 space-y-3 font-sans">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider font-sans">
                  EXPECTED AUTHORIZED VERIFIER
                </span>
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>

              <div className="text-lg font-bold text-emerald-300 font-sans">
                {verifierId || 'Bob'}
              </div>

              <div className="space-y-1 text-xs text-slate-300 font-sans">
                <div className="flex justify-between">
                  <span className="text-slate-400">VERIFIER NODE ROLE:</span>
                  <span className="text-emerald-400 font-bold">AUTHORIZED RECIPIENT ✓</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">QUANTUM CHANNEL KEYS:</span>
                  <span className="text-slate-300 font-mono">BOB-QUANTUM-NODE</span>
                </div>
              </div>
            </div>

            {/* Requesting Verifier Node */}
            <div className="bg-slate-950 p-5 rounded-xl border border-rose-600/60 space-y-3 font-sans">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-[10px] text-rose-400 font-bold uppercase tracking-wider font-sans">
                  REQUESTING VERIFIER NODE
                </span>
                <AlertOctagon className="w-5 h-5 text-rose-400" />
              </div>

              <div className="text-lg font-bold text-rose-400 flex items-center justify-between font-sans">
                <span>{observedVerifier}</span>
                <span className="text-[10px] bg-rose-950 text-rose-300 border border-rose-700 px-2 py-0.5 rounded font-bold uppercase font-sans">
                  UNAUTHORIZED
                </span>
              </div>

              <div className="space-y-1 text-xs text-slate-300 font-sans">
                <div className="flex justify-between">
                  <span className="text-slate-400">VERIFIER AUTHORIZATION:</span>
                  <span className="text-rose-400 font-bold flex items-center gap-1 font-sans">
                    <XCircle className="w-3.5 h-3.5" /> FAILED
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">PROTOCOL EXECUTION:</span>
                  <span className="text-rose-400 font-bold font-sans">BLOCKED ✕</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Verification Authorization Rules */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-lg space-y-4 font-sans">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-2 font-sans">
            VERIFIER SECURITY RULE EVALUATION
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-sans">
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-sans">
              <div className="text-[10px] text-slate-400 font-bold uppercase">EXPECTED RECIPIENT</div>
              <div className="text-emerald-400 font-bold mt-1 font-sans">{verifierId || 'Bob'}</div>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-sans">
              <div className="text-[10px] text-slate-400 font-bold uppercase">REQUESTING RECIPIENT</div>
              <div className="text-rose-400 font-bold mt-1 font-sans">{observedVerifier}</div>
            </div>

            <div className="bg-rose-950 text-rose-300 p-3 rounded-lg border border-rose-700 font-bold font-sans">
              <div className="text-[10px] font-sans">DECISION</div>
              <div className="mt-1 font-sans font-extrabold uppercase">UNAUTHORIZED VERIFICATION DETECTED</div>
            </div>
          </div>
        </div>
      </AttackPageLayout>
    </RequirementGuard>
  );
}
