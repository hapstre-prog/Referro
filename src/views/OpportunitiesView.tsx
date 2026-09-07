import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Opportunity } from '../types';
import { 
  Briefcase, 
  Send, 
  Download, 
  Sparkles, 
  MapPin, 
  DollarSign, 
  Clock, 
  ShieldCheck, 
  ArrowRight,
  Plus
} from 'lucide-react';

export const OpportunitiesView: React.FC = () => {
  const { opportunities, setActiveTab } = useApp();
  const [filterType, setFilterType] = useState<'all' | 'give' | 'take'>('all');

  const filtered = opportunities.filter(o => filterType === 'all' || o.type === filterType);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-1">
              <Briefcase className="w-4 h-4" />
              <span>Deal Board</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Opportunities
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Active buyer relocations, co-broke listings, and contractor leads across your network.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('give')}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Post New Lead</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="mt-4 flex items-center space-x-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              filterType === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Opportunities ({opportunities.length})
          </button>
          <button
            onClick={() => setFilterType('give')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              filterType === 'give' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Gives (Posted by You)
          </button>
          <button
            onClick={() => setFilterType('take')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              filterType === 'take' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Takes (Seeking Partners)
          </button>
        </div>
      </div>

      {/* Opportunities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((opp) => (
          <div
            key={opp.id}
            className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:border-indigo-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  opp.type === 'give' ? 'bg-indigo-100 text-indigo-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {opp.type.toUpperCase()} · {opp.category.replace(/_/g, ' ')}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">{opp.timeline}</span>
              </div>

              <h4 className="text-base font-extrabold text-slate-900 leading-snug mb-2 line-clamp-2">
                {opp.title}
              </h4>

              <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed">
                {opp.description}
              </p>

              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-2 text-xs mb-4">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" /> Target Market:</span>
                  <strong className="text-slate-900">{opp.targetMarket}</strong>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center"><DollarSign className="w-3.5 h-3.5 mr-1 text-slate-400" /> Price Range:</span>
                  <strong className="text-slate-900">{opp.priceRange.label}</strong>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center"><ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-500" /> Referral Fee:</span>
                  <strong className="text-indigo-600 font-bold">{opp.referralTermsPct}% Co-Broke</strong>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Posted by {opp.creatorName.split(' ')[0]}
              </span>
              <button
                onClick={() => setActiveTab('ai-matches')}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors flex items-center space-x-1"
              >
                <Sparkles className="w-3 h-3 text-indigo-300" />
                <span>View AI Matches</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
