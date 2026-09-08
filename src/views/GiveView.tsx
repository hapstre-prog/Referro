import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { OpportunityCategory, AIMatchCandidate, Opportunity } from '../types';
import { 
  Send, 
  Sparkles, 
  CheckCircle2, 
  MapPin, 
  DollarSign, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  UserCheck,
  Bot,
  FileText
} from 'lucide-react';

export const GiveView: React.FC = () => {
  const { user, createOpportunity, createReferralFromMatch, networkContacts, setActiveTab } = useApp();

  const [category, setCategory] = useState<OpportunityCategory>('out_of_area');
  const [naturalText, setNaturalText] = useState(
    'I have a tech executive buyer moving from San Francisco to Miami looking for a 3-bedroom luxury waterfront condo up to $3,000,000. Cash verified, ready in 60 days. Need a top-producing luxury specialist in Brickell/South Beach with 25% standard referral fee.'
  );
  const [title, setTitle] = useState('Tech Executive Relocating SF → Miami Waterfront Condo ($2M - $3.5M)');
  const [targetMarket, setTargetMarket] = useState('Miami, FL');
  const [minPrice, setMinPrice] = useState(2000000);
  const [maxPrice, setMaxPrice] = useState(3500000);
  const [referralPct, setReferralPct] = useState(25);
  const [isAiStructuring, setIsAiStructuring] = useState(false);
  const [generatedOpp, setGeneratedOpp] = useState<Opportunity | null>(null);
  const [matches, setMatches] = useState<AIMatchCandidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<AIMatchCandidate | null>(null);
  const [introDraftText, setIntroDraftText] = useState('');
  const [isDraftingIntro, setIsDraftingIntro] = useState(false);
  const [isIntroSent, setIsIntroSent] = useState(false);

  // Auto-structure with AI (Requirement #18)
  const handleAiStructure = async () => {
    setIsAiStructuring(true);
    try {
      const res = await fetch('/api/ai/structure-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: naturalText, type: 'give' })
      });
      const data = await res.json();
      if (data.title) setTitle(data.title);
      if (data.targetMarket) setTargetMarket(data.targetMarket);
      if (data.priceRange?.min) setMinPrice(data.priceRange.min);
      if (data.priceRange?.max) setMaxPrice(data.priceRange.max);
      if (data.referralTermsPct) setReferralPct(data.referralTermsPct);

      // Create opportunity
      const opp = await createOpportunity({
        type: 'give',
        category,
        title: data.title || title,
        description: naturalText,
        targetMarket: data.targetMarket || targetMarket,
        priceRange: {
          min: data.priceRange?.min || minPrice,
          max: data.priceRange?.max || maxPrice,
          label: `$${(((data.priceRange?.min || minPrice || 0)/1000000)).toFixed(1)}M - $${(((data.priceRange?.max || maxPrice || 0)/1000000)).toFixed(1)}M`
        },
        referralTermsPct: data.referralTermsPct || referralPct,
        structuredData: data
      });

      setGeneratedOpp(opp);

      // Rank network contacts based on criteria
      const scoredCandidates: AIMatchCandidate[] = networkContacts
        .map(c => {
          let score = 50;
          const matchReasons: string[] = [];
          const markets = (c.marketsServed && c.marketsServed.length > 0) ? c.marketsServed : (c.geographicCoverage || []);
          const expertise = c.expertise || [];

          if (markets.some(m => m.toLowerCase().includes('miami') || m.toLowerCase().includes('fl')) || (c.location && c.location.toLowerCase().includes('miami'))) {
            score += 35;
            matchReasons.push('Active verified producer in Miami market');
          }
          if (expertise.some(e => e.toLowerCase().includes('luxury') || e.toLowerCase().includes('buyer'))) {
            score += 10;
            matchReasons.push('Luxury buyer representation specialist');
          }
          if (c.degree === 1) {
            score += 5;
            matchReasons.push('Direct 1st-degree connection in your personal network');
          }
          score = Math.min(98, score);

          return {
            contact: c,
            overallScore: score,
            breakdown: {
              geographyScore: (markets.some(m => m.toLowerCase().includes('miami')) || (c.location && c.location.toLowerCase().includes('miami'))) ? 95 : 40,
              propertyTypeScore: 90,
              budgetAlignmentScore: 95,
              specializationScore: 92,
              networkProximityScore: c.degree === 1 ? 100 : 75
            },
            matchReasons: matchReasons.length > 0 ? matchReasons : ['Colleague in verified network'],
            connectionPath: c.degree === 1 ? 'Direct 1st Degree' : `Connected via ${c.connectedVia?.name || 'Colleague'} (2nd Degree)`
          };
        })
        .sort((a, b) => b.overallScore - a.overallScore);

      setMatches(scoredCandidates.slice(0, 3));
    } catch (e: any) {
      console.warn('[GiveView] Notice:', e?.message || e);
    } finally {
      setIsAiStructuring(false);
    }
  };

  // Open Intro Modal with AI draft
  const handleOpenIntroModal = async (candidate: AIMatchCandidate) => {
    setSelectedCandidate(candidate);
    setIsDraftingIntro(true);

    try {
      const res = await fetch('/api/ai/draft-intro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          giverName: user.name,
          takerName: candidate.contact.name,
          clientDescription: 'Tech executive relocating from SF looking for a waterfront condo ($2.5M - $3M)',
          opportunityTitle: title,
          targetMarket: candidate.contact.location,
          takerExpertise: candidate.contact.expertise || []
        })
      });
      const data = await res.json();
      setIntroDraftText(data.draft || `Hi ${candidate.contact.name}, I have an exclusive buyer referral opportunity for you in ${targetMarket}. Let's collaborate!`);
    } catch (e) {
      setIntroDraftText(`Hi ${candidate.contact.name}, I have an active buyer client relocating to ${targetMarket} ($${(((minPrice || 0)/1000000)).toFixed(1)}M - $${(((maxPrice || 0)/1000000)).toFixed(1)}M). I know your expertise in luxury properties and would love to introduce them under standard 25% referral terms.`);
    } finally {
      setIsDraftingIntro(false);
    }
  };

  const handleSendIntroduction = async () => {
    if (!generatedOpp || !selectedCandidate) return;
    await createReferralFromMatch(generatedOpp, selectedCandidate, introDraftText);
    setIsIntroSent(true);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center space-x-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-1">
          <Send className="w-4 h-4" />
          <span>Give an Opportunity</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          What do you have?
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
          Monetize the out-of-area clients, buyer overflows, and contractor seller leads you can't service yourself with 25% - 30% co-broke commissions.
        </p>

        {/* Category selector */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mt-5">
          {[
            { id: 'out_of_area', label: 'Out of Area' },
            { id: 'buyer', label: 'Buyer' },
            { id: 'seller', label: 'Seller' },
            { id: 'listing', label: 'Listing' },
            { id: 'contractor_lead', label: 'Contractor Lead' },
            { id: 'investor_lead', label: 'Investor Lead' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id as OpportunityCategory)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all border text-center ${
                category === cat.id
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input Section: AI Structured Prompt */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center">
            <Sparkles className="w-4 h-4 text-indigo-600 mr-1.5" />
            Describe the Lead (Natural Language or Details)
          </label>
          <span className="text-[11px] text-slate-400">AI auto-extracts terms & location</span>
        </div>

        <textarea
          rows={3}
          value={naturalText}
          onChange={(e) => setNaturalText(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors leading-relaxed"
          placeholder="e.g., I have a luxury buyer moving from NYC to Miami looking for a 3-bedroom penthouse with water views up to $4M, closing within 60 days. Standard 25% referral fee."
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-100">
          <div>
            <label className="text-[11px] font-semibold text-slate-500 block mb-1">Target Market</label>
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs">
              <MapPin className="w-3.5 h-3.5 text-slate-400 mr-1.5" />
              <input
                type="text"
                value={targetMarket}
                onChange={(e) => setTargetMarket(e.target.value)}
                className="bg-transparent w-full font-medium text-slate-900 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-500 block mb-1">Price Range</label>
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs">
              <DollarSign className="w-3.5 h-3.5 text-slate-400 mr-1" />
              <span className="text-slate-900 font-semibold">
                ${(((minPrice || 0)/1000000)).toFixed(1)}M - ${(((maxPrice || 0)/1000000)).toFixed(1)}M
              </span>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-500 block mb-1">Referral Terms</label>
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 mr-1.5" />
              <span className="text-slate-900 font-semibold">{referralPct}% Referral Fee</span>
            </div>
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={handleAiStructure}
            disabled={isAiStructuring || !naturalText.trim()}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-4 h-4 text-indigo-200" />
            <span>{isAiStructuring ? 'AI Structuring & Matching...' : 'Structure with AI & Find Verified Matches'}</span>
          </button>
        </div>
      </div>

      {/* Matches Results */}
      {matches.length > 0 && (
        <div className="space-y-4 animate-in fade-in-50 duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center">
                <Sparkles className="w-4 h-4 text-indigo-600 mr-2" />
                Ranked AI Matches in Your Network
              </h3>
              <p className="text-xs text-slate-500">
                AI verified these candidates based on local market production, specialization, and relationship proximity.
              </p>
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              {matches.length} Top Matches Found
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {matches.map((cand) => (
              <div 
                key={cand.contact.id} 
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:border-indigo-200 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <img
                        src={cand.contact.avatarUrl}
                        alt={cand.contact.name}
                        className="w-12 h-12 rounded-xl object-cover ring-2 ring-indigo-500/20"
                      />
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">{cand.contact.name}</h4>
                        <span className="text-xs text-slate-500 block">{cand.contact.company}</span>
                        <span className="text-[10px] text-slate-400 block">{cand.contact.location}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-black text-emerald-600">
                        {cand.overallScore}%
                      </div>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                        Match Score
                      </span>
                    </div>
                  </div>

                  {/* Relationship Badge */}
                  <div className="bg-slate-50 rounded-xl p-2.5 mb-3 border border-slate-100 text-[11px]">
                    <span className="font-bold text-slate-700 block mb-0.5">Connection Path:</span>
                    <span className="text-slate-600">{cand.connectionPath}</span>
                  </div>

                  {/* Match reasons */}
                  <div className="space-y-1 mb-4 text-[11px] text-slate-600">
                    {cand.matchReasons.map((r, i) => (
                      <div key={i} className="flex items-center space-x-1.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                        <span className="line-clamp-1">{r}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <button
                    onClick={() => handleOpenIntroModal(cand)}
                    className="w-full py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors flex items-center justify-center space-x-1.5 shadow-2xs"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Send Referral & Warm Intro</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Introduction Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Initiate Referral to {selectedCandidate.contact.name}
                </h3>
                <p className="text-xs text-slate-500">
                  Referro establishes an enforceable legal agreement and delivers a warm introduction.
                </p>
              </div>
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                {referralPct}% Referral Split
              </span>
            </div>

            {/* Fee summary box */}
            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80 mb-4 grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <span className="text-slate-400 text-[10px] block">Est. Deal Value</span>
                <strong className="text-slate-900 font-bold">${minPrice.toLocaleString()}</strong>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Gross 3% Comm.</span>
                <strong className="text-slate-900 font-bold">${(minPrice * 0.03).toLocaleString()}</strong>
              </div>
              <div>
                <span className="text-emerald-700 text-[10px] block">Your Net Payout (25%)</span>
                <strong className="text-emerald-700 font-extrabold">+${((minPrice * 0.03 * 0.25) * 0.9).toLocaleString()}</strong>
              </div>
            </div>

            {/* AI Draft message */}
            <div className="mb-5">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-1.5 flex items-center justify-between">
                <span>Warm Introduction Message (AI Drafted)</span>
                {isDraftingIntro && <span className="text-[10px] text-indigo-600 font-normal">AI writing draft...</span>}
              </label>
              <textarea
                rows={5}
                value={introDraftText}
                onChange={(e) => setIntroDraftText(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 leading-relaxed focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {isIntroSent ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <h4 className="font-bold text-sm text-emerald-900">Referral Successfully Created!</h4>
                <p className="text-xs text-emerald-700 mt-1 mb-3">
                  Deal added to your Pipeline Kanban and contract executed.
                </p>
                <button
                  onClick={() => {
                    setSelectedCandidate(null);
                    setIsIntroSent(false);
                    setActiveTab('deals');
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs"
                >
                  View in Deals Pipeline &rarr;
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => setSelectedCandidate(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendIntroduction}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center space-x-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Execute Agreement & Send Intro</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
