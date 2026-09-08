import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  DollarSign, 
  Coins, 
  TrendingUp, 
  ShieldCheck, 
  CreditCard, 
  CheckCircle2, 
  ArrowUpRight,
  Clock,
  Layers,
  Building
} from 'lucide-react';

export const EarningsView: React.FC = () => {
  const { deals, wallet, isDemoMode, user, setActiveTab } = useApp();

  const closedDeals = deals.filter(d => d.stage === 'closed');
  const activeDeals = deals.filter(d => d.stage !== 'closed');

  const totalClosedEarnings = closedDeals.reduce((acc, d) => acc + d.giverPayoutAmount, 0);
  const totalPendingEarnings = activeDeals.reduce((acc, d) => acc + d.giverPayoutAmount, 0);

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-10">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-1">
              <DollarSign className="w-4 h-4" />
              <span>Brokerage Revenue & Distributions</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Earnings & Economics
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Dual-engine revenue architecture: AI Search Credits (Operational) and Transaction Success Fees (Escrow).
            </p>
          </div>

          {/* Stripe Connect Badge */}
          <div className="flex items-center space-x-2 bg-emerald-50 border border-emerald-200 text-emerald-900 px-3.5 py-2 rounded-2xl text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Stripe Connect: Direct Deposit Active</span>
          </div>
        </div>

        {/* Dual-Engine Distinction Explainer Box */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-1.5">
            <div className="flex items-center space-x-2 text-indigo-900 font-bold text-xs">
              <Coins className="w-4 h-4 text-amber-500" />
              <span>ENGINE 1: AI SEARCH CREDITS</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Operational usage fees for searching beyond your network graph. Paid via Stripe checkout and never deducted from closed deals.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setActiveTab('credits')}
                className="text-indigo-600 font-bold text-xs hover:underline inline-flex items-center"
              >
                <span>View Credit Wallet ({isDemoMode ? 'Unlimited' : wallet.availableCredits} available)</span>
                <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
              </button>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-1.5">
            <div className="flex items-center space-x-2 text-emerald-900 font-bold text-xs">
              <Building className="w-4 h-4 text-emerald-600" />
              <span>ENGINE 2: TRANSACTION SUCCESS FEES</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tied strictly to closed transaction escrow values. The standard 25% referral commission split distributed between participating brokerages and Referro.
            </p>
            <div className="pt-2">
              <span className="text-emerald-700 font-bold text-xs">
                ${totalClosedEarnings.toLocaleString()} Paid Out · ${totalPendingEarnings.toLocaleString()} In Escrow
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Payout Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Total Distributed Earnings
          </span>
          <div className="text-3xl font-black text-slate-900">
            ${totalClosedEarnings.toLocaleString()}
          </div>
          <span className="text-xs text-emerald-600 font-semibold mt-1 block">
            Paid directly to {user.brokerage || 'Keller Williams'}
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Pending In Escrow Pipeline
          </span>
          <div className="text-3xl font-black text-amber-600">
            ${totalPendingEarnings.toLocaleString()}
          </div>
          <span className="text-xs text-slate-500 mt-1 block">
            Across {activeDeals.length} active deals in progress
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Average Referral Commission
          </span>
          <div className="text-3xl font-black text-indigo-600">
            $17,812
          </div>
          <span className="text-xs text-slate-500 mt-1 block">
            Based on 25% standard luxury splits
          </span>
        </div>
      </div>

      {/* Escrow Distributions Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center">
            <DollarSign className="w-4 h-4 text-emerald-600 mr-1.5" />
            Transaction Escrow Settlements & Disclosures
          </h3>
          <p className="text-xs text-slate-500">
            Immutable settlement breakdown per closed referral deal.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">Deal & Property</th>
                <th className="py-3 px-3">Stage</th>
                <th className="py-3 px-3">Close Date</th>
                <th className="py-3 px-3 text-right">Deal Value</th>
                <th className="py-3 px-3 text-right">Referral Fee (25%)</th>
                <th className="py-3 px-3 text-right">Referro Share (10%)</th>
                <th className="py-3 px-3 text-right">Your Payout</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {deals.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-sm text-slate-400">
                    No transaction settlements yet. Your closed referral deals will appear here.
                  </td>
                </tr>
              ) : (
              deals.map((deal) => (
                <tr key={deal.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3">
                    <strong className="text-slate-900 block">{deal.propertyAddress}</strong>
                    <span className="text-[11px] text-slate-400">Taker: {deal.takerName}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                      deal.stage === 'closed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {deal.stage.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-500">
                    {deal.actualCloseDate || `Est. ${deal.expectedCloseDate}`}
                  </td>
                  <td className="py-3 px-3 text-right font-semibold text-slate-900">
                    ${deal.dealValue.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-right font-medium text-slate-700">
                    ${deal.grossReferralFee.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-right text-slate-400">
                    -${deal.platformFeeAmount.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-right font-black text-sm text-emerald-600">
                    +${deal.giverPayoutAmount.toLocaleString()}
                  </td>
                </tr>
              ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
