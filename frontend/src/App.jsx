import React, { useState, useEffect } from 'react';
import {
  fetchHealth,
  uploadDocument,
  hashDocument,
  signDocument,
  verifySignature
} from './services/api';

import { useRouter } from './components/Router';
import { formatPauliCorrection } from './utils/formatters';
import ErrorBoundary from './components/ErrorBoundary';
import Header from './components/Header';
import DocumentSection from './components/DocumentSection';
import QDSResultCard from './components/QDSResultCard';
import SecurityContext from './components/SecurityContext';
import TeleportationPipeline from './components/TeleportationPipeline';
import QuantumCircuitView from './components/QuantumCircuitView';
import VerificationStatus from './components/VerificationStatus';
import ThreatEngine from './components/ThreatEngine';
import MeasurementAnalysis from './components/MeasurementAnalysis';
import AttackCenter from './components/AttackCenter';
import LiveSecurityLog from './components/LiveSecurityLog';

// Dedicated Attack Pages
import NormalAttackPage from './components/attacks/NormalAttackPage';
import ForgeryAttackPage from './components/attacks/ForgeryAttackPage';
import ReplayAttackPage from './components/attacks/ReplayAttackPage';
import ImpersonationAttackPage from './components/attacks/ImpersonationAttackPage';
import UnauthorizedVerificationPage from './components/attacks/UnauthorizedVerificationPage';
import MITMAttackPage from './components/attacks/MITMAttackPage';
import NoiseAttackPage from './components/attacks/NoiseAttackPage';

import { ShieldAlert, RefreshCw } from 'lucide-react';

export default function App() {
  const { currentPath, navigate } = useRouter();

  // Initial State: Empty string (No default demo document on load!)
  const [documentText, setDocumentText] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [signerId, setSignerId] = useState("Alice");
  const [verifierId, setVerifierId] = useState("Bob");

  const [currentHash, setCurrentHash] = useState("");
  const [hashDetails, setHashDetails] = useState(null);
  const [signatureData, setSignatureData] = useState(null);
  const [verificationData, setVerificationData] = useState(null);

  const [systemHealth, setSystemHealth] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [logs, setLogs] = useState([]);

  const addLog = (level, message) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [{ timestamp, level, message }, ...prev]);
  };

  const checkHealth = async () => {
    setApiError(null);
    try {
      const health = await fetchHealth();
      const isOk = health.status === 'ok' || health.status === 'healthy';
      setSystemHealth(isOk);
      if (isOk) {
        addLog("SUCCESS", `Connected to FastAPI Backend Engine v${health.version || '1.0.0'} (Qiskit Aer Simulator).`);
      } else {
        addLog("WARN", "Backend reported unhealthy status.");
      }
    } catch (err) {
      console.error("Health check failed:", err);
      setSystemHealth(false);
      addLog("CRITICAL", `Backend unavailable. Please ensure Uvicorn server is running on http://127.0.0.1:8001 (${err.message || 'Connection refused'})`);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  // Compute text hash when text changes and no file is uploaded
  useEffect(() => {
    if (uploadedFile) return;
    if (!documentText) {
      setCurrentHash("");
      setHashDetails(null);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await hashDocument(documentText);
        setCurrentHash(res.hash);
        setHashDetails(res);
      } catch (err) {
        // Fallback silently
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [documentText, uploadedFile]);

  // Handler: Real File Upload
  const handleFileUpload = async (file) => {
    setUploading(true);
    setApiError(null);
    addLog("INFO", `Uploading real document file '${file.name}' (${(file.size / 1024).toFixed(1)} KB) to FastAPI backend...`);

    try {
      const res = await uploadDocument(file);
      setUploadedFile(res);
      setDocumentText(res.text_preview || `Document Payload: ${file.name}`);
      setCurrentHash(res.sha3_256);
      setHashDetails({
        hash: res.sha3_256,
        theta: res.theta,
        phi: res.phi,
        byte_size: res.size_bytes
      });
      addLog("SUCCESS", `Uploaded '${file.name}' successfully! SHA3-256 Hash calculated from raw file bytes: ${res.sha3_256.substring(0, 16)}...`);
    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.message || "Failed to upload file.";
      setApiError({ title: "DOCUMENT UPLOAD FAILED", reason: errorMsg, status: err.response?.status || 500 });
      addLog("CRITICAL", `Document upload failed: ${errorMsg}`);
    } finally {
      setUploading(false);
    }
  };

  const handleClearFile = () => {
    setUploadedFile(null);
    setDocumentText("");
    setSignatureData(null);
    setVerificationData(null);
    setApiError(null);
    addLog("INFO", "Cleared document.");
  };

  // Handler: Generate QDS Signature
  const handleGenerateSignature = async () => {
    setLoading(true);
    setApiError(null);
    addLog("INFO", `Initiating Quantum Digital Signing & Teleportation Protocol...`);
    
    try {
      const payloadText = uploadedFile ? (uploadedFile.text_preview || documentText) : documentText;
      const signRes = await signDocument({
        document_text: payloadText,
        signer_id: signerId,
        verifier_id: verifierId
      });

      setSignatureData(signRes);
      addLog("SUCCESS", `QDS Signature Generated (ID: ${signRes.signature_id || signRes.transaction_id}). Pauli Gate: ${formatPauliCorrection(signRes.pauli_correction)}`);

      // Auto-run baseline verification after signature generation
      await handleVerifySignature(signRes.transaction_id, payloadText);

    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.message || "Failed to generate QDS signature.";
      setApiError({ title: "QDS GENERATION FAILED", reason: errorMsg, status: err.response?.status || 500 });
      addLog("CRITICAL", `QDS Generation Failed: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  // Handler: Verify QDS Signature
  const handleVerifySignature = async (txId, payloadText) => {
    const targetTxId = txId || signatureData?.transaction_id || "QDS-001";
    const targetPayload = payloadText || (uploadedFile ? (uploadedFile.text_preview || documentText) : documentText);

    setLoading(true);
    setApiError(null);
    addLog("INFO", `Executing Bob's projective measurements in X, Y, Z bases across 1024 shots...`);

    try {
      const verifyRes = await verifySignature({
        transaction_id: targetTxId,
        document_text: targetPayload,
        signer_id: signerId,
        verifier_id: verifierId,
        mitm_attack: false,
        channel_noise: 0.0
      });

      setVerificationData(verifyRes);
      
      const level = verifyRes.verdict === 'ACCEPT' ? 'SUCCESS' : verifyRes.verdict === 'ALERT' ? 'WARN' : 'CRITICAL';
      addLog(level, `Verification Verdict: [${verifyRes.verdict}] - ${verifyRes.verdict_message}`);

    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.message || "Failed to verify QDS signature.";
      setApiError({ title: "QDS VERIFICATION FAILED", reason: errorMsg, status: err.response?.status || 500 });
      addLog("CRITICAL", `QDS Verification Failed: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  // Route Dispatcher
  const renderRoute = () => {
    const cleanPath = currentPath.toLowerCase();

    if (cleanPath === '/attacks/normal') {
      return (
        <NormalAttackPage
          documentText={documentText}
          uploadedFile={uploadedFile}
          currentHash={currentHash}
          signerId={signerId}
          verifierId={verifierId}
          signatureData={signatureData}
          systemHealth={systemHealth}
          onRetryHealth={checkHealth}
          onBack={() => navigate('/')}
        />
      );
    }

    if (cleanPath === '/attacks/forgery') {
      return (
        <ForgeryAttackPage
          documentText={documentText}
          uploadedFile={uploadedFile}
          currentHash={currentHash}
          signerId={signerId}
          verifierId={verifierId}
          signatureData={signatureData}
          systemHealth={systemHealth}
          onRetryHealth={checkHealth}
          onBack={() => navigate('/')}
        />
      );
    }

    if (cleanPath === '/attacks/replay') {
      return (
        <ReplayAttackPage
          documentText={documentText}
          uploadedFile={uploadedFile}
          currentHash={currentHash}
          signerId={signerId}
          verifierId={verifierId}
          signatureData={signatureData}
          systemHealth={systemHealth}
          onRetryHealth={checkHealth}
          onBack={() => navigate('/')}
        />
      );
    }

    if (cleanPath === '/attacks/impersonation') {
      return (
        <ImpersonationAttackPage
          documentText={documentText}
          uploadedFile={uploadedFile}
          currentHash={currentHash}
          signerId={signerId}
          verifierId={verifierId}
          signatureData={signatureData}
          systemHealth={systemHealth}
          onRetryHealth={checkHealth}
          onBack={() => navigate('/')}
        />
      );
    }

    if (cleanPath === '/attacks/unauthorized-verification' || cleanPath === '/attacks/unauthorized') {
      return (
        <UnauthorizedVerificationPage
          documentText={documentText}
          uploadedFile={uploadedFile}
          currentHash={currentHash}
          signerId={signerId}
          verifierId={verifierId}
          signatureData={signatureData}
          systemHealth={systemHealth}
          onRetryHealth={checkHealth}
          onBack={() => navigate('/')}
        />
      );
    }

    if (cleanPath === '/attacks/mitm') {
      return (
        <MITMAttackPage
          documentText={documentText}
          uploadedFile={uploadedFile}
          currentHash={currentHash}
          signerId={signerId}
          verifierId={verifierId}
          signatureData={signatureData}
          systemHealth={systemHealth}
          onRetryHealth={checkHealth}
          onBack={() => navigate('/')}
        />
      );
    }

    if (cleanPath === '/attacks/noise') {
      return (
        <NoiseAttackPage
          documentText={documentText}
          uploadedFile={uploadedFile}
          currentHash={currentHash}
          signerId={signerId}
          verifierId={verifierId}
          signatureData={signatureData}
          systemHealth={systemHealth}
          onRetryHealth={checkHealth}
          onBack={() => navigate('/')}
        />
      );
    }

    // Default Route: Main Dashboard
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
        
        {/* Top Navigation & Brand Header */}
        <Header systemHealth={systemHealth} onRetryHealth={checkHealth} />

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          
          {/* Section 1: Document Upload & Signer Selector */}
          <DocumentSection
            documentText={documentText}
            setDocumentText={setDocumentText}
            uploadedFile={uploadedFile}
            uploading={uploading}
            onFileUpload={handleFileUpload}
            onClearFile={handleClearFile}
            signerId={signerId}
            setSignerId={setSignerId}
            verifierId={verifierId}
            setVerifierId={setVerifierId}
            currentHash={currentHash}
            hashDetails={hashDetails}
            onGenerateSignature={handleGenerateSignature}
            loading={loading}
          />

          {/* Visible Error Banner */}
          {apiError && (
            <div className="bg-rose-950/60 border border-rose-600/80 rounded-xl p-4 shadow-xl font-mono text-xs text-rose-300 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white uppercase">{apiError.title}</h4>
                  <p className="mt-0.5 text-slate-200">Reason: {apiError.reason}</p>
                  <span className="text-[10px] text-rose-400 font-bold block mt-1">API HTTP Status: {apiError.status}</span>
                </div>
              </div>
              <button
                onClick={handleGenerateSignature}
                className="bg-rose-600 hover:bg-rose-500 text-white font-bold py-1.5 px-3 rounded flex items-center gap-1 text-[11px] shrink-0 cursor-pointer transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>RETRY</span>
              </button>
            </div>
          )}

          {/* QDS Signature Result Display Card */}
          <QDSResultCard
            signatureData={signatureData}
            onVerifySignature={() => handleVerifySignature()}
            loading={loading}
          />

          {/* Security Context: Classical vs Quantum Threat */}
          <SecurityContext />

          {/* Section 2: Visual Quantum Teleportation Pipeline */}
          <TeleportationPipeline signatureData={signatureData} />

          {/* Section 3: Dynamic Qiskit Circuit ASCII Viewer */}
          <QuantumCircuitView
            circuitData={verificationData?.circuit}
            asciiCircuit={signatureData?.circuit_ascii}
          />

          {/* Section 4: Big Security Verdict & Checklist Card */}
          <VerificationStatus verificationData={verificationData} loading={loading} />

          {/* Section 5 & 6 Grid: Threat Engine & Pauli Measurement Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ThreatEngine verificationData={verificationData} />
            <MeasurementAnalysis measurementData={verificationData?.measurements} />
          </div>

          {/* Section 7: ATTACK CENTER (SOC Cyber Threat Detection Cards Hub) */}
          <AttackCenter
            onNavigate={navigate}
            signatureData={signatureData}
            verificationData={verificationData}
          />

          {/* Section 8: Live Security Logs Terminal */}
          <LiveSecurityLog logs={logs} onClearLogs={() => setLogs([])} />

        </main>

        {/* Footer */}
        <footer className="border-t border-slate-900 bg-slate-950 py-4 text-center text-xs font-mono text-slate-500">
          Q-SHIELD &bull; Quantum Digital Signature Security &bull; Team VELCODEX &bull; Powered by Qiskit Aer & FastAPI
        </footer>

      </div>
    );
  };

  return (
    <ErrorBoundary>
      {renderRoute()}
    </ErrorBoundary>
  );
}
