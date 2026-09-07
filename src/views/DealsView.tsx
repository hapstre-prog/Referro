import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Deal, DealStage } from '../types';
import { 
  Kanban, 
  DollarSign, 
  Calendar, 
  MapPin, 
  ArrowRight, 
  CheckCircle2, 
  ChevronRight,
  TrendingUp
} from 'lucide-react';

const STAGES: { id: DealStage; label: string }[] = [
  { id: 'new_referral', label: 'New Referral' },
  { id: 'contacted', label: 'Contacted' },
  { id: 'meeting_showing', label: 'Meeting / Showing' },
  { id: 'offer', label: 'Offer' },
  { id: 'negotiation', label: 'Negotiation' },
  { id: 'under_contract', label: 'Under Contract' },
  { id: 'closed', label: 'Closed & Paid' }
];

export const DealsView: React.FC = () => {
  const { deals, updateDealStage, setActiveTab } = useApp();
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(deals[0] || null);

  const handleAdvance = async (deal: Deal) => {
    const currentIdx = STAGES.findIndex(s => s.id === deal.stage);
    if (currentIdx < STAGES.length - 1) {
      const nextStage = STAGES[currentIdx + 1].id;
      await updateDealStage(deal.id, nextStage);
      if (selectedDeal?.id === deal.id) {
        setSelectedDeal(prev => prev ? { ...prev, stage: nextStage } : null);
      }
    }
  };

  const totalGMV = (deals || []).reduce((sum, d) => sum + (d.dealValue || 0), 0);
  const potentialPayouts = (deals || []).reduce((sum, d) => sum + (d.giverPayoutAmount || 0), 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header & Metrics */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-1">
              <Kanban className="w-4 h-4" />
              <span>Escrow & Deal Management</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Deals Pipeline
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Track referrals from first contact to closed escrow. Payouts distributed automatically via Stripe Connect.
            </p>
          </div>

          <div className="flex items-center space-x-4 bg-slate-50 p-3 rounded-2xl border border-slate-200/80 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Pipeline GMV</span>
              <strong className="text-slate-900 font-extrabold text-base">${(((totalGMV || 0)/1000000)).toFixed(2)}M</strong>
            </div>
            <div className="border-l border-slate-200 pl-4">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Your Projected Payouts</span>
              <strong className="text-emerald-600 font-extrabold text-base">+${potentialPayouts.toLocaleString()}</strong>
            </div>
          </div>
        </div>

        {/* Kanban Board Horizontal Scroll */}
        <div className="mt-6 flex space-x-4 overflow-x-auto pb-4">
          {STAGES.map((stage) => {
            const stageDeals = deals.filter(d => d.stage === stage.id);
            return (
              <div
                key={stage.id}
                className="w-72 shrink-0 bg-slate-50 rounded-2xl p-3.5 border border-slate-200/70 flex flex-col justify-between min-h-[460px]"
              >
                <div>
                  <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-200/80">
                    <span className="text-xs font-bold text-slate-800">{stage.label}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-slate-700 border border-slate-200">
                      {stageDeals.length}
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {stageDeals.map((deal) => (
                      <div
                        key={deal.id}
                        onClick={() => setSelectedDeal(deal)}
                        className={`p-3.5 rounded-xl border bg-white transition-all cursor-pointer shadow-2xs hover:shadow-xs ${
                          selectedDeal?.id === deal.id ? 'border-indigo-500 ring-1 ring-indigo-500/30' : 'border-slate-200/80'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="font-semibold text-slate-500">{deal.market}</span>
                          <span className="font-bold text-slate-900">${(((deal.dealValue || 0) / 1000000)).toFixed(2)}M</span>
                        </div>
                        <h4 className="font-bold text-xs text-slate-900 line-clamp-1 mb-1.5">
                          {deal.propertyAddress}
                        </h4>
                        <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-100">
                          <span className="text-slate-500">Taker: {deal.takerName.split(' ')[0]}</span>
                          <span className="font-bold text-emerald-600">+${deal.giverPayoutAmount.toLocaleString()}</span>
                        </div>

                        {stage.id !== 'closed' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAdvance(deal);
                            }}
                            className="mt-2.5 w-full py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 text-[10px] font-bold transition-colors flex items-center justify-center space-x-1"
                          >
                            <span>Advance Stage</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    ))}
                    {stageDeals.length === 0 && (
                      <div className="text-center py-10 text-slate-400 text-xs">
                        No deals in this stage
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Deal Inspector & Live Success Fee Split Breakdown (Section #12 & #15) */}
      {selectedDeal && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 mb-6">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800">
                  {selectedDeal.stage.replace('_', ' ')}
                </span>
                <span className="text-xs text-slate-400 font-mono">Deal ID: {selectedDeal.id}</span>
              </div>
              <h3 className="text-xl font-black text-slate-900 mt-1">{selectedDeal.propertyAddress}</h3>
            </div>

            <div className="flex items-center space-x-3">
              {selectedDeal.stage !== 'closed' && (
                <button
                  onClick={() => handleAdvance(selectedDeal)}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center space-x-1.5"
                >
                  <span>Advance Deal Stage</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Live Fee Mathematics */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Live Success Fee Mathematics
              </h4>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-3 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Gross Deal Value:</span>
                  <strong className="text-slate-900">${selectedDeal.dealValue.toLocaleString()}</strong>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Gross Commission (3.0% standard):</span>
                  <strong className="text-slate-900">${(selectedDeal.dealValue * 0.03).toLocaleString()}</strong>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Referral Fee ({selectedDeal.referralFeePct}% co-broke share):</span>
                  <strong className="text-slate-900">${selectedDeal.grossReferralFee.toLocaleString()}</strong>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Relay Platform Success Fee ({selectedDeal.platformFeePct}% of referral):</span>
                  <strong className="text-slate-500">-${selectedDeal.platformFeeAmount.toLocaleString()}</strong>
                </div>
                <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                  <span className="font-bold text-emerald-800 text-sm">Your Net Referring Payout:</span>
                  <strong className="text-emerald-600 font-black text-lg">+${selectedDeal.giverPayoutAmount.toLocaleString()}</strong>
                </div>
              </div>
            </div>

            {/* Right: Deal Audit Log */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Deal Progress History & Compliance Notes
              </h4>
              <div className="space-y-2 text-xs">
                {selectedDeal.notes.map((note, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start space-x-2 text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{note}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
