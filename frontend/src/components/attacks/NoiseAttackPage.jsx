import React, { useState, useEffect } from 'react';
import AttackPageLayout from './AttackPageLayout';
import RequirementGuard from './RequirementGuard';
import { triggerAttack } from '../../services/api';
import { Sliders, RefreshCw } from 'lucide-react';

export default function NoiseAttackPage({
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
  const [noiseLevel, setNoiseLevel] = useState(0.18); // 18% default
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Debounced API call when slider changes
  useEffect(() => {
    if (!signatureData || (!uploadedFile && (!documentText || documentText.trim() === ''))) {
      setLoading(false);
      return;
    }

    let isSubscribed = true;
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const payloadText = uploadedFile ? (uploadedFile.text_preview || documentText) : documentText;
        const res = await triggerAttack('noise', {
          transaction_id: signatureData?.transaction_id,
          document_text: payloadText,
          signer_id: signerId,
          verifier_id: verifierId,
          channel_noise: noiseLevel
        });
        if (isSubscribed) {
          setData(res);
        }
      } catch (err) {
        // Handled
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    }, 250);

    return () => {
      isSubscribed = false;
      clearTimeout(timer);
    };
  }, [noiseLevel, documentText, uploadedFile, signerId, verifierId, signatureData]);

  const verdict = data?.verdict || (noiseLevel <= 0.10 ? 'ACCEPT' : noiseLevel <= 0.15 ? 'ALERT' : 'REJECT');
  const riskScore = data?.risk_score ?? Math.round(noiseLevel * 200);

  const qberVal = data?.metrics?.qber ?? (noiseLevel * 0.7);
  const qberPct = data?.metrics?.qber_percentage || `${(qberVal * 100).toFixed(1)}%`;
  const fidelityVal = data?.metrics?.fidelity ?? (1.0 - noiseLevel * 0.6);
  const fidelityPct = data?.metrics?.fidelity_percentage || `${(fidelityVal * 100).toFixed(1)}%`;

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
        title="CHANNEL NOISE DETECTION"
        subtitle="/attacks/noise"
        explanation="Interactively adjust environmental quantum channel noise rates. Tests how Q-SHIELD deterministically transitions between ACCEPT, ALERT, and REJECT based on QBER and Fidelity threshold boundaries."
        attackType="noise"
        systemHealth={systemHealth}
        onRetryHealth={onRetryHealth}
        onBack={onBack}
        loading={loading}
        verdict={verdict}
        riskScore={riskScore}
        evidenceText={data?.primary_evidence || `Measurement deviation observed across Pauli X, Y, Z bases (QBER: ${qberPct}).`}
        secondaryEvidence={data?.secondary_evidence || `State fidelity: ${fidelityPct}.`}
      >
        {/* Interactive Noise Control Slider Panel */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-lg space-y-6 font-sans">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 font-sans">
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-bold uppercase text-white tracking-wider font-sans">
                INTERACTIVE NOISE & DECOHERENCE SLIDER
              </h3>
            </div>

            <div className="flex items-center gap-3 font-sans">
              <span className="text-xs text-slate-400 font-bold uppercase">NOISE LEVEL:</span>
              <span className="text-lg font-black text-amber-400 bg-slate-950 px-3 py-1 rounded border border-slate-800 font-mono">
                {(noiseLevel * 100).toFixed(0)}%
              </span>
              {loading && <RefreshCw className="w-4 h-4 text-cyan-400 animate-spin" />}
            </div>
          </div>

          {/* Range Slider Controls */}
          <div className="space-y-4 font-sans">
            <div className="flex justify-between text-xs text-slate-400 font-bold">
              <span className="text-emerald-400">LOW NOISE (0% - 10%)</span>
              <span className="text-amber-400">MEDIUM NOISE (11% - 15%)</span>
              <span className="text-rose-400">HIGH NOISE (&gt; 15%)</span>
            </div>

            <input
              type="range"
              min="0.00"
              max="0.45"
              step="0.01"
              value={noiseLevel}
              onChange={(e) => setNoiseLevel(parseFloat(e.target.value))}
              className="w-full h-3 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-amber-500 border border-slate-800"
            />

            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>0% (Ideal Channel)</span>
              <span>11% (QBER Limit)</span>
              <span>25% (High Noise)</span>
              <span>45% (Thermal Collapse)</span>
            </div>
          </div>
        </div>

        {/* Dynamic QBER & Fidelity Gauge Cards with Visual Threshold Lines */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
          
          {/* QBER Gauge */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3 font-sans">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2 font-sans">
              <span className="text-xs text-slate-300 font-bold uppercase font-sans">QUANTUM BIT ERROR RATE (QBER)</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded font-sans ${
                qberVal <= 0.11 ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300 border border-rose-800'
              }`}>
                {qberVal <= 0.11 ? 'WITHIN LIMIT' : 'EXCEEDED'}
              </span>
            </div>

            <div className="text-2xl font-black text-white font-mono">
              {qberPct}
            </div>

            {/* QBER Visual Threshold Bar */}
            <div className="space-y-1 font-sans">
              <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden border border-slate-800 relative">
                <div
                  className={`h-full transition-all duration-300 ${
                    qberVal <= 0.11 ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${Math.min(100, (qberVal / 0.35) * 100)}%` }}
                />
                <div className="absolute top-0 bottom-0 left-[31.4%] w-0.5 bg-cyan-400 z-10" />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>0%</span>
                <span className="text-cyan-400 font-bold font-sans">11.0% Threshold</span>
                <span>35%</span>
              </div>
            </div>
          </div>

          {/* Fidelity Gauge */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3 font-sans">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2 font-sans">
              <span className="text-xs text-slate-300 font-bold uppercase font-sans">QUANTUM STATE FIDELITY (F)</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded font-sans ${
                fidelityVal >= 0.85 ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300 border border-rose-800'
              }`}>
                {fidelityVal >= 0.85 ? 'SAFE' : 'DEGRADED'}
              </span>
            </div>

            <div className="text-2xl font-black text-white font-mono">
              {fidelityPct}
            </div>

            {/* Fidelity Visual Threshold Bar */}
            <div className="space-y-1 font-sans">
              <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden border border-slate-800 relative">
                <div
                  className={`h-full transition-all duration-300 ${
                    fidelityVal >= 0.85 ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${Math.min(100, fidelityVal * 100)}%` }}
                />
                <div className="absolute top-0 bottom-0 left-[85%] w-0.5 bg-cyan-400 z-10" />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>0%</span>
                <span className="text-cyan-400 font-bold font-sans">85.0% Minimum</span>
                <span>100%</span>
              </div>
            </div>
          </div>

        </div>

        {/* Noise Level Dynamic State Matrix */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-lg space-y-4 font-sans">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-2 font-sans">
            NOISE LEVEL RESPONSE MATRIX
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-sans">
            <div className={`p-3 rounded-lg border ${noiseLevel <= 0.10 ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
              <div className="font-bold">LOW NOISE (0% - 10%)</div>
              <div className="mt-1 font-mono text-[11px]">QBER ≤ 11.0% | Fidelity ≥ 85%</div>
              <div className="font-bold mt-1 text-emerald-400">STATUS: ACCEPT</div>
            </div>

            <div className={`p-3 rounded-lg border ${noiseLevel > 0.10 && noiseLevel <= 0.15 ? 'bg-amber-950/60 border-amber-500 text-amber-300 font-bold' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
              <div className="font-bold">MEDIUM NOISE (11% - 15%)</div>
              <div className="mt-1 font-mono text-[11px]">QBER Borderline | Fidelity ~85%</div>
              <div className="font-bold mt-1 text-amber-400">STATUS: ALERT</div>
            </div>

            <div className={`p-3 rounded-lg border ${noiseLevel > 0.15 ? 'bg-rose-950/60 border-rose-500 text-rose-300 font-bold' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
              <div className="font-bold">HIGH NOISE (&gt; 15%)</div>
              <div className="mt-1 font-mono text-[11px]">QBER &gt; 11.0% | Fidelity &lt; 85%</div>
              <div className="font-bold mt-1 text-rose-400">STATUS: REJECT</div>
            </div>
          </div>
        </div>
      </AttackPageLayout>
    </RequirementGuard>
  );
}
