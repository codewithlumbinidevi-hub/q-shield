import React from 'react';
import Header from '../Header';
import { FileText, ShieldAlert, ArrowLeft, Upload, Key } from 'lucide-react';

export default function RequirementGuard({
  documentText,
  uploadedFile,
  signatureData,
  systemHealth,
  onRetryHealth,
  onBack,
  children
}) {
  const hasDocument = Boolean(uploadedFile || (documentText && documentText.trim().length > 0));
  const hasSignature = Boolean(signatureData);

  // If no document loaded at all
  if (!hasDocument) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
        <Header systemHealth={systemHealth} onRetryHealth={onRetryHealth} />

        {/* Top Breadcrumb Bar */}
        <div className="border-b border-slate-800 bg-slate-900/60 backdrop-blur sticky top-0 z-20 px-4 sm:px-6 lg:px-8 py-3 font-sans">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-sans text-xs font-bold bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer shadow-sm group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>← BACK TO DASHBOARD</span>
            </button>
          </div>
        </div>

        {/* Main Empty State Panel */}
        <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-16 flex items-center justify-center font-sans">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-8 shadow-2xl text-center space-y-6 w-full">
            <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center mx-auto text-amber-400">
              <FileText className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-950/80 border border-amber-800/80 px-3 py-1 rounded-full">
                PREREQUISITE MISSING
              </span>
              <h2 className="text-2xl font-extrabold text-white tracking-tight font-sans pt-2">
                DOCUMENT REQUIRED
              </h2>
              <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                No document has been uploaded for threat analysis. Please upload a document and generate a QDS signature before running an attack simulation.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 font-sans">
              <button
                onClick={onBack}
                className="w-full sm:w-auto bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold py-2.5 px-6 rounded-lg flex items-center justify-center gap-2 shadow-md transition-all text-xs uppercase tracking-wider cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>UPLOAD DOCUMENT</span>
              </button>

              <button
                onClick={onBack}
                className="w-full sm:w-auto bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 font-bold py-2.5 px-6 rounded-lg flex items-center justify-center gap-2 transition-all text-xs uppercase tracking-wider cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>BACK TO DASHBOARD</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // If document exists, but QDS signature has not been generated yet
  if (!hasSignature) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
        <Header systemHealth={systemHealth} onRetryHealth={onRetryHealth} />

        {/* Top Breadcrumb Bar */}
        <div className="border-b border-slate-800 bg-slate-900/60 backdrop-blur sticky top-0 z-20 px-4 sm:px-6 lg:px-8 py-3 font-sans">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-sans text-xs font-bold bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer shadow-sm group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>← BACK TO DASHBOARD</span>
            </button>
          </div>
        </div>

        {/* Main Empty State Panel */}
        <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-16 flex items-center justify-center font-sans">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-8 shadow-2xl text-center space-y-6 w-full">
            <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center mx-auto text-cyan-400">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 bg-cyan-950/80 border border-cyan-800/80 px-3 py-1 rounded-full">
                QDS SIGNATURE REQUIRED
              </span>
              <h2 className="text-2xl font-extrabold text-white tracking-tight font-sans pt-2">
                QDS SIGNATURE REQUIRED
              </h2>
              <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                Generate a QDS signature before running threat simulations.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 font-sans">
              <button
                onClick={onBack}
                className="w-full sm:w-auto bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold py-2.5 px-6 rounded-lg flex items-center justify-center gap-2 shadow-md transition-all text-xs uppercase tracking-wider cursor-pointer"
              >
                <Key className="w-4 h-4" />
                <span>GENERATE QDS SIGNATURE</span>
              </button>

              <button
                onClick={onBack}
                className="w-full sm:w-auto bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 font-bold py-2.5 px-6 rounded-lg flex items-center justify-center gap-2 transition-all text-xs uppercase tracking-wider cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>BACK TO DASHBOARD</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // All prerequisites satisfied -> Render actual attack simulation page
  return children;
}
