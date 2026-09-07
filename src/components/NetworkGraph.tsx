import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { NetworkContact } from '../types';
import { Users, Sparkles, ExternalLink, ShieldCheck, MapPin, Award } from 'lucide-react';

export const NetworkGraph: React.FC = () => {
  const { user, networkContacts, setActiveTab } = useApp();
  const [selectedContact, setSelectedContact] = useState<NetworkContact | null>(networkContacts[0] || null);
  const [filterDegree, setFilterDegree] = useState<number | 'all'>('all');

  // Filter contacts
  const filtered = networkContacts.filter(c => filterDegree === 'all' || c.degree === filterDegree);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center">
            <Users className="w-5 h-5 text-indigo-600 mr-2" />
            Interactive Relationship Graph
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Visualize 1st-degree direct contacts and 2nd-degree connectors to understand how AI sources referrals.
          </p>
        </div>

        {/* Degree filter */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-slate-500">Degree:</span>
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setFilterDegree('all')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${filterDegree === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'}`}
            >
              All ({networkContacts.length})
            </button>
            <button
              onClick={() => setFilterDegree(1)}
              className={`px-2.5 py-1 rounded-lg transition-colors ${filterDegree === 1 ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'}`}
            >
              1st Degree
            </button>
            <button
              onClick={() => setFilterDegree(2)}
              className={`px-2.5 py-1 rounded-lg transition-colors ${filterDegree === 2 ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'}`}
            >
              2nd Degree (Connectors)
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Graph Canvas Representation */}
        <div className="lg:col-span-2 relative bg-slate-950 rounded-2xl p-6 overflow-hidden min-h-[440px] flex items-center justify-center border border-slate-800">
          {/* Subtle concentric orbital rings */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
            <div className="w-48 h-48 rounded-full border border-indigo-500" />
            <div className="w-80 h-80 rounded-full border border-dashed border-indigo-400" />
            <div className="w-[440px] h-[440px] rounded-full border border-slate-600" />
          </div>

          <div className="absolute top-4 left-4 z-10 flex items-center space-x-3 text-[11px] text-slate-400">
            <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-indigo-500 mr-1.5" /> You (Root)</span>
            <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-emerald-400 mr-1.5" /> 1st Degree (Direct)</span>
            <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-amber-400 mr-1.5" /> 2nd Degree (Connector)</span>
          </div>

          {/* SVG Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
              <linearGradient id="gradDirect" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.4" />
              </linearGradient>
              <linearGradient id="grad2nd" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.4" />
              </linearGradient>
            </defs>

            {/* Simulated connection lines from center to nodes */}
            <line x1="50%" y1="50%" x2="25%" y2="25%" stroke="url(#gradDirect)" strokeWidth="1.5" />
            <line x1="50%" y1="50%" x2="75%" y2="25%" stroke="url(#gradDirect)" strokeWidth="1.5" />
            <line x1="50%" y1="50%" x2="80%" y2="70%" stroke="url(#gradDirect)" strokeWidth="1.5" />
            <line x1="50%" y1="50%" x2="20%" y2="75%" stroke="url(#gradDirect)" strokeWidth="1.5" />
            <line x1="50%" y1="50%" x2="50%" y2="85%" stroke="url(#gradDirect)" strokeWidth="1.5" />
            
            {/* 2nd degree lines */}
            <line x1="75%" y1="25%" x2="88%" y2="15%" stroke="url(#grad2nd)" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="25%" y1="25%" x2="12%" y2="15%" stroke="url(#grad2nd)" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="80%" y1="70%" x2="90%" y2="85%" stroke="url(#grad2nd)" strokeWidth="1" strokeDasharray="3 3" />
          </svg>

          {/* Central Root: User */}
          <div className="relative z-20 flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 ring-4 ring-indigo-400/30 text-white flex items-center justify-center font-extrabold shadow-lg">
              <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover rounded-2xl" />
            </div>
            <span className="mt-1.5 text-xs font-bold text-white bg-slate-900/90 px-2 py-0.5 rounded-full border border-indigo-500/40">
              {user.name} (You)
            </span>
          </div>

          {/* Orbiting Sample Contacts */}
          {/* Node 1: Sarah Chen (1st degree) */}
          <div 
            onClick={() => setSelectedContact(networkContacts.find(c => c.id === 'cnt_sarah_chen') || networkContacts[0])}
            className="absolute top-1/4 right-1/4 -translate-y-4 translate-x-4 cursor-pointer group z-20 flex flex-col items-center"
          >
            <div className="w-11 h-11 rounded-xl bg-emerald-600/90 ring-2 ring-emerald-400 p-0.5 group-hover:scale-110 transition-transform">
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80" alt="Sarah Chen" className="w-full h-full object-cover rounded-lg" />
            </div>
            <span className="text-[10px] text-emerald-200 font-semibold bg-slate-900/80 px-1.5 py-0.5 rounded mt-1 border border-emerald-500/30">
              Sarah Chen (94%)
            </span>
          </div>

          {/* Node 2: Julian Ross (2nd degree via Sarah) */}
          <div 
            onClick={() => setSelectedContact(networkContacts.find(c => c.id === 'cnt_julian_ross') || null)}
            className="absolute top-10 right-8 cursor-pointer group z-20 flex flex-col items-center"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-600 ring-2 ring-amber-400 p-0.5 group-hover:scale-110 transition-transform">
              <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80" alt="Julian Ross" className="w-full h-full object-cover rounded-lg" />
            </div>
            <span className="text-[9px] text-amber-200 font-semibold bg-slate-900/80 px-1.5 py-0.5 rounded mt-1 border border-amber-500/30">
              Julian Ross (2nd°)
            </span>
          </div>

          {/* Node 3: David Miller (1st degree) */}
          <div 
            onClick={() => setSelectedContact(networkContacts.find(c => c.id === 'cnt_david_miller') || null)}
            className="absolute top-1/4 left-1/4 -translate-y-4 -translate-x-4 cursor-pointer group z-20 flex flex-col items-center"
          >
            <div className="w-11 h-11 rounded-xl bg-emerald-600/90 ring-2 ring-emerald-400 p-0.5 group-hover:scale-110 transition-transform">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80" alt="David Miller" className="w-full h-full object-cover rounded-lg" />
            </div>
            <span className="text-[10px] text-emerald-200 font-semibold bg-slate-900/80 px-1.5 py-0.5 rounded mt-1 border border-emerald-500/30">
              David Miller (92%)
            </span>
          </div>

          {/* Node 4: Amara Okoye (2nd degree via David) */}
          <div 
            onClick={() => setSelectedContact(networkContacts.find(c => c.id === 'cnt_amara_okoye') || null)}
            className="absolute top-10 left-8 cursor-pointer group z-20 flex flex-col items-center"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-600 ring-2 ring-amber-400 p-0.5 group-hover:scale-110 transition-transform">
              <img src="https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=200&auto=format&fit=crop&q=80" alt="Amara Okoye" className="w-full h-full object-cover rounded-lg" />
            </div>
            <span className="text-[9px] text-amber-200 font-semibold bg-slate-900/80 px-1.5 py-0.5 rounded mt-1 border border-amber-500/30">
              Amara (2nd°)
            </span>
          </div>

          {/* Node 5: Marcus Vance (Contractor 1st degree) */}
          <div 
            onClick={() => setSelectedContact(networkContacts.find(c => c.id === 'cnt_marcus_vance') || null)}
            className="absolute bottom-16 left-16 cursor-pointer group z-20 flex flex-col items-center"
          >
            <div className="w-11 h-11 rounded-xl bg-emerald-600/90 ring-2 ring-emerald-400 p-0.5 group-hover:scale-110 transition-transform">
              <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80" alt="Marcus Vance" className="w-full h-full object-cover rounded-lg" />
            </div>
            <span className="text-[10px] text-emerald-200 font-semibold bg-slate-900/80 px-1.5 py-0.5 rounded mt-1 border border-emerald-500/30">
              Marcus (Contractor)
            </span>
          </div>

          {/* Node 6: Elena Rostova (NYC 1st degree) */}
          <div 
            onClick={() => setSelectedContact(networkContacts.find(c => c.id === 'cnt_elena_rostova') || null)}
            className="absolute bottom-16 right-16 cursor-pointer group z-20 flex flex-col items-center"
          >
            <div className="w-11 h-11 rounded-xl bg-emerald-600/90 ring-2 ring-emerald-400 p-0.5 group-hover:scale-110 transition-transform">
              <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80" alt="Elena Rostova" className="w-full h-full object-cover rounded-lg" />
            </div>
            <span className="text-[10px] text-emerald-200 font-semibold bg-slate-900/80 px-1.5 py-0.5 rounded mt-1 border border-emerald-500/30">
              Elena Rostova (NYC)
            </span>
          </div>
        </div>

        {/* Contact Inspector Card */}
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 flex flex-col justify-between h-full">
          {selectedContact ? (
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={selectedContact.avatarUrl}
                    alt={selectedContact.name}
                    className="w-12 h-12 rounded-xl object-cover ring-2 ring-indigo-500/30"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{selectedContact.name}</h4>
                    <span className="text-xs text-slate-500 block">{selectedContact.company}</span>
                    <span className="inline-flex items-center text-[10px] text-slate-500 mt-0.5">
                      <MapPin className="w-3 h-3 mr-1 text-slate-400" />
                      {selectedContact.location}
                    </span>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  selectedContact.degree === 1 
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                    : 'bg-amber-100 text-amber-800 border border-amber-200'
                }`}>
                  {selectedContact.degree === 1 ? '1st Degree' : '2nd Degree'}
                </span>
              </div>

              {/* Relationship path (Requirement #23) */}
              <div className="bg-white p-3 rounded-xl border border-slate-200/80 mb-4 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Connection Path
                </span>
                {selectedContact.degree === 1 ? (
                  <p className="text-slate-700">
                    <strong className="text-indigo-600">Direct 1st-degree connection.</strong> You have collaborated on {selectedContact.dealsClosedTogether} past transactions together.
                  </p>
                ) : (
                  <p className="text-slate-700">
                    You don't know {selectedContact.name.split(' ')[0]} directly, but <strong>{selectedContact.name.split(' ')[0]} is connected to {selectedContact.connectedVia?.name}</strong> in your network.
                  </p>
                )}
              </div>

              <div className="space-y-2 mb-4">
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    Specialties & Coverage
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {(selectedContact.expertise || []).map((exp, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-medium text-slate-700">
                        {exp}
                      </span>
                    ))}
                  </div>
                </div>

                {selectedContact.notes && (
                  <div className="pt-2 border-t border-slate-200/60 text-[11px] text-slate-600 italic">
                    "{selectedContact.notes}"
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-200">
                <button
                  onClick={() => setActiveTab('give')}
                  className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors flex items-center justify-center space-x-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
                  <span>Send Referral to {selectedContact.name.split(' ')[0]}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs">
              Click any node in the graph to inspect connection path and referral history.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
