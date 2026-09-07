import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  User, 
  ShieldCheck, 
  Award, 
  MapPin, 
  Building, 
  CheckCircle2, 
  TrendingUp, 
  ExternalLink,
  Coins
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { user, deals, wallet, opportunities, isDemoMode, setActiveTab } = useApp();

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-start sm:items-center space-x-4">
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-20 h-20 rounded-2xl object-cover ring-4 ring-indigo-50 shadow-sm"
            />
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">{user.name}</h2>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                  Verified DRE Broker
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-600">
                {user.company} · {user.brokerage}
              </p>
              <div className="flex items-center space-x-3 text-[11px] text-slate-400 mt-1">
                <span>DRE #{user.licenseNumber}</span>
                <span>•</span>
                <span>{user.jurisdiction.join(', ')}</span>
              </div>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <div className="text-3xl font-black text-indigo-600">{user.reputationScore}</div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Network Trust Score
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Deals Closed
            </span>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {user.dealsClosed}
            </div>
            <span className="text-[10px] text-emerald-600 font-semibold mt-0.5 block">100% compliant splits</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Career Volume
            </span>
            <div className="text-2xl font-black text-slate-900 mt-1">
              ${(((user?.totalVolumeClosed || 0) / 1000000)).toFixed(0)}M+
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5 block">San Francisco Bay Area</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Opportunities
            </span>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {opportunities.length}
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5 block">{user.giveOpportunitiesPosted} gives posted</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              AI Credits
            </span>
            <div className="text-2xl font-black text-amber-600 mt-1">
              {isDemoMode ? 'Unlimited' : wallet.availableCredits}
            </div>
            <button
              onClick={() => setActiveTab('credits')}
              className="text-[10px] text-indigo-600 font-semibold hover:underline mt-0.5 block"
            >
              Manage wallet &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Verified Integrations */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center">
          <ShieldCheck className="w-5 h-5 text-indigo-600 mr-2" />
          Verified Compliance & Connected Accounts
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
            <div>
              <strong className="text-xs font-bold text-slate-900 block">LinkedIn Profile</strong>
              <span className="text-[11px] text-emerald-600 font-semibold">Connected (OAuth Verified)</span>
            </div>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
            <div>
              <strong className="text-xs font-bold text-slate-900 block">Stripe Connect Payouts</strong>
              <span className="text-[11px] text-emerald-600 font-semibold">Direct Deposit Active</span>
            </div>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
            <div>
              <strong className="text-xs font-bold text-slate-900 block">State DRE License</strong>
              <span className="text-[11px] text-emerald-600 font-semibold">Good Standing (CA #01992014)</span>
            </div>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
        </div>
      </div>
    </div>
  );
};
