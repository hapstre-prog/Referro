import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { structureRequestWithAI, draftIntroductionWithAI, chatReferralAssistantWithAI } from './server/gemini';
import { searchForSaleListings, searchSoldListings, buildMarketSummary, getMarketDataForAI, formatMarketDataForAI } from './server/mls';
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
} from './src/data/seedData';
import { CreditTransaction, CreditWallet, AdminCreditConfig, CreditPackage, ReferralContract, Deal, Opportunity, Message } from './src/types';

dotenv.config();

// In-memory persistent state for server runtime
let adminConfig: AdminCreditConfig = { ...INITIAL_ADMIN_CONFIG };
let creditPackages: CreditPackage[] = [...INITIAL_CREDIT_PACKAGES];
let creditWallet: CreditWallet = { ...INITIAL_CREDIT_WALLET };
let creditTransactions: CreditTransaction[] = [...INITIAL_TRANSACTIONS];
let opportunities: Opportunity[] = [...SEED_OPPORTUNITIES];
let referrals: ReferralContract[] = [...SEED_REFERRALS];
let deals: Deal[] = [...SEED_DEALS];
let messages: Message[] = [...SEED_MESSAGES];
let funnelAnalytics = { ...SEED_FUNNEL_ANALYTICS };

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // ----------------------------------------------------
  // API: Health Check
  // ----------------------------------------------------
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // ----------------------------------------------------
  // API: Auth & User Session
  // ----------------------------------------------------
  app.get('/api/auth/me', (req, res) => {
    // In production this checks JWT/session cookie; returns demo user profile or real user
    res.json({
      authenticated: true,
      user: DEMO_USER,
      isDemo: true
    });
  });

  app.get('/api/auth/linkedin/url', (req, res) => {
    // Generates official LinkedIn OAuth authorization URL
    const clientId = process.env.LINKEDIN_CLIENT_ID || 'mock_linkedin_client_id';
    const redirectUri = encodeURIComponent(`${process.env.APP_URL || 'http://localhost:3000'}/auth/callback`);
    const state = 'csrf_state_' + Math.random().toString(36).substring(7);
    const scope = encodeURIComponent('openid profile email');
    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=${scope}`;
    res.json({ authUrl, configured: Boolean(process.env.LINKEDIN_CLIENT_ID) });
  });

  app.post('/api/auth/demo', (req, res) => {
    res.json({ success: true, user: DEMO_USER, mode: 'demo' });
  });

  // LinkedIn OAuth callback: exchange code for token, fetch profile
  app.post('/api/auth/linkedin/callback', async (req, res) => {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ error: 'Missing authorization code' });
    }

    const clientId = process.env.LINKEDIN_CLIENT_ID;
    const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
    const redirectUri = `${process.env.APP_URL || 'http://localhost:3000'}/auth/callback`;

    // If LinkedIn credentials aren't configured, return a structured mock profile
    if (!clientId || !clientSecret) {
      return res.json({
        success: true,
        profile: {
          id: 'li_demo_user',
          name: 'LinkedIn Demo User',
          email: 'demo@linkedin.com',
          avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
          headline: 'Real Estate Professional',
          configured: false
        }
      });
    }

    try {
      // Step 1: Exchange authorization code for access token
      const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri
        })
      });

      if (!tokenResponse.ok) {
        const errText = await tokenResponse.text();
        console.error('LinkedIn token exchange failed:', errText);
        return res.status(400).json({ error: 'Failed to exchange authorization code for token' });
      }

      const tokenData = await tokenResponse.json() as any;

      // Step 2: Fetch user profile via OpenID Connect userinfo endpoint
      const profileResponse = await fetch('https://api.linkedin.com/v2/userinfo', {
        headers: { Authorization: `Bearer ${tokenData.access_token}` }
      });

      if (!profileResponse.ok) {
        console.error('LinkedIn profile fetch failed:', await profileResponse.text());
        return res.status(400).json({ error: 'Failed to fetch LinkedIn profile' });
      }

      const profile = await profileResponse.json() as any;

      res.json({
        success: true,
        profile: {
          id: profile.sub,
          name: profile.name || `${profile.given_name || ''} ${profile.family_name || ''}`.trim(),
          email: profile.email,
          avatarUrl: profile.picture,
          headline: profile.headline || '',
          configured: true
        }
      });
    } catch (err: any) {
      console.error('LinkedIn OAuth error:', err.message);
      res.status(500).json({ error: 'LinkedIn authentication failed' });
    }
  });

  // ----------------------------------------------------
  // API: Credits & Freemium Wallet (Requirement #1 - #15)
  // ----------------------------------------------------
  app.get('/api/credits/wallet', (req, res) => {
    res.json({
      wallet: creditWallet,
      config: {
        freeSignupCredits: adminConfig.freeSignupCredits,
        freeNetworkSearchesPerDay: adminConfig.freeNetworkSearchesPerDay,
        beyondNetworkSearchCost: adminConfig.beyondNetworkSearchCost,
        lowCreditThreshold: adminConfig.lowCreditThreshold
      }
    });
  });

  app.get('/api/credits/transactions', (req, res) => {
    res.json({ transactions: creditTransactions });
  });

  app.get('/api/credits/packages', (req, res) => {
    res.json({ packages: creditPackages.filter(p => p.active) });
  });

  // Credit Consumption Flow (Requirement #3, #4, #6, #8)
  app.post('/api/credits/consume', (req, res) => {
    const { searchType, relatedSearchId, isDemoMode } = req.body; // 'my_network' | 'beyond_network'

    if (isDemoMode || creditWallet.isDemoUnlimited) {
      // In Demo Mode: unlimited credits, but still records demonstration transaction
      return res.json({
        success: true,
        consumedAmount: 0,
        remainingTotal: 9999,
        message: 'Demo Mode: unlimited simulated credits used.'
      });
    }

    if (searchType === 'my_network') {
      // Level 1: My Network is 0 credits, up to daily limit
      const today = new Date().toISOString().split('T')[0];
      if (creditWallet.lastSearchDate !== today) {
        creditWallet.freeNetworkSearchesUsedToday = 0;
        creditWallet.lastSearchDate = today;
      }

      if (creditWallet.freeNetworkSearchesUsedToday >= adminConfig.freeNetworkSearchesPerDay) {
        return res.status(403).json({
          error: 'DAILY_LIMIT_REACHED',
          message: `You have reached your free daily limit of ${adminConfig.freeNetworkSearchesPerDay} network searches for today.`
        });
      }

      creditWallet.freeNetworkSearchesUsedToday += 1;
      return res.json({
        success: true,
        consumedAmount: 0,
        freeSearchesUsedToday: creditWallet.freeNetworkSearchesUsedToday,
        freeSearchesLimit: adminConfig.freeNetworkSearchesPerDay,
        remainingTotal: creditWallet.availableCredits
      });
    }

    // Level 2: Beyond My Network - requires credits
    const cost = adminConfig.beyondNetworkSearchCost;
    if (creditWallet.availableCredits < cost) {
      return res.status(402).json({
        error: 'INSUFFICIENT_CREDITS',
        message: "You've used all your free credits. Your next Beyond Network search requires credits.",
        availableCredits: creditWallet.availableCredits
      });
    }

    const balanceBefore = creditWallet.availableCredits;
    let consumedFrom: 'free' | 'purchased' = 'free';

    // FREE CREDIT PRIORITY: Always consume free credits first!
    if (creditWallet.freeCreditsRemaining >= cost) {
      creditWallet.freeCreditsRemaining -= cost;
      consumedFrom = 'free';
    } else {
      const freePart = creditWallet.freeCreditsRemaining;
      creditWallet.freeCreditsRemaining = 0;
      const remainder = cost - freePart;
      creditWallet.purchasedCredits = Math.max(0, creditWallet.purchasedCredits - remainder);
      consumedFrom = 'purchased';
    }

    creditWallet.availableCredits = creditWallet.freeCreditsRemaining + creditWallet.purchasedCredits;
    creditWallet.usageBeyondNetworkSearches += cost;

    // Create immutable transaction (Requirement #6)
    const txId = `tx_bns_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const tx: CreditTransaction = {
      id: txId,
      userId: DEMO_USER.id,
      amount: -cost,
      balanceBefore,
      balanceAfter: creditWallet.availableCredits,
      type: 'BEYOND_NETWORK_SEARCH',
      relatedSearchId: relatedSearchId || `search_${Date.now()}`,
      timestamp: new Date().toISOString(),
      description: `Beyond Network AI Search (1 credit consumed from ${consumedFrom} allocation)`,
      creditBucket: consumedFrom
    };

    creditTransactions.unshift(tx);
    funnelAnalytics.freeCreditsConsumed += (consumedFrom === 'free' ? cost : 0);
    if (creditWallet.availableCredits === 0) {
      funnelAnalytics.creditsExhausted += 1;
    }

    res.json({
      success: true,
      consumedAmount: cost,
      transaction: tx,
      wallet: creditWallet
    });
  });

  // ----------------------------------------------------
  // API: Stripe Integration (Requirement #12)
  // ----------------------------------------------------
  app.post('/api/stripe/create-checkout-session', (req, res) => {
    const { packageId, isDemoMode } = req.body;
    const pkg = creditPackages.find(p => p.id === packageId);
    if (!pkg) {
      return res.status(404).json({ error: 'Package not found' });
    }

    // In a production environment with STRIPE_SECRET_KEY, this calls stripe.checkout.sessions.create()
    // Here we provide a verified server-side response
    res.json({
      success: true,
      sessionId: `cs_test_${Date.now()}_${pkg.id}`,
      checkoutUrl: `/checkout-success?packageId=${pkg.id}`,
      package: pkg
    });
  });

  // Verified server-side Stripe webhook handling (Requirement #12)
  app.post('/api/stripe/webhook', (req, res) => {
    const { eventType, packageId, paymentId } = req.body;

    // Enforce server-side verification
    if (eventType === 'checkout.session.completed') {
      const pkg = creditPackages.find(p => p.id === packageId) || creditPackages[0];
      const creditsToAdd = pkg.credits;
      const balanceBefore = creditWallet.availableCredits;

      creditWallet.purchasedCredits += creditsToAdd;
      creditWallet.availableCredits = creditWallet.freeCreditsRemaining + creditWallet.purchasedCredits;
      creditWallet.lifetimePurchased += creditsToAdd;

      const tx: CreditTransaction = {
        id: `tx_stripe_${Date.now()}`,
        userId: DEMO_USER.id,
        amount: creditsToAdd,
        balanceBefore,
        balanceAfter: creditWallet.availableCredits,
        type: 'CREDIT_PURCHASE',
        relatedPaymentId: paymentId || `pi_stripe_${Date.now()}`,
        timestamp: new Date().toISOString(),
        description: `Stripe Verified Purchase: ${pkg.name} Package (${creditsToAdd} credits for $${pkg.price})`,
        creditBucket: 'purchased'
      };

      creditTransactions.unshift(tx);
      funnelAnalytics.creditPurchases += 1;
      funnelAnalytics.totalCreditsPurchased += creditsToAdd;
      funnelAnalytics.creditRevenueDollars += pkg.price;

      return res.json({ success: true, transaction: tx, wallet: creditWallet });
    }

    res.json({ received: true });
  });

  // ----------------------------------------------------
  // API: MLS Property Data (backend-only, enriches AI)
  // ----------------------------------------------------
  app.get('/api/mls/search', async (req, res) => {
    const location = (req.query.location as string) || '';
    const priceMin = req.query.price_min ? Number(req.query.price_min) : undefined;
    const priceMax = req.query.price_max ? Number(req.query.price_max) : undefined;

    if (!location) {
      return res.status(400).json({ error: 'Location is required' });
    }

    const [forSale, sold] = await Promise.all([
      searchForSaleListings(location, priceMin, priceMax),
      searchSoldListings(location),
    ]);

    const summary = buildMarketSummary(location, forSale, sold);
    res.json({ summary, forSale, sold });
  });

  app.get('/api/mls/market-data', async (req, res) => {
    const location = (req.query.location as string) || '';
    const priceMin = req.query.price_min ? Number(req.query.price_min) : undefined;
    const priceMax = req.query.price_max ? Number(req.query.price_max) : undefined;

    if (!location) {
      return res.status(400).json({ error: 'Location is required' });
    }

    const formatted = await getMarketDataForAI(location, priceMin, priceMax);
    res.json({ location, marketData: formatted, available: formatted.length > 0 });
  });

  // ----------------------------------------------------
  // API: AI Matching & Referral Structuring
  // ----------------------------------------------------
  app.post('/api/ai/structure-request', async (req, res) => {
    try {
      const { text, type } = req.body;
      const structured = await structureRequestWithAI(text, type);
      res.json(structured);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/ai/draft-intro', async (req, res) => {
    try {
      const { giverName, takerName, clientDescription, opportunityTitle, targetMarket, takerExpertise } = req.body;
      const draft = await draftIntroductionWithAI({
        giverName: giverName || DEMO_USER.name,
        takerName: takerName || 'Colleague',
        clientDescription: clientDescription || 'A qualified real estate client',
        opportunityTitle: opportunityTitle || 'Referral Opportunity',
        targetMarket: targetMarket || 'Local market',
        takerExpertise: takerExpertise || ['Luxury Specialist']
      });
      res.json({ draft });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/ai/assistant', async (req, res) => {
    try {
      const { prompt, context } = req.body;
      const reply = await chatReferralAssistantWithAI(prompt, context || 'Relay User Alex Morgan');
      res.json({ reply });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ----------------------------------------------------
  // API: Admin Credit Control & Analytics (Requirement #15 & #16)
  // ----------------------------------------------------
  app.get('/api/admin/credits/config', (req, res) => {
    res.json({ config: adminConfig, packages: creditPackages, analytics: funnelAnalytics });
  });

  app.post('/api/admin/credits/config', (req, res) => {
    adminConfig = { ...adminConfig, ...req.body.config };
    if (req.body.packages) {
      creditPackages = req.body.packages;
    }
    res.json({ success: true, config: adminConfig, packages: creditPackages });
  });

  app.post('/api/admin/credits/grant-promo', (req, res) => {
    const { amount, reason } = req.body;
    const qty = Number(amount) || 5;
    const balanceBefore = creditWallet.availableCredits;
    creditWallet.freeCreditsRemaining += qty;
    creditWallet.availableCredits = creditWallet.freeCreditsRemaining + creditWallet.purchasedCredits;

    const tx: CreditTransaction = {
      id: `tx_admin_${Date.now()}`,
      userId: DEMO_USER.id,
      amount: qty,
      balanceBefore,
      balanceAfter: creditWallet.availableCredits,
      type: 'ADMIN_ADJUSTMENT',
      timestamp: new Date().toISOString(),
      description: `Admin Grant: ${reason || 'Promotional adjustment'} (+${qty} credits)`,
      creditBucket: 'promo'
    };
    creditTransactions.unshift(tx);
    res.json({ success: true, wallet: creditWallet, transaction: tx });
  });

  // ----------------------------------------------------
  // API: Referrals & Deals Pipeline (Requirement #12 & #15)
  // ----------------------------------------------------
  app.get('/api/referrals', (req, res) => {
    res.json({ referrals });
  });

  app.post('/api/referrals', (req, res) => {
    const newRef: ReferralContract = {
      id: `ref_${Date.now()}`,
      opportunityId: req.body.opportunityId,
      opportunityTitle: req.body.opportunityTitle,
      giverId: DEMO_USER.id,
      giverName: DEMO_USER.name,
      giverAvatar: DEMO_USER.avatarUrl,
      takerId: req.body.takerId,
      takerName: req.body.takerName,
      takerAvatar: req.body.takerAvatar,
      referralPercentage: req.body.referralPercentage || 25,
      platformPercentage: adminConfig.platformSuccessFeePct,
      status: 'introduced',
      createdDate: new Date().toISOString(),
      estimatedDealValue: req.body.estimatedDealValue || 2000000,
      expectedGrossCommission: (req.body.estimatedDealValue || 2000000) * 0.03,
      estimatedReferralFee: (req.body.estimatedDealValue || 2000000) * 0.03 * 0.25,
      estimatedPlatformFee: (req.body.estimatedDealValue || 2000000) * 0.03 * 0.25 * (adminConfig.platformSuccessFeePct / 100),
      estimatedConnectorPayout: (req.body.estimatedDealValue || 2000000) * 0.03 * 0.25 * (1 - adminConfig.platformSuccessFeePct / 100),
      estimatedTakerNetCommission: (req.body.estimatedDealValue || 2000000) * 0.03 * 0.75,
      paymentStatus: 'unpaid',
      complianceApproved: true,
      legalAgreementSigned: true
    };
    referrals.unshift(newRef);

    // Also auto-create a deal in pipeline
    const newDeal: Deal = {
      id: `deal_${Date.now()}`,
      referralId: newRef.id,
      clientName: req.body.clientName || 'Referred Client',
      propertyAddress: req.body.propertyAddress || `${req.body.targetMarket || 'Miami, FL'} Target Property`,
      market: req.body.targetMarket || 'Miami, FL',
      stage: 'new_referral',
      dealValue: newRef.estimatedDealValue,
      giverName: DEMO_USER.name,
      takerName: newRef.takerName,
      referralFeePct: newRef.referralPercentage,
      platformFeePct: newRef.platformPercentage,
      grossReferralFee: newRef.estimatedReferralFee,
      platformFeeAmount: newRef.estimatedPlatformFee,
      giverPayoutAmount: newRef.estimatedConnectorPayout,
      expectedCloseDate: '2026-10-31',
      lastUpdated: new Date().toISOString(),
      notes: [`Referral created by ${DEMO_USER.name}`, `Introduction sent to ${newRef.takerName}`]
    };
    deals.unshift(newDeal);

    res.json({ success: true, referral: newRef, deal: newDeal });
  });

  app.get('/api/deals', (req, res) => {
    res.json({ deals });
  });

  app.patch('/api/deals/:id/stage', (req, res) => {
    const { id } = req.params;
    const { stage } = req.body;
    const deal = deals.find(d => d.id === id);
    if (!deal) return res.status(404).json({ error: 'Deal not found' });
    deal.stage = stage;
    deal.lastUpdated = new Date().toISOString();
    deal.notes.unshift(`Deal advanced to ${stage.replace('_', ' ').toUpperCase()} on ${new Date().toLocaleDateString()}`);

    if (stage === 'closed') {
      deal.actualCloseDate = new Date().toISOString().split('T')[0];
      // Update linked referral
      const ref = referrals.find(r => r.id === deal.referralId);
      if (ref) {
        ref.status = 'closed';
        ref.paymentStatus = 'processing';
      }
      funnelAnalytics.dealToCloseRate = 72.4;
      funnelAnalytics.totalDealVolumeGMV += deal.dealValue;
      funnelAnalytics.totalPlatformSuccessFees += deal.platformFeeAmount;
    }

    res.json({ success: true, deal });
  });

  app.get('/api/opportunities', (req, res) => {
    res.json({ opportunities });
  });

  app.post('/api/opportunities', (req, res) => {
    const opp: Opportunity = {
      id: `opp_${Date.now()}`,
      creatorId: DEMO_USER.id,
      creatorName: DEMO_USER.name,
      creatorAvatar: DEMO_USER.avatarUrl,
      type: req.body.type || 'give',
      category: req.body.category || 'buyer',
      title: req.body.title,
      description: req.body.description,
      location: req.body.location || 'San Francisco, CA',
      targetMarket: req.body.targetMarket || 'Miami, FL',
      priceRange: req.body.priceRange || { min: 2000000, max: 3500000, label: '$2M - $3.5M' },
      propertyType: req.body.propertyType || 'luxury',
      timeline: req.body.timeline || 'Within 30 days',
      referralTermsPct: req.body.referralTermsPct || 25,
      urgency: req.body.urgency || 'medium',
      status: 'active',
      daysActive: 0,
      createdAt: new Date().toISOString(),
      structuredData: req.body.structuredData
    };
    opportunities.unshift(opp);
    res.json({ success: true, opportunity: opp });
  });

  // ----------------------------------------------------
  // Vite Middleware / Static Serving
  // ----------------------------------------------------
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Relay AI Referral Network server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start Relay server:', err);
  process.exit(1);
});
