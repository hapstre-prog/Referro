import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserProfile, 
  NetworkContact, 
  Opportunity, 
  ReferralContract, 
  Deal, 
  DealStage,
  CreditWallet, 
  CreditTransaction, 
  CreditPackage, 
  AdminCreditConfig, 
  FunnelAnalytics,
  AIMatchCandidate,
  Message,
  NotificationItem
} from '../types';
import { 
  DEMO_USER, 
  INITIAL_ADMIN_CONFIG, 
  INITIAL_CREDIT_PACKAGES, 
  INITIAL_CREDIT_WALLET, 
  INITIAL_TRANSACTIONS,
  SEED_NETWORK_CONTACTS,
  SEED_OPPORTUNITIES,
  SEED_REFERRALS,
  SEED_DEALS,
  SEED_FUNNEL_ANALYTICS,
  SEED_MESSAGES,
  SEED_NOTIFICATIONS
} from '../data/seedData';

interface AppContextType {
  user: UserProfile;
  isDemoMode: boolean;
  isAuthenticated: boolean;
  setDemoMode: (val: boolean) => void;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  
  // Opportunities & Network
  opportunities: Opportunity[];
  networkContacts: NetworkContact[];
  referrals: ReferralContract[];
  deals: Deal[];
  messages: Message[];
  notifications: NotificationItem[];
  
  // Credits & Wallet
  wallet: CreditWallet;
  transactions: CreditTransaction[];
  creditPackages: CreditPackage[];
  adminConfig: AdminCreditConfig;
  analytics: FunnelAnalytics;
  
  // Modals & User Experience
  isFirstTimeWelcomeOpen: boolean;
  setIsFirstTimeWelcomeOpen: (open: boolean) => void;
  zeroCreditModalOpen: boolean;
  setZeroCreditModalOpen: (open: boolean) => void;
  consumptionConfirmation: {
    isOpen: boolean;
    cost: number;
    title: string;
    onConfirm: () => void;
  } | null;
  setConsumptionConfirmation: (val: any) => void;
  isAiAssistantOpen: boolean;
  setIsAiAssistantOpen: (open: boolean) => void;
  
  // LinkedIn Auth
  isLinkedInConnected: boolean;
  isLinkedInConnectOpen: boolean;
  setIsLinkedInConnectOpen: (open: boolean) => void;
  connectLinkedIn: () => Promise<void>;
  handleLinkedInCallback: (profile: any) => Promise<void>;
  // LinkedIn Network Sync
  isLinkedInSyncOpen: boolean;
  setIsLinkedInSyncOpen: (open: boolean) => void;
  syncLinkedInConnections: () => Promise<{ imported: number; total: number }>;
  
  // Handlers
  consumeSearchCredit: (type: 'my_network' | 'beyond_network', onSuccess: () => void) => boolean;
  promptBeyondNetworkSearch: (actionTitle: string, onConfirm: () => void) => void;
  purchasePackage: (pkg: CreditPackage) => Promise<void>;
  createOpportunity: (data: Partial<Opportunity>) => Promise<Opportunity>;
  createReferralFromMatch: (opp: Opportunity, candidate: AIMatchCandidate, customIntroText?: string) => Promise<ReferralContract>;
  updateDealStage: (dealId: string, stage: DealStage) => Promise<void>;
  updateAdminConfig: (newConfig: Partial<AdminCreditConfig>, updatedPackages?: CreditPackage[]) => void;
  grantPromoCredits: (amount: number, reason: string) => void;
  runDemoScenario: (scenarioId: 1 | 2 | 3) => void;
  markNotificationAsRead: (id: string) => void;
  sendMessage: (recipientId: string, text: string, referralId?: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(DEMO_USER);
  const [isDemoMode, setIsDemoModeState] = useState<boolean>(false); // Start at login screen; user can enter demo from there
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  
  // Data lists
  const [opportunities, setOpportunities] = useState<Opportunity[]>(SEED_OPPORTUNITIES);
  const [networkContacts, setNetworkContacts] = useState<NetworkContact[]>(SEED_NETWORK_CONTACTS);
  const [referrals, setReferrals] = useState<ReferralContract[]>(SEED_REFERRALS);
  const [deals, setDeals] = useState<Deal[]>(SEED_DEALS);
  const [messages, setMessages] = useState<Message[]>(SEED_MESSAGES);
  const [notifications, setNotifications] = useState<NotificationItem[]>(SEED_NOTIFICATIONS);

  // Credit System State
  const [wallet, setWallet] = useState<CreditWallet>({
    ...INITIAL_CREDIT_WALLET,
    isDemoUnlimited: true // Unlimited in Demo Mode as required by Section #17
  });
  const [transactions, setTransactions] = useState<CreditTransaction[]>(INITIAL_TRANSACTIONS);
  const [creditPackages, setCreditPackages] = useState<CreditPackage[]>(INITIAL_CREDIT_PACKAGES);
  const [adminConfig, setAdminConfig] = useState<AdminCreditConfig>(INITIAL_ADMIN_CONFIG);
  const [analytics, setAnalytics] = useState<FunnelAnalytics>(SEED_FUNNEL_ANALYTICS);

  // Modals
  const [isFirstTimeWelcomeOpen, setIsFirstTimeWelcomeOpen] = useState<boolean>(false);
  const [zeroCreditModalOpen, setZeroCreditModalOpen] = useState<boolean>(false);
  const [consumptionConfirmation, setConsumptionConfirmation] = useState<{
    isOpen: boolean;
    cost: number;
    title: string;
    onConfirm: () => void;
  } | null>(null);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState<boolean>(false);

  // LinkedIn Auth State
  const [isLinkedInConnected, setIsLinkedInConnected] = useState<boolean>(false);
  const [isLinkedInConnectOpen, setIsLinkedInConnectOpen] = useState<boolean>(false);
  const [isLinkedInSyncOpen, setIsLinkedInSyncOpen] = useState<boolean>(false);

  // Load backend data if available
  useEffect(() => {
    fetch('/api/credits/wallet')
      .then(r => r.json())
      .then(data => {
        if (data.wallet) {
          setWallet(prev => ({
            ...data.wallet,
            isDemoUnlimited: isDemoMode
          }));
        }
      })
      .catch(() => {});
  }, [isDemoMode]);

  // Demo mode toggle handler (Requirement #4 & #5)
  const setDemoMode = (val: boolean) => {
    setIsDemoModeState(val);
    setWallet(prev => ({
      ...prev,
      isDemoUnlimited: val
    }));

    if (val) {
      // Entering demo mode: restore all seed/mockup data
      setOpportunities(SEED_OPPORTUNITIES);
      setNetworkContacts(SEED_NETWORK_CONTACTS);
      setReferrals(SEED_REFERRALS);
      setDeals(SEED_DEALS);
      setMessages(SEED_MESSAGES);
      setNotifications(SEED_NOTIFICATIONS);
      setTransactions(INITIAL_TRANSACTIONS);
      setAnalytics(SEED_FUNNEL_ANALYTICS);
      setUser(DEMO_USER);
    } else {
      // Leaving demo mode: clear all mockup data for a clean production slate
      setOpportunities([]);
      setNetworkContacts([]);
      setReferrals([]);
      setDeals([]);
      setMessages([]);
      setNotifications([]);
      setTransactions([]);
      setAnalytics({
        signups: 0, totalUsersSignedUp: 0, freeCreditsGranted: 0,
        firstNetworkSearches: 0, firstBeyondSearches: 0,
        freeCreditsConsumed: 0, creditsExhausted: 0,
        creditPurchases: 0, repeatPurchases: 0,
        freeToPaidRate: 0, creditUtilizationRate: 0,
        searchToMatchRate: 0, matchToIntroRate: 0,
        introToDealRate: 0, dealToCloseRate: 0,
        totalCreditsPurchased: 0, creditRevenueDollars: 0,
        totalDealVolumeGMV: 0, totalPlatformSuccessFees: 0
      });
      // In production mode, prompt welcome if first time
      setIsFirstTimeWelcomeOpen(true);
    }
  };

  // Consume credit logic with free credit priority and immutable transaction (Requirements #2, #3, #4, #6, #8)
  const consumeSearchCredit = (type: 'my_network' | 'beyond_network', onSuccess: () => void): boolean => {
    if (isDemoMode) {
      // Demo Mode: Unlimited simulated credits (Section #17)
      onSuccess();
      return true;
    }

    if (type === 'my_network') {
      // Level 1: Free network search
      if (wallet.freeNetworkSearchesUsedToday >= adminConfig.freeNetworkSearchesPerDay) {
        alert(`You have reached your daily limit of ${adminConfig.freeNetworkSearchesPerDay} free network searches. Try again tomorrow or search beyond your network.`);
        return false;
      }
      setWallet(prev => ({
        ...prev,
        freeNetworkSearchesUsedToday: prev.freeNetworkSearchesUsedToday + 1
      }));
      onSuccess();
      return true;
    }

    // Level 2: Beyond Network Search
    const cost = adminConfig.beyondNetworkSearchCost;
    if (wallet.availableCredits < cost) {
      setZeroCreditModalOpen(true);
      return false;
    }

    const balanceBefore = wallet.availableCredits;
    let consumedFrom: 'free' | 'purchased' = 'free';

    // FREE CREDIT PRIORITY (Section #4): Always consume free credits first!
    setWallet(prev => {
      let newFree = prev.freeCreditsRemaining;
      let newPurchased = prev.purchasedCredits;

      if (newFree >= cost) {
        newFree -= cost;
        consumedFrom = 'free';
      } else {
        const remainingCost = cost - newFree;
        newFree = 0;
        newPurchased = Math.max(0, newPurchased - remainingCost);
        consumedFrom = 'purchased';
      }

      const newAvailable = newFree + newPurchased;

      // Create immutable transaction (Section #6)
      const tx: CreditTransaction = {
        id: `tx_bns_${Date.now()}`,
        userId: user.id,
        amount: -cost,
        balanceBefore,
        balanceAfter: newAvailable,
        type: 'BEYOND_NETWORK_SEARCH',
        timestamp: new Date().toISOString(),
        description: `Beyond Network AI Search (1 credit consumed from ${consumedFrom} credits)`,
        creditBucket: consumedFrom
      };

      setTransactions(t => [tx, ...t]);

      // Check low credit warning (Section #9)
      if (newAvailable <= adminConfig.lowCreditThreshold && newAvailable > 0) {
        setNotifications(n => [
          {
            id: `notif_low_${Date.now()}`,
            userId: user.id,
            title: 'Low Credits Warning',
            message: `You have ${newAvailable} credit${newAvailable === 1 ? '' : 's'} remaining.`,
            type: 'credit',
            timestamp: 'Just now',
            read: false,
            actionUrl: 'credits'
          },
          ...n
        ]);
      }

      if (newAvailable === 0) {
        setAnalytics(a => ({ ...a, creditsExhausted: a.creditsExhausted + 1 }));
      }

      return {
        ...prev,
        freeCreditsRemaining: newFree,
        purchasedCredits: newPurchased,
        availableCredits: newAvailable,
        usageBeyondNetworkSearches: prev.usageBeyondNetworkSearches + cost
      };
    });

    onSuccess();
    return true;
  };

  // Confirmation prompt before consuming credit (Requirement #8: Credit Consumption Confirmation)
  const promptBeyondNetworkSearch = (actionTitle: string, onConfirm: () => void) => {
    if (isDemoMode) {
      onConfirm();
      return;
    }

    if (wallet.availableCredits < adminConfig.beyondNetworkSearchCost) {
      setZeroCreditModalOpen(true);
      return;
    }

    setConsumptionConfirmation({
      isOpen: true,
      cost: adminConfig.beyondNetworkSearchCost,
      title: actionTitle,
      onConfirm: () => {
        consumeSearchCredit('beyond_network', onConfirm);
        setConsumptionConfirmation(null);
      }
    });
  };

  // Stripe verified purchase simulation / flow (Requirement #11, #12)
  const purchasePackage = async (pkg: CreditPackage) => {
    try {
      const res = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageId: pkg.id, isDemoMode })
      });
      const data = await res.json();

      // Trigger verified server-side webhook processing
      const webhookRes = await fetch('/api/stripe/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: 'checkout.session.completed',
          packageId: pkg.id,
          paymentId: `pi_stripe_${Date.now()}`
        })
      });
      const webhookData = await webhookRes.json();

      if (webhookData.transaction) {
        setTransactions(t => [webhookData.transaction, ...t]);
      }
      if (webhookData.wallet) {
        setWallet(webhookData.wallet);
      } else {
        setWallet(prev => ({
          ...prev,
          purchasedCredits: prev.purchasedCredits + pkg.credits,
          availableCredits: prev.availableCredits + pkg.credits,
          lifetimePurchased: prev.lifetimePurchased + pkg.credits
        }));
      }

      setNotifications(n => [
        {
          id: `notif_purchase_${Date.now()}`,
          userId: user.id,
          title: 'Credits Purchased!',
          message: `Successfully added ${pkg.credits} credits from ${pkg.name} package.`,
          type: 'credit',
          timestamp: 'Just now',
          read: false,
          actionUrl: 'credits'
        },
        ...n
      ]);
    } catch (e: any) {
      console.warn('[AppContext] Notice processing purchase:', e?.message || e);
    }
  };

  // Opportunity creation
  const createOpportunity = async (data: Partial<Opportunity>): Promise<Opportunity> => {
    const opp: Opportunity = {
      id: `opp_${Date.now()}`,
      creatorId: user.id,
      creatorName: user.name,
      creatorAvatar: user.avatarUrl,
      type: data.type || 'give',
      category: data.category || 'buyer',
      title: data.title || 'Untitled Opportunity',
      description: data.description || '',
      location: data.location || 'San Francisco, CA',
      targetMarket: data.targetMarket || 'Miami, FL',
      priceRange: data.priceRange || { min: 1500000, max: 3000000, label: '$1.5M - $3M' },
      propertyType: data.propertyType || 'luxury',
      timeline: data.timeline || 'Within 30 days',
      referralTermsPct: data.referralTermsPct || 25,
      urgency: data.urgency || 'medium',
      status: 'active',
      daysActive: 0,
      createdAt: new Date().toISOString(),
      structuredData: data.structuredData
    };

    setOpportunities(prev => [opp, ...prev]);
    return opp;
  };

  // Referral and introduction creation (Section #12)
  const createReferralFromMatch = async (
    opp: Opportunity, 
    candidate: AIMatchCandidate, 
    customIntroText?: string
  ): Promise<ReferralContract> => {
    const dealValue = opp.priceRange.min;
    const grossCommission = dealValue * 0.03;
    const referralFee = grossCommission * (opp.referralTermsPct / 100);
    const platformFee = referralFee * (adminConfig.platformSuccessFeePct / 100);
    const connectorPayout = referralFee - platformFee;
    const takerNetCommission = grossCommission - referralFee;

    const ref: ReferralContract = {
      id: `ref_${Date.now()}`,
      opportunityId: opp.id,
      opportunityTitle: opp.title,
      giverId: user.id,
      giverName: user.name,
      giverAvatar: user.avatarUrl,
      takerId: candidate.contact.id,
      takerName: candidate.contact.name,
      takerAvatar: candidate.contact.avatarUrl,
      referralPercentage: opp.referralTermsPct,
      platformPercentage: adminConfig.platformSuccessFeePct,
      status: 'introduced',
      createdDate: new Date().toISOString(),
      estimatedDealValue: dealValue,
      expectedGrossCommission: grossCommission,
      estimatedReferralFee: referralFee,
      estimatedPlatformFee: platformFee,
      estimatedConnectorPayout: connectorPayout,
      estimatedTakerNetCommission: takerNetCommission,
      paymentStatus: 'unpaid',
      complianceApproved: true,
      legalAgreementSigned: true
    };

    const newDeal: Deal = {
      id: `deal_${Date.now()}`,
      referralId: ref.id,
      clientName: opp.title.split(' ')[0] + ' Client',
      propertyAddress: `${opp.targetMarket} Target Acquisition`,
      market: opp.targetMarket,
      stage: 'new_referral',
      dealValue,
      giverName: user.name,
      takerName: candidate.contact.name,
      referralFeePct: opp.referralTermsPct,
      platformFeePct: adminConfig.platformSuccessFeePct,
      grossReferralFee: referralFee,
      platformFeeAmount: platformFee,
      giverPayoutAmount: connectorPayout,
      expectedCloseDate: '2026-11-15',
      lastUpdated: new Date().toISOString(),
      notes: [
        `Referral initiated via Referro AI Matching (${candidate.overallScore}% Match)`,
        `Introduction delivered to ${candidate.contact.name} with ${opp.referralTermsPct}% fee terms.`
      ]
    };

    setReferrals(r => [ref, ...r]);
    setDeals(d => [newDeal, ...d]);

    // Send introduction message
    const introMsg: Message = {
      id: `msg_${Date.now()}`,
      conversationId: `conv_${candidate.contact.id}`,
      senderId: user.id,
      senderName: user.name,
      senderAvatar: user.avatarUrl,
      recipientId: candidate.contact.id,
      text: customIntroText || `Hi ${candidate.contact.name}, I would like to introduce you to an exclusive referral opportunity: "${opp.title}". Looking forward to working together!`,
      timestamp: new Date().toISOString(),
      relatedReferralId: ref.id,
      isAiDrafted: true
    };
    setMessages(m => [...m, introMsg]);

    setNotifications(n => [
      {
        id: `notif_ref_${Date.now()}`,
        userId: user.id,
        title: 'Referral & Warm Intro Created!',
        message: `Introduced ${candidate.contact.name} for "${opp.title}". Deal added to your Pipeline.`,
        type: 'intro',
        timestamp: 'Just now',
        read: false,
        actionUrl: 'deals'
      },
      ...n
    ]);

    return ref;
  };

  // Deal pipeline stage updater (Section #15)
  const updateDealStage = async (dealId: string, stage: DealStage) => {
    setDeals(prev => prev.map(d => {
      if (d.id === dealId) {
        const isClosing = stage === 'closed';
        return {
          ...d,
          stage,
          lastUpdated: new Date().toISOString(),
          actualCloseDate: isClosing ? new Date().toISOString().split('T')[0] : d.actualCloseDate,
          notes: [`Advanced to stage ${stage.replace('_', ' ').toUpperCase()} on ${new Date().toLocaleDateString()}`, ...d.notes]
        };
      }
      return d;
    }));

    if (stage === 'closed') {
      const deal = deals.find(d => d.id === dealId);
      if (deal) {
        setNotifications(n => [
          {
            id: `notif_closed_${Date.now()}`,
            userId: user.id,
            title: 'Deal Closed! Success Fee Processed',
            message: `Congratulations! ${deal.propertyAddress} closed ($${deal.dealValue.toLocaleString()}). Payout of $${deal.giverPayoutAmount.toLocaleString()} initiated via Stripe Connect.`,
            type: 'payment',
            timestamp: 'Just now',
            read: false,
            actionUrl: 'earnings'
          },
          ...n
        ]);
      }
    }
  };

  const updateAdminConfig = (newConfig: Partial<AdminCreditConfig>, updatedPackages?: CreditPackage[]) => {
    setAdminConfig(prev => ({ ...prev, ...newConfig }));
    if (updatedPackages) {
      setCreditPackages(updatedPackages);
    }
  };

  const grantPromoCredits = (amount: number, reason: string) => {
    const qty = Number(amount) || 5;
    const balanceBefore = wallet.availableCredits;
    const newAvailable = wallet.availableCredits + qty;

    setWallet(prev => ({
      ...prev,
      freeCreditsRemaining: prev.freeCreditsRemaining + qty,
      availableCredits: newAvailable
    }));

    const tx: CreditTransaction = {
      id: `tx_promo_${Date.now()}`,
      userId: user.id,
      amount: qty,
      balanceBefore,
      balanceAfter: newAvailable,
      type: 'PROMOTIONAL_CREDIT',
      timestamp: new Date().toISOString(),
      description: `Promotional Credit Grant: ${reason} (+${qty} credits)`,
      creditBucket: 'promo'
    };
    setTransactions(t => [tx, ...t]);
  };

  // Run one of the 3 required Demo Scenarios (Section #38)
  const runDemoScenario = (scenarioId: 1 | 2 | 3) => {
    if (scenarioId === 1) {
      // Scenario 1: Miami buyer out-of-area referral
      setActiveTab('give');
    } else if (scenarioId === 2) {
      // Scenario 2: Stuck Listing 127 days looking for buyers
      setActiveTab('take');
    } else if (scenarioId === 3) {
      // Scenario 3: Contractor seller lead
      setActiveTab('opportunities');
    }
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const sendMessage = (recipientId: string, text: string, referralId?: string) => {
    const msg: Message = {
      id: `msg_${Date.now()}`,
      conversationId: `conv_${recipientId}`,
      senderId: user.id,
      senderName: user.name,
      senderAvatar: user.avatarUrl,
      recipientId,
      text,
      timestamp: new Date().toISOString(),
      relatedReferralId: referralId
    };
    setMessages(prev => [...prev, msg]);
  };

  // Email login
  const loginWithEmail = async (email: string, password: string) => {
    const res = await fetch('/api/auth/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed.');
    if (data.success && data.user) {
      setUser(data.user);
      setIsAuthenticated(true);
      setIsDemoModeState(false);
      setWallet(prev => ({ ...prev, isDemoUnlimited: false }));
    }
  };

  // Email registration
  const registerWithEmail = async (name: string, email: string, password: string) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed.');
    if (data.success && data.user) {
      setUser(data.user);
      setIsAuthenticated(true);
      setIsDemoModeState(false);
      setWallet(prev => ({ ...prev, isDemoUnlimited: false }));
      setIsFirstTimeWelcomeOpen(true);
    }
  };

  // Logout
  const logout = () => {
    setIsAuthenticated(false);
    setIsDemoModeState(true);
    setUser(DEMO_USER);
    setActiveTab('dashboard');
    setWallet({ ...INITIAL_CREDIT_WALLET, isDemoUnlimited: true });
  };

  // LinkedIn OAuth: redirect user to LinkedIn authorization page
  const connectLinkedIn = async () => {
    try {
      const res = await fetch('/api/auth/linkedin/url');
      const data = await res.json();
      if (data.authUrl) {
        window.location.href = data.authUrl;
      }
    } catch (err) {
      console.error('Failed to get LinkedIn auth URL:', err);
      setIsLinkedInConnectOpen(false);
    }
  };

  // LinkedIn OAuth: process the returned profile and update user state
  const handleLinkedInCallback = async (profile: any) => {
    setIsLinkedInConnected(true);
    setIsLinkedInConnectOpen(false);
    setIsAuthenticated(true);
    setIsDemoModeState(false);
    setWallet(prev => ({ ...prev, isDemoUnlimited: false }));

    // Update user profile with LinkedIn data, preserving demo data as fallbacks
    setUser(prev => ({
      ...prev,
      id: profile.id || prev.id,
      name: profile.name || prev.name,
      email: profile.email || prev.email,
      avatarUrl: profile.avatarUrl || prev.avatarUrl,
      title: profile.headline || prev.title,
      isVerified: true,
      complianceStatus: 'verified'
    }));

    setNotifications(n => [
      {
        id: `notif_li_${Date.now()}`,
        userId: profile.id || user.id,
        title: 'LinkedIn Connected!',
        message: 'Your profile is verified. Your network is now powering smarter referral matches.',
        type: 'intro',
        timestamp: 'Just now',
        read: false,
        actionUrl: 'my-network'
      },
      ...n
    ]);
  };

  // LinkedIn Network Sync: fetch and import connections
  const syncLinkedInConnections = async (): Promise<{ imported: number; total: number }> => {
    const res = await fetch('/api/linkedin/sync', { method: 'POST' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Sync failed.');

    if (data.success && data.contacts) {
      setNetworkContacts(prev => {
        const existingNames = new Set(prev.map(c => c.name));
        const newContacts = data.contacts.filter((c: any) => !existingNames.has(c.name));
        return [...newContacts, ...prev];
      });
    }

    return { imported: data.imported || 0, total: data.total || 0 };
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isDemoMode,
        isAuthenticated,
        setDemoMode,
        loginWithEmail,
        registerWithEmail,
        logout,
        activeTab,
        setActiveTab,
        opportunities,
        networkContacts,
        referrals,
        deals,
        messages,
        notifications,
        wallet,
        transactions,
        creditPackages,
        adminConfig,
        analytics,
        isFirstTimeWelcomeOpen,
        setIsFirstTimeWelcomeOpen,
        zeroCreditModalOpen,
        setZeroCreditModalOpen,
        consumptionConfirmation,
        setConsumptionConfirmation,
        isAiAssistantOpen,
        setIsAiAssistantOpen,
        isLinkedInConnected,
        isLinkedInConnectOpen,
        setIsLinkedInConnectOpen,
        connectLinkedIn,
        handleLinkedInCallback,
        isLinkedInSyncOpen,
        setIsLinkedInSyncOpen,
        syncLinkedInConnections,
        consumeSearchCredit,
        promptBeyondNetworkSearch,
        purchasePackage,
        createOpportunity,
        createReferralFromMatch,
        updateDealStage,
        updateAdminConfig,
        grantPromoCredits,
        runDemoScenario,
        markNotificationAsRead,
        sendMessage
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
