import { GoogleGenAI, Type } from '@google/genai';
import { getMarketDataForAI } from './mls';

// Lazy initialization of Gemini client
let aiClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

export interface StructuredRequestOutput {
  type: 'give' | 'take';
  category: string;
  title: string;
  targetMarket: string;
  priceRange: { min: number; max: number; label: string };
  propertyType: 'residential' | 'luxury' | 'commercial' | 'multi_family' | 'land' | 'renovation';
  intent: string;
  urgency: 'high' | 'medium' | 'low';
  keyCriteria: string[];
  recommendedStrategy: string;
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error('Request timeout')), ms))
  ]);
}

/**
 * Resilient Gemini caller with automatic fallback models and quick timeouts.
 * Primary: gemini-3.8-flash, Fallback: gemini-flash-latest
 */
async function callGeminiWithFallback(
  client: GoogleGenAI,
  requestParams: {
    contents: any;
    config?: any;
  }
) {
  const candidateModels = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];

  for (const model of candidateModels) {
    try {
      const response = await withTimeout(
        client.models.generateContent({
          model,
          ...requestParams
        }),
        15000
      );
      if (response && response.text) {
        return response;
      }
    } catch (err: any) {
      console.error(`[Gemini Service] Model ${model} failed:`, err?.message || err);
      continue;
    }
  }

  // Gracefully log warning without dumping noisy error stack trace to stderr
  console.warn('[Gemini Service] AI models experiencing temporary high demand; smoothly applying smart structured fallback.');
  return null;
}

export async function structureRequestWithAI(rawText: string, intentType?: 'give' | 'take'): Promise<StructuredRequestOutput> {
  const client = getAIClient();
  
  if (!client) {
    return fallbackStructureRequest(rawText, intentType);
  }

  // Pull real MLS data for the target market to enrich AI structuring
  let marketData = '';
  try {
    const locMatch = rawText.match(/(?:in|at|for|to)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?,\s*[A-Z]{2})/);
    const location = locMatch?.[1] || '';
    if (location) {
      marketData = await getMarketDataForAI(location);
    }
  } catch {
    // Non-blocking
  }

  try {
    const prompt = `You are the AI engine of Referro, a B2B real estate referral network platform.
Analyze this user's natural language referral request and parse it into structured data:
"${rawText}"

Target request type: ${intentType || 'auto-detect'}

${marketData ? `\n${marketData}\n\nUse this live MLS market data to inform your structured analysis with real market conditions.\n` : ''}
Extract the real estate referral details accurately.`;

    const response = await callGeminiWithFallback(client, {
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            type: { type: Type.STRING, description: 'either "give" or "take"' },
            category: { type: Type.STRING, description: 'e.g. buyer, seller, listing, out_of_area_referral, contractor_lead' },
            title: { type: Type.STRING, description: 'Crisp, professional 5-10 word title summarizing the referral' },
            targetMarket: { type: Type.STRING, description: 'City and state e.g. Miami, FL or Austin, TX' },
            priceRangeMin: { type: Type.NUMBER, description: 'Minimum price in dollars' },
            priceRangeMax: { type: Type.NUMBER, description: 'Maximum price in dollars' },
            priceRangeLabel: { type: Type.STRING, description: 'Formatted string like $2M - $3.5M' },
            propertyType: { type: Type.STRING, description: 'residential, luxury, commercial, multi_family, land, or renovation' },
            intent: { type: Type.STRING, description: 'Summary of the business goal' },
            urgency: { type: Type.STRING, description: 'high, medium, or low' },
            keyCriteria: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '3-5 key criteria for matching the right agent or connector'
            },
            recommendedStrategy: { type: Type.STRING, description: 'Suggested referral strategy and commission term' }
          },
          required: ['type', 'category', 'title', 'targetMarket', 'priceRangeMin', 'priceRangeMax', 'priceRangeLabel', 'propertyType', 'intent', 'urgency', 'keyCriteria', 'recommendedStrategy']
        }
      }
    });

    if (response && response.text) {
      const parsed = JSON.parse(response.text);
      return {
        type: (parsed.type === 'take' ? 'take' : 'give'),
        category: parsed.category || 'buyer',
        title: parsed.title || 'Real Estate Referral Opportunity',
        targetMarket: parsed.targetMarket || 'Target Market',
        priceRange: {
          min: parsed.priceRangeMin || 1000000,
          max: parsed.priceRangeMax || 2500000,
          label: parsed.priceRangeLabel || '$1M - $2.5M'
        },
        propertyType: parsed.propertyType || 'residential',
        intent: parsed.intent || 'Referral matching',
        urgency: parsed.urgency || 'medium',
        keyCriteria: parsed.keyCriteria || ['Experienced local specialist', 'Verified track record'],
        recommendedStrategy: parsed.recommendedStrategy || 'Standard 25% referral fee upon closing'
      };
    }
  } catch {
    // Non-blocking catch
  }

  return fallbackStructureRequest(rawText, intentType);
}

export async function draftIntroductionWithAI(params: {
  giverName: string;
  takerName: string;
  clientDescription: string;
  opportunityTitle: string;
  targetMarket: string;
  takerExpertise: string[];
}): Promise<string> {
  const client = getAIClient();

  if (!client) {
    return `Hi ${params.takerName},\n\nI'd like to introduce you to a referral opportunity: "${params.opportunityTitle}" in ${params.targetMarket}.\n\nGiven your track record in ${params.takerExpertise.slice(0, 2).join(' and ')}, you're a great fit for this client. I've registered our 25% referral agreement on Referro.\n\nI'll let you take it from here! Best,\n${params.giverName}`;
  }

  try {
    const prompt = `Write a polished, professional 3-4 sentence warm introduction message for real estate agent ${params.giverName} introducing ${params.takerName} to a referral opportunity.
Details:
- Opportunity: ${params.opportunityTitle}
- Target market: ${params.targetMarket}
- Client description: ${params.clientDescription}
- Taker's expertise: ${params.takerExpertise.join(', ')}

Tone: Warm, collaborative, executive B2B tone. Highlight why ${params.takerName} was chosen.`;

    const response = await callGeminiWithFallback(client, {
      contents: prompt
    });

    if (response && response.text) {
      return response.text.trim();
    }
  } catch {
    // Non-blocking fallback
  }

  return `Hi ${params.takerName},\n\nI would like to introduce you to our client for "${params.opportunityTitle}". You're a perfect match with your proven expertise in ${params.targetMarket}.\n\nBest,\n${params.giverName}`;
}

export async function chatReferralAssistantWithAI(
  prompt: string,
  context: string,
  history?: Array<{ role: 'ai' | 'user'; text: string }>
): Promise<string> {
  const client = getAIClient();

  if (!client) {
    return "I'm Referral AI. I can help you find buyer agents for stale listings, refer clients out-of-state, share tips as a contractor, or match someone you know with the right agent — and everyone gets paid when the deal closes. What's your situation?";
  }

  // Pull real MLS market data to ground AI recommendations in actual listings
  let marketData = '';
  try {
    const locMatch = prompt.match(/(?:in|at|for|to)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?,\s*[A-Z]{2})/)
      || context.match(/(?:market|location|area)[:\s]+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?,\s*[A-Z]{2})/);
    const location = locMatch?.[1] || '';
    if (location) {
      marketData = await getMarketDataForAI(location);
    }
  } catch {
    // Non-blocking — AI works fine without MLS data
  }

  const systemInstruction = `You are Referral AI, the assistant built into Referro — a real estate referral platform where anyone can turn a connection into a paid opportunity.

Referro serves four types of users:
1. AGENTS WITH STALE LISTINGS: Their listing has been sitting too long. They need buyer agents who have ready buyers.
2. AGENTS WITH OUT-OF-STATE CLIENTS: Their client needs an agent in another state where they're not licensed. They refer to a local licensed agent and keep the referral fee.
3. TIP PROVIDERS (contractors, designers, anyone): They know a home is about to sell. They share the tip, Referro finds the right agent, and they earn a cut when the deal closes.
4. MATCHMAKERS (anyone): They know someone looking for a home. They share the info, Referro finds the right agent, and they earn a referral fee when the deal closes.

The platform is free to explore. Asking Referral AI is always free. Credits are only consumed when generating leads via Beyond Network AI search.

Context of current user: ${context}
${marketData ? `\n${marketData}\n\nUse this live MLS market data to ground your recommendations with real listing evidence.\n` : ''}

Provide concise, actionable advice (under 120 words). Address the user's specific situation directly. Do not assume they are a luxury agent — they could be a contractor, a regular person, or an agent. Remember and reference what the user said earlier in the conversation — do not repeat previous answers or ask the same questions again.`;

  try {
    // Build multi-turn conversation contents from history + current prompt
    const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

    if (history && history.length > 0) {
      for (const msg of history) {
        contents.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }],
        });
      }
    }

    // Add the current user prompt
    contents.push({
      role: 'user',
      parts: [{ text: prompt }],
    });

    const response = await callGeminiWithFallback(client, {
      contents,
      config: {
        systemInstruction,
      },
    });

    if (response && response.text) {
      return response.text.trim();
    }
  } catch {
    // Non-blocking fallback
  }

  return contextualChatFallback(prompt, history);
}

// Contextual fallback for the chat assistant when Gemini is unavailable
function contextualChatFallback(prompt: string, history?: Array<{ role: 'ai' | 'user'; text: string }>): string {
  const lower = prompt.toLowerCase();

  // If we have conversation history, build a more contextual response
  if (history && history.length > 0) {
    const prevUserMsgs = history.filter(m => m.role === 'user').map(m => m.text.toLowerCase());
    const prevAiMsgs = history.filter(m => m.role === 'ai').map(m => m.text.toLowerCase());
    const allPrevText = [...prevUserMsgs, ...prevAiMsgs].join(' ');

    // Determine what topic was already discussed
    const discussedStaleListing = allPrevText.includes('stale') || allPrevText.includes('sitting') || allPrevText.includes('too long') || (allPrevText.includes('listing') && allPrevText.includes('buyer'));
    const discussedOutOfState = allPrevText.includes('out-of-state') || allPrevText.includes('out of state') || allPrevText.includes('licensed in') || allPrevText.includes('another state');
    const discussedContractor = allPrevText.includes('contractor') || allPrevText.includes('designer') || allPrevText.includes('tip') || allPrevText.includes('about to sell');
    const discussedMatchmaker = allPrevText.includes('knows someone') || allPrevText.includes('looking for a home') || allPrevText.includes('matchmaker');
    const discussedFees = allPrevText.includes('referral fee') || allPrevText.includes('fee split') || allPrevText.includes('commission') || allPrevText.includes('cut') || allPrevText.includes('get paid');

    // Follow-up about a specific property or market detail
    if (lower.includes('bedroom') || lower.includes('condo') || lower.includes('house') || lower.includes('property') || lower.includes('miami') || lower.includes('new york') || lower.includes('austin') || lower.includes('$') || lower.includes('price')) {
      if (discussedStaleListing) {
        return `Great — with those property details, I'd recommend looking for buyer agents who specialize in that price range and property type in your market. On Referro, post your listing with these details and our matching will surface agents who have recently closed similar properties. The buyer agent brings their buyer, you keep your listing-side commission, and the buyer agent gets their side. You can also agree a referral bonus if they bring a buyer who closes.`;
      }
      if (discussedOutOfState) {
        return `Perfect — with that market detail, Referro can match your client with a licensed agent who knows that local market. The agent handles everything on the ground, and you collect a referral fee (typically 25% of gross commission) when the deal closes. Post the lead with the client's requirements and target market, and we'll find the right local agent.`;
      }
      if (discussedContractor) {
        return `Great — with those details about the property, Referro can find a listing agent who specializes in that area and property type. Share the tip with as much detail as you have (address, condition, estimated value), and we'll match it with the right agent. When they list and sell the property, you earn your agreed cut — no license needed.`;
      }
      if (discussedMatchmaker) {
        return `Perfect — with those details about what the buyer is looking for, Referro can match them with a buyer agent who specializes in that market and price range. Share the lead with the buyer's requirements, and we'll find the right agent. When the agent closes the deal, you earn your referral fee — no license needed.`;
      }
    }

    // Follow-up about fees or getting paid
    if (lower.includes('fee') || lower.includes('cut') || lower.includes('pay') || lower.includes('commission') || lower.includes('how much') || lower.includes('split')) {
      return `Referral fees on Referro are typically 25% of the gross commission, paid at closing. For tip providers and matchmakers without a license, the cut is negotiated with the agent upfront — Referro tracks and protects the agreement so you get paid when the deal closes. The exact amount depends on the property's sale price and the agreed percentage.`;
    }

    // Follow-up about next steps or how to start
    if (lower.includes('how do i') || lower.includes('next') || lower.includes('start') || lower.includes('begin') || lower.includes('sign up') || lower.includes('post')) {
      if (discussedStaleListing) return `To get started: post your listing on Referro as an opportunity, including the property details and your market. Our AI will match you with buyer agents who have active buyers in your area. You review the matches, accept the ones you like, and agree on terms — all tracked through to closing.`;
      if (discussedOutOfState) return `To get started: share your client's needs on Referro as a referral lead, including the target market. Our AI will match you with licensed local agents in that state. You pick the best match, refer your client, and collect your fee at closing.`;
      if (discussedContractor) return `To get started: share the tip on Referro with the property details. We'll find the right listing agent for that property. You agree on your cut upfront, and when the property sells, you get paid — no license required.`;
      if (discussedMatchmaker) return `To get started: share the buyer's info on Referro. We'll match them with the right buyer agent in their target market. You agree on a referral fee upfront, and when the deal closes, you get paid — no license required.`;
    }

    // Generic follow-up that references the previous topic
    if (discussedStaleListing) return `Based on what we discussed about your listing — the next step is to post it on Referro so our AI can match you with buyer agents who have active buyers. You keep your commission, the buyer agent brings the buyer. Would you like to know more about how the matching works or what to include in your listing post?`;
    if (discussedOutOfState) return `Following up on the out-of-state referral — the next step is to share your client's needs on Referro. We'll match them with a licensed local agent, and you collect a referral fee at closing. Would you like to know more about the fee structure or how to find the right agent in that market?`;
    if (discussedContractor) return `Following up on your tip — the next step is to share the property details on Referro. We'll find the right listing agent, and you earn a cut when it sells. Would you like to know more about how the cut is negotiated or what details to include?`;
    if (discussedMatchmaker) return `Following up on your match — the next step is to share the buyer's info on Referro. We'll find the right buyer agent, and you earn a referral fee at closing. Would you like to know more about the fee or how matching works?`;
    if (discussedFees) return `To put the fee in context — the exact amount depends on the property's sale price and the agreed percentage. Referro tracks the agreement and ensures payment at closing. Would you like to start posting an opportunity or learn more about the matching process?`;
  }

  // Stale listing
  if (lower.includes('stale') || lower.includes('sitting') || lower.includes('too long') || (lower.includes('listing') && lower.includes('buyer'))) {
    return "If your listing has been sitting too long, Referro connects you with buyer agents who have active buyers in your area. Post your listing as an opportunity, and we'll match you with agents who can bring qualified buyers. You keep your commission — the buyer agent gets their side. Click 'Find the right people' to start.";
  }
  // Out-of-state referral
  if (lower.includes('out-of-state') || lower.includes('out of state') || lower.includes('licensed in') || lower.includes('another state') || lower.includes('relocat')) {
    return "If your client needs an agent in a state where you're not licensed, Referro matches them with a verified local agent. You refer the client, the local agent handles the deal, and you collect a referral fee at closing — typically 25% of the gross commission. Click 'Find the right people' to search for agents in that market.";
  }
  // Contractor / tip provider
  if (lower.includes('contractor') || lower.includes('designer') || lower.includes('tip') || lower.includes('about to sell') || lower.includes('knows a home')) {
    return "If you know a home is about to sell — maybe you're a contractor, designer, or just well-connected — share the tip on Referro. We'll find the right listing agent for that property. When the deal closes, you earn a cut of the commission. No license required. Click 'Find the right people' to get started.";
  }
  // Matchmaker
  if (lower.includes('knows someone') || lower.includes('looking for a home') || lower.includes('looking for homes') || lower.includes('matchmaker') || lower.includes('hook up') || lower.includes('hookup')) {
    return "If you know someone looking for a home, share their info on Referro. We'll match them with the right buyer agent. If that agent closes the deal, you earn a referral fee — no real estate license needed. You're the matchmaker, and you get paid when it closes. Click 'Find the right people' to start.";
  }
  // Referral fees
  if (lower.includes('referral fee') || lower.includes('fee split') || lower.includes('commission') || lower.includes('cut') || lower.includes('get paid') || lower.includes('how much')) {
    return "Referral fees on Referro are typically 25% of the gross commission, paid at closing. For tip providers and matchmakers who aren't licensed agents, the cut is negotiated with the agent upfront. Referro tracks and protects these agreements automatically so everyone gets paid when the deal closes.";
  }
  // How it works
  if (lower.includes('how') && (lower.includes('referro') || lower.includes('work') || lower.includes('platform'))) {
    return "Referro connects anyone who knows about a real estate opportunity with the right professional to close it. Agents find buyer agents for stale listings, refer clients out-of-state, contractors share tips about homes about to sell, and anyone can match a friend with an agent. Everyone who helps gets paid when the deal closes. Click 'Find the right people' to explore — it's free.";
  }
  // Free / cost
  if (lower.includes('free') || lower.includes('credit') || lower.includes('cost') || lower.includes('price')) {
    return "Exploring your network and asking Referral AI are completely free — no credits, no limits. Credits are only used for 'Beyond Network' AI searches that find agents outside your current connections. Click 'Find the right people' to start exploring for free.";
  }
  // Matching
  if (lower.includes('match') || lower.includes('right agent') || lower.includes('find the right')) {
    return "Referro matches you with the right agent based on location, property type, price range, and track record. Whether you need a buyer agent, a local pro in another state, or an agent for a tip you're sharing — we'll find the best fit. Click 'Find the right people' to see your matches.";
  }

  return "I can help you with any real estate connection: find buyer agents for stale listings, refer clients out-of-state, share tips as a contractor, or match someone you know with the right agent. Everyone gets paid when the deal closes. What's your situation?";
}

// Intelligent heuristic fallback for offline, demo, and temporary high-demand reliability
function fallbackStructureRequest(text: string, defaultType: 'give' | 'take' = 'give'): StructuredRequestOutput {
  const lower = text.toLowerCase();
  const isTake = defaultType === 'take' || lower.includes('need') || lower.includes('looking for') || lower.includes('find me');
  
  let targetMarket = 'San Francisco, CA';
  if (lower.includes('miami')) targetMarket = 'Miami, FL';
  else if (lower.includes('austin')) targetMarket = 'Austin, TX';
  else if (lower.includes('new york') || lower.includes('nyc') || lower.includes('tribeca') || lower.includes('manhattan')) targetMarket = 'New York, NY';
  else if (lower.includes('los angeles') || lower.includes('la') || lower.includes('beverly hills')) targetMarket = 'Los Angeles, CA';
  else if (lower.includes('seattle') || lower.includes('bellevue')) targetMarket = 'Seattle, WA';
  else if (lower.includes('dallas')) targetMarket = 'Dallas, TX';
  else if (lower.includes('aspen')) targetMarket = 'Aspen, CO';
  else if (lower.includes('chicago')) targetMarket = 'Chicago, IL';

  let min = 1500000;
  let max = 3000000;
  let label = '$1.5M - $3M';

  // Dynamic price extraction via regex
  const rangeMatch = text.match(/\$?(\d+(?:\.\d+)?)\s*M?\s*[-–to]+\s*\$?(\d+(?:\.\d+)?)\s*M/i);
  if (rangeMatch) {
    const num1 = parseFloat(rangeMatch[1]);
    const num2 = parseFloat(rangeMatch[2]);
    min = Math.round(num1 * 1000000);
    max = Math.round(num2 * 1000000);
    label = `$${num1}M - $${num2}M`;
  } else if (lower.includes('2m') || lower.includes('2.5m')) {
    min = 2000000; max = 3500000; label = '$2M - $3.5M';
  } else if (lower.includes('7m') || lower.includes('8m')) {
    min = 7000000; max = 8500000; label = '$7M - $8.5M';
  } else if (lower.includes('4m') || lower.includes('4.2m') || lower.includes('5m')) {
    min = 4000000; max = 5500000; label = '$4M - $5.5M';
  }

  let category = 'buyer';
  if (lower.includes('contractor') || lower.includes('renovate')) category = 'contractor_lead';
  else if (lower.includes('listing') || lower.includes('stuck') || lower.includes('days')) category = 'listing';
  else if (lower.includes('seller') || lower.includes('selling')) category = 'seller';
  else if (lower.includes('out-of-area') || lower.includes('relocat')) category = 'out_of_area_referral';

  let propertyType: 'residential' | 'luxury' | 'commercial' | 'multi_family' | 'land' | 'renovation' = 'residential';
  if (lower.includes('commercial') || lower.includes('office') || lower.includes('retail')) propertyType = 'commercial';
  else if (lower.includes('multi-family') || lower.includes('multifamily') || lower.includes('units')) propertyType = 'multi_family';
  else if (lower.includes('land') || lower.includes('lot')) propertyType = 'land';
  else if (lower.includes('luxury') || min >= 2500000) propertyType = 'luxury';

  return {
    type: isTake ? 'take' : 'give',
    category,
    title: text.length > 55 ? `${text.slice(0, 52).trim()}...` : text.trim(),
    targetMarket,
    priceRange: { min, max, label },
    propertyType,
    intent: isTake ? 'Identify qualified recipient/agent in target market' : 'Monetize opportunity via verified local specialist',
    urgency: lower.includes('urgent') || lower.includes('immediate') || lower.includes('asap') ? 'high' : 'medium',
    keyCriteria: [
      `Specialist in ${targetMarket}`,
      `Proven track record in ${label} price band`,
      'Active network relationship with verified response rate'
    ],
    recommendedStrategy: 'Execute 25% co-broke referral agreement with standard 10% platform success fee protection.'
  };
}
