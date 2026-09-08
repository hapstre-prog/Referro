import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Users, 
  Send, 
  Download, 
  Sparkles, 
  Kanban, 
  DollarSign, 
  Coins, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Compass, 
  ShieldCheck,
  ChevronRight,
  Flame
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { 
    user, 
    opportunities, 
    referrals, 
    deals, 
    wallet, 
    networkContacts, 
    setActiveTab, 
    isDemoMode,
    runDemoScenario 
  } = useApp();

  const totalGMV = (deals || []).reduce((acc, d) => acc + (d.dealValue || 0), 0);
  const pendingPayouts = (deals || [])
    .filter(d => d.stage !== 'closed')
    .reduce((acc, d) => acc + (d.giverPayoutAmount || 0), 0);
  const closedEarnings = (deals || [])
    .filter(d => d.stage === 'closed')
    .reduce((acc, d) => acc + (d.giverPayoutAmount || 0), 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome & Scenarios Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2 border border-indigo-400/30">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>{user.brokerage || 'Keller Williams Luxury'} · California DRE Verified</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Welcome back, {user.name.split(' ')[0]}
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
                Turn the out-of-area buyers and listings you can't service into high-converting 25% referral fees. Sourced by AI across your verified network.
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setActiveTab('match-refer')}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-xs transition-colors flex items-center space-x-1.5"
              >
                <Sparkles className="w-4 h-4 text-indigo-200" />
                <span>Match & Refer (AI)</span>
              </button>
              <button
                onClick={() => setActiveTab('deals')}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold border border-white/20 transition-colors flex items-center space-x-1.5"
              >
                <Kanban className="w-4 h-4" />
                <span>View Pipeline</span>
              </button>
            </div>
          </div>

          {/* Interactive Demo Scenarios Carousel — demo mode only */}
          {isDemoMode && (
          <div className="mt-6 pt-5 border-t border-slate-700/80">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center">
                <Flame className="w-3.5 h-3.5 mr-1" />
                Quick Interactive Test Scenarios (Click to Run)
              </span>
              <span className="text-[11px] text-slate-400">Complete end-to-end user journeys</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div 
                onClick={() => runDemoScenario(1)}
                className="p-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-amber-400/50 cursor-pointer transition-all group"
              >
                <div className="flex items-center justify-between text-xs font-bold text-white mb-1">
                  <span>Scenario 1: Miami Buyer</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-300 group-hover:translate-x-1 transition-all" />
                </div>
                <p className="text-[11px] text-slate-300 line-clamp-2">
                  Alex has a tech client relocating to Miami ($2.5M). AI matches Sarah Chen (94%) for an immediate warm intro.
                </p>
                <span className="inline-block mt-2 text-[10px] font-semibold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                  Est. $18,750 Referral Fee
                </span>
              </div>

              <div 
                onClick={() => runDemoScenario(2)}
                className="p-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-amber-400/50 cursor-pointer transition-all group"
              >
                <div className="flex items-center justify-between text-xs font-bold text-white mb-1">
                  <span>Scenario 2: Stuck Listing</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-300 group-hover:translate-x-1 transition-all" />
                </div>
                <p className="text-[11px] text-slate-300 line-clamp-2">
                  Pacific Heights Victorian active 127 days ($7.85M). AI searches network to find buyer agents representing luxury transactors.
                </p>
                <span className="inline-block mt-2 text-[10px] font-semibold text-indigo-300 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-500/30">
                  Est. $70,650 Co-Broke Fee
                </span>
              </div>

              <div 
                onClick={() => runDemoScenario(3)}
                className="p-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-amber-400/50 cursor-pointer transition-all group"
              >
                <div className="flex items-center justify-between text-xs font-bold text-white mb-1">
                  <span>Scenario 3: Contractor Lead</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-300 group-hover:translate-x-1 transition-all" />
                </div>
                <p className="text-[11px] text-slate-300 line-clamp-2">
                  General Contractor Marcus Vance finished $650k remodel. Owner is selling ($4.2M). Contractor posts lead for top listing agent.
                </p>
                <span className="inline-block mt-2 text-[10px] font-semibold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                  Compliant Contractor Share
                </span>
              </div>
            </div>
          </div>
          )}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div 
          onClick={() => setActiveTab('my-network')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 hover:border-slate-300 shadow-2xs cursor-pointer transition-all hover:shadow-xs"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">My Network</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-1">
            {networkContacts.length}
          </div>
          <div className="text-xs text-slate-500 flex items-center">
            <span className="text-emerald-600 font-semibold mr-1">1st & 2nd Degree</span>
            <span>across 8 US metros</span>
          </div>
        </div>

        <div 
          onClick={() => setActiveTab('deals')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 hover:border-slate-300 shadow-2xs cursor-pointer transition-all hover:shadow-xs"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pipeline GMV</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Kanban className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-1">
            ${(((totalGMV || 0) / 1000000)).toFixed(1)}M
          </div>
          <div className="text-xs text-slate-500 flex items-center">
            <span className="font-semibold text-indigo-600 mr-1">{deals.length} Active Deals</span>
            <span>in pipeline</span>
          </div>
        </div>

        <div 
          onClick={() => setActiveTab('earnings')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 hover:border-slate-300 shadow-2xs cursor-pointer transition-all hover:shadow-xs"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Success Fee Earnings</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-1">
            ${closedEarnings.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 flex items-center">
            <span className="text-amber-600 font-semibold mr-1">+${pendingPayouts.toLocaleString()}</span>
            <span>in escrow</span>
          </div>
        </div>

        <div 
          onClick={() => setActiveTab('credits')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 hover:border-slate-300 shadow-2xs cursor-pointer transition-all hover:shadow-xs"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">AI Search Credits</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-1">
            {isDemoMode ? 'Unlimited' : wallet.availableCredits}
          </div>
          <div className="text-xs text-slate-500">
            {isDemoMode ? (
              <span className="text-emerald-600 font-semibold">Demo Sandbox Active</span>
            ) : (
              <span>{wallet.freeCreditsRemaining} free · {wallet.purchasedCredits} purchased</span>
            )}
          </div>
        </div>
      </div>

      {/* Two Columns: Active Deals & Opportunities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Deals Pipeline */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Active Deals Pipeline</h3>
              <p className="text-xs text-slate-500 mt-0.5">Real-time status of referred client escrows and success fee distributions.</p>
            </div>
            <button
              onClick={() => setActiveTab('deals')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center"
            >
              <span>View Kanban</span>
              <ChevronRight className="w-4 h-4 ml-0.5" />
            </button>
          </div>

          <div className="space-y-3">
            {deals.length === 0 ? (
              <div className="py-10 text-center">
                <Kanban className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-400 font-medium">No deals in your pipeline yet.</p>
                <p className="text-xs text-slate-400 mt-1">Post a lead or accept a referral to get started.</p>
              </div>
            ) : (
            deals.map((deal) => (
              <div 
                key={deal.id}
                onClick={() => setActiveTab('deals')}
                className="p-4 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/70 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      deal.stage === 'closed' 
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                        : deal.stage === 'under_contract'
                        ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}>
                      {deal.stage.replace('_', ' ')}
                    </span>
                    <span className="text-xs font-bold text-slate-900">{deal.propertyAddress}</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Client: <strong className="text-slate-700">{deal.clientName}</strong> · Taker: <strong className="text-slate-700">{deal.takerName}</strong>
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Est. Close: {deal.expectedCloseDate}
                  </p>
                </div>

                <div className="sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200">
                  <div className="text-sm font-extrabold text-slate-900">
                    ${deal.dealValue.toLocaleString()}
                  </div>
                  <div className="text-xs font-bold text-emerald-600">
                    +${deal.giverPayoutAmount.toLocaleString()} Net Payout
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {deal.referralFeePct}% Fee Split
                  </div>
                </div>
              </div>
            ))
            )}
          </div>
        </div>

        {/* Right 1 Col: Recent Opportunities */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Opportunities</h3>
              <button
                onClick={() => setActiveTab('opportunities')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center"
              >
                <span>All ({opportunities.length})</span>
                <ChevronRight className="w-4 h-4 ml-0.5" />
              </button>
            </div>

            <div className="space-y-3">
              {opportunities.length === 0 ? (
                <div className="py-8 text-center">
                  <Compass className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm text-slate-400 font-medium">No opportunities yet.</p>
                  <p className="text-xs text-slate-400 mt-1">Post your first lead to start receiving referrals.</p>
                </div>
              ) : (
              opportunities.slice(0, 3).map((opp) => (
                <div 
                  key={opp.id} 
                  onClick={() => setActiveTab(opp.type === 'give' ? 'give' : 'take')}
                  className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/70 transition-colors cursor-pointer text-xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                      opp.type === 'give' ? 'bg-indigo-100 text-indigo-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {opp.type.toUpperCase()} · {opp.category.replace(/_/g, ' ')}
                    </span>
                    <span className="text-[10px] text-slate-400">{opp.targetMarket}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 line-clamp-1 mb-1">{opp.title}</h4>
                  <div className="flex items-center justify-between text-slate-500 text-[11px]">
                    <span>Budget: <strong className="text-slate-800">{opp.priceRange.label}</strong></span>
                    <span className="font-semibold text-indigo-600">{opp.referralTermsPct}% fee</span>
                  </div>
                </div>
              ))
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4">
            <button
              onClick={() => setActiveTab('give')}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors flex items-center justify-center space-x-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Post New Lead to Network</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
