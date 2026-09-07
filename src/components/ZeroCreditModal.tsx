import React from 'react';
import { useApp } from '../context/AppContext';
import { CreditCard, CheckCircle2, ArrowRight, X } from 'lucide-react';

export const ZeroCreditModal: React.FC = () => {
  const { zeroCreditModalOpen, setZeroCreditModalOpen, setActiveTab } = useApp();

  if (!zeroCreditModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-7 shadow-xl border border-slate-100 text-center relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={() => setZeroCreditModalOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-100">
          <CreditCard className="w-6 h-6" />
        </div>

        <h3 className="text-xl font-bold text-slate-900 mb-2">
          You've used all your free credits.
        </h3>

        <p className="text-slate-600 text-sm mb-5">
          Your next <strong>Beyond Network search</strong> requires credits.
        </p>

        <button
          onClick={() => {
            setZeroCreditModalOpen(false);
            setActiveTab('credits');
          }}
          className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-sm transition-colors flex items-center justify-center space-x-2 mb-6"
        >
          <span>Get More Credits</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="border-t border-slate-100 pt-4 text-left">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            You can still freely:
          </span>
          <ul className="space-y-1.5 text-xs text-slate-600">
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Search your own network within the daily free limit</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Receive referrals and accept opportunities</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Give opportunities to your personal network</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Message colleagues, track deals, and receive payouts</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
