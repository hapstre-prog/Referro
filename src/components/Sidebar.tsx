import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, 
  Sparkles, 
  Users, 
  Kanban, 
  DollarSign, 
  Coins, 
  MessageSquare, 
  User, 
  ShieldAlert,
  X
} from 'lucide-react';

interface SidebarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onMobileClose }) => {
  const { activeTab, setActiveTab, deals, referrals, wallet, isDemoMode, notifications } = useApp();

  const unreadCount = notifications.filter(n => !n.read).length;

  const navGroups = [
    {
      groupLabel: 'Core Engine',
      items: [
        { 
          id: 'dashboard', 
          label: 'Dashboard', 
          icon: LayoutDashboard,
          activeFor: ['dashboard']
        },
        { 
          id: 'match-refer', 
          label: 'Match & Refer', 
          icon: Sparkles, 
          badge: 'AI Copilot',
          activeFor: ['match-refer', 'give', 'take', 'ai-matches']
        },
        { 
          id: 'deals', 
          label: 'Pipeline & Deals', 
          icon: Kanban, 
          count: deals.length + referrals.length,
          activeFor: ['deals', 'referrals', 'opportunities']
        },
        { 
          id: 'my-network', 
          label: 'My Network', 
          icon: Users, 
          badge: '50+ Verified',
          activeFor: ['my-network']
        }
      ]
    },
    {
      groupLabel: 'Activity & Wallet',
      items: [
        { 
          id: 'credits', 
          label: 'Credits Wallet', 
          icon: Coins, 
          highlight: true,
          badge: isDemoMode ? 'Unlimited' : `${wallet.availableCredits}`,
          activeFor: ['credits']
        },
        { 
          id: 'earnings', 
          label: 'Earnings & Escrow', 
          icon: DollarSign,
          activeFor: ['earnings']
        },
        { 
          id: 'messages', 
          label: 'Messages', 
          icon: MessageSquare,
          count: unreadCount > 0 ? unreadCount : undefined,
          activeFor: ['messages']
        }
      ]
    },
    {
      groupLabel: 'Settings',
      items: [
        { 
          id: 'profile', 
          label: 'Profile & License', 
          icon: User,
          activeFor: ['profile']
        },
        { 
          id: 'admin', 
          label: 'Admin Economics', 
          icon: ShieldAlert,
          activeFor: ['admin']
        }
      ]
    }
  ];

  const handleSelect = (id: string) => {
    setActiveTab(id);
    if (onMobileClose) onMobileClose();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300 w-64 border-r border-slate-800 select-none">
      {/* Sidebar header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {isDemoMode ? 'Demo Sandbox' : 'Production Engine'}
          </span>
        </div>
        {onMobileClose && (
          <button 
            onClick={onMobileClose} 
            className="md:hidden p-1 text-slate-400 hover:text-white rounded-lg"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Core Loop Reminder Widget */}
      <div className="mx-3 my-3 p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 text-[11px] leading-relaxed">
        <div className="flex items-center justify-between font-semibold text-slate-200 mb-1">
          <span>The Core Loop</span>
          <span className="text-indigo-400 font-bold text-[10px]">25% - 30% Fee</span>
        </div>
        <div className="text-slate-400">
          Describe lead → AI Follow-up → Match → Intro → Deal closes → Payout.
        </div>
      </div>

      {/* Grouped Nav links */}
      <nav className="flex-1 px-3 space-y-4 overflow-y-auto py-1">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              {group.groupLabel}
            </div>
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = item.activeFor.includes(activeTab);
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : item.highlight
                      ? 'text-amber-300 hover:bg-slate-800 hover:text-amber-200'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.highlight ? 'text-amber-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.count !== undefined && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-indigo-700 text-white' : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}>
                      {item.count}
                    </span>
                  )}

                  {item.badge && (
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium tracking-wide uppercase ${
                      isActive 
                        ? 'bg-indigo-700 text-indigo-100' 
                        : item.highlight 
                        ? 'bg-amber-950 text-amber-300 border border-amber-800' 
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Mini Wallet status footer */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/50">
        <div 
          onClick={() => handleSelect('credits')}
          className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 cursor-pointer transition-colors"
        >
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-400 font-medium">Credits Wallet</span>
            <span className="font-bold text-amber-400">
              {isDemoMode ? 'Unlimited' : `${wallet.availableCredits} Available`}
            </span>
          </div>
          <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-amber-500 h-full rounded-full transition-all duration-300"
              style={{ width: isDemoMode ? '100%' : `${Math.min(100, (wallet.availableCredits / 10) * 100)}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1.5">
            <span>Click to refill or buy</span>
            <span className="text-indigo-400 font-semibold">+ Buy</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop static sidebar */}
      <aside className="hidden md:block shrink-0 h-full">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div 
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity" 
            onClick={onMobileClose} 
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-slate-900 shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
