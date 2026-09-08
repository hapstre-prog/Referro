import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { AIMatchCandidate } from '../types';
import { 
  getMatchedOutsideNetworkResults,
  LEVEL_1_BENCHMARKS
} from '../data/outsideNetworkData';
import { 
  Search,
  Sparkles, 
  Coins, 
  RefreshCw, 
  TrendingUp, 
  Zap, 
  Users, 
  Award, 
  Lock, 
  Unlock, 
  Globe2, 
  CheckCircle2, 
  Building2, 
  Phone, 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  ChevronRight, 
  X, 
  CreditCard,
  Send,
  SlidersHorizontal
} from 'lucide-react';

interface MatchAndReferViewProps {
  initialMode?: 'auto' | 'give' | 'take';
}

const SEARCH_HINTS = [
  {
    label: 'Relocating buyer to Miami ($2.5M - $3M)',
    query: 'Referring a verified tech executive buyer relocating from SF to Miami ($2M - $3.5M cash budget). Looking for Brickell luxury specialist.',
    market: 'Miami, FL'
  },
  {
    label: 'Buyer agent for $7.85M SF luxury listing',
    query: 'Need a top buyer agent for my $7.85M Pacific Heights historic luxury listing (127 days active) with liquid cash buyers.',
    market: 'San Francisco, CA'
  },
  {
    label: 'Aspen off-market ski estate ($12.5M)',
    query: 'Seeking Aspen co-broke partner for an off-market ski-in/ski-out estate ($12.5M). Need deep UHNW buyer rolodex.',
    market: 'Aspen, CO'
  },
  {
    label: 'Austin 40-unit multi-family acquisition',
    query: 'Need an active commercial acquisition specialist in Austin, TX for 40-unit multifamily value-add syndication.',
    market: 'Austin, TX'
  }
];

export const MatchAndReferView: React.FC<MatchAndReferViewProps> = ({ initialMode = 'auto' }) => {
  const { 
    wallet, 
    isDemoMode, 
    networkContacts, 
    setActiveTab,
    consumeSearchCredit,
    setZeroCreditModalOpen,
    createOpportunity,
    createReferralFromMatch
  } = useApp();

  const [query, setQuery] = useState(
    isDemoMode
      ? (initialMode === 'give'
        ? 'I have a tech buyer relocating from San Francisco to Miami looking for a waterfront condo up to $3M.'
        : 'Need a top buyer agent for my $7.85M Pacific Heights historic luxury listing with liquid cash buyers.')
      : ''
  );

  const [hasSearched, setHasSearched] = useState(isDemoMode);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [searchScope, setSearchScope] = useState<'outside_network' | 'level_1_network'>('outside_network');
  const [displayFilter, setDisplayFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  const [outsideMatches, setOutsideMatches] = useState<AIMatchCandidate[]>([]);
  const [unlockedIds, setUnlockedIds] = useState<string[]>([]);
  const [level1Matches, setLevel1Matches] = useState<AIMatchCandidate[]>([]);

  // Modals & notifications
  const [selectedForUnlock, setSelectedForUnlock] = useState<AIMatchCandidate | null>(null);
  const [selectedForIntro, setSelectedForIntro] = useState<AIMatchCandidate | null>(null);
  const [introSentMessage, setIntroSentMessage] = useState<string | null>(null);
  const [unlockToast, setUnlockToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  const resultsRef = useRef<HTMLDivElement>(null);

  // Initial load — only auto-search in demo mode (mock data)
  useEffect(() => {
    if (isDemoMode) {
      executeSearch();
    }
  }, []);

  // Clear toast
  useEffect(() => {
    if (unlockToast) {
      const t = setTimeout(() => setUnlockToast(null), 4000);
      return () => clearTimeout(t);
    }
  }, [unlockToast]);

  const executeSearch = (scopeOverride?: 'outside_network' | 'level_1_network', queryOverride?: string) => {
    const q = queryOverride !== undefined ? queryOverride : query;
    if (!q.trim()) return;

    setIsAnalyzing(true);
    setHasSearched(true);
    const scope = scopeOverride || searchScope;

    if (scope === 'outside_network') {
      if (!isDemoMode) {
        // No mock outside-network data in production mode
        setTimeout(() => {
          setOutsideMatches([]);
          setUnlockedIds([]);
          setSearchScope('outside_network');
          setIsAnalyzing(false);
        }, 350);
      } else {
        const { candidates, initialUnlockedIds } = getMatchedOutsideNetworkResults(12);
        setTimeout(() => {
          setOutsideMatches(candidates);
          setUnlockedIds(initialUnlockedIds);
          setSearchScope('outside_network');
          setIsAnalyzing(false);
          setUnlockToast({
            message: 'AI found 12 outperforming agents: 2 unlocked free, 10 masked.',
            type: 'info'
          });
        }, 350);
      }
    } else {
      setTimeout(() => {
        const l1Contacts = networkContacts.filter(c => c.degree === 1);
        const scored: AIMatchCandidate[] = l1Contacts.map(c => {
          const isLuxury = (c.expertise || []).some(e => e.toLowerCase().includes('luxury') || e.toLowerCase().includes('buyer'));
          return {
            contact: c,
            overallScore: isLuxury ? 94 : 82,
            matchLevel: 'my_network' as const,
            breakdown: {
              geographyScore: 92,
              propertyTypeScore: 88,
              budgetAlignmentScore: 85,
              specializationScore: isLuxury ? 90 : 75,
              networkProximityScore: 100
            },
            matchReasons: [
              'Direct 1st-degree connection in your verified address book',
              'Proven track record in regional residential transactions',
              `Past volume: $${(((c.totalSalesVolume || 35000000) / 1000000)).toFixed(0)}M`
            ],
            connectionPath: 'Direct 1st-Degree Connection'
          };
        }).sort((a, b) => b.overallScore - a.overallScore);

        setLevel1Matches(scored.slice(0, 4));
        setSearchScope('level_1_network');
        setIsAnalyzing(false);
      }, 300);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeSearch();
    }
  };

  const applyHint = (hintQuery: string) => {
    setQuery(hintQuery);
    executeSearch(undefined, hintQuery);
  };

  // Handle Single Profile Unlock
  const handleUnlockCandidate = (candidate: AIMatchCandidate) => {
    if (unlockedIds.includes(candidate.contact.id)) return;

    if (wallet.availableCredits < 1 && !isDemoMode) {
      setSelectedForUnlock(candidate);
      return;
    }

    const success = consumeSearchCredit('beyond_network', () => {
      setUnlockedIds(prev => [...prev, candidate.contact.id]);
      setUnlockToast({
        message: `Unlocked ${candidate.contact.name}! 1 credit used. Direct contact details visible.`,
        type: 'success'
      });
      setSelectedForUnlock(null);
    });

    if (!success) {
      setSelectedForUnlock(candidate);
    }
  };

  // Handle Bulk Unlock
  const handleBulkUnlock = () => {
    const lockedCandidates = outsideMatches.filter(c => !unlockedIds.includes(c.contact.id));
    if (lockedCandidates.length === 0) return;

    const bulkCost = Math.min(5, lockedCandidates.length);
    if (wallet.availableCredits < bulkCost && !isDemoMode) {
      setZeroCreditModalOpen(true);
      return;
    }

    lockedCandidates.forEach(() => {
      consumeSearchCredit('beyond_network', () => {});
    });

    setUnlockedIds(outsideMatches.map(c => c.contact.id));
    setUnlockToast({
      message: `Unlocked all ${lockedCandidates.length} remaining outperforming profiles!`,
      type: 'success'
    });
  };

  // Send Formal Introduction
  const handleSendIntroduction = async (candidate: AIMatchCandidate) => {
    const isRelocation = query.toLowerCase().includes('buyer') || query.toLowerCase().includes('refer');
    const opp = await createOpportunity({
      type: isRelocation ? 'give' : 'take',
      category: isRelocation ? 'out_of_area_referral' : 'listing',
      title: query.slice(0, 70) + (query.length > 70 ? '...' : ''),
      description: query,
      targetMarket: candidate.contact.location,
      priceRange: { min: 2000000, max: 7850000, label: '$2M - $8M' },
      referralTermsPct: 25
    });

    await createReferralFromMatch(
      opp,
      candidate,
      `Hello ${candidate.contact.name}, I would like to introduce an opportunity regarding: "${query.slice(0, 60)}...". Standard 25% referral terms via Referro Escrow.`
    );
    setSelectedForIntro(null);
    setIntroSentMessage(`Referral agreement sent to ${candidate.contact.name} with standard 25% escrow protection.`);
    setTimeout(() => setIntroSentMessage(null), 5000);
  };

  const getMaskedName = (fullName: string) => {
    const parts = fullName.split(' ');
    return parts.map(part => part.charAt(0) + '•'.repeat(Math.max(part.length - 1, 4))).join(' ');
  };

  const displayedCandidates = outsideMatches.filter(cand => {
    const isUnlocked = unlockedIds.includes(cand.contact.id);
    if (displayFilter === 'unlocked') return isUnlocked;
    if (displayFilter === 'locked') return !isUnlocked;
    return true;
  });

  const unlockedCount = outsideMatches.filter(c => unlockedIds.includes(c.contact.id)).length;
  const lockedCount = outsideMatches.length - unlockedCount;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Toast Notification */}
      {unlockToast && (
        <div className={`fixed bottom-6 right-6 z-50 p-4 rounded-xl shadow-lg border flex items-center space-x-3 max-w-md animate-in slide-in-from-bottom-5 duration-200 ${
          unlockToast.type === 'success' 
            ? 'bg-emerald-900 text-white border-emerald-700' 
            : 'bg-slate-900 text-white border-slate-700'
        }`}>
          {unlockToast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <Sparkles className="w-5 h-5 text-indigo-400 shrink-0" />
          )}
          <p className="text-xs font-medium leading-relaxed">{unlockToast.message}</p>
          <button onClick={() => setUnlockToast(null)} className="text-slate-400 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Intro Sent Confirmation */}
      {introSentMessage && (
        <div className="bg-emerald-900 text-white p-4 rounded-2xl border border-emerald-700 shadow-md flex items-center justify-between animate-in fade-in">
          <div className="flex items-center space-x-3">
            <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-300">Agreement Executed</div>
              <p className="text-xs font-medium">{introSentMessage}</p>
            </div>
          </div>
          <button 
            onClick={() => setActiveTab('deals')}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-xs shrink-0 transition-colors"
          >
            Track in Pipeline
          </button>
        </div>
      )}

      {/* TOP: Wallet Mini Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>AI Referral Match Engine</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs font-medium text-slate-500">Wallet:</span>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center space-x-1">
            <Coins className="w-3.5 h-3.5 text-indigo-600" />
            <span>{isDemoMode ? 'Unlimited' : `${wallet.availableCredits} Credits`}</span>
          </span>
          <button
            onClick={() => setActiveTab('credits')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors ml-1"
          >
            + Add Credits
          </button>
        </div>
      </div>

      {/* GOOGLE-STYLE MINIMALIST SEARCH HERO */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-10 shadow-sm text-center">
        {/* Title */}
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-4">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Natural Language Real Estate Match</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
          Find Any Agent, Listing, or Referral Partner
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto mb-7 leading-relaxed">
          Type your client, relocation, or listing in plain English. Referro AI searches outperforming agents outside your network with verified buyer demand.
        </p>

        {/* The Pure Google-Style Search Bar */}
        <div className="max-w-2xl mx-auto">
          <div className="relative flex items-center bg-slate-50/80 hover:bg-white focus-within:bg-white rounded-full border border-slate-300 hover:border-slate-400 focus-within:border-indigo-600 focus-within:ring-4 focus-within:ring-indigo-100 transition-all shadow-xs p-1.5 pl-4 sm:pl-5">
            <Search className="w-5 h-5 text-slate-400 shrink-0 mr-3" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g. Relocating tech buyer to Miami ($2M-$3.5M cash) or buyer agent for luxury listing..."
              className="w-full bg-transparent border-none text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full transition-colors mr-1"
                aria-label="Clear input"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => executeSearch()}
              disabled={isAnalyzing}
              className="px-5 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-bold text-xs sm:text-sm transition-all shadow-sm flex items-center space-x-1.5 shrink-0"
            >
              <Sparkles className={`w-3.5 h-3.5 text-indigo-200 ${isAnalyzing ? 'animate-spin' : ''}`} />
              <span>{isAnalyzing ? 'Searching...' : 'Search'}</span>
            </button>
          </div>

          {/* Clean Prompt Hints Below Search Bar */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-slate-400 text-[11px] font-medium mr-1">Try asking:</span>
            {SEARCH_HINTS.map((hint, idx) => (
              <button
                key={idx}
                onClick={() => applyHint(hint.query)}
                className="px-3 py-1 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 border border-slate-200/80 text-[11px] transition-colors"
              >
                {hint.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RESULTS SECTION (Rendered directly below once searched) */}
      {hasSearched && (
        <div ref={resultsRef} className="space-y-4 pt-2">
          {/* Streamlined Results Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center space-x-2 text-xs">
              <span className="font-bold text-slate-900">
                {searchScope === 'outside_network' ? (
                  <>12 Outperforming Agents Matched</>
                ) : (
                  <>Level 1 In-Network Contacts</>
                )}
              </span>
              {searchScope === 'outside_network' && (
                <div className="flex items-center space-x-1.5">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    2 Unlocked Free
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                    10 Masked (1 Credit)
                  </span>
                </div>
              )}
            </div>

            {/* Scope & Filter Toggles */}
            <div className="flex items-center space-x-2">
              {searchScope === 'outside_network' ? (
                <>
                  <button
                    onClick={() => {
                      setSearchScope('level_1_network');
                      executeSearch('level_1_network');
                    }}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-xs transition-colors flex items-center space-x-1"
                  >
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>Limit to My Network</span>
                  </button>

                  {lockedCount > 0 && (
                    <button
                      onClick={handleBulkUnlock}
                      className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-xs shadow-2xs transition-all flex items-center space-x-1.5"
                    >
                      <Coins className="w-3.5 h-3.5 text-amber-200" />
                      <span>Unlock All ({Math.min(5, lockedCount)} Credits)</span>
                    </button>
                  )}
                </>
              ) : (
                <button
                  onClick={() => {
                    setSearchScope('outside_network');
                    executeSearch('outside_network');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors shadow-2xs flex items-center space-x-1"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
                  <span>Switch to Outside Network</span>
                </button>
              )}
            </div>
          </div>

          {/* Empty state when no results (non-demo mode) */}
          {((searchScope === 'outside_network' && outsideMatches.length === 0) ||
            (searchScope === 'level_1_network' && level1Matches.length === 0)) && !isAnalyzing && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-10 text-center shadow-2xs">
              <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-700 mb-1">
                {searchScope === 'outside_network' ? 'No outside-network agents found.' : 'No contacts in your network yet.'}
              </p>
              <p className="text-xs text-slate-400">
                {searchScope === 'outside_network' 
                  ? 'Connect your LinkedIn account to sync your real network, or try searching within your network.'
                  : 'Connect LinkedIn or add contacts to start matching with referral partners.'}
              </p>
            </div>
          )}

          {/* Matched Agents Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(searchScope === 'outside_network' ? displayedCandidates : level1Matches).map((cand) => {
              const isUnlocked = searchScope === 'level_1_network' || unlockedIds.includes(cand.contact.id);

              return (
                <div
                  key={cand.contact.id}
                  className={`bg-white rounded-2xl border transition-all flex flex-col justify-between relative overflow-hidden ${
                    isUnlocked 
                      ? 'border-slate-200/90 p-5 shadow-2xs hover:border-indigo-300' 
                      : 'border-amber-200/80 p-5 shadow-2xs hover:border-amber-400 bg-gradient-to-b from-white via-amber-50/20 to-white'
                  }`}
                >
                  {!isUnlocked && (
                    <div className="absolute top-3 right-3 z-10 flex items-center space-x-1 bg-amber-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold shadow-2xs">
                      <Lock className="w-2.5 h-2.5" />
                      <span>Masked • 1 Credit</span>
                    </div>
                  )}

                  <div>
                    {/* Identity & Match Score */}
                    <div className="flex items-start justify-between mb-3.5">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <img
                            src={cand.contact.avatarUrl}
                            alt={isUnlocked ? cand.contact.name : 'Masked Agent'}
                            className={`w-12 h-12 rounded-xl object-cover ring-2 transition-all ${
                              isUnlocked ? 'ring-indigo-500/20' : 'ring-amber-500/30 blur-xs'
                            }`}
                          />
                          {!isUnlocked && (
                            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/30 rounded-xl backdrop-blur-2xs text-white">
                              <Lock className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center space-x-1.5">
                            <h4 className="font-bold text-sm text-slate-900">
                              {isUnlocked ? cand.contact.name : getMaskedName(cand.contact.name)}
                            </h4>
                            {!isUnlocked && (
                              <span className="text-[9px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                                Locked
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-slate-600 font-medium block">{cand.contact.title}</span>
                          <span className="text-[11px] text-slate-500 block flex items-center">
                            <Building2 className="w-3 h-3 mr-1 text-slate-400 inline shrink-0" />
                            {cand.contact.company}
                          </span>
                          <span className="text-[10px] text-slate-400 block">{cand.contact.location}</span>
                        </div>
                      </div>

                      {isUnlocked && (
                        <div className="text-right shrink-0">
                          <div className="text-xl font-black text-indigo-600">{cand.overallScore}%</div>
                          <span className="text-[9px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                            AI Match
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Outperformance Metric Callout */}
                    {cand.outperformance && (
                      <div className="mb-3.5 p-3 rounded-xl bg-gradient-to-br from-emerald-50/90 via-teal-50/60 to-slate-50 border border-emerald-200/90">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-extrabold text-emerald-900 uppercase tracking-wider flex items-center">
                            <TrendingUp className="w-3.5 h-3.5 text-emerald-600 mr-1" />
                            Outperforms L1 Network
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300/80">
                            {cand.outperformance.salesVolumeMultiplier}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[11px] mb-2">
                          <div className="bg-white/80 p-2 rounded-lg border border-emerald-100">
                            <span className="text-slate-400 block text-[9px] uppercase font-bold">Annual Volume</span>
                            <span className="font-extrabold text-slate-900 block">${(((cand.contact.totalSalesVolume || 0) / 1000000)).toFixed(0)}M</span>
                            <span className="text-[9px] text-emerald-700 font-semibold">vs $38.5M L1 avg</span>
                          </div>
                          <div className="bg-white/80 p-2 rounded-lg border border-emerald-100">
                            <span className="text-slate-400 block text-[9px] uppercase font-bold">Days to Contract</span>
                            <span className="font-extrabold text-slate-900 block">{cand.outperformance.closingSpeed.split('(')[0].trim()}</span>
                            <span className="text-[9px] text-emerald-700 font-semibold">vs 44d L1 avg</span>
                          </div>
                        </div>

                        <p className="text-[11px] text-emerald-950 font-medium leading-relaxed">
                          💡 <strong className="font-semibold">Key Advantage:</strong> {cand.outperformance.activeBuyerAdvantage}
                        </p>
                      </div>
                    )}

                    {/* UNLOCKED: Match Reasons & Direct Contacts */}
                    {isUnlocked ? (
                      <div className="mb-4">
                        <span className="text-[11px] font-bold text-slate-900 uppercase tracking-wider block mb-1.5 flex items-center">
                          <Zap className="w-3 h-3 text-amber-500 mr-1" />
                          Why AI Matched This Agent:
                        </span>
                        <div className="space-y-1.5 text-[11px] text-slate-600 mb-3">
                          {cand.matchReasons.map((reason, i) => (
                            <div key={i} className="flex items-start space-x-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                              <span className="leading-snug">{reason}</span>
                            </div>
                          ))}
                        </div>

                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70 text-[11px] space-y-1 text-slate-600">
                          <div className="flex items-center justify-between">
                            <span className="flex items-center text-slate-500">
                              <Phone className="w-3 h-3 mr-1 text-indigo-500" />
                              Direct Cell:
                            </span>
                            <span className="font-semibold text-slate-800">{cand.contact.phone}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="flex items-center text-slate-500">
                              <Mail className="w-3 h-3 mr-1 text-indigo-500" />
                              Direct Email:
                            </span>
                            <span className="font-semibold text-slate-800">{cand.contact.email}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* MASKED PROFILE TEASER */
                      <div className="mb-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 text-center">
                        <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-2 shadow-2xs">
                          <Lock className="w-4 h-4" />
                        </div>
                        <div className="text-xs font-bold text-slate-900">
                          Agent Identity & Buyer Rolodex Masked
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 mb-2.5">
                          Unlock cell phone, direct email, and 25% referral contract with {cand.contact.company}.
                        </p>
                        <button
                          onClick={() => handleUnlockCandidate(cand)}
                          className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all shadow-xs flex items-center justify-center space-x-1.5"
                        >
                          <Coins className="w-3.5 h-3.5 text-amber-300" />
                          <span>Unlock Agent Profile (1 Credit)</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Card Bottom CTA */}
                  {isUnlocked ? (
                    <div className="pt-3 border-t border-slate-100 flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedForIntro(cand)}
                        className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors flex items-center justify-center space-x-1 shadow-2xs"
                      >
                        <span>Request Introduction (25% Fee)</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <span className="flex items-center">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 mr-1" />
                        Referro Escrow Protection
                      </span>
                      <button
                        onClick={() => handleUnlockCandidate(cand)}
                        className="text-indigo-600 font-bold hover:underline flex items-center space-x-1"
                      >
                        <span>Unlock Profile</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Credit Unlock Modal */}
      {selectedForUnlock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
                <Coins className="w-5 h-5" />
              </div>
              <button onClick={() => setSelectedForUnlock(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Unlock Outperforming Agent Profile
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Access full identity, direct phone, email, and 25% referral escrow introduction with {selectedForUnlock.contact.company}.
            </p>

            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 mb-4 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Target Agent:</span>
                <span className="font-bold text-slate-800">{getMaskedName(selectedForUnlock.contact.name)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Brokerage:</span>
                <span className="font-bold text-slate-800">{selectedForUnlock.contact.company}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm font-bold">
                <span className="text-slate-700">Unlock Cost:</span>
                <span className="text-indigo-600">1 Credit</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Your Current Balance:</span>
                <span className={`font-bold ${wallet.availableCredits > 0 ? 'text-slate-800' : 'text-amber-600'}`}>
                  {wallet.availableCredits} Credits
                </span>
              </div>
            </div>

            {wallet.availableCredits >= 1 || isDemoMode ? (
              <div className="flex items-center justify-end space-x-3 mt-6">
                <button
                  onClick={() => setSelectedForUnlock(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleUnlockCandidate(selectedForUnlock)}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors shadow-xs flex items-center space-x-1.5"
                >
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Confirm Unlock (1 Credit)</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3 mt-4">
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                  <strong>You have 0 credits available.</strong> Buy a credit pack to unlock this profile and connect immediately.
                </div>
                <button
                  onClick={() => {
                    setSelectedForUnlock(null);
                    setActiveTab('credits');
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center space-x-2"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Buy Credits Now (from $15/credit)</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Introduction Modal */}
      {selectedForIntro && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                <Send className="w-5 h-5" />
              </div>
              <button onClick={() => setSelectedForIntro(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Send Referral Agreement & Warm Intro
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Connect with {selectedForIntro.contact.name} ({selectedForIntro.contact.company}) under standard 25% Referro escrow protection.
            </p>

            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 mb-4 text-xs space-y-2.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Partner Agent:</span>
                <span className="font-bold text-slate-800">{selectedForIntro.contact.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Brokerage:</span>
                <span className="font-bold text-slate-800">{selectedForIntro.contact.company}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Opportunity Query:</span>
                <span className="font-semibold text-slate-700">{query.slice(0, 50)}...</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                <span className="text-slate-700 font-bold">Referral Split:</span>
                <span className="font-black text-emerald-600 text-sm">25% Escrow Protected</span>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setSelectedForIntro(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSendIntroduction(selectedForIntro)}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors shadow-xs flex items-center space-x-1.5"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Execute & Send Agreement</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
