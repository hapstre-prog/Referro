import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Linkedin, Users, MapPin, Search, ShieldCheck, ArrowRight } from 'lucide-react';

export const LinkedInConnectModal: React.FC = () => {
  const { isLinkedInConnectOpen, setIsLinkedInConnectOpen, connectLinkedIn, isDemoMode, setDemoMode } = useApp();
  const [isRedirecting, setIsRedirecting] = useState(false);

  if (!isLinkedInConnectOpen) return null;

  const handleConnect = async () => {
    setIsRedirecting(true);
    // Demo mode is turned off after the OAuth callback returns (in handleLinkedInCallback),
    // not here — otherwise the WelcomeModal flashes before the LinkedIn redirect.
    await connectLinkedIn();
  };

  const handleSkip = () => {
    setIsLinkedInConnectOpen(false);
    // Exiting demo mode opens the WelcomeModal with options to explore
    if (isDemoMode) {
      setDemoMode(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-5">
          <div className="w-14 h-14 bg-[#0A66C2] text-white rounded-2xl flex items-center justify-center shadow-xs">
            <Linkedin className="w-7 h-7" />
          </div>
          <button
            onClick={handleSkip}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">
          Connect your LinkedIn profile
        </h3>

        <p className="text-slate-600 font-medium text-sm mb-6">
          Referro uses your LinkedIn network to find the right referral partners — agents who can help your clients buy, sell, or relocate across state lines.
        </p>

        <div className="space-y-3 mb-6">
          <div className="flex items-start space-x-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Search className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Smarter matching</p>
              <p className="text-xs text-slate-500">We analyze your connections to find agents in the markets your clients need.</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Out-of-area referrals</p>
              <p className="text-xs text-slate-500">Got a buyer relocating to another state? We'll find a trusted local agent to take the referral.</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Verified credibility</p>
              <p className="text-xs text-slate-500">Your LinkedIn profile establishes trust so other agents feel confident accepting your referrals.</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-400 mb-5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>We only access your public profile and connections. We never post on your behalf.</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleConnect}
            disabled={isRedirecting}
            className="flex-1 py-3 px-4 rounded-xl bg-[#0A66C2] hover:bg-[#0A4fA8] text-white font-semibold text-sm shadow-sm transition-colors flex items-center justify-center space-x-2 disabled:opacity-60"
          >
            <Linkedin className="w-4 h-4" />
            <span>{isRedirecting ? 'Redirecting...' : 'Connect with LinkedIn'}</span>
            {!isRedirecting && <ArrowRight className="w-4 h-4" />}
          </button>
          <button
            onClick={handleSkip}
            disabled={isRedirecting}
            className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold text-sm transition-colors"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
};
