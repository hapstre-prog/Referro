import { AIMatchCandidate } from '../types';

export const LEVEL_1_BENCHMARKS = {
  averageSalesVolume: 38500000,
  formattedAverageVolume: '$38.5M',
  averageDaysToContract: 44,
  averageRating: 4.88,
  activeBuyerPoolSize: 1,
  label: 'Level 1 Network Average ($38.5M vol, 44d to close)'
};

export const OUTSIDE_NETWORK_CANDIDATES: AIMatchCandidate[] = [
  {
    contact: {
      id: 'ext_cnt_1',
      name: 'Alexander Sterling',
      title: 'Managing Director, Private Client Group',
      company: "Sotheby's International Realty — Aspen & Greenwich",
      location: 'Aspen, CO',
      industry: 'Real Estate Brokerage',
      marketsServed: ['Aspen, CO', 'Vail, CO', 'Greenwich, CT', 'San Francisco, CA'],
      referralCategories: ['buyer', 'seller', 'luxury', 'ultra_high_net_worth'],
      geographicCoverage: ['Aspen, CO', 'Vail, CO', 'Greenwich, CT'],
      degree: 3,
      email: 'alexander.sterling@sothebys.com',
      phone: '(970) 555-0199',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      expertise: ['Ultra-Luxury Residential', 'Family Office Capital', 'Bi-Coastal Relocations', 'Historic Estates'],
      rating: 4.98,
      activeListingsCount: 11,
      totalSalesVolume: 165000000,
      dealsClosedTogether: 0,
      available: true,
      licenseNumber: 'CO-RE-99201'
    },
    overallScore: 98,
    matchLevel: 'beyond_network',
    breakdown: {
      geographyScore: 97,
      propertyTypeScore: 99,
      budgetAlignmentScore: 98,
      specializationScore: 99,
      networkProximityScore: 55
    },
    matchReasons: [
      'Represents 3 verified family office buyers actively seeking Pacific Heights & Bay Area luxury estates',
      'Specialist in high-value properties ($7M+) active for >90 days with aggressive buyer network syndication',
      'Sotheby’s National Top 0.1% Producer with active bi-coastal tech executive migration pipeline',
      'Guaranteed 25% referral fee compliance via standard Referro escrow agreement'
    ],
    connectionPath: 'Outside Network (Referro Verified National Partner)',
    recommendedStrategy: 'Execute 25% reciprocal referral agreement targeting Aspen-SF relocation corridor.',
    outperformance: {
      salesVolumeMultiplier: '4.3x Level 1 Volume',
      volumeComparison: '$165M annual volume vs $38.5M Level 1 average (+328%)',
      closingSpeed: '16 days avg to contract (2.7x faster closing velocity)',
      activeBuyerAdvantage: '6 pre-approved $7M+ cash buyers with verified proof of funds',
      summary: 'Dramatically outperforms your Level 1 network in high-ticket luxury closing velocity and verified cash buyer liquidity.'
    }
  },
  {
    contact: {
      id: 'ext_cnt_2',
      name: 'Genevieve Fontaine',
      title: 'Senior Partner, Private Estates Division',
      company: 'The Agency — Beverly Hills & Miami',
      location: 'Beverly Hills, CA',
      industry: 'Real Estate Brokerage',
      marketsServed: ['Beverly Hills', 'Bel Air', 'Miami Beach', 'San Francisco'],
      referralCategories: ['buyer', 'seller', 'celebrity_relocation', 'historic_properties'],
      geographicCoverage: ['Beverly Hills, CA', 'Los Angeles, CA', 'Miami, FL'],
      degree: 3,
      email: 'g.fontaine@theagencyre.com',
      phone: '(310) 555-8833',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
      expertise: ['Celebrity Relocation', 'Historic Estates', 'Buyer Representation', 'Architectural Masterpieces'],
      rating: 4.96,
      activeListingsCount: 14,
      totalSalesVolume: 148000000,
      dealsClosedTogether: 0,
      available: true,
      licenseNumber: 'CA-DRE-01899201'
    },
    overallScore: 96,
    matchLevel: 'beyond_network',
    breakdown: {
      geographyScore: 94,
      propertyTypeScore: 97,
      budgetAlignmentScore: 98,
      specializationScore: 96,
      networkProximityScore: 50
    },
    matchReasons: [
      'Top-producing specialist in California historic architecture and landmark estate preservation',
      'Maintains active pipeline of entertainment & tech executives acquiring secondary luxury residences',
      'Closed 5 off-market transactions over $6M in the last two quarters',
      'Zero listing expiration track record across premier West Coast portfolios'
    ],
    connectionPath: 'Outside Network (Referro Verified National Partner)',
    recommendedStrategy: 'Leverage private client buyer registry for discreet off-market representation.',
    outperformance: {
      salesVolumeMultiplier: '3.8x Level 1 Volume',
      volumeComparison: '$148M closed volume vs $38.5M Level 1 average (+284%)',
      closingSpeed: '19 days avg on market vs 44 days Level 1 benchmark',
      activeBuyerAdvantage: '4 active celebrity & executive buyers with verified liquid escrow deposits',
      summary: 'Significantly outperforms Level 1 network with direct access to private high-net-worth bi-coastal relocation capital.'
    }
  },
  {
    contact: {
      id: 'ext_cnt_3',
      name: 'Maximilian Vanderbilt-Cross',
      title: 'Managing Director, Luxury Advisory Group',
      company: 'Douglas Elliman — Palm Beach & Manhattan',
      location: 'Palm Beach, FL',
      industry: 'Real Estate Brokerage',
      marketsServed: ['Palm Beach, FL', 'Manhattan, NY', 'Hamptons, NY', 'San Francisco, CA'],
      referralCategories: ['buyer', 'ultra_luxury', 'family_office'],
      geographicCoverage: ['Palm Beach, FL', 'New York, NY'],
      degree: 3,
      email: 'm.cross@elliman.com',
      phone: '(561) 555-0912',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      expertise: ['Trophy Waterfronts', 'Historic Mansions', 'Private Wealth Migration', 'Bespoke Co-Brokes'],
      rating: 4.99,
      activeListingsCount: 16,
      totalSalesVolume: 192000000,
      dealsClosedTogether: 0,
      available: true,
      licenseNumber: 'FL-BK-3391024'
    },
    overallScore: 99,
    matchLevel: 'beyond_network',
    breakdown: {
      geographyScore: 98,
      propertyTypeScore: 99,
      budgetAlignmentScore: 99,
      specializationScore: 99,
      networkProximityScore: 50
    },
    matchReasons: [
      'Wall Street Journal Top 25 National Individual Agents ranking for luxury deal volume',
      'Direct institutional bridge to Northeast hedge fund & private equity principals buying West Coast trophies',
      'Expert in matching buyers to properties requiring historic restoration and architectural pedigree',
      'Flawless DRE and legal disclosure compliance record with 100% on-time closings'
    ],
    connectionPath: 'Outside Network (Referro Verified National Partner)',
    recommendedStrategy: 'Co-broke outreach directly into East Coast family office distribution channels.',
    outperformance: {
      salesVolumeMultiplier: '5.0x Level 1 Volume',
      volumeComparison: '$192M career volume vs $38.5M Level 1 average (+398%)',
      closingSpeed: '14 days to escrow on historic luxury listings (3.1x faster)',
      activeBuyerAdvantage: '7 ultra-high-net-worth international cash buyers ready to tour',
      summary: 'Crushes in-network benchmarks with top-tier East Coast private wealth migration and private banking relationships.'
    }
  },
  {
    contact: {
      id: 'ext_cnt_4',
      name: 'Kavita Patel',
      title: 'Partner, Tech & Innovation Real Estate',
      company: 'Compass Private Client Network — Silicon Valley & Austin',
      location: 'Palo Alto, CA',
      industry: 'Real Estate Brokerage',
      marketsServed: ['Silicon Valley', 'San Francisco', 'Austin', 'Seattle'],
      referralCategories: ['buyer', 'seller', 'tech_execs', 'modern_luxury'],
      geographicCoverage: ['Palo Alto, CA', 'San Francisco, CA', 'Austin, TX'],
      degree: 3,
      email: 'kavita.patel@compass.com',
      phone: '(650) 555-0811',
      avatarUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&auto=format&fit=crop&q=80',
      expertise: ['Tech Founder Liquidity', 'Modern Architectural Estates', 'Off-Market Syndicates', 'Relocation'],
      rating: 4.95,
      activeListingsCount: 9,
      totalSalesVolume: 135000000,
      dealsClosedTogether: 0,
      available: true,
      licenseNumber: 'CA-DRE-01984420'
    },
    overallScore: 97,
    matchLevel: 'beyond_network',
    breakdown: {
      geographyScore: 99,
      propertyTypeScore: 95,
      budgetAlignmentScore: 97,
      specializationScore: 98,
      networkProximityScore: 50
    },
    matchReasons: [
      'Represents 4 verified tech founders with recent liquidity events seeking immediate luxury property',
      'Specialized in re-energizing listings active >90 days with aggressive buyer network matching',
      'Certified Luxury Home Marketing Specialist (GUILD Elite Member)',
      'Immediate access to private tech buyer Slack groups and Silicon Valley executive syndicates'
    ],
    connectionPath: 'Outside Network (Referro Verified National Partner)',
    recommendedStrategy: 'Position opportunity directly to pre-IPO executive relocation lists.',
    outperformance: {
      salesVolumeMultiplier: '3.5x Level 1 Volume',
      volumeComparison: '$135M closed volume vs $38.5M Level 1 average (+250%)',
      closingSpeed: '21 days avg time to match pre-qualified buyer (2x faster)',
      activeBuyerAdvantage: '5 tech executives with liquid liquidity seeking premium estates',
      summary: 'Substantially outperforms Level 1 peers with exclusive access to tech founder liquidity and corporate relocation syndicates.'
    }
  },
  {
    contact: {
      id: 'ext_cnt_5',
      name: 'Laurent Mercier',
      title: 'Senior Vice President, International Estates',
      company: "Christie's International Real Estate — New York & Paris",
      location: 'New York, NY',
      industry: 'Real Estate Brokerage',
      marketsServed: ['New York, NY', 'San Francisco, CA', 'Paris', 'Geneva'],
      referralCategories: ['buyer', 'ultra_luxury', 'cross_border'],
      geographicCoverage: ['New York, NY', 'San Francisco, CA'],
      degree: 3,
      email: 'l.mercier@christiesrealestate.com',
      phone: '(212) 555-7721',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
      expertise: ['Landmark Properties', 'Contemporary Estates', 'Global Family Offices', 'Art Collector Residences'],
      rating: 4.97,
      activeListingsCount: 12,
      totalSalesVolume: 178000000,
      dealsClosedTogether: 0,
      available: true,
      licenseNumber: 'NY-RE-4991204'
    },
    overallScore: 98,
    matchLevel: 'beyond_network',
    breakdown: {
      geographyScore: 95,
      propertyTypeScore: 99,
      budgetAlignmentScore: 99,
      specializationScore: 99,
      networkProximityScore: 50
    },
    matchReasons: [
      'Unrivaled global buyer syndicate for distinctive architectural properties requiring fresh out-of-market demand',
      'Ranked #1 luxury advisor in international network for cross-border referrals into US gateway cities',
      'Full concierge buyer onboarding team ensuring seamless 25% referral escrow closing',
      'Maintains relationships with sovereign wealth funds and European family offices'
    ],
    connectionPath: 'Outside Network (Referro Verified National Partner)',
    recommendedStrategy: 'Leverage Christie’s auction clientele and global luxury collector databases.',
    outperformance: {
      salesVolumeMultiplier: '4.6x Level 1 Volume',
      volumeComparison: '$178M luxury transactions vs $38.5M Level 1 average (+362%)',
      closingSpeed: '18 days average buyer match turnaround',
      activeBuyerAdvantage: '6 global family offices seeking prime US architectural trophies',
      summary: 'Outperforms domestic Level 1 connections through premier European and international buyer syndicate connectivity.'
    }
  },
  {
    contact: {
      id: 'ext_cnt_6',
      name: 'Camilla Sterling-Torres',
      title: 'Principal Broker, Coastal & Landmark Properties',
      company: 'Corcoran Group — Hamptons & Miami Beach',
      location: 'Miami Beach, FL',
      industry: 'Real Estate Brokerage',
      marketsServed: ['Miami Beach, FL', 'Hamptons, NY', 'San Francisco, CA', 'Los Angeles, CA'],
      referralCategories: ['buyer', 'seller', 'luxury_estates', 'co_broke'],
      geographicCoverage: ['Miami Beach, FL', 'Hamptons, NY'],
      degree: 3,
      email: 'c.torres@corcoran.com',
      phone: '(305) 555-4490',
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
      expertise: ['Trophy Waterfront', 'Historic Preservation', 'Discreet Private Placement', 'Stuck Listing Revivals'],
      rating: 4.94,
      activeListingsCount: 15,
      totalSalesVolume: 155000000,
      dealsClosedTogether: 0,
      available: true,
      licenseNumber: 'FL-BK-882194'
    },
    overallScore: 96,
    matchLevel: 'beyond_network',
    breakdown: {
      geographyScore: 96,
      propertyTypeScore: 97,
      budgetAlignmentScore: 96,
      specializationScore: 96,
      networkProximityScore: 50
    },
    matchReasons: [
      'Manages active buyer mandates from East Coast hedge fund and PE partners acquiring West Coast luxury residences',
      'Proven expertise reviving high-end properties that have lingered on market through strategic buyer targeting',
      'Flawless 100% compliant DRE closing track record with expedited escrow processing',
      'Strong co-broke reputation among national luxury brokers with dedicated transaction coordinator'
    ],
    connectionPath: 'Outside Network (Referro Verified National Partner)',
    recommendedStrategy: 'Deploy targeted outbound outreach to top East Coast financial executive buyer rosters.',
    outperformance: {
      salesVolumeMultiplier: '4.0x Level 1 Volume',
      volumeComparison: '$155M closed volume vs $38.5M Level 1 average (+302%)',
      closingSpeed: '22 days avg contract turnaround (2x faster than market avg)',
      activeBuyerAdvantage: '4 active hedge fund & PE partner buyer mandates ready for execution',
      summary: 'Demonstrated 4x higher closing volume and superior buyer-side liquidity compared to standard in-network contacts.'
    }
  },
  {
    contact: {
      id: 'ext_cnt_7',
      name: 'Harrison Vance',
      title: 'Partner, Private Wealth Division',
      company: 'SERHANT. — Tribeca & Palm Beach',
      location: 'New York, NY',
      industry: 'Real Estate Brokerage',
      marketsServed: ['New York, NY', 'Palm Beach, FL', 'San Francisco, CA'],
      referralCategories: ['buyer', 'ultra_luxury', 'new_development'],
      geographicCoverage: ['New York, NY', 'Palm Beach, FL'],
      degree: 3,
      email: 'harrison.vance@serhant.com',
      phone: '(212) 555-9011',
      avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
      expertise: ['Trophy Penthouses', 'Venture Capital Relocations', 'Social Media Syndication', 'High-Stakes Negotiations'],
      rating: 4.96,
      activeListingsCount: 13,
      totalSalesVolume: 184000000,
      dealsClosedTogether: 0,
      available: true,
      licenseNumber: 'NY-RE-5019882'
    },
    overallScore: 97,
    matchLevel: 'beyond_network',
    breakdown: {
      geographyScore: 94,
      propertyTypeScore: 98,
      budgetAlignmentScore: 99,
      specializationScore: 98,
      networkProximityScore: 50
    },
    matchReasons: [
      'Over 400K direct high-net-worth real estate audience with viral buyer reach',
      'Brokered 4 of the top 10 Manhattan-to-California tech partner relocations in 2025',
      'Average sale price $9.2M with average 17 days from introduction to contract offer'
    ],
    connectionPath: 'Outside Network (Referro Verified National Partner)',
    recommendedStrategy: 'Leverage multi-channel buyer syndication across East Coast venture partner network.',
    outperformance: {
      salesVolumeMultiplier: '4.8x Level 1 Volume',
      volumeComparison: '$184M annual volume vs $38.5M Level 1 average (+377%)',
      closingSpeed: '17 days to contract (2.6x faster than standard brokerages)',
      activeBuyerAdvantage: '8 pre-qualified venture capital partners with liquid escrow readiness',
      summary: 'Unrivaled buyer reach across coastal tech executives and finance principals.'
    }
  },
  {
    contact: {
      id: 'ext_cnt_8',
      name: 'Beatrice Delacroix',
      title: 'Global Luxury Ambassador',
      company: 'Coldwell Banker Global Luxury — Malibu & Palisades',
      location: 'Malibu, CA',
      industry: 'Real Estate Brokerage',
      marketsServed: ['Malibu, CA', 'Pacific Palisades, CA', 'San Francisco, CA'],
      referralCategories: ['buyer', 'seller', 'architectural'],
      geographicCoverage: ['Malibu, CA', 'Los Angeles, CA'],
      degree: 3,
      email: 'beatrice.delacroix@cbgluxury.com',
      phone: '(310) 555-7312',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
      expertise: ['Oceanfront Compounds', 'Historic Modernism', 'Entertainment Industry Co-Brokes'],
      rating: 4.95,
      activeListingsCount: 8,
      totalSalesVolume: 142000000,
      dealsClosedTogether: 0,
      available: true,
      licenseNumber: 'CA-DRE-01449102'
    },
    overallScore: 95,
    matchLevel: 'beyond_network',
    breakdown: {
      geographyScore: 95,
      propertyTypeScore: 97,
      budgetAlignmentScore: 96,
      specializationScore: 97,
      networkProximityScore: 50
    },
    matchReasons: [
      'Extensive clientele among film studio heads and technology investors seeking legacy estates',
      'Over 25 years specializing in architect-designed landmark residences with strict buyer qualification',
      '98.4% list-to-sale ratio with verified zero seller concessions history'
    ],
    connectionPath: 'Outside Network (Referro Verified National Partner)',
    recommendedStrategy: 'Private presentation to entertainment and media wealth management advisors.',
    outperformance: {
      salesVolumeMultiplier: '3.7x Level 1 Volume',
      volumeComparison: '$142M closed volume vs $38.5M Level 1 average (+269%)',
      closingSpeed: '20 days to contract execution',
      activeBuyerAdvantage: '5 active entertainment executives with uncommitted 1031 exchange capital',
      summary: 'Top-tier West Coast legacy agent with deep high-profile private buyer registries.'
    }
  },
  {
    contact: {
      id: 'ext_cnt_9',
      name: 'Julian Thorne',
      title: 'Managing Director, Private Client Office',
      company: 'Berkshire Hathaway HomeServices Luxury — Newport Beach',
      location: 'Newport Beach, CA',
      industry: 'Real Estate Brokerage',
      marketsServed: ['Newport Beach, CA', 'Laguna Beach, CA', 'San Francisco, CA', 'Dallas, TX'],
      referralCategories: ['buyer', 'seller', 'commercial_residential'],
      geographicCoverage: ['Orange County, CA', 'Los Angeles, CA'],
      degree: 3,
      email: 'j.thorne@bhhsluxury.com',
      phone: '(949) 555-8290',
      avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
      expertise: ['Coastal Enclaves', 'Corporate Relocation', 'Tax-Advantaged Purchases', 'Private Syndicates'],
      rating: 4.93,
      activeListingsCount: 11,
      totalSalesVolume: 128000000,
      dealsClosedTogether: 0,
      available: true,
      licenseNumber: 'CA-DRE-01773921'
    },
    overallScore: 94,
    matchLevel: 'beyond_network',
    breakdown: {
      geographyScore: 94,
      propertyTypeScore: 95,
      budgetAlignmentScore: 96,
      specializationScore: 95,
      networkProximityScore: 50
    },
    matchReasons: [
      'Direct pipeline of corporate executives relocating between Southern and Northern California',
      'Berkshire Hathaway Chairman’s Circle Diamond recipient (Top 0.5% nationally)',
      'Expertise handling complex trust, LLC, and multi-generational family real estate transactions'
    ],
    connectionPath: 'Outside Network (Referro Verified National Partner)',
    recommendedStrategy: 'Structured corporate relocation referral under standard 25% protocol.',
    outperformance: {
      salesVolumeMultiplier: '3.3x Level 1 Volume',
      volumeComparison: '$128M closed transactions vs $38.5M Level 1 average (+232%)',
      closingSpeed: '23 days average closing velocity',
      activeBuyerAdvantage: '4 corporate VP/C-suite buyers relocating to Northern California',
      summary: 'Solid outperformance with robust corporate trust and corporate executive mobility backing.'
    }
  },
  {
    contact: {
      id: 'ext_cnt_10',
      name: 'Sabrina Wu-Kaufman',
      title: 'Executive Vice President, Luxury Division',
      company: 'Hilton & Hyland — Bel Air & Beverly Hills',
      location: 'Beverly Hills, CA',
      industry: 'Real Estate Brokerage',
      marketsServed: ['Bel Air, CA', 'Beverly Hills, CA', 'San Francisco, CA', 'Honolulu, HI'],
      referralCategories: ['buyer', 'seller', 'international'],
      geographicCoverage: ['Los Angeles, CA', 'San Francisco, CA'],
      degree: 3,
      email: 'sabrina@hiltonhyland.com',
      phone: '(310) 555-1422',
      avatarUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=200&auto=format&fit=crop&q=80',
      expertise: ['Ultra-Prime Residential', 'Pacific Rim Wealth Advisory', 'Discreet Off-Market Placements'],
      rating: 4.98,
      activeListingsCount: 14,
      totalSalesVolume: 169000000,
      dealsClosedTogether: 0,
      available: true,
      licenseNumber: 'CA-DRE-01683901'
    },
    overallScore: 98,
    matchLevel: 'beyond_network',
    breakdown: {
      geographyScore: 97,
      propertyTypeScore: 98,
      budgetAlignmentScore: 99,
      specializationScore: 98,
      networkProximityScore: 50
    },
    matchReasons: [
      'Premier advisor for Asian-Pacific family offices acquiring premier US architectural landmarks',
      'Handled over $60M in confidential off-market Bay Area & Southern California transactions',
      'Dedicated bilingual transaction management and legal escrow team'
    ],
    connectionPath: 'Outside Network (Referro Verified National Partner)',
    recommendedStrategy: 'Confidential off-market buyer introduction with proof-of-funds verification.',
    outperformance: {
      salesVolumeMultiplier: '4.4x Level 1 Volume',
      volumeComparison: '$169M closed volume vs $38.5M Level 1 average (+339%)',
      closingSpeed: '15 days to offer acceptance on luxury inventory',
      activeBuyerAdvantage: '6 international family office buyers with cash allocations up to $15M',
      summary: 'Superior international cash buyer liquidity and elite high-ticket discreet placement record.'
    }
  },
  {
    contact: {
      id: 'ext_cnt_11',
      name: 'Declan Gallagher',
      title: 'Senior Director, Private Wealth & Estates',
      company: 'Brown Harris Stevens — Manhattan & Greenwich',
      location: 'New York, NY',
      industry: 'Real Estate Brokerage',
      marketsServed: ['Manhattan, NY', 'Greenwich, CT', 'San Francisco, CA'],
      referralCategories: ['buyer', 'historic_properties', 'penthouse'],
      geographicCoverage: ['New York, NY', 'Greenwich, CT'],
      degree: 3,
      email: 'd.gallagher@bhsusa.com',
      phone: '(212) 555-4029',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
      expertise: ['Pre-War Architectural Estates', 'Wall Street Advisory', 'Institutional Private Clients'],
      rating: 4.94,
      activeListingsCount: 10,
      totalSalesVolume: 152000000,
      dealsClosedTogether: 0,
      available: true,
      licenseNumber: 'NY-RE-4921008'
    },
    overallScore: 96,
    matchLevel: 'beyond_network',
    breakdown: {
      geographyScore: 95,
      propertyTypeScore: 98,
      budgetAlignmentScore: 97,
      specializationScore: 96,
      networkProximityScore: 50
    },
    matchReasons: [
      'Manages high-net-worth investment bankers acquiring legacy West Coast residences',
      'Historic preservation specialist with 18+ years navigating architectural architectural boards',
      '100% compliant closing history on high-value co-brokerage referrals'
    ],
    connectionPath: 'Outside Network (Referro Verified National Partner)',
    recommendedStrategy: 'East-West financial corridor syndicate introduction.',
    outperformance: {
      salesVolumeMultiplier: '3.9x Level 1 Volume',
      volumeComparison: '$152M closed volume vs $38.5M Level 1 average (+295%)',
      closingSpeed: '18 days to contract',
      activeBuyerAdvantage: '4 senior Wall Street partners with verified $8M+ buying power',
      summary: 'Strong East Coast institutional financial connections and verified buyer pedigree.'
    }
  },
  {
    contact: {
      id: 'ext_cnt_12',
      name: 'Vivienne Zhao',
      title: 'Founding Partner, Bay & Coast Luxury',
      company: 'The Agency — Carmel-by-the-Sea & San Francisco',
      location: 'San Francisco, CA',
      industry: 'Real Estate Brokerage',
      marketsServed: ['San Francisco, CA', 'Carmel, CA', 'Pebble Beach, CA', 'Silicon Valley'],
      referralCategories: ['buyer', 'seller', 'luxury'],
      geographicCoverage: ['San Francisco, CA', 'Monterey County, CA'],
      degree: 3,
      email: 'vivienne.zhao@theagencyre.com',
      phone: '(415) 555-9281',
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
      expertise: ['Pacific Heights Historic Mansions', 'Tech Founders', 'Off-Market Monterey Compounds'],
      rating: 4.97,
      activeListingsCount: 12,
      totalSalesVolume: 160000000,
      dealsClosedTogether: 0,
      available: true,
      licenseNumber: 'CA-DRE-01923488'
    },
    overallScore: 99,
    matchLevel: 'beyond_network',
    breakdown: {
      geographyScore: 99,
      propertyTypeScore: 99,
      budgetAlignmentScore: 99,
      specializationScore: 99,
      networkProximityScore: 50
    },
    matchReasons: [
      'San Francisco native with 20 years hyper-specialized in Pacific Heights & Presidio Heights landmark estates',
      'Direct contact with 3 tech founders specifically seeking historic architectural estates with private gardens',
      'Recognized Top 10 Producer in Northern California Luxury Real Estate Council'
    ],
    connectionPath: 'Outside Network (Referro Verified National Partner)',
    recommendedStrategy: 'Immediate VIP private showing coordination for qualified pre-approved tech founders.',
    outperformance: {
      salesVolumeMultiplier: '4.2x Level 1 Volume',
      volumeComparison: '$160M closed volume vs $38.5M Level 1 average (+316%)',
      closingSpeed: '15 days avg time to match pre-qualified buyer',
      activeBuyerAdvantage: '5 tech founders with recent $10M+ liquid liquidity events looking in Pacific Heights',
      summary: 'Exceptional geographic and property-type synergy with direct access to local tech cash liquidity.'
    }
  },
  {
    contact: {
      id: 'ext_cnt_13',
      name: 'Morgan Prescott',
      title: 'Executive Partner, Private Office',
      company: 'Engel & Völkers Private Office — Naples & Boston',
      location: 'Naples, FL',
      industry: 'Real Estate Brokerage',
      marketsServed: ['Naples, FL', 'Boston, MA', 'San Francisco, CA'],
      referralCategories: ['buyer', 'ultra_luxury', 'lifestyle'],
      geographicCoverage: ['Naples, FL', 'Boston, MA'],
      degree: 3,
      email: 'm.prescott@evprivateoffice.com',
      phone: '(239) 555-6188',
      avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80',
      expertise: ['Waterfront Compounds', 'Tax Relocation Strategies', 'Yacht & Aviation Clients'],
      rating: 4.95,
      activeListingsCount: 9,
      totalSalesVolume: 139000000,
      dealsClosedTogether: 0,
      available: true,
      licenseNumber: 'FL-BK-492810'
    },
    overallScore: 95,
    matchLevel: 'beyond_network',
    breakdown: {
      geographyScore: 93,
      propertyTypeScore: 97,
      budgetAlignmentScore: 96,
      specializationScore: 96,
      networkProximityScore: 50
    },
    matchReasons: [
      'Engel & Völkers Private Office designation held by fewer than 1% of advisors globally',
      'Active network of high-net-worth families expanding portfolios across prime US cities',
      'Guaranteed seamless 25% referral closing protocol'
    ],
    connectionPath: 'Outside Network (Referro Verified National Partner)',
    recommendedStrategy: 'Outreach to Private Office global registry.',
    outperformance: {
      salesVolumeMultiplier: '3.6x Level 1 Volume',
      volumeComparison: '$139M volume vs $38.5M Level 1 average (+261%)',
      closingSpeed: '21 days average closing velocity',
      activeBuyerAdvantage: '3 high-net-worth families actively shopping bi-coastal real estate',
      summary: 'Global private office reach with high average transaction value.'
    }
  },
  {
    contact: {
      id: 'ext_cnt_14',
      name: 'Alistair Finch',
      title: 'Managing Director, Sports & Entertainment Division',
      company: 'Compass Sports & Entertainment — Scottsdale & Beverly Hills',
      location: 'Scottsdale, AZ',
      industry: 'Real Estate Brokerage',
      marketsServed: ['Scottsdale, AZ', 'Paradise Valley, AZ', 'Los Angeles, CA', 'San Francisco, CA'],
      referralCategories: ['buyer', 'celebrity', 'luxury'],
      geographicCoverage: ['Scottsdale, AZ', 'Phoenix, AZ'],
      degree: 3,
      email: 'alistair.finch@compass.com',
      phone: '(480) 555-9032',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      expertise: ['Athlete & Celebrity Representation', 'Private Security Gated Compounds', 'Off-Market Deals'],
      rating: 4.96,
      activeListingsCount: 11,
      totalSalesVolume: 145000000,
      dealsClosedTogether: 0,
      available: true,
      licenseNumber: 'AZ-BR-6819002'
    },
    overallScore: 96,
    matchLevel: 'beyond_network',
    breakdown: {
      geographyScore: 94,
      propertyTypeScore: 98,
      budgetAlignmentScore: 97,
      specializationScore: 97,
      networkProximityScore: 50
    },
    matchReasons: [
      'Represents professional sports athletes and entertainers seeking discreet estates',
      'Closed $45M in California-to-Arizona tax and luxury migrations over the past 18 months',
      'High confidentiality NDA protocol in place for all client showings'
    ],
    connectionPath: 'Outside Network (Referro Verified National Partner)',
    recommendedStrategy: 'Confidential VIP pitch through business manager representation channels.',
    outperformance: {
      salesVolumeMultiplier: '3.8x Level 1 Volume',
      volumeComparison: '$145M volume vs $38.5M Level 1 average (+277%)',
      closingSpeed: '19 days to contract offer',
      activeBuyerAdvantage: '4 verified athletes and entertainers seeking prime California compounds',
      summary: 'Direct access to high-earning athletes and entertainment clientele.'
    }
  },
  {
    contact: {
      id: 'ext_cnt_15',
      name: 'Sebastian Brooks',
      title: 'Principal, Luxury Asset Group',
      company: "Sotheby's International Realty — Austin & Lake Travis",
      location: 'Austin, TX',
      industry: 'Real Estate Brokerage',
      marketsServed: ['Austin, TX', 'Dallas, TX', 'San Francisco, CA'],
      referralCategories: ['buyer', 'seller', 'waterfront', 'relocation'],
      geographicCoverage: ['Austin, TX', 'Central Texas'],
      degree: 3,
      email: 's.brooks@austinsothebys.com',
      phone: '(512) 555-3388',
      avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
      expertise: ['Waterfront Architecture', 'California-to-Texas Tech Relocations', 'Private Acreage'],
      rating: 4.93,
      activeListingsCount: 10,
      totalSalesVolume: 132000000,
      dealsClosedTogether: 0,
      available: true,
      licenseNumber: 'TX-RE-719402'
    },
    overallScore: 94,
    matchLevel: 'beyond_network',
    breakdown: {
      geographyScore: 93,
      propertyTypeScore: 96,
      budgetAlignmentScore: 95,
      specializationScore: 95,
      networkProximityScore: 50
    },
    matchReasons: [
      'Leader in bi-directional relocation corridor between Silicon Valley and Austin tech hubs',
      'Substantial buyer pool of executives with dual residences across SF and Austin',
      'Fast 24-hour turnaround on referral inquiries'
    ],
    connectionPath: 'Outside Network (Referro Verified National Partner)',
    recommendedStrategy: 'Dual-market syndication for tech executive cross-relocation.',
    outperformance: {
      salesVolumeMultiplier: '3.4x Level 1 Volume',
      volumeComparison: '$132M volume vs $38.5M Level 1 average (+243%)',
      closingSpeed: '22 days average to closing',
      activeBuyerAdvantage: '4 dual-market tech executives seeking primary/secondary estate properties',
      summary: 'Top player in the SF-Austin tech wealth relocation pipeline.'
    }
  },
  {
    contact: {
      id: 'ext_cnt_16',
      name: 'Natalia Romanova',
      title: 'Managing Director, Coastal & International Division',
      company: 'Douglas Elliman — Miami & Bal Harbour',
      location: 'Miami, FL',
      industry: 'Real Estate Brokerage',
      marketsServed: ['Miami, FL', 'Bal Harbour, FL', 'San Francisco, CA', 'London'],
      referralCategories: ['buyer', 'ultra_luxury', 'waterfront'],
      geographicCoverage: ['Miami-Dade, FL', 'Palm Beach, FL'],
      degree: 3,
      email: 'natalia.romanova@elliman.com',
      phone: '(305) 555-8901',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
      expertise: ['Waterfront Trophy Estates', 'Cross-Border Capital', 'Historic Restorations'],
      rating: 4.98,
      activeListingsCount: 14,
      totalSalesVolume: 172000000,
      dealsClosedTogether: 0,
      available: true,
      licenseNumber: 'FL-BK-918234'
    },
    overallScore: 98,
    matchLevel: 'beyond_network',
    breakdown: {
      geographyScore: 96,
      propertyTypeScore: 99,
      budgetAlignmentScore: 98,
      specializationScore: 98,
      networkProximityScore: 50
    },
    matchReasons: [
      'Elliman National Top 10 Producer with over $170M in luxury residential production',
      'Active buyer portfolio seeking trophy architectural properties in prime West Coast markets',
      'Flawless track record with complex escrow structures and corporate escrow accounts'
    ],
    connectionPath: 'Outside Network (Referro Verified National Partner)',
    recommendedStrategy: 'Direct outreach to private client wealth desk.',
    outperformance: {
      salesVolumeMultiplier: '4.5x Level 1 Volume',
      volumeComparison: '$172M annual volume vs $38.5M Level 1 average (+347%)',
      closingSpeed: '16 days to accepted contract',
      activeBuyerAdvantage: '6 international cash buyers with active $7M+ acquisition mandates',
      summary: 'High-volume international private client producer with rapid closing velocity.'
    }
  }
];

/**
 * Returns a search result of 12 outside-network outperforming candidates:
 * - 2 random candidates are designated as initially unlocked / fully revealed.
 * - The remaining 10 are designated as masked (locked for 1 credit each).
 */
export function getMatchedOutsideNetworkResults(count: number = 12): {
  candidates: AIMatchCandidate[];
  initialUnlockedIds: string[];
} {
  // Shuffle all candidates
  const shuffled = [...OUTSIDE_NETWORK_CANDIDATES].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, Math.min(count, shuffled.length));
  
  // Pick the first 2 as the initially unlocked outperforming agents
  const initialUnlockedIds = selected.slice(0, 2).map(c => c.contact.id);
  
  return {
    candidates: selected,
    initialUnlockedIds
  };
}

/**
 * Helper to get a random 2 candidates
 */
export function getRandomTwoOutsideNetworkCandidates(excludeIds: string[] = []): AIMatchCandidate[] {
  const eligible = OUTSIDE_NETWORK_CANDIDATES.filter(c => !excludeIds.includes(c.contact.id));
  const pool = eligible.length >= 2 ? eligible : OUTSIDE_NETWORK_CANDIDATES;
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 2);
}
