import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { NetworkGraph } from '../components/NetworkGraph';
import { 
  Users, 
  Search, 
  Filter, 
  MapPin, 
  ShieldCheck, 
  Send, 
  ArrowRight,
  Sparkles,
  LayoutGrid,
  GitBranch
} from 'lucide-react';

export const MyNetworkView: React.FC = () => {
  const { networkContacts, setActiveTab } = useApp();
  const [viewMode, setViewMode] = useState<'list' | 'graph'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDegree, setSelectedDegree] = useState<number | 'all'>('all');
  const [selectedMarket, setSelectedMarket] = useState<string>('all');

  const filteredContacts = networkContacts.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDegree = selectedDegree === 'all' || c.degree === selectedDegree;
    const markets = (c.marketsServed && c.marketsServed.length > 0) ? c.marketsServed : (c.geographicCoverage || []);
    const matchesMarket = selectedMarket === 'all' || 
      markets.some(m => m.toLowerCase().includes(selectedMarket.toLowerCase())) ||
      (c.location && c.location.toLowerCase().includes(selectedMarket.toLowerCase()));
    return matchesSearch && matchesDegree && matchesMarket;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-1">
              <Users className="w-4 h-4" />
              <span>Verified Agent Relationships</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              My Network
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {networkContacts.length} verified real estate professionals across 8 luxury US metros. Free to search at any time.
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center space-x-1.5 ${
                viewMode === 'list' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Directory List</span>
            </button>
            <button
              onClick={() => setViewMode('graph')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center space-x-1.5 ${
                viewMode === 'graph' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>Relationship Graph</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by name, brokerage, city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-slate-400">Degree:</span>
            <select
              value={selectedDegree}
              onChange={(e) => setSelectedDegree(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none flex-1"
            >
              <option value="all">All Degrees</option>
              <option value="1">1st Degree (Direct)</option>
              <option value="2">2nd Degree (Connector)</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-slate-400">Market:</span>
            <select
              value={selectedMarket}
              onChange={(e) => setSelectedMarket(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none flex-1"
            >
              <option value="all">All Metros</option>
              <option value="Miami">Miami, FL</option>
              <option value="San Francisco">San Francisco, CA</option>
              <option value="New York">New York, NY</option>
              <option value="Austin">Austin, TX</option>
              <option value="Aspen">Aspen, CO</option>
            </select>
          </div>
        </div>
      </div>

      {/* Render either NetworkGraph or List */}
      {viewMode === 'graph' ? (
        <NetworkGraph />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:border-indigo-200 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <img
                      src={contact.avatarUrl}
                      alt={contact.name}
                      className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-100"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{contact.name}</h4>
                      <span className="text-xs text-slate-500 block">{contact.company}</span>
                      <span className="inline-flex items-center text-[10px] text-slate-400 mt-0.5">
                        <MapPin className="w-3 h-3 mr-1" />
                        {contact.location}
                      </span>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    contact.degree === 1 
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                      : 'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}>
                    {contact.degree === 1 ? '1st Degree' : '2nd Degree'}
                  </span>
                </div>

                <div className="bg-slate-50 rounded-xl p-2.5 mb-3 text-[11px] border border-slate-100">
                  <div className="flex justify-between text-slate-600 mb-1">
                    <span>Career Sales Volume:</span>
                    <strong className="text-slate-900">
                      {contact.totalSalesVolume ? `$${(contact.totalSalesVolume / 1000000).toFixed(0)}M+` : '$35M+'}
                    </strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Closed With You:</span>
                    <strong className="text-indigo-600 font-semibold">{contact.dealsClosedTogether} deals</strong>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {(contact.expertise || []).map((exp, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-medium text-slate-600">
                      {exp}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <button
                  onClick={() => setActiveTab('give')}
                  className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors flex items-center justify-center space-x-1"
                >
                  <span>Send Opportunity</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
