import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { DemoBanner } from './components/DemoBanner';
import { LowCreditBanner } from './components/LowCreditBanner';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { WelcomeModal } from './components/WelcomeModal';
import { CreditConfirmationModal } from './components/CreditConfirmationModal';
import { ZeroCreditModal } from './components/ZeroCreditModal';
import { ReferralAIAssistant } from './components/ReferralAIAssistant';
import { LinkedInConnectModal } from './components/LinkedInConnectModal';
import { LinkedInSyncModal } from './components/LinkedInSyncModal';
import { AuthCallback } from './components/AuthCallback';

// Views
import { DashboardView } from './views/DashboardView';
import { GiveView } from './views/GiveView';
import { TakeView } from './views/TakeView';
import { AIMatchesView } from './views/AIMatchesView';
import { MyNetworkView } from './views/MyNetworkView';
import { OpportunitiesView } from './views/OpportunitiesView';
import { ReferralsView } from './views/ReferralsView';
import { DealsView } from './views/DealsView';
import { EarningsView } from './views/EarningsView';
import { CreditsView } from './views/CreditsView';
import { MessagesView } from './views/MessagesView';
import { ProfileView } from './views/ProfileView';
import { AdminCreditsView } from './views/AdminCreditsView';
import { MatchAndReferView } from './views/MatchAndReferView';

const AppContent: React.FC = () => {
  const { activeTab } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'match-refer':
        return <MatchAndReferView initialMode="auto" />;
      case 'give':
        return <MatchAndReferView initialMode="give" />;
      case 'take':
        return <MatchAndReferView initialMode="take" />;
      case 'ai-matches':
        return <MatchAndReferView initialMode="auto" />;
      case 'my-network':
        return <MyNetworkView />;
      case 'opportunities':
        return <OpportunitiesView />;
      case 'referrals':
        return <ReferralsView />;
      case 'deals':
        return <DealsView />;
      case 'earnings':
        return <EarningsView />;
      case 'credits':
        return <CreditsView />;
      case 'messages':
        return <MessagesView />;
      case 'profile':
        return <ProfileView />;
      case 'admin':
        return <AdminCreditsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* 1. Persistent Top Demo Banner (Requirement #5) */}
      <DemoBanner />

      {/* 2. Low Credit Warning Banner (Requirement #9) */}
      <LowCreditBanner />

      {/* 3. Top Navbar */}
      <Navbar onMobileMenuToggle={() => setIsMobileMenuOpen(true)} />

      {/* 4. Body with Sidebar and Active Screen */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar 
          isMobileOpen={isMobileMenuOpen} 
          onMobileClose={() => setIsMobileMenuOpen(false)} 
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {renderActiveView()}
        </main>
      </div>

      {/* 5. Modals & Drawers */}
      <WelcomeModal />
      <CreditConfirmationModal />
      <ZeroCreditModal />
      <ReferralAIAssistant />
      <LinkedInConnectModal />
      <LinkedInSyncModal />
      <AuthCallback />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
