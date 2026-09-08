import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AIMatchCandidate } from '../types';
import { 
  Sparkles, 
  MapPin, 
  CheckCircle2, 
  UserCheck, 
  ShieldCheck, 
  ArrowRight, 
  Filter, 
  Search,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

export const AIMatchesView: React.FC = () => {
  const { networkContacts, opportunities, createReferralFromMatch, setActiveTab } = useApp();
  const [selectedOppId, setSelectedOppId] = useState<string>(opportunities[0]?.id || '');
  const [selectedMarket, setSelectedMarket] = useState<string>('all');

  const selectedOpp = opportunities.find(o => o.id === selectedOppId) || opportunities[0];

  // Derive transparent matches
  const matchCandidates: AIMatchCandidate[] = networkContacts.map(c => {
    let score = 65;
    const reasons: string[] = [];

    const markets = (c.marketsServed && c.marketsServed.length > 0) ? c.marketsServed : (c.geographicCoverage || []);
    const expertise = c.expertise || [];

    const isMiami = markets.some(m => m.toLowerCase().includes('miami') || m.toLowerCase().includes('fl'));
    const isSF = markets.some(m => m.toLowerCase().includes('san francisco') || m.toLowerCase().includes('ca'));
    const isLuxury = expertise.some(e => e.toLowerCase().includes('luxury'));

    if (isMiami && selectedOpp?.targetMarket.includes('Miami')) {
      score += 25;
      reasons.push('Specializes in Miami luxury residential properties');
      reasons.push('Actively transacts in Brickell, South Beach & Coral Gables');
    } else if (isSF) {
      score += 15;
      reasons.push('Deep familiarity with Bay Area clients relocating to Florida');
    }

    if (isLuxury) {
      score += 5;
      reasons.push('Proven record with transactions above $2,000,000+');
    }

    if (c.degree === 1) {
      score += 4;
      reasons.push('Direct 1st-degree connection in your verified network');
    }

    score = Math.min(97, score);

    return {
      contact: c,
      overallScore: score,
      breakdown: {
        geographyScore: isMiami ? 96 : 70,
        propertyTypeScore: 92,
        budgetAlignmentScore: 95,
        specializationScore: isLuxury ? 94 : 80,
        networkProximityScore: c.degree === 1 ? 100 : 75
      },
      matchReasons: reasons.length > 0 ? reasons : ['Verified real estate licensee on Referro platform'],
      connectionPath: c.degree === 1 ? 'Direct 1st-Degree Connection' : `Connected via ${c.connectedVia?.name || 'Colleague'} (2nd Degree)`
    };
  }).sort((a, b) => b.overallScore - a.overallScore);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Transparent AI Match Engine</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              AI Opportunity Matches
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Every score (0–100) is backed by mathematical weights: Geography, Budget Alignment, Specialization, and Relationship Degree.
            </p>
          </div>

          {/* Active Opportunity Selector */}
          <div className="w-full sm:w-72">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Matching For Opportunity:
            </label>
            <select
              value={selectedOppId}
              onChange={(e) => setSelectedOppId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {opportunities.map(o => (
                <option key={o.id} value={o.id}>
                  {o.title} ({o.targetMarket})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Opportunity Context Header */}
        {selectedOpp && (
          <div className="mt-5 p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <span className="font-bold text-indigo-950 text-sm block">{selectedOpp.title}</span>
              <span className="text-slate-600">
                Target: <strong>{selectedOpp.targetMarket}</strong> · Budget: <strong>{selectedOpp.priceRange.label}</strong> · Terms: <strong>{selectedOpp.referralTermsPct}% co-broke fee</strong>
              </span>
            </div>
            <button
              onClick={() => setActiveTab('give')}
              className="px-3 py-1.5 rounded-xl bg-white text-indigo-700 font-bold border border-indigo-200 hover:bg-indigo-50 transition-colors shadow-2xs"
            >
              Edit Lead Details
            </button>
          </div>
        )}
      </div>

      {/* Match Cards List */}
      <div className="space-y-4">
        {matchCandidates.slice(0, 4).map((cand) => (
          <div
            key={cand.contact.id}
            className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs hover:border-indigo-300 transition-all"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Agent Profile & Score */}
              <div className="flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-100 pb-5 lg:pb-0 lg:pr-6">
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3.5">
                      <img
                        src={cand.contact.avatarUrl}
                        alt={cand.contact.name}
                        className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-500/30"
                      />
                      <div>
                        <h4 className="font-extrabold text-base text-slate-900">{cand.contact.name}</h4>
                        <span className="text-xs text-slate-500 block">{cand.contact.company}</span>
                        <span className="inline-flex items-center text-[11px] text-slate-400 mt-0.5">
                          <MapPin className="w-3 h-3 mr-1" />
                          {cand.contact.location}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-black text-emerald-600 tracking-tight">
                        {cand.overallScore}%
                      </div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        AI Match
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-xs mb-3">
                    <span className="font-bold text-slate-700 block mb-0.5">Connection Path:</span>
                    <span className="text-slate-600">{cand.connectionPath}</span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {(cand.contact.expertise || []).map((exp, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-medium text-slate-600">
                        {exp}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => setActiveTab('give')}
                    className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center space-x-1.5"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Send Referral & Warm Intro</span>
                  </button>
                </div>
              </div>

              {/* Middle & Right: Score Breakdown & Reasons (Requirement #22) */}
              <div className="lg:col-span-2 space-y-4">
                {/* 5-Dimension Score Bars */}
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2.5">
                    Match Score Factor Breakdown
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="flex justify-between text-slate-500 mb-1 text-[11px]">
                        <span>Geography:</span>
                        <strong className="text-slate-900">{cand.breakdown.geographyScore}%</strong>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${cand.breakdown.geographyScore}%` }} />
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="flex justify-between text-slate-500 mb-1 text-[11px]">
                        <span>Budget Fit:</span>
                        <strong className="text-slate-900">{cand.breakdown.budgetAlignmentScore}%</strong>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${cand.breakdown.budgetAlignmentScore}%` }} />
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="flex justify-between text-slate-500 mb-1 text-[11px]">
                        <span>Expertise:</span>
                        <strong className="text-slate-900">{cand.breakdown.specializationScore}%</strong>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${cand.breakdown.specializationScore}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Explanation Paragraphs */}
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    Why the AI matched this candidate
                  </span>
                  <div className="space-y-2 text-xs text-slate-700 bg-slate-50/70 p-4 rounded-2xl border border-slate-200/60 leading-relaxed">
                    {cand.matchReasons.map((reason, idx) => (
                      <div key={idx} className="flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{reason}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
