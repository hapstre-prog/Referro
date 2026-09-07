import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  FileText, 
  ShieldCheck, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  User,
  Building
} from 'lucide-react';

export const ReferralsView: React.FC = () => {
  const { referrals, setActiveTab } = useApp();

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center space-x-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-1">
          <FileText className="w-4 h-4" />
          <span>Legally Binding Referral Agreements</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Referral Contracts
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Every matched introduction creates a DRE-compliant referral agreement ensuring fee collection upon escrow closing.
        </p>
      </div>

      {/* Referrals List */}
      <div className="space-y-4">
        {referrals.map((ref) => (
          <div
            key={ref.id}
            className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs hover:border-slate-300 transition-all"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    ref.status === 'closed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-indigo-100 text-indigo-800'
                  }`}>
                    {ref.status.toUpperCase()}
                  </span>
                  <span className="text-xs font-mono text-slate-400">ID: {ref.id}</span>
                </div>
                <h3 className="text-base font-extrabold text-slate-900">{ref.opportunityTitle}</h3>
              </div>

              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                  Compliance Signed & DRE Verified
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4 border-b border-slate-100 text-xs">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Referring Agent (Giver)
                </span>
                <div className="flex items-center space-x-2">
                  <img src={ref.giverAvatar} alt={ref.giverName} className="w-8 h-8 rounded-lg object-cover" />
                  <div>
                    <strong className="text-slate-900 block">{ref.giverName}</strong>
                    <span className="text-slate-500 text-[11px]">Keller Williams Luxury SF</span>
                  </div>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Receiving Agent (Taker)
                </span>
                <div className="flex items-center space-x-2">
                  <img src={ref.takerAvatar} alt={ref.takerName} className="w-8 h-8 rounded-lg object-cover" />
                  <div>
                    <strong className="text-slate-900 block">{ref.takerName}</strong>
                    <span className="text-slate-500 text-[11px]">Certified Producer</span>
                  </div>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Fee Split Terms
                </span>
                <div className="text-sm font-black text-indigo-600">
                  {ref.referralPercentage}% Gross Commission
                </div>
                <span className="text-[10px] text-slate-400">
                  Platform Success Fee: {ref.platformPercentage}% of referral
                </span>
              </div>
            </div>

            {/* Economics Breakdown */}
            <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-slate-600">
                <div>
                  <span className="text-slate-400 text-[10px] block">Est. Deal Value</span>
                  <strong className="text-slate-900 font-bold">${ref.estimatedDealValue.toLocaleString()}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Gross 3% Comm.</span>
                  <strong className="text-slate-900 font-bold">${ref.expectedGrossCommission.toLocaleString()}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">25% Referral Fee</span>
                  <strong className="text-slate-900 font-bold">${ref.estimatedReferralFee.toLocaleString()}</strong>
                </div>
                <div>
                  <span className="text-emerald-600 text-[10px] font-bold block">Your Net Payout</span>
                  <strong className="text-emerald-600 font-black text-sm">+${ref.estimatedConnectorPayout.toLocaleString()}</strong>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('deals')}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors flex items-center justify-center space-x-1.5 shadow-2xs self-start sm:self-center"
              >
                <span>Track in Deals Pipeline</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
