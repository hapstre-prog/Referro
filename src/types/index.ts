export type UserRole = 'agent' | 'broker' | 'contractor' | 'investor' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: UserRole;
  title: string;
  company: string;
  brokerage?: string;
  licenseNumber?: string;
  jurisdiction: string[]; // States / Markets e.g. ['CA', 'FL']
  marketsServed: string[];
  specialties: string[];
  priceRange: { min: number; max: number };
  reputationScore: number; // 0 - 100
  responseRate: number; // e.g. 96%
  successRate: number; // e.g. 92%
  dealsClosed: number;
  totalVolume: number;
  totalVolumeClosed?: number;
  giveOpportunitiesPosted?: number;
  isVerified: boolean;
  complianceStatus: 'verified' | 'pending' | 'action_required';
  joinedAt: string;
}

export type NetworkDegree = 1 | 2 | 3;

export interface NetworkContact {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  title: string;
  company: string;
  location: string;
  industry: string;
  degree: NetworkDegree;
  connectedVia?: { id: string; name: string; title: string };
  referralCategories: string[];
  geographicCoverage: string[];
  marketsServed?: string[];
  expertise: string[];
  matchScore?: number;
  rating: number;
  dealsClosedTogether: number;
  totalSalesVolume?: number;
  activeListingsCount?: number;
  licenseNumber?: string;
  available: boolean;
  phone?: string;
  notes?: string;
}

export type OpportunityCategory = 
  | 'buyer'
  | 'seller'
  | 'listing'
  | 'out_of_area_referral'
  | 'contractor_lead'
  | 'investor_lead'
  | 'commercial'
  | 'other';

export interface Opportunity {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  type: 'give' | 'take';
  category: OpportunityCategory;
  title: string;
  description: string;
  location: string;
  targetMarket: string;
  priceRange: { min: number; max: number; label: string };
  propertyType: 'residential' | 'luxury' | 'commercial' | 'multi_family' | 'land' | 'renovation';
  timeline: string;
  referralTermsPct: number; // e.g. 25% or 30%
  urgency: 'high' | 'medium' | 'low';
  status: 'active' | 'matched' | 'in_progress' | 'closed' | 'archived';
  daysActive?: number;
  createdAt: string;
  structuredData?: {
    intent: string;
    keyCriteria: string[];
    buyerMotivation?: string;
    specialRequirements?: string;
  };
}

export interface MatchScoreBreakdown {
  geography: number; // 0 - 100
  propertyType: number;
  priceRange: number;
  expertise: number;
  networkRelationship: number;
  historicalPerformance: number;
}

export interface AIMatchCandidate {
  contact: NetworkContact;
  overallScore: number; // 0 - 100
  matchLevel?: 'my_network' | 'beyond_network';
  scoreBreakdown?: MatchScoreBreakdown;
  breakdown?: {
    geographyScore: number;
    propertyTypeScore: number;
    budgetAlignmentScore: number;
    specializationScore: number;
    networkProximityScore: number;
  };
  matchReasons: string[];
  connectionPath: string; // e.g. "Direct Connection (1st degree)" or "Connected via David Miller (2nd degree)"
  recommendedStrategy?: string;
  outperformance?: {
    salesVolumeMultiplier: string; // e.g. "4.3x Level 1 Average"
    volumeComparison: string;      // e.g. "$165M vs $38M Level 1 average"
    closingSpeed: string;          // e.g. "16 days avg to contract (2.7x faster)"
    activeBuyerAdvantage: string;  // e.g. "6 pre-approved $7M+ cash buyers"
    summary: string;
  };
}

export type ReferralStatus = 
  | 'posted'
  | 'matched'
  | 'introduced'
  | 'accepted'
  | 'in_progress'
  | 'under_contract'
  | 'closed'
  | 'paid'
  | 'rejected';

export interface ReferralContract {
  id: string;
  opportunityId: string;
  opportunityTitle: string;
  giverId: string;
  giverName: string;
  giverAvatar: string;
  takerId: string;
  takerName: string;
  takerAvatar: string;
  connectorId?: string;
  connectorName?: string;
  referralPercentage: number; // e.g. 25%
  platformPercentage: number; // e.g. 10% of referral fee
  status: ReferralStatus;
  createdDate: string;
  acceptedDate?: string;
  closingDate?: string;
  estimatedDealValue: number;
  actualDealValue?: number;
  expectedGrossCommission: number;
  estimatedReferralFee: number;
  estimatedPlatformFee: number;
  estimatedConnectorPayout: number;
  estimatedTakerNetCommission: number;
  paymentStatus: 'unpaid' | 'escrow' | 'processing' | 'paid';
  complianceApproved: boolean;
  legalAgreementSigned: boolean;
}

export type DealStage = 
  | 'new_referral'
  | 'contacted'
  | 'meeting_showing'
  | 'offer'
  | 'negotiation'
  | 'under_contract'
  | 'closed';

export interface Deal {
  id: string;
  referralId: string;
  clientName: string;
  propertyAddress: string;
  market: string;
  stage: DealStage;
  dealValue: number;
  giverName: string;
  takerName: string;
  referralFeePct: number;
  platformFeePct: number;
  grossReferralFee: number;
  platformFeeAmount: number;
  giverPayoutAmount: number;
  expectedCloseDate: string;
  actualCloseDate?: string;
  lastUpdated: string;
  notes: string[];
}

export type CreditTransactionType = 
  | 'FREE_CREDIT_GRANT'
  | 'BEYOND_NETWORK_SEARCH'
  | 'CREDIT_PURCHASE'
  | 'CREDIT_REFUND'
  | 'ADMIN_ADJUSTMENT'
  | 'PROMOTIONAL_CREDIT';

export interface CreditTransaction {
  id: string;
  userId: string;
  amount: number; // Positive for grant/purchase, negative for consumption
  balanceBefore: number;
  balanceAfter: number;
  type: CreditTransactionType;
  relatedSearchId?: string;
  relatedPaymentId?: string;
  timestamp: string;
  description: string;
  creditBucket: 'free' | 'purchased' | 'promo';
}

export interface CreditWallet {
  availableCredits: number;
  freeCreditsRemaining: number;
  purchasedCredits: number;
  lifetimePurchased: number;
  lifetimeFreeGranted: number;
  usageBeyondNetworkSearches: number;
  freeNetworkSearchesUsedToday: number;
  freeNetworkSearchesLimit: number; // default 2
  lastSearchDate: string; // YYYY-MM-DD
  isDemoUnlimited: boolean;
}

export interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  costPerCredit?: number;
  discountLabel?: string;
  badge?: string;
  popular?: boolean;
  active: boolean;
  stripePriceId?: string;
  description?: string;
}

export interface AdminCreditConfig {
  freeSignupCredits: number;
  freeNetworkSearchesPerDay: number;
  beyondNetworkSearchCost: number;
  lowCreditThreshold: number;
  freeCreditExpiration: 'never' | '30_days' | '60_days' | '90_days' | 'custom';
  purchasedCreditExpiration: 'never' | '365_days';
  referralInviteCredits: number;
  referralCreditsGrant?: number;
  successfulReferralRewardCredits: number;
  platformSuccessFeePct: number; // default 10%
  connectorSharePct: number; // default 25%
}

export interface FunnelAnalytics {
  signups: number;
  totalUsersSignedUp?: number;
  freeCreditsGranted: number;
  firstNetworkSearches: number;
  firstBeyondSearches: number;
  freeCreditsConsumed: number;
  creditsExhausted: number;
  creditPurchases: number;
  repeatPurchases: number;
  freeToPaidRate: number; // %
  creditUtilizationRate: number; // %
  searchToMatchRate: number; // %
  matchToIntroRate: number; // %
  introToDealRate: number; // %
  dealToCloseRate: number; // %
  totalCreditsPurchased: number;
  creditRevenueDollars: number;
  totalDealVolumeGMV: number;
  totalPlatformSuccessFees: number;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  recipientId: string;
  text: string;
  timestamp: string;
  relatedReferralId?: string;
  isAiDrafted?: boolean;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'match' | 'intro' | 'referral' | 'deal' | 'payment' | 'credit' | 'system';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}
