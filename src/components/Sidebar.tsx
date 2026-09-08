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
  X,
  ChevronDown
} from 'lucide-react';

interface SidebarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onMobileClose }) => {
  const { activeTab, setActiveTab, deals, referrals, wallet, isDemoMode, notifications, user } = useApp();

  const unreadCount = notifications.filter(n => !n.read).length;

  const navGroups = [
    {
      groupLabel: 'Core Engine',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, activeFor: ['dashboard'] },
        {
          id: 'match-refer',
          label: 'Match & Refer',
          icon: Sparkles,
          badge: 'AI',
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
          activeFor: ['my-network']
        }
      ]
    },
    {
      groupLabel: 'Activity & Wallet',
      items: [
        {
          id: 'messages',
          label: 'Messages',
          icon: MessageSquare,
          count: unreadCount > 0 ? unreadCount : undefined,
          activeFor: ['messages']
        },
        {
          id: 'credits',
          label: 'Credits Wallet',
          icon: Coins,
          badge: isDemoMode ? '∞' : `${wallet.availableCredits}`,
          activeFor: ['credits']
        },
        {
          id: 'earnings',
          label: 'Earnings & Escrow',
          icon: DollarSign,
          activeFor: ['earnings']
        }
      ]
    },
    {
      groupLabel: 'Settings',
      items: [
        { id: 'profile', label: 'Profile & License', icon: User, activeFor: ['profile'] },
        { id: 'admin', label: 'Admin Economics', icon: ShieldAlert, activeFor: ['admin'] }
      ]
    }
  ];

  const handleSelect = (id: string) => {
    setActiveTab(id);
    if (onMobileClose) onMobileClose();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#F9F9F9] text-[#555] w-64 select-none border-r border-slate-200/60">
      {/* Header */}
      <div className="px-4 py-4 flex items-center justify-end">
        {onMobileClose ? (
          <button
            onClick={onMobileClose}
            className="md:hidden p-1 text-slate-400 hover:text-slate-700 rounded-lg"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-400" />
        )}
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 space-y-5 overflow-y-auto py-2">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-0.5">
            <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#777]">
              {group.groupLabel}
            </div>
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = item.activeFor.includes(activeTab);
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-[13px] font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#EAEAEA] text-slate-900 font-semibold'
                      : 'text-[#555] hover:bg-slate-200/50'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className={`w-[18px] h-[18px] ${isActive ? 'text-slate-900' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.count !== undefined && (
                    <span className="px-1.5 min-w-[20px] text-center py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                      {item.count}
                    </span>
                  )}

                  {item.badge && !item.count && (
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold ${
                      isActive ? 'bg-slate-300 text-slate-700' : 'bg-slate-200 text-slate-500'
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

      {/* User profile footer */}
      <div className="px-3 py-3 border-t border-slate-200/60">
        <button
          onClick={() => handleSelect('profile')}
          className="w-full flex items-center space-x-2.5 px-2 py-2 rounded-lg hover:bg-slate-200/50 transition-colors"
        >
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
          />
          <div className="flex-1 text-left leading-tight min-w-0">
            <div className="text-xs font-semibold text-slate-900 truncate">{user.name}</div>
            <div className="text-[10px] text-slate-400 truncate">{user.email}</div>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
        </button>
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
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity"
            onClick={onMobileClose}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-[#F9F9F9] shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
