import React from 'react';
import { ShieldAlert, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Q-SHIELD UI ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-rose-950/40 border border-rose-600/60 rounded-xl p-6 shadow-2xl font-mono space-y-4 max-w-7xl mx-auto my-6">
          <div className="flex items-center gap-3 text-rose-400 border-b border-rose-900/50 pb-3">
            <ShieldAlert className="w-7 h-7 shrink-0" />
            <div>
              <h2 className="text-base font-bold uppercase tracking-wider text-white">
                UI RENDERING EXCEPTION CAUGHT (SAFEGUARD ACTIVE)
              </h2>
              <p className="text-xs text-rose-300">
                A component rendering error occurred. The application was prevented from displaying a blank screen.
              </p>
            </div>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 text-xs text-rose-300">
            <span className="text-[10px] text-slate-500 block font-bold mb-1">ERROR DETAILS:</span>
            <code>{this.state.error?.toString() || "Unknown rendering exception"}</code>
          </div>

          <div className="flex justify-end pt-1">
            <button
              onClick={this.handleReset}
              className="bg-rose-600 hover:bg-rose-500 text-white font-bold py-2 px-5 rounded-lg flex items-center gap-2 text-xs transition-colors cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>RETRY & RECOVER</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
