import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { AIMatchCandidate } from '../types';
import { 
  getMatchedOutsideNetworkResults,
  LEVEL_1_BENCHMARKS,
  OUTSIDE_NETWORK_CANDIDATES
} from '../data/outsideNetworkData';
import { 
  Download, 
  Sparkles, 
  Search, 
  MapPin, 
  CheckCircle2, 
  ShieldCheck, 
  Coins, 
  ArrowRight,
  Filter,
  RefreshCw,
  TrendingUp,
  Zap,
  Users,
  Award,
  Lock,
  Unlock,
  Globe2,
  ExternalLink,
  ChevronRight,
  Phone,
  Mail,
  Eye,
  AlertCircle,
  X,
  CreditCard,
  Building2
} from 'lucide-react';

export const TakeView: React.FC = () => {
  const { 
    wallet, 
    isDemoMode, 
    networkContacts, 
    setActiveTab,
    consumeSearchCredit,
    setZeroCreditModalOpen,
    creditPackages,
    purchasePackage
  } = useApp();

  const [query, setQuery] = useState('Need a buyer for my $7.85M Pacific Heights historic luxury listing (127 days active)');
  const [targetCategory, setTargetCategory] = useState<'buyer_agent' | 'listing_help' | 'contractor' | 'investor'>('buyer_agent');
  const [searchScope, setSearchScope] = useState<'outside_network' | 'level_1_network'>('outside_network');
  const [isSearching, setIsSearching] = useState(false);
  
  // Outside network matched candidates (12 in total)
  const [outsideMatches, setOutsideMatches] = useState<AIMatchCandidate[]>([]);
  // Unlocked candidate IDs (initially 2, rest are masked)
  const [unlockedIds, setUnlockedIds] = useState<string[]>([]);
  
  // Filter for outside network view: 'all' | 'unlocked' | 'locked'
  const [displayFilter, setDisplayFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  // Modal for unlocking or insufficient credits
  const [selectedForUnlock, setSelectedForUnlock] = useState<AIMatchCandidate | null>(null);
  const [unlockToast, setUnlockToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);
  const [isUnlocking, setIsUnlocking] = useState(false);

  // Level 1 network matches (if user explicitly chooses to limit)
  const [level1Matches, setLevel1Matches] = useState<AIMatchCandidate[]>([]);

  // Automate search directly outside network on initial load
  useEffect(() => {
    executeOutsideNetworkSearch();
  }, []);

  // Clear toast after 4s
  useEffect(() => {
    if (unlockToast) {
      const timer = setTimeout(() => setUnlockToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [unlockToast]);

  // Automated search directly outside network (returns 12 candidates, 2 initially revealed, 10 masked)
  const executeOutsideNetworkSearch = () => {
    setIsSearching(true);
    const { candidates, initialUnlockedIds } = getMatchedOutsideNetworkResults(12);
    
    setTimeout(() => {
      setOutsideMatches(candidates);
      setUnlockedIds(initialUnlockedIds);
      setSearchScope('outside_network');
      setIsSearching(false);
      setUnlockToast({
        message: `Found 12 outperforming agents. 2 profiles unlocked free, 10 masked.`,
        type: 'info'
      });
    }, 320);
  };

  // Limit search within Level 1 network if requested by user
  const handleLimitToLevel1Network = () => {
    setIsSearching(true);
    setTimeout(() => {
      const l1Contacts = networkContacts.filter(c => c.degree === 1);
      const scored: AIMatchCandidate[] = l1Contacts.map(c => {
        const isLuxury = (c.expertise || []).some(e => e.toLowerCase().includes('luxury') || e.toLowerCase().includes('buyer'));
        const inSF = (c.geographicCoverage || []).some(g => g.toLowerCase().includes('san francisco')) || (c.location && c.location.toLowerCase().includes('san francisco'));
        
        let score = 78;
        if (isLuxury) score += 8;
        if (inSF) score += 6;

        return {
          contact: c,
          overallScore: score,
          matchLevel: 'my_network' as const,
          breakdown: {
            geographyScore: inSF ? 95 : 70,
            propertyTypeScore: isLuxury ? 90 : 75,
            budgetAlignmentScore: 82,
            specializationScore: isLuxury ? 88 : 74,
            networkProximityScore: 100
          },
          matchReasons: [
            'Direct 1st-degree connection in your verified contact book',
            inSF ? 'Active presence in Northern California' : 'General luxury residential transaction history',
            `Past closed volume: $${(((c.totalSalesVolume || 35000000) / 1000000)).toFixed(0)}M`
          ],
          connectionPath: 'Direct Level 1 Network Connection (1st Degree)'
        };
      }).sort((a, b) => b.overallScore - a.overallScore);

      setLevel1Matches(scored.slice(0, 3));
      setSearchScope('level_1_network');
      setIsSearching(false);
    }, 250);
  };

  // Unlock single profile with 1 credit
  const handleUnlockCandidate = (candidate: AIMatchCandidate) => {
    if (unlockedIds.includes(candidate.contact.id)) {
      return; // Already unlocked
    }

    // Check credits
    if (wallet.availableCredits < 1 && !isDemoMode) {
      setSelectedForUnlock(candidate);
      return;
    }

    setIsUnlocking(true);
    const success = consumeSearchCredit('beyond_network', () => {
      setUnlockedIds(prev => [...prev, candidate.contact.id]);
      setUnlockToast({
        message: `Unlocked ${candidate.contact.name}! 1 credit consumed. Direct contact details now visible.`,
        type: 'success'
      });
      setIsUnlocking(false);
      setSelectedForUnlock(null);
    });

    if (!success) {
      setIsUnlocking(false);
      setSelectedForUnlock(candidate);
    }
  };

  // Bulk unlock remaining locked candidates
  const handleBulkUnlock = () => {
    const lockedCandidates = outsideMatches.filter(c => !unlockedIds.includes(c.contact.id));
    if (lockedCandidates.length === 0) return;

    const bulkCost = Math.min(5, lockedCandidates.length); // Discounted bulk rate
    if (wallet.availableCredits < bulkCost && !isDemoMode) {
      setZeroCreditModalOpen(true);
      return;
    }

    // Unlock all locked
    lockedCandidates.forEach((c) => {
      consumeSearchCredit('beyond_network', () => {});
    });

    setUnlockedIds(outsideMatches.map(c => c.contact.id));
    setUnlockToast({
      message: `Successfully unlocked all ${lockedCandidates.length} outperforming agents!`,
      type: 'success'
    });
  };

  // Helper to mask name (e.g. "Harrison Vance" -> "H••••••• V•••••")
  const getMaskedName = (fullName: string) => {
    const parts = fullName.split(' ');
    return parts
      .map(part => part.charAt(0) + '•'.repeat(Math.max(part.length - 1, 4)))
      .join(' ');
  };

  // Filtered list based on tab
  const displayedCandidates = outsideMatches.filter(cand => {
    const isUnlocked = unlockedIds.includes(cand.contact.id);
    if (displayFilter === 'unlocked') return isUnlocked;
    if (displayFilter === 'locked') return !isUnlocked;
    return true;
  });

  const unlockedCount = outsideMatches.filter(c => unlockedIds.includes(c.contact.id)).length;
  const lockedCount = outsideMatches.length - unlockedCount;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
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
          <button 
            onClick={() => setUnlockToast(null)}
            className="text-slate-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header with Balance & Navigation */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-1">
              <Download className="w-4 h-4" />
              <span>Take an Opportunity / Find Agent Match</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Automated AI Opportunity Search
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              Automated directly to search outside your personal graph for elite agents who statistically outperform your Level 1 network.
            </p>
          </div>

          {/* Right Side: Wallet Balance & Quick Credit Link */}
          <div className="flex items-center space-x-3 shrink-0">
            <div className="bg-indigo-50/80 border border-indigo-100 rounded-xl px-3.5 py-2 flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                <Coins className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-900">Credit Balance</div>
                <div className="text-sm font-black text-indigo-700">
                  {wallet.availableCredits} <span className="text-xs font-semibold text-indigo-500">Credits</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('credits')}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 text-indigo-700 border border-indigo-200 shadow-2xs flex items-center space-x-1.5 transition-all"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Buy Credits</span>
            </button>
          </div>
        </div>

        {/* Target role selector */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-5">
          {[
            { id: 'buyer_agent', label: 'Buyer / Buyer Agent' },
            { id: 'listing_help', label: 'Co-Broke Listing Help' },
            { id: 'contractor', label: 'Contractor Leads' },
            { id: 'investor', label: 'Cash Investor Partner' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setTargetCategory(item.id as any);
                if (searchScope === 'outside_network') {
                  executeOutsideNetworkSearch();
                }
              }}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all border text-center ${
                targetCategory === item.id
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Natural Language Search Box */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
        <div>
          <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-1.5 flex items-center justify-between">
            <span>Mandate Description</span>
            <span className="text-[11px] text-slate-400 font-normal">AI auto-matches outside network</span>
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (searchScope === 'outside_network') executeOutsideNetworkSearch();
                    else handleLimitToLevel1Network();
                  }
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                placeholder="e.g. Need a buyer for my $7.85M Pacific Heights historic luxury listing (127 days active)"
              />
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={executeOutsideNetworkSearch}
                disabled={isSearching}
                className="px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors flex items-center justify-center space-x-2 shadow-xs shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
                <span>Search Outside Network</span>
              </button>
              <button
                onClick={handleLimitToLevel1Network}
                disabled={isSearching}
                className="px-3 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors flex items-center justify-center space-x-1.5 border border-slate-200 shrink-0"
                title="Limit search to Level 1 Network only"
              >
                <Filter className="w-3.5 h-3.5 text-slate-600" />
                <span className="hidden sm:inline">Limit to Level 1</span>
              </button>
            </div>
          </div>
        </div>

        {/* Status Callout Bar */}
        {searchScope === 'outside_network' ? (
          <div className="bg-gradient-to-r from-indigo-50/90 via-blue-50/70 to-slate-50 p-4 rounded-xl border border-indigo-100/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-start sm:items-center space-x-2.5">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                <Globe2 className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-slate-900 flex items-center space-x-2">
                  <span>Outside-Network Matches: 12 Outperforming Agents Found</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {unlockedCount} Unlocked Free
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-200">
                    {lockedCount} Masked (1 Credit Each)
                  </span>
                </div>
                <p className="text-slate-600 text-[11px] mt-0.5">
                  2 high-performing agents are revealed free of charge. The remaining 10 profiles are masked with key performance teasers — unlock individual profiles for 1 credit.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0 self-start sm:self-center">
              <button
                onClick={executeOutsideNetworkSearch}
                disabled={isSearching}
                className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-indigo-700 font-bold text-[11px] border border-indigo-200/80 shadow-2xs flex items-center space-x-1"
                title="Shuffle search and generate fresh matches"
              >
                <RefreshCw className={`w-3 h-3 ${isSearching ? 'animate-spin' : ''}`} />
                <span>Reshuffle (New 2 Free)</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-amber-50/90 p-4 rounded-xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center shrink-0">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-amber-950">
                  Search Limited to Level 1 Network (In-Network Only)
                </div>
                <p className="text-amber-800 text-[11px] mt-0.5">
                  Showing contacts from your direct 1st-degree network. External agents show +300% higher average sales volume for this mandate.
                </p>
              </div>
            </div>

            <button
              onClick={executeOutsideNetworkSearch}
              className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] shadow-2xs flex items-center space-x-1 shrink-0"
            >
              <Sparkles className="w-3 h-3 text-amber-200" />
              <span>Switch to Outside Network</span>
            </button>
          </div>
        )}
      </div>

      {/* Outside Network Controls: Filter Tabs & Bulk Unlock Banner */}
      {searchScope === 'outside_network' && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          {/* View Filter Tabs */}
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setDisplayFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                displayFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Matches ({outsideMatches.length})
            </button>
            <button
              onClick={() => setDisplayFilter('unlocked')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 ${
                displayFilter === 'unlocked'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Unlock className="w-3 h-3 mr-1" />
              <span>Unlocked ({unlockedCount})</span>
            </button>
            <button
              onClick={() => setDisplayFilter('locked')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 ${
                displayFilter === 'locked'
                  ? 'bg-amber-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Lock className="w-3 h-3 mr-1" />
              <span>Masked ({lockedCount})</span>
            </button>
          </div>

          {/* Bulk Unlock Callout */}
          {lockedCount > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-[11px] text-slate-500 hidden md:inline">
                Need all verified contacts?
              </span>
              <button
                onClick={handleBulkUnlock}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-xs shadow-xs transition-all flex items-center space-x-1.5"
              >
                <Coins className="w-3.5 h-3.5 text-amber-200" />
                <span>Unlock All Remaining ({Math.min(5, lockedCount)} Credits)</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Results Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>
                {searchScope === 'outside_network' 
                  ? `Matched Outside-Network Agents (${displayedCandidates.length} Shown)`
                  : 'Level 1 Network Connections (Direct In-Network Only)'}
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              {searchScope === 'outside_network'
                ? 'High-volume agents with active buyer pools for $7M+ historic luxury listings.'
                : 'Direct 1st-degree relationships from your verified contacts address book.'}
            </p>
          </div>

          {searchScope === 'outside_network' && (
            <div className="hidden sm:flex items-center space-x-1 text-[11px] font-semibold text-slate-500">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>Level 1 Benchmark: {LEVEL_1_BENCHMARKS.formattedAverageVolume} avg volume, 44d to close</span>
            </div>
          )}
        </div>

        {/* Candidates Grid */}
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
                {/* Status Badge in Top Right Corner */}
                {!isUnlocked && (
                  <div className="absolute top-3 right-3 z-10 flex items-center space-x-1 bg-amber-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold shadow-2xs">
                    <Lock className="w-2.5 h-2.5" />
                    <span>Masked Profile • 1 Credit</span>
                  </div>
                )}

                <div>
                  {/* Header: Agent Identity & AI Score */}
                  <div className="flex items-start justify-between mb-3.5">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <img
                          src={cand.contact.avatarUrl}
                          alt={isUnlocked ? cand.contact.name : 'Masked Agent'}
                          className={`w-13 h-13 rounded-xl object-cover ring-2 transition-all ${
                            isUnlocked 
                              ? 'ring-indigo-500/20' 
                              : 'ring-amber-500/30 blur-xs'
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
                          {isUnlocked ? (
                            cand.contact.licenseNumber && (
                              <span className="text-[10px] font-medium text-slate-400">
                                {cand.contact.licenseNumber}
                              </span>
                            )
                          ) : (
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

                  {/* Network Scope Tag */}
                  <div className="bg-slate-50 rounded-xl p-2.5 mb-3 border border-slate-100 text-[11px] flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Network Scope:</span>
                    <span className="font-bold text-slate-800 flex items-center">
                      {cand.matchLevel === 'beyond_network' ? (
                        <>
                          <Globe2 className="w-3 h-3 text-indigo-600 mr-1" />
                          Outside Network (Verified Partner)
                        </>
                      ) : (
                        <>
                          <Users className="w-3 h-3 text-emerald-600 mr-1" />
                          Level 1 Network (1st Degree)
                        </>
                      )}
                    </span>
                  </div>

                  {/* OUTPERFORMANCE BENCHMARK (Visible for all so realtors see value) */}
                  {cand.outperformance && (
                    <div className="mb-3.5 p-3 rounded-xl bg-gradient-to-br from-emerald-50/90 via-teal-50/60 to-slate-50 border border-emerald-200/90">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-extrabold text-emerald-900 uppercase tracking-wider flex items-center">
                          <TrendingUp className="w-3.5 h-3.5 text-emerald-600 mr-1" />
                          Outperforms Level 1 Network
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
                          <span className="text-slate-400 block text-[9px] uppercase font-bold">Velocity to Close</span>
                          <span className="font-extrabold text-slate-900 block">{cand.outperformance.closingSpeed.split('(')[0].trim()}</span>
                          <span className="text-[9px] text-emerald-700 font-semibold">vs 44d L1 avg</span>
                        </div>
                      </div>

                      <p className="text-[11px] text-emerald-950 font-medium leading-relaxed">
                        💡 <strong className="font-semibold">Key Advantage:</strong> {cand.outperformance.activeBuyerAdvantage}
                      </p>
                    </div>
                  )}

                  {/* UNLOCKED: FULL MATCH REASONS & CONTACT */}
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

                      {/* Contact Preview for Unlocked Agent */}
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70 text-[11px] space-y-1 text-slate-600">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center text-slate-500">
                            <Phone className="w-3 h-3 mr-1 text-indigo-500" />
                            Direct Phone:
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
                    /* MASKED TEASER OVERLAY */
                    <div className="mb-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 text-center relative overflow-hidden">
                      <div className="space-y-2">
                        <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-2xs">
                          <Lock className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">
                            Verified Agent Profile & Direct Contact Masked
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Unlock full name, cell phone, direct email, and 25% referral introduction contract.
                          </p>
                        </div>
                        <div className="pt-1">
                          <button
                            onClick={() => handleUnlockCandidate(cand)}
                            className="w-full py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all shadow-xs flex items-center justify-center space-x-1.5"
                          >
                            <Coins className="w-3.5 h-3.5 text-amber-300" />
                            <span>Unlock Agent Profile (1 Credit)</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Action Area */}
                {isUnlocked ? (
                  <div className="pt-3 border-t border-slate-100 flex items-center space-x-2">
                    <button
                      onClick={() => setActiveTab('messages')}
                      className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors flex items-center justify-center space-x-1 shadow-2xs"
                    >
                      <span>Request Introduction</span>
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
                      <span>Unlock (1 Credit)</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Banner: Limit or Expand Network */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-slate-600">
            {searchScope === 'outside_network' ? (
              <span>
                Want to evaluate contacts already in your personal address book? You can limit the search to your Level 1 network.
              </span>
            ) : (
              <span>
                Level 1 network results limited to your 1st-degree contacts. Ready to find top outperforming agents nationwide?
              </span>
            )}
          </div>
          <div>
            {searchScope === 'outside_network' ? (
              <button
                onClick={handleLimitToLevel1Network}
                className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-800 font-bold border border-slate-300 text-xs transition-all shadow-2xs shrink-0"
              >
                Limit Search to Level 1 Network
              </button>
            ) : (
              <button
                onClick={executeOutsideNetworkSearch}
                className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all shadow-2xs shrink-0"
              >
                Search Outside Network (12 Matches)
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Credit Unlock / Insufficient Credit Modal */}
      {selectedForUnlock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
                <Coins className="w-5 h-5" />
              </div>
              <button
                onClick={() => setSelectedForUnlock(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
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
              <div className="flex justify-between">
                <span className="text-slate-500">Outperformance:</span>
                <span className="font-bold text-emerald-700">{selectedForUnlock.outperformance?.salesVolumeMultiplier}</span>
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
                  disabled={isUnlocking}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors shadow-xs flex items-center space-x-1.5"
                >
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Confirm Unlock (1 Credit)</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3 mt-4">
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                  <strong>You have 0 credits available.</strong> Purchase a credit bundle to unlock this agent profile and connect immediately.
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
    </div>
  );
};
