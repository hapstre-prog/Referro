import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CreditPackage } from '../types';
import { 
  Coins, 
  Sparkles, 
  CreditCard, 
  History, 
  Check, 
  ArrowUpRight, 
  Gift, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  ArrowDownLeft, 
  Copy,
  Users,
  Zap
} from 'lucide-react';

export const CreditsView: React.FC = () => {
  const { 
    wallet, 
    transactions, 
    creditPackages, 
    adminConfig, 
    purchasePackage, 
    isDemoMode,
    grantPromoCredits
  } = useApp();

  const [filterType, setFilterType] = useState<string>('all');
  const [copiedInvite, setCopiedInvite] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState<string | null>(null);
  const [purchaseSuccessMessage, setPurchaseSuccessMessage] = useState<string | null>(null);

  const handleBuy = async (pkg: CreditPackage) => {
    setIsPurchasing(pkg.id);
    try {
      await purchasePackage(pkg);
      setPurchaseSuccessMessage(`Successfully purchased ${pkg.credits} credits via Stripe checkout!`);
      setTimeout(() => setPurchaseSuccessMessage(null), 5000);
    } catch (e: any) {
      console.warn('[CreditsView] Purchase notice:', e?.message || e);
    } finally {
      setIsPurchasing(null);
    }
  };

  const handleCopyInvite = () => {
    navigator.clipboard?.writeText('https://relay.network/invite/alex-morgan-kw');
    setCopiedInvite(true);
    setTimeout(() => setCopiedInvite(false), 2500);
  };

  const filteredTransactions = transactions.filter(t => {
    if (filterType === 'all') return true;
    if (filterType === 'consumed') return t.amount < 0;
    if (filterType === 'added') return t.amount > 0;
    return t.type.toLowerCase().includes(filterType.toLowerCase());
  });

  const totalCreditsEver = wallet.freeCreditsRemaining + wallet.purchasedCredits + wallet.usageBeyondNetworkSearches;
  const usagePercentage = totalCreditsEver > 0 
    ? Math.min(100, Math.round((wallet.usageBeyondNetworkSearches / totalCreditsEver) * 100)) 
    : 0;

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-10">
      {/* Header & Wallet Summary Card (Requirement #5) */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-1">
              <Coins className="w-4 h-4 text-amber-500" />
              <span>AI Search Engine Billing</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Credits Wallet & Usage
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Credits power <strong>Beyond Network AI Searches</strong>. Searching your direct personal network is always complimentary.
            </p>
          </div>

          {isDemoMode && (
            <div className="inline-flex items-center px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-amber-600" />
              <span>Demo Mode: Unlimited Simulated Credits</span>
            </div>
          )}
        </div>

        {/* 3 Metric Pillars (Requirement #5) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          {/* Available Credits */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-2xl p-5 text-white shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                Available Credits
              </span>
              <div className="text-3xl sm:text-4xl font-black mt-2 tracking-tight">
                {isDemoMode ? 'Unlimited' : wallet.availableCredits}
              </div>
            </div>
            <p className="text-[11px] text-slate-300 mt-3 pt-3 border-t border-slate-800">
              {isDemoMode ? 'Sandbox mode active' : `${wallet.freeCreditsRemaining} free + ${wallet.purchasedCredits} purchased`}
            </p>
          </div>

          {/* Free Credits Allocation */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Free Credits Remaining
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800">
                  Priority 1
                </span>
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
                {wallet.freeCreditsRemaining}
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-3 pt-3 border-t border-slate-200">
              Free credits are always consumed before purchased credits.
            </p>
          </div>

          {/* Purchased Credits */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Purchased Credits
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">
                  Never Expire
                </span>
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
                {wallet.purchasedCredits}
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-3 pt-3 border-t border-slate-200">
              Lifetime purchased: {wallet.lifetimePurchased} credits via Stripe.
            </p>
          </div>
        </div>

        {/* Usage Progress Bar (Requirement #5: Beyond Network Searches [████████░░ 8 / 10]) */}
        <div className="mt-6 pt-6 border-t border-slate-100 space-y-4">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-900 mb-2">
              <span className="flex items-center">
                <Zap className="w-3.5 h-3.5 text-indigo-600 mr-1.5" />
                Beyond Network Searches Usage
              </span>
              <span className="text-slate-600">
                {wallet.usageBeyondNetworkSearches} searches performed
              </span>
            </div>

            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
              <div 
                className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.max(8, usagePercentage)}%` }}
              />
            </div>
          </div>

          {/* Complimentary Network Searches Daily Limit */}
          <div className="flex items-center justify-between text-xs bg-slate-50 p-3 rounded-xl border border-slate-200/70">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="text-slate-700 font-medium">
                Free Network Searches Today:
              </span>
            </div>
            <span className="font-bold text-slate-900">
              {wallet.freeNetworkSearchesUsedToday} / {adminConfig.freeNetworkSearchesPerDay} used (Resets midnight UTC)
            </span>
          </div>
        </div>
      </div>

      {purchaseSuccessMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm font-semibold flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>{purchaseSuccessMessage}</span>
          </div>
        </div>
      )}

      {/* Credit Purchase Tiers (Requirement #11: Stripe Checkout Integration) */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center">
            <CreditCard className="w-5 h-5 text-indigo-600 mr-2" />
            Purchase Search Credit Packages
          </h3>
          <p className="text-xs text-slate-500">
            Refill your Beyond Network search balance. Verified instant delivery with secure Stripe checkout.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {creditPackages.map((pkg) => (
            <div
              key={pkg.id}
              className={`bg-white rounded-3xl p-6 border transition-all flex flex-col justify-between relative ${
                pkg.popular 
                  ? 'border-indigo-500 shadow-md ring-2 ring-indigo-500/20' 
                  : 'border-slate-200/80 shadow-2xs hover:border-slate-300'
              }`}
            >
              {pkg.badge && (
                <span className="absolute -top-3 left-6 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-indigo-600 text-white shadow-xs">
                  {pkg.badge}
                </span>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-base font-extrabold text-slate-900">{pkg.name}</h4>
                  <span className="text-xs font-semibold text-slate-400">
                    ${((pkg.costPerCredit !== undefined && pkg.costPerCredit !== null) ? pkg.costPerCredit : (pkg.credits > 0 ? pkg.price / pkg.credits : 0)).toFixed(2)} / search
                  </span>
                </div>

                <div className="flex items-baseline space-x-1 mb-4">
                  <span className="text-3xl sm:text-4xl font-black text-slate-900">${pkg.price}</span>
                  <span className="text-xs text-slate-500 font-medium">USD</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 mb-5">
                  <div className="text-2xl font-black text-indigo-600">
                    {pkg.credits} Credits
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {pkg.credits} Beyond Network AI Searches
                  </div>
                </div>

                <ul className="space-y-2 text-xs text-slate-600 mb-6">
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Nationwide luxury agent match discovery</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Credits never expire</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Automated 25% referral contract generator</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handleBuy(pkg)}
                disabled={isPurchasing === pkg.id}
                className={`w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center justify-center space-x-2 cursor-pointer ${
                  pkg.popular
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>{isPurchasing === pkg.id ? 'Processing...' : `Get ${pkg.credits} Credits`}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Referral & Invite Incentives (Requirement #14) */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-400/30">
            <Gift className="w-3.5 h-3.5 text-amber-300" />
            <span>Referral Incentive Program</span>
          </div>
          <h3 className="text-xl font-extrabold tracking-tight">
            Invite a Colleague, Receive +{adminConfig.referralCreditsGrant} Free Credits
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Expand your collective deal sourcing. When another licensed agent joins Relay through your personal link, you both receive complimentary credits.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2.5 shrink-0">
          <button
            onClick={handleCopyInvite}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs transition-colors flex items-center justify-center space-x-1.5 shadow-xs"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copiedInvite ? 'Link Copied!' : 'Copy Invite Link'}</span>
          </button>
          <button
            onClick={() => grantPromoCredits(adminConfig.referralCreditsGrant, 'Invited Realtor colleague signed up')}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs border border-indigo-400/30 transition-colors flex items-center justify-center space-x-1.5"
            title="Simulate a colleague signing up via your link"
          >
            <Users className="w-3.5 h-3.5 text-indigo-200" />
            <span>Simulate Invite (+{adminConfig.referralCreditsGrant})</span>
          </button>
        </div>
      </div>

      {/* Immutable Transaction Ledger (Requirement #6) */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center">
              <History className="w-4 h-4 text-indigo-600 mr-2" />
              Immutable Transaction Ledger
            </h3>
            <p className="text-xs text-slate-500">
              Cryptographically timestamped credit history. Every balance change produces an audit record.
            </p>
          </div>

          <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded-lg transition-colors ${filterType === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'}`}
            >
              All ({transactions.length})
            </button>
            <button
              onClick={() => setFilterType('consumed')}
              className={`px-3 py-1 rounded-lg transition-colors ${filterType === 'consumed' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Consumed
            </button>
            <button
              onClick={() => setFilterType('added')}
              className={`px-3 py-1 rounded-lg transition-colors ${filterType === 'added' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Added
            </button>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">Transaction ID</th>
                <th className="py-3 px-3">Type & Description</th>
                <th className="py-3 px-3">Date & Time</th>
                <th className="py-3 px-3 text-right">Amount</th>
                <th className="py-3 px-3 text-right">Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-3 font-mono text-[11px] text-slate-500">
                    {tx.id}
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                        tx.amount > 0 
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                          : 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                      }`}>
                        {tx.type.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <span className="text-slate-700 block mt-0.5 text-xs font-medium">
                      {tx.description}
                    </span>
                    {tx.relatedSearchId && (
                      <span className="text-[10px] text-slate-400 font-mono block">
                        Search Ref: {tx.relatedSearchId}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-3 text-slate-500 text-[11px]">
                    {new Date(tx.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3.5 px-3 text-right font-bold text-sm">
                    <span className={tx.amount > 0 ? 'text-emerald-600' : 'text-slate-900'}>
                      {tx.amount > 0 ? `+${tx.amount}` : tx.amount}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right font-medium text-slate-600 text-[11px]">
                    {tx.balanceAfter} credits
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
