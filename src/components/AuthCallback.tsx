import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Linkedin, Loader2, CheckCircle2, XCircle } from 'lucide-react';

/**
 * Handles the LinkedIn OAuth callback redirect.
 * Detects ?code=... in the URL, sends it to the backend, and updates the user state.
 * Renders a brief loading screen while processing.
 */
export const AuthCallback: React.FC = () => {
  const { handleLinkedInCallback, setActiveTab } = useApp();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const error = params.get('error');

    if (error) {
      setStatus('error');
      setErrorMsg(error === 'access_denied' ? 'You cancelled the LinkedIn authorization.' : `LinkedIn returned an error: ${error}`);
      return;
    }

    if (!code) {
      // Not a callback URL — do nothing
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const res = await fetch('/api/auth/linkedin/callback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code })
        });
        const data = await res.json();

        if (cancelled) return;

        if (data.success && data.profile) {
          await handleLinkedInCallback(data.profile);
          setStatus('success');
          // Clean the URL and redirect to dashboard after a brief delay
          setTimeout(() => {
            window.history.replaceState({}, '', '/');
            setActiveTab('dashboard');
          }, 1500);
        } else {
          setStatus('error');
          setErrorMsg(data.error || 'Failed to authenticate with LinkedIn.');
        }
      } catch (err: any) {
        if (cancelled) return;
        setStatus('error');
        setErrorMsg(err.message || 'Network error during authentication.');
      }
    })();

    return () => { cancelled = true; };
  }, []);

  // Only render if we're on the callback route
  const params = new URLSearchParams(window.location.search);
  if (!params.get('code') && !params.get('error')) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-white">
      <div className="text-center max-w-sm px-6">
        {status === 'processing' && (
          <>
            <div className="w-16 h-16 bg-[#0A66C2] text-white rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Connecting to LinkedIn...</h2>
            <p className="text-sm text-slate-500">Verifying your profile and setting up your account.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">LinkedIn connected!</h2>
            <p className="text-sm text-slate-500">Your profile is verified. Redirecting to your dashboard...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <XCircle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Connection failed</h2>
            <p className="text-sm text-slate-500 mb-4">{errorMsg}</p>
            <button
              onClick={() => {
                window.history.replaceState({}, '', '/');
                setActiveTab('dashboard');
              }}
              className="py-2.5 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-colors"
            >
              Back to Dashboard
            </button>
          </>
        )}
      </div>
    </div>
  );
};
