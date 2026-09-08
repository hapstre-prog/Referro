import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  Coins, 
  Bell, 
  Bot, 
  Search, 
  ShieldCheck, 
  Check, 
  Layers, 
  Menu,
  ChevronDown,
  Linkedin
} from 'lucide-react';

export const Navbar: React.FC<{ onMobileMenuToggle?: () => void }> = ({ onMobileMenuToggle }) => {
  const { 
    user, 
    isDemoMode, 
    setDemoMode, 
    wallet, 
    notifications, 
    markNotificationAsRead, 
    setActiveTab,
    isAiAssistantOpen,
    setIsAiAssistantOpen,
    isLinkedInConnected,
    setIsLinkedInConnectOpen
  } = useApp();

  const [isNotifsOpen, setIsNotifsOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Left branding & mobile trigger */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        {onMobileMenuToggle && (
          <button
            onClick={onMobileMenuToggle}
            className="md:hidden p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div 
          onClick={() => setActiveTab('dashboard')} 
          className="flex items-center space-x-2.5 cursor-pointer select-none"
        >
          <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold tracking-tight shadow-xs">
            <Layers className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-lg text-slate-900 tracking-tight">Relay</span>
              <span className="text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                Network
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium hidden sm:block -mt-0.5">
              Transaction Referral Engine
            </p>
          </div>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Credit Indicator (Section #5 & #17) */}
        <button
          onClick={() => setActiveTab('credits')}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/80 hover:bg-slate-100 transition-colors text-xs font-semibold text-slate-800 shadow-2xs"
          title="View Credits Wallet"
        >
          <Coins className="w-3.5 h-3.5 text-amber-500" />
          {isDemoMode ? (
            <span className="flex items-center">
              <span className="text-slate-500 mr-1 hidden sm:inline">Demo Credits:</span>
              <strong className="text-emerald-700 font-bold">Unlimited</strong>
            </span>
          ) : (
            <span>
              <strong className="text-slate-900">{wallet.availableCredits}</strong>
              <span className="text-slate-500 ml-1">Credits</span>
            </span>
          )}
        </button>

        {/* DEMO Mode Toggle Button (Section #3 & #4) */}
        <button
          onClick={() => setDemoMode(!isDemoMode)}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
            isDemoMode 
              ? 'bg-amber-600 hover:bg-amber-700 text-white' 
              : 'bg-slate-900 hover:bg-slate-800 text-white'
          }`}
          title={isDemoMode ? 'Exit Demo Mode' : 'Enter Interactive Demo Mode'}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>{isDemoMode ? 'DEMO ACTIVE' : 'TRY DEMO'}</span>
        </button>

        {/* LinkedIn Connect Button — shown when not yet connected */}
        {!isLinkedInConnected && (
          <button
            onClick={() => setIsLinkedInConnectOpen(true)}
            className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-[#0A66C2]/20 hover:bg-[#0A66C2]/5 text-[#0A66C2] transition-colors text-xs font-semibold"
            title="Connect your LinkedIn profile for better referral matching"
          >
            <Linkedin className="w-3.5 h-3.5" />
            <span>Connect LinkedIn</span>
          </button>
        )}

        {/* Referral AI Drawer Trigger (Section #18) */}
        <button
          onClick={() => setIsAiAssistantOpen(!isAiAssistantOpen)}
          className={`p-2 rounded-xl border transition-colors relative ${
            isAiAssistantOpen 
              ? 'bg-indigo-50 border-indigo-200 text-indigo-600' 
              : 'border-slate-200 hover:bg-slate-50 text-slate-600'
          }`}
          title="Referral AI Assistant"
        >
          <Bot className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setIsNotifsOpen(!isNotifsOpen)}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 relative transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {isNotifsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-88 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in-50 zoom-in-95">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 px-1">
                <span className="font-bold text-xs uppercase tracking-wider text-slate-700">Notifications</span>
                <span className="text-xs text-slate-400">{unreadCount} new</span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-50 py-1">
                {notifications.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center">No notifications yet.</p>
                ) : (
                  notifications.map(n => (
                    <div 
                      key={n.id} 
                      onClick={() => {
                        markNotificationAsRead(n.id);
                        if (n.actionUrl) {
                          setActiveTab(n.actionUrl);
                          setIsNotifsOpen(false);
                        }
                      }}
                      className={`p-2.5 rounded-xl text-xs cursor-pointer transition-colors ${
                        n.read ? 'hover:bg-slate-50 text-slate-600' : 'bg-indigo-50/50 hover:bg-indigo-50 text-slate-900 font-medium'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-slate-900">{n.title}</span>
                        <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                      </div>
                      <p className="text-slate-600 line-clamp-2">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Mini Badge */}
        <div 
          onClick={() => setActiveTab('profile')}
          className="flex items-center space-x-2 pl-1 sm:pl-2 border-l border-slate-200 cursor-pointer"
        >
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-8 h-8 rounded-xl object-cover ring-1 ring-slate-200"
          />
          <div className="hidden lg:block text-left">
            <span className="text-xs font-semibold text-slate-900 block leading-tight">{user.name}</span>
            <span className="text-[10px] text-slate-400 font-medium block">
              {user.brokerage?.split(' ')[0] || 'KW'} · {user.jurisdiction[0]}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
