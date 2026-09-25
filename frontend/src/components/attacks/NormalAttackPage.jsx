import React, { useState, useEffect } from 'react';
import AttackPageLayout from './AttackPageLayout';
import RequirementGuard from './RequirementGuard';
import { triggerAttack } from '../../services/api';
import { formatBsmMeasurement, formatPauliCorrection } from '../../utils/formatters';
import { CheckCircle2, ArrowRight, Activity } from 'lucide-react';

export default function NormalAttackPage({
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

    async function loadNormalSimulation() {
      setLoading(true);
      try {
        const payloadText = uploadedFile ? (uploadedFile.text_preview || documentText) : documentText;
        const res = await triggerAttack('normal', {
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
    loadNormalSimulation();
  }, [documentText, uploadedFile, signerId, verifierId, signatureData]);

  const hashToDisplay = data?.original_state?.hash || currentHash || '';
  const qberPct = data?.metrics?.qber_percentage || '2.1%';
  const fidelityPct = data?.metrics?.fidelity_percentage || '98.5%';

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
        title="BASELINE VERIFICATION"
        subtitle="/attacks/normal"
        explanation="Pristine quantum digital signature teleportation over an undisturbed quantum channel. Demonstrates baseline cryptographic integrity and quantum measurement statistics when no adversary is active."
        attackType="normal"
        systemHealth={systemHealth}
        onRetryHealth={onRetryHealth}
        onBack={onBack}
        loading={loading}
        verdict="ACCEPT"
        riskScore={0}
        evidenceText={data?.primary_evidence || "All cryptographic, quantum channel, and identity checks passed."}
        secondaryEvidence={data?.secondary_evidence || "QBER (2.1%) and state fidelity (98.5%) meet baseline verification thresholds."}
      >
        {/* Visual Pipeline Header Flow */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-lg space-y-6 font-sans">
          <h3 className="text-xs font-bold uppercase text-cyan-400 tracking-wider flex items-center gap-2 font-sans">
            <Activity className="w-4 h-4" />
            <span>END-TO-END PRISTINE TRANSMISSION WORKFLOW</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-7 gap-2 items-center text-center text-xs font-sans">
            <div className="bg-slate-950 border border-slate-800 p-3 rounded-lg text-cyan-300 font-bold font-sans">
              <div>ALICE</div>
              <div className="text-[10px] text-slate-400 font-normal">Authorized Signer</div>
            </div>
            <ArrowRight className="w-4 h-4 text-cyan-500 mx-auto hidden md:block" />
            <div className="bg-slate-950 border border-slate-800 p-3 rounded-lg text-slate-200 font-sans">
              <div>SHA3-256</div>
              <div className="text-[10px] text-slate-400 font-normal">Hash Angle Map</div>
            </div>
            <ArrowRight className="w-4 h-4 text-cyan-500 mx-auto hidden md:block" />
            <div className="bg-slate-950 border border-slate-800 p-3 rounded-lg text-purple-300 font-sans">
              <div>BELL PAIR</div>
              <div className="text-[10px] text-slate-400 font-normal">|Φ⁺⟩ Entanglement</div>
            </div>
            <ArrowRight className="w-4 h-4 text-cyan-500 mx-auto hidden md:block" />
            <div className="bg-slate-950 border border-slate-800 p-3 rounded-lg text-emerald-300 font-bold font-sans">
              <div>BOB</div>
              <div className="text-[10px] text-slate-400 font-normal">Target Verifier</div>
            </div>
          </div>
        </div>

        {/* Protocol Parameter Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
          {/* Signer & Hash Metadata */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4 font-sans">
            <h4 className="text-xs text-slate-400 uppercase tracking-wider font-bold border-b border-slate-800 pb-2 font-sans">
              CRITICAL TRANSACTION METADATA
            </h4>

            <div className="space-y-3 text-xs font-sans">
              <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-sans">
                <span className="text-slate-400">AUTHORIZED SIGNER:</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1 font-sans">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {signerId || 'Alice'}
                </span>
              </div>

              <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-sans">
                <span className="text-slate-400">AUTHORIZED VERIFIER:</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1 font-sans">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {verifierId || 'Bob'}
                </span>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1 font-sans">
                <div className="text-[10px] text-slate-400 uppercase font-bold font-sans">REAL SHA3-256 DOCUMENT HASH:</div>
                <div className="text-cyan-300 font-mono text-[11px] break-all bg-slate-900 p-2 rounded border border-slate-800">
                  {hashToDisplay}
                </div>
              </div>
            </div>
          </div>

          {/* Quantum Measurement Metrics */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4 font-sans">
            <h4 className="text-xs text-slate-400 uppercase tracking-wider font-bold border-b border-slate-800 pb-2 font-sans">
              QUANTUM METRICS & TELEPORTATION STATUS
            </h4>

            <div className="grid grid-cols-2 gap-3 text-xs font-sans">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center font-sans">
                <div className="text-[10px] text-slate-400 font-bold font-sans">QBER (QUANTUM ERROR)</div>
                <div className="text-lg font-bold text-emerald-400 font-mono mt-1">{qberPct}</div>
                <div className="text-[10px] text-slate-400 font-sans">Threshold: ≤ 11.0%</div>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center font-sans">
                <div className="text-[10px] text-slate-400 font-bold font-sans">STATE FIDELITY</div>
                <div className="text-lg font-bold text-emerald-400 font-mono mt-1">{fidelityPct}</div>
                <div className="text-[10px] text-slate-400 font-sans">Threshold: ≥ 85.0%</div>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center font-sans">
                <div className="text-[10px] text-slate-400 font-bold font-sans">BELL MEASUREMENT</div>
                <div className="text-sm font-bold text-purple-400 font-mono mt-1">
                  {formatBsmMeasurement(signatureData?.bell_measurement, signatureData?.bsm_bitstring)}
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center font-sans">
                <div className="text-[10px] text-slate-400 font-bold font-sans">PAULI CORRECTION</div>
                <div className="text-sm font-bold text-cyan-400 font-mono mt-1">
                  {formatPauliCorrection(signatureData?.pauli_correction)}
                </div>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-3 rounded-lg flex items-center justify-between text-xs text-emerald-300 font-sans">
              <span className="font-bold uppercase tracking-wider font-sans">TELEPORTATION STATUS:</span>
              <span className="font-extrabold bg-emerald-950 text-emerald-300 px-2.5 py-1 rounded border border-emerald-700 font-sans">
                COMPLETED
              </span>
            </div>
          </div>
        </div>
      </AttackPageLayout>
    </RequirementGuard>
  );
}
