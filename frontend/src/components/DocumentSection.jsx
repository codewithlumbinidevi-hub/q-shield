import React, { useRef } from 'react';
import { FileText, Key, UserCheck, Shield, Sparkles, Hash, ArrowRight, Upload, X, CheckCircle2 } from 'lucide-react';

export default function DocumentSection({
  documentText,
  setDocumentText,
  uploadedFile,
  uploading,
  onFileUpload,
  onClearFile,
  signerId,
  setSignerId,
  verifierId,
  setVerifierId,
  currentHash,
  hashDetails,
  onGenerateSignature,
  loading
}) {
  const fileInputRef = useRef(null);
  const sampleDocument = "Digital Signature Authorization: Transfer ₹10,000 to Account A.";

  const handleQuickFill = () => {
    onClearFile();
    setDocumentText(sampleDocument);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 shadow-lg font-sans">
      
      {/* Section Title */}
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-cyan-400" />
          <h2 className="text-base font-bold text-white tracking-wide font-sans">
            1. Document Upload & Digital Signature Verification
          </h2>
        </div>
        <button
          onClick={handleQuickFill}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-sans text-cyan-300 transition-colors cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Use Demo Document</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Document Input & Upload (2 cols) */}
        <div className="lg:col-span-2 space-y-4 font-sans">
          
          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".txt,.pdf,.docx,.doc,.json,.csv"
            className="hidden"
          />

          {/* Upload Area / Active File Card */}
          {uploadedFile ? (
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-3.5 flex items-center justify-between font-sans">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{uploadedFile.filename}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1 font-bold">
                      <CheckCircle2 className="w-3 h-3" /> ✓ Uploaded
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Size: {(uploadedFile.size_bytes / 1024).toFixed(1)} KB &bull; Type: {uploadedFile.content_type}
                  </p>
                </div>
              </div>
              <button
                onClick={onClearFile}
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-900 rounded transition-colors cursor-pointer"
                title="Remove File"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
              className="border border-dashed border-slate-800 hover:border-cyan-500/50 bg-slate-950/60 rounded-lg p-4 text-center cursor-pointer transition-all space-y-1.5"
            >
              <Upload className="w-5 h-5 text-slate-400 mx-auto" />
              <div className="text-xs font-sans text-slate-200 font-medium">
                Drag & drop document here or <span className="text-cyan-400 font-semibold underline">Browse Files</span>
              </div>
              <p className="text-[11px] font-sans text-slate-500">
                Supports .txt, .pdf, .docx, .json, .csv files
              </p>
            </div>
          )}

          {/* Text Area for Document Payload / Text Preview */}
          <div className="space-y-1">
            <label className="block text-[11px] font-sans font-bold text-slate-400 uppercase tracking-wider">
              DOCUMENT PAYLOAD CONTENT / PREVIEW
            </label>
            <textarea
              rows={3}
              value={documentText}
              onChange={(e) => setDocumentText(e.target.value)}
              placeholder="Type document string or upload file above..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-100 font-sans focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all resize-none"
            />
          </div>

          {/* SHA3-256 Live Hash Output */}
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1 font-sans">
              <span className="flex items-center gap-1 text-cyan-400 font-semibold">
                <Hash className="w-3.5 h-3.5" /> REAL SHA3-256 DOCUMENT HASH
              </span>
              <span className="font-mono">{currentHash ? `${currentHash.length * 4} bits` : '0 bits'}</span>
            </div>
            <div className="text-xs text-emerald-400 font-mono break-all bg-slate-900/50 p-2 rounded border border-slate-800">
              {currentHash || 'Computing SHA3-256 hash from file bytes...'}
            </div>
          </div>
        </div>

        {/* Identity & Parameters (1 col) */}
        <div className="space-y-4 flex flex-col justify-between font-sans">
          
          {/* Identity Controls */}
          <div className="space-y-3 bg-slate-950 p-4 rounded-lg border border-slate-800">
            <div>
              <label className="block text-xs font-sans font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <Key className="w-3.5 h-3.5 text-cyan-400" /> SIGNER:
              </label>
              <select
                value={signerId}
                onChange={(e) => setSignerId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 font-sans outline-none focus:border-cyan-500"
              >
                <option value="Alice">Alice (Authorized Signer)</option>
                <option value="velcodex-primary">velcodex-primary (Authorized Primary Key)</option>
                <option value="Mallory">Mallory (Unauthorized Signer)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-sans font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" /> VERIFIER:
              </label>
              <select
                value={verifierId}
                onChange={(e) => setVerifierId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 font-sans outline-none focus:border-cyan-500"
              >
                <option value="Bob">Bob (Authorized Verifier)</option>
                <option value="velcodex-validator">velcodex-validator (Validator Node)</option>
                <option value="Mallory">Mallory (Unauthorized Verifier)</option>
              </select>
            </div>

            {/* Derived Quantum State Angles */}
            {hashDetails && (
              <div className="pt-2 border-t border-slate-800 text-xs font-mono grid grid-cols-2 gap-2 text-center">
                <div className="bg-slate-900 p-1.5 rounded border border-slate-800">
                  <span className="text-slate-400 text-[10px] block font-sans">THETA (θ)</span>
                  <span className="text-cyan-400 font-semibold">{hashDetails.theta} rad</span>
                </div>
                <div className="bg-slate-900 p-1.5 rounded border border-slate-800">
                  <span className="text-slate-400 text-[10px] block font-sans">PHI (φ)</span>
                  <span className="text-cyan-400 font-semibold">{hashDetails.phi} rad</span>
                </div>
              </div>
            )}
          </div>

          {/* Action Button */}
          <button
            onClick={onGenerateSignature}
            disabled={loading || uploading || !documentText}
            className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-slate-950 font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 shadow-md transition-all font-sans text-xs uppercase tracking-wider cursor-pointer"
          >
            {loading ? (
              <span>Executing Quantum Teleportation...</span>
            ) : (
              <>
                <Shield className="w-4 h-4" />
                <span>Generate QDS Signature</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

        </div>

      </div>

    </div>
  );
}
