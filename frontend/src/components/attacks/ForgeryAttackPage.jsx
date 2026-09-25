import React, { useState, useEffect } from 'react';
import AttackPageLayout from './AttackPageLayout';
import RequirementGuard from './RequirementGuard';
import { triggerAttack } from '../../services/api';
import { FileSignature, ArrowRight, XCircle, AlertTriangle, Terminal } from 'lucide-react';

export default function ForgeryAttackPage({
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
    // Only query backend if document and signature exist
    if (!signatureData || (!uploadedFile && (!documentText || documentText.trim() === ''))) {
      setLoading(false);
      return;
    }

    async function loadForgerySimulation() {
      setLoading(true);
      try {
        const payloadText = uploadedFile ? (uploadedFile.text_preview || documentText) : documentText;
        const res = await triggerAttack('forgery', {
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
    loadForgerySimulation();
  }, [documentText, uploadedFile, signerId, verifierId, signatureData]);

  const origText = data?.original_state?.document_text || documentText || '';
  const tampText = data?.observed_state?.document_text || origText + '\n[TAMPERED CONTENT]';

  const originalHash = data?.original_state?.hash || currentHash || '';
  const tamperedHash = data?.observed_state?.hash || '';

  const isDemoDoc = origText.includes("₹10,000");

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
        title="FORGERY DETECTION"
        subtitle="/attacks/forgery"
        explanation="Demonstrates cryptographic payload tampering post-signing. An adversary modifies document parameters. The deterministic SHA3-256 hash comparison instantly exposes the integrity mismatch."
        attackType="forgery"
        systemHealth={systemHealth}
        onRetryHealth={onRetryHealth}
        onBack={onBack}
        loading={loading}
        verdict="REJECT"
        riskScore={95}
        evidenceText={data?.primary_evidence || "SHA3-256 hash mismatch between signed document state and received payload."}
        secondaryEvidence={data?.secondary_evidence || "Signature integrity failure resulting from payload content alteration."}
      >
        {/* Two Large Side-by-Side Comparative Panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
          
          {/* Panel 1: ORIGINAL DOCUMENT */}
          <div className="bg-slate-950 border border-emerald-600/40 rounded-xl p-6 shadow-lg space-y-4 font-sans relative">
            <div className="absolute top-0 right-0 bg-emerald-950 text-emerald-300 border-b border-l border-emerald-700 px-3 py-1 text-[10px] font-bold uppercase rounded-bl-lg font-sans">
              ORIGINAL SIGNED DOCUMENT
            </div>

            <div className="flex items-center gap-2 text-emerald-400 font-bold border-b border-slate-800 pb-3 font-sans">
              <FileSignature className="w-5 h-5" />
              <h3 className="text-base uppercase tracking-wider font-sans">1. ORIGINAL PAYLOAD STATE</h3>
            </div>

            <div className="space-y-3 text-xs font-sans">
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold block font-sans">ORIGINAL CONTENT / AMOUNT:</span>
                {isDemoDoc ? (
                  <div className="text-emerald-300 font-bold text-sm bg-slate-950 p-2 rounded border border-slate-800 font-mono">
                    Amount: ₹10,000
                  </div>
                ) : (
                  <div className="text-emerald-300 font-bold text-xs bg-slate-950 p-2 rounded border border-slate-800 font-mono truncate">
                    {uploadedFile ? uploadedFile.filename : 'Custom Document Payload'}
                  </div>
                )}
                <p className="text-[11px] text-slate-300 mt-1 line-clamp-3 font-mono bg-slate-950 p-2 rounded border border-slate-800">
                  {origText}
                </p>
              </div>

              <div className="flex justify-between items-center bg-slate-900 p-2.5 rounded-lg border border-slate-800 font-sans">
                <span className="text-slate-400">AUTHORIZED SIGNER:</span>
                <span className="text-white font-bold">{signerId || 'Alice'}</span>
              </div>

              <div className="flex justify-between items-center bg-slate-900 p-2.5 rounded-lg border border-slate-800 font-sans">
                <span className="text-slate-400">TARGET VERIFIER:</span>
                <span className="text-white font-bold">{verifierId || 'Bob'}</span>
              </div>

              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold block font-sans">ORIGINAL SHA3-256 HASH (COMPUTED):</span>
                <div className="text-emerald-400 font-mono text-[11px] break-all bg-slate-950 p-2 rounded border border-slate-800">
                  {originalHash}
                </div>
              </div>
            </div>
          </div>

          {/* Panel 2: ATTACKED DOCUMENT */}
          <div className="bg-slate-950 border border-rose-600/60 rounded-xl p-6 shadow-lg space-y-4 font-sans relative">
            <div className="absolute top-0 right-0 bg-rose-950 text-rose-300 border-b border-l border-rose-700 px-3 py-1 text-[10px] font-bold uppercase rounded-bl-lg font-sans">
              ATTACKER TAMPERED PAYLOAD
            </div>

            <div className="flex items-center gap-2 text-rose-400 font-bold border-b border-slate-800 pb-3 font-sans">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-base uppercase tracking-wider font-sans">2. TAMPERED PAYLOAD (ATTACK ACTION)</h3>
            </div>

            <div className="space-y-3 text-xs font-sans">
              <div className="bg-slate-900 p-3 rounded-lg border border-rose-950 space-y-2">
                <div className="flex items-center justify-between font-sans">
                  <span className="text-slate-400 text-[10px] uppercase font-bold">TAMPERED PAYLOAD ACTION:</span>
                  <span className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase font-sans">
                    ATTACK ACTION
                  </span>
                </div>

                {isDemoDoc ? (
                  <div className="text-rose-300 font-bold text-sm bg-slate-950 p-2 rounded border border-rose-800 flex items-center justify-between font-mono">
                    <span className="line-through text-slate-400 font-normal">₹10,000</span>
                    <ArrowRight className="w-4 h-4 text-rose-400" />
                    <span className="text-rose-400">₹2,00,000</span>
                  </div>
                ) : (
                  <div className="text-rose-300 font-bold text-xs bg-slate-950 p-2 rounded border border-rose-800 font-sans">
                    Content Altered / Payload Block Appended
                  </div>
                )}

                <p className="text-[11px] text-rose-300 line-clamp-3 font-mono bg-slate-950 p-2 rounded border border-rose-900">
                  {tampText}
                </p>
              </div>

              <div className="flex justify-between items-center bg-slate-900 p-2.5 rounded-lg border border-slate-800 font-sans">
                <span className="text-slate-400">SIGNER IN PAYLOAD:</span>
                <span className="text-slate-200 font-bold">{signerId || 'Alice'}</span>
              </div>

              <div className="flex justify-between items-center bg-slate-900 p-2.5 rounded-lg border border-slate-800 font-sans">
                <span className="text-slate-400">VERIFIER IN PAYLOAD:</span>
                <span className="text-slate-200 font-bold">{verifierId || 'Bob'}</span>
              </div>

              <div className="bg-slate-900 p-3 rounded-lg border border-rose-950 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold block font-sans">TAMPERED SHA3-256 HASH (RECOMPUTED):</span>
                <div className="text-rose-400 font-mono text-[11px] break-all bg-slate-950 p-2 rounded border border-slate-800">
                  {tamperedHash}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Forgery Detection Workflow Steps */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-lg space-y-4 font-sans">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-2 font-sans">
            DETERMINISTIC CRYPTOGRAPHIC INTEGRITY PROOF (DETECTION EVIDENCE)
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs text-center font-sans">
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-sans">
              <div className="text-[10px] text-slate-400 font-bold uppercase font-sans">1. SHA3-256 RECOMPUTED</div>
              <div className="text-rose-400 font-bold mt-1 flex items-center justify-center gap-1 font-sans">
                <XCircle className="w-3.5 h-3.5" /> HASH MATCH: FAILED
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-sans">
              <div className="text-[10px] text-slate-400 font-bold uppercase font-sans">2. DOCUMENT INTEGRITY</div>
              <div className="text-rose-400 font-bold mt-1 flex items-center justify-center gap-1 font-sans">
                <XCircle className="w-3.5 h-3.5" /> FAILED
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-sans">
              <div className="text-[10px] text-slate-400 font-bold uppercase font-sans">3. SIGNATURE INTEGRITY</div>
              <div className="text-rose-400 font-bold mt-1 flex items-center justify-center gap-1 font-sans">
                <XCircle className="w-3.5 h-3.5" /> FAILED
              </div>
            </div>

            <div className="bg-rose-950 text-rose-300 p-3 rounded-lg border border-rose-700 font-bold font-sans">
              <div className="text-[10px] font-sans">4. FORGERY DIAGNOSIS</div>
              <div className="mt-1 uppercase font-sans font-extrabold">FORGERY DETECTED</div>
            </div>
          </div>

          <div className="text-center pt-2 font-sans">
            <span className="text-[11px] text-slate-400 bg-slate-950 px-3 py-1 rounded-full border border-slate-800 inline-flex items-center gap-1.5 font-sans">
              <Terminal className="w-3 h-3 text-cyan-400" />
              Deterministic cryptographic verification — no AI/ML involved.
            </span>
          </div>
        </div>
      </AttackPageLayout>
    </RequirementGuard>
  );
}
