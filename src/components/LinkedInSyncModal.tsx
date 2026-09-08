import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Linkedin, RefreshCw, CheckCircle2, Loader2, Users, AlertCircle } from 'lucide-react';

export const LinkedInSyncModal: React.FC = () => {
  const { isLinkedInSyncOpen, setIsLinkedInSyncOpen, syncLinkedInConnections, isLinkedInConnected } = useApp();
  const [status, setStatus] = useState<'idle' | 'fetching' | 'syncing' | 'done' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ imported: number; total: number } | null>(null);
  const [error, setError] = useState('');

  if (!isLinkedInSyncOpen) return null;

  const handleSync = async () => {
    setStatus('fetching');
    setProgress(20);
    setError('');

    try {
      setProgress(40);
      setStatus('syncing');
      setProgress(70);

      const res = await syncLinkedInConnections();
      setProgress(100);
      setResult({ imported: res.imported, total: res.total });
      setStatus('done');
    } catch (err: any) {
      setStatus('error');
      setError(err.message || 'Failed to sync connections.');
    }
  };

  const handleClose = () => {
    setIsLinkedInSyncOpen(false);
    // Reset after closing animation
    setTimeout(() => {
      setStatus('idle');
      setProgress(0);
      setResult(null);
      setError('');
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-5">
          <div className="w-14 h-14 bg-[#0A66C2] text-white rounded-2xl flex items-center justify-center shadow-xs">
            <Linkedin className="w-7 h-7" />
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {status === 'idle' && (
          <>
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">
              Sync Your LinkedIn Network
            </h3>
            <p className="text-slate-600 font-medium text-sm mb-6">
              Import your LinkedIn connections into Referro to instantly build your referral network. We'll match each connection to their market and expertise.
            </p>

            {!isLinkedInConnected && (
              <div className="flex items-center gap-2 p-3 mb-5 rounded-xl bg-blue-50 border border-blue-100 text-blue-700 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>LinkedIn not connected — sample connections will be imported for demonstration. Connect LinkedIn from the navbar for your real network.</span>
              </div>
            )}

            <div className="space-y-3 mb-6">
              <div className="flex items-start space-x-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-[#0A66C2]/10 text-[#0A66C2] flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Import all connections</p>
                  <p className="text-xs text-slate-500">Fetches your 1st-degree LinkedIn connections and adds them as network contacts.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Auto-profile matching</p>
                  <p className="text-xs text-slate-500">Each connection is categorized by market, expertise, and referral potential.</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleSync}
              className="w-full py-3 px-4 rounded-xl bg-[#0A66C2] hover:bg-[#0A4fA8] text-white font-semibold text-sm shadow-sm transition-colors flex items-center justify-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Start Sync</span>
            </button>
          </>
        )}

        {(status === 'fetching' || status === 'syncing') && (
          <>
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">
              Syncing your network...
            </h3>
            <p className="text-slate-600 font-medium text-sm mb-6">
              {status === 'fetching' ? 'Fetching connections from LinkedIn...' : 'Importing and categorizing contacts...'}
            </p>

            <div className="w-full bg-slate-100 rounded-full h-3 mb-4 overflow-hidden">
              <div
                className="bg-[#0A66C2] h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-8 h-8 text-[#0A66C2] animate-spin" />
            </div>
          </>
        )}

        {status === 'done' && result && (
          <>
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2 text-center">
              Sync Complete!
            </h3>
            <p className="text-slate-600 font-medium text-sm mb-6 text-center">
              Imported <strong className="text-slate-900">{result.imported}</strong> new connection{result.imported !== 1 ? 's' : ''} into your network. Your network now has <strong className="text-slate-900">{result.total}</strong> total contacts.
            </p>

            <button
              onClick={handleClose}
              className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm shadow-sm transition-colors"
            >
              View My Network
            </button>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2 text-center">
              Sync Failed
            </h3>
            <p className="text-slate-600 font-medium text-sm mb-6 text-center">{error}</p>
            <button
              onClick={() => setStatus('idle')}
              className="w-full py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-colors"
            >
              Try Again
            </button>
          </>
        )}
      </div>
    </div>
  );
};
