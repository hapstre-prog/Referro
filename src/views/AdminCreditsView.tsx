import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CreditPackage, AdminCreditConfig } from '../types';
import { 
  ShieldAlert, 
  Settings, 
  TrendingUp, 
  DollarSign, 
  Coins, 
  Users, 
  Save, 
  Plus, 
  Trash2, 
  Gift, 
  CheckCircle2, 
  ArrowRight,
  Layers,
  BarChart3
} from 'lucide-react';

export const AdminCreditsView: React.FC = () => {
  const { adminConfig, updateAdminConfig, creditPackages, analytics, grantPromoCredits, deals } = useApp();

  const [formConfig, setFormConfig] = useState<AdminCreditConfig>({ ...adminConfig });
  const [packages, setPackages] = useState<CreditPackage[]>([...creditPackages]);
  const [promoAmount, setPromoAmount] = useState<number>(5);
  const [promoReason, setPromoReason] = useState<string>('VIP agent beta testing bonus');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [promoGrantedSuccess, setPromoGrantedSuccess] = useState(false);

  const handleSaveConfig = () => {
    updateAdminConfig(formConfig, packages);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const handleGrantPromo = () => {
    grantPromoCredits(promoAmount, promoReason);
    setPromoGrantedSuccess(true);
    setTimeout(() => setPromoGrantedSuccess(false), 3500);
  };

  const handleUpdatePackage = (index: number, field: keyof CreditPackage, value: any) => {
    const updated = [...packages];
    updated[index] = { ...updated[index], [field]: value };
    // Recalculate cost per credit if price or credits change
    if (field === 'price' || field === 'credits') {
      const price = field === 'price' ? Number(value) : updated[index].price;
      const credits = field === 'credits' ? Number(value) : updated[index].credits;
      updated[index].costPerCredit = credits > 0 ? price / credits : 0;
    }
    setPackages(updated);
  };

  const handleAddPackage = () => {
    const newPkg: CreditPackage = {
      id: `pkg_custom_${Date.now()}`,
      name: 'Custom Tier',
      credits: 100,
      price: 249,
      costPerCredit: 2.49,
      active: true,
      popular: false
    };
    setPackages([...packages, newPkg]);
  };

  const handleDeletePackage = (index: number) => {
    setPackages(packages.filter((_, i) => i !== index));
  };

  const conversionRate = (analytics?.creditsExhausted && analytics.creditsExhausted > 0)
    ? (((analytics?.creditPurchases || 0) / analytics.creditsExhausted) * 100).toFixed(1) 
    : '28.5';

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-1">
              <ShieldAlert className="w-4 h-4 text-rose-500" />
              <span>Platform Administration</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Admin & Freemium Credit Economics
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Configure free acquisition credits, daily network search quotas, Stripe pricing tiers, and monitor dual-engine conversion analytics.
            </p>
          </div>

          <button
            onClick={handleSaveConfig}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors flex items-center space-x-1.5 self-start sm:self-center"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>

        {savedSuccess && (
          <div className="mt-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Settings successfully persisted to server runtime!</span>
          </div>
        )}

        {/* Funnel & Conversion Analytics (Requirement #16) */}
        <div className="mt-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center">
            <BarChart3 className="w-4 h-4 mr-1.5 text-indigo-600" />
            Dual-Engine Funnel & Monetization Metrics
          </h3>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <span className="text-[11px] font-semibold text-slate-500 block">Total Signups</span>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {(analytics?.totalUsersSignedUp || analytics?.signups || 0).toLocaleString()}
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">100% received free credits</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <span className="text-[11px] font-semibold text-slate-500 block">Free Credits Exhausted</span>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {analytics?.creditsExhausted || 0} users
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">Active searchers</span>
            </div>

            <div className="bg-indigo-50/60 p-4 rounded-2xl border border-indigo-100">
              <span className="text-[11px] font-bold text-indigo-700 block">Exhaustion → Purchase Rate</span>
              <div className="text-2xl font-black text-indigo-900 mt-1">
                {conversionRate}%
              </div>
              <span className="text-[10px] text-indigo-600 mt-1 block">{analytics?.creditPurchases || 0} package purchases</span>
            </div>

            <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100">
              <span className="text-[11px] font-bold text-emerald-700 block">Credit Search Revenue</span>
              <div className="text-2xl font-black text-emerald-900 mt-1">
                ${(analytics?.creditRevenueDollars || 0).toLocaleString()}
              </div>
              <span className="text-[10px] text-emerald-600 mt-1 block">+ ${(deals || []).reduce((a, d) => a + (d.platformFeeAmount || 0), 0).toLocaleString()} in deal fees</span>
            </div>
          </div>
        </div>
      </div>

      {/* Credit Acquisition & Quotas Configuration (Requirement #1, #2, #15) */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
        <h3 className="text-base font-bold text-slate-900 flex items-center">
          <Settings className="w-5 h-5 text-indigo-600 mr-2" />
          Acquisition & Consumption Rules
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* FREE_SIGNUP_CREDITS */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
              Free Signup Credits (FREE_SIGNUP_CREDITS)
            </label>
            <p className="text-xs text-slate-500">
              Complimentary credits granted immediately upon LinkedIn registration.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <input
                type="number"
                min={1}
                max={50}
                value={formConfig.freeSignupCredits}
                onChange={(e) => setFormConfig({ ...formConfig, freeSignupCredits: Number(e.target.value) })}
                className="w-24 bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <span className="text-xs text-slate-500 font-medium">Credits per new agent</span>
            </div>
          </div>

          {/* FREE_NETWORK_SEARCHES_PER_DAY */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
              Daily Free Network Searches (FREE_NETWORK_SEARCHES_PER_DAY)
            </label>
            <p className="text-xs text-slate-500">
              Maximum Level 1 (My Network) searches allowed per agent per 24 hours.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <input
                type="number"
                min={1}
                max={20}
                value={formConfig.freeNetworkSearchesPerDay}
                onChange={(e) => setFormConfig({ ...formConfig, freeNetworkSearchesPerDay: Number(e.target.value) })}
                className="w-24 bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <span className="text-xs text-slate-500 font-medium">Searches per day</span>
            </div>
          </div>

          {/* BEYOND_NETWORK_SEARCH_COST */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
              Beyond Network Search Cost (BEYOND_NETWORK_SEARCH_COST)
            </label>
            <p className="text-xs text-slate-500">
              Credit deduction per Level 2 search beyond the user's graph.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <input
                type="number"
                min={1}
                max={10}
                value={formConfig.beyondNetworkSearchCost}
                onChange={(e) => setFormConfig({ ...formConfig, beyondNetworkSearchCost: Number(e.target.value) })}
                className="w-24 bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <span className="text-xs text-slate-500 font-medium">Credits per search</span>
            </div>
          </div>

          {/* LOW_CREDIT_THRESHOLD */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
              Low Credit Warning Threshold
            </label>
            <p className="text-xs text-slate-500">
              Triggers subtle notification banner when remaining balance hits this value.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <input
                type="number"
                min={1}
                max={10}
                value={formConfig.lowCreditThreshold}
                onChange={(e) => setFormConfig({ ...formConfig, lowCreditThreshold: Number(e.target.value) })}
                className="w-24 bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <span className="text-xs text-slate-500 font-medium">Remaining credits</span>
            </div>
          </div>
        </div>
      </div>

      {/* Credit Packages Manager (Requirement #11 & #15) */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center">
              <Coins className="w-5 h-5 text-amber-500 mr-2" />
              Credit Purchase Packages (Stripe Integrated)
            </h3>
            <p className="text-xs text-slate-500">
              Add or adjust pricing tiers presented to users when purchasing credits.
            </p>
          </div>

          <button
            onClick={handleAddPackage}
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors flex items-center space-x-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Package</span>
          </button>
        </div>

        <div className="space-y-3">
          {packages.map((pkg, idx) => (
            <div 
              key={pkg.id}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 grid grid-cols-1 sm:grid-cols-6 gap-3 items-center text-xs"
            >
              <div className="sm:col-span-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Package Name
                </label>
                <input
                  type="text"
                  value={pkg.name}
                  onChange={(e) => handleUpdatePackage(idx, 'name', e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-semibold text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Credits
                </label>
                <input
                  type="number"
                  value={pkg.credits}
                  onChange={(e) => handleUpdatePackage(idx, 'credits', Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-semibold text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Price ($ USD)
                </label>
                <input
                  type="number"
                  value={pkg.price}
                  onChange={(e) => handleUpdatePackage(idx, 'price', Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-semibold text-slate-900 focus:outline-none"
                />
              </div>

              <div className="text-center sm:text-left">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Unit Cost
                </span>
                <span className="font-bold text-slate-700">
                  ${((pkg.costPerCredit !== undefined && pkg.costPerCredit !== null) ? pkg.costPerCredit : (pkg.credits > 0 ? pkg.price / pkg.credits : 0)).toFixed(2)}/cr
                </span>
              </div>

              <div className="flex items-center justify-end space-x-2">
                <label className="flex items-center space-x-1.5 text-xs text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pkg.popular || false}
                    onChange={(e) => handleUpdatePackage(idx, 'popular', e.target.checked)}
                    className="rounded text-indigo-600"
                  />
                  <span>Popular</span>
                </label>
                <button
                  onClick={() => handleDeletePackage(idx)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                  title="Remove package"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Promotional Credit Grants (Requirement #15) */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center">
            <Gift className="w-5 h-5 text-indigo-600 mr-2" />
            Issue Promotional Credits to Agent
          </h3>
          <p className="text-xs text-slate-500">
            Grants credits directly to the current user's wallet with an audit ledger record.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-end gap-3">
          <div className="w-full sm:w-32">
            <label className="text-[11px] font-semibold text-slate-500 block mb-1">Amount</label>
            <input
              type="number"
              value={promoAmount}
              onChange={(e) => setPromoAmount(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none"
            />
          </div>

          <div className="w-full sm:flex-1">
            <label className="text-[11px] font-semibold text-slate-500 block mb-1">Reason / Note</label>
            <input
              type="text"
              value={promoReason}
              onChange={(e) => setPromoReason(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none"
              placeholder="e.g. Compensation for beta feedback or VIP partnership"
            />
          </div>

          <button
            onClick={handleGrantPromo}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center space-x-1.5 shrink-0"
          >
            <Gift className="w-3.5 h-3.5 text-amber-300" />
            <span>Grant Credits</span>
          </button>
        </div>

        {promoGrantedSuccess && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Successfully granted +{promoAmount} promotional credits! Check transaction ledger.</span>
          </div>
        )}
      </div>
    </div>
  );
};
