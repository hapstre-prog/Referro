import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Users, Search, ArrowRight, CheckCircle2, Linkedin } from 'lucide-react';

export const WelcomeModal: React.FC = () => {
  const { isFirstTimeWelcomeOpen, setIsFirstTimeWelcomeOpen, adminConfig, setActiveTab, isLinkedInConnected, setIsLinkedInConnectOpen } = useApp();

  if (!isFirstTimeWelcomeOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 text-center animate-in fade-in zoom-in-95 duration-200">
        <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-indigo-100 shadow-xs">
          <Sparkles className="w-7 h-7" />
        </div>

        <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">
          Welcome to Relay
        </h3>

        <p className="text-slate-600 font-medium text-sm sm:text-base mb-6">
          Your network is already your first source of opportunities.
        </p>

        <div className="bg-gradient-to-br from-indigo-50 to-blue-50/50 border border-indigo-100/80 rounded-xl p-5 mb-6 text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-700 block mb-1">
            Complimentary Welcome Grant
          </span>
          <div className="text-4xl font-extrabold text-indigo-900 mb-1">
            {adminConfig.freeSignupCredits} FREE CREDITS
          </div>
          <p className="text-xs text-slate-600 max-w-xs mx-auto">
            Use them to discover high-value client opportunities beyond your existing network before requiring payment.
          </p>
        </div>

        <div className="space-y-2.5 text-left mb-6 text-xs text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Search your own network for free (2 complimentary searches/day)</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{adminConfig.freeSignupCredits} Beyond-Network AI searches included at zero upfront cost</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Receive 25% - 30% co-broke referral commissions when deals close</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => {
              setIsFirstTimeWelcomeOpen(false);
              setActiveTab('match-refer');
            }}
            className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-sm transition-colors flex items-center justify-center space-x-2"
          >
            <span>Find My First Match</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setIsFirstTimeWelcomeOpen(false);
              setActiveTab('my-network');
            }}
            className="flex-1 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-colors flex items-center justify-center space-x-2"
          >
            <Users className="w-4 h-4" />
            <span>Explore My Network</span>
          </button>
        </div>

        {!isLinkedInConnected && (
          <button
            onClick={() => {
              setIsFirstTimeWelcomeOpen(false);
              setIsLinkedInConnectOpen(true);
            }}
            className="w-full mt-3 py-2.5 px-4 rounded-xl border border-[#0A66C2]/20 hover:bg-[#0A66C2]/5 text-[#0A66C2] font-semibold text-sm transition-colors flex items-center justify-center space-x-2"
          >
            <Linkedin className="w-4 h-4" />
            <span>Connect LinkedIn for better matches</span>
          </button>
        )}
      </div>
    </div>
  );
};
