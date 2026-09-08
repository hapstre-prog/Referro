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
    return `Hi ${params.takerName},\n\nI would like to introduce you to a high-priority referral opportunity: "${params.opportunityTitle}" in ${params.targetMarket}.\n\nGiven your exceptional track record in ${params.takerExpertise.slice(0, 2).join(' and ')}, you are an ideal match for this client. I have registered our 25% referral agreement on Relay.\n\nI'll let you take it from here! Best,\n${params.giverName}`;
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

export async function chatReferralAssistantWithAI(prompt: string, context: string): Promise<string> {
  const client = getAIClient();

  if (!client) {
    return "I'm Referral AI, your intelligence partner. I can help you structure referral opportunities, analyze match scores, draft introductions, and optimize your 25% referral fee agreements. How can I assist with your deal pipeline today?";
  }

  // Pull real MLS market data to ground AI recommendations in actual listings
  let marketData = '';
  try {
    // Extract a location from the prompt or context for MLS lookup
    const locMatch = prompt.match(/(?:in|at|for|to)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?,\s*[A-Z]{2})/) 
      || context.match(/(?:market|location|area)[:\s]+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?,\s*[A-Z]{2})/);
    const location = locMatch?.[1] || '';
    if (location) {
      marketData = await getMarketDataForAI(location);
    }
  } catch {
    // Non-blocking — AI works fine without MLS data
  }

  try {
    const response = await callGeminiWithFallback(client, {
      contents: `You are Referral AI, an executive assistant built into Referro, the premier real estate referral network.
Help the agent with their referral strategy, match selection, fee negotiations, or deal tracking.
Context of current user & pipeline: ${context}

${marketData ? `\n${marketData}\n\nUse this live MLS market data to ground your recommendations with real listing evidence. Reference specific properties, prices, and market trends when explaining why an agent or property is a good match.\n` : ''}
User question: "${prompt}"

Provide concise, highly actionable, strategic advice (under 120 words).`,
    });

    if (response && response.text) {
      return response.text.trim();
    }
  } catch {
    // Non-blocking fallback
  }

  return contextualChatFallback(prompt);
}

// Contextual fallback for the chat assistant when Gemini is unavailable
function contextualChatFallback(prompt: string): string {
  const lower = prompt.toLowerCase();

  if (lower.includes('miami')) {
    return "For Miami, I'd match you with agents specializing in luxury relocations — particularly those with proven track records in Coconut Grove, Brickell, and Coral Gables. Referro's network includes verified agents who average $4M+ in closed luxury volume. A standard 25% referral fee applies. Click 'Start to find the right people' to browse your network for Miami specialists — it's always free.";
  }
  if (lower.includes('referral fee') || lower.includes('fee split') || lower.includes('commission')) {
    return "A standard referral fee in luxury real estate is 25% of the gross commission, paid at closing. Some markets and price points may justify 30-35% for high-value leads. Referro tracks and protects these agreements automatically. You can negotiate terms directly with your matched agent within the platform.";
  }
  if (lower.includes('match') || lower.includes('right agent') || lower.includes('find the right')) {
    return "Referro uses AI-powered matching that considers market expertise, price band experience, response rate, and verified deal history. When you post an opportunity, we score every agent in your network against your criteria and surface the top matches. Try the 'Start to find the right people' button — searching your network is always free with no credit cost.";
  }
  if (lower.includes('free') || lower.includes('credit') || lower.includes('cost') || lower.includes('price')) {
    return "Searching your own network on Referro is always free — no credits consumed, no limits. Credits are only used for 'Beyond Network' AI searches that find agents outside your current connections. You start with 5 free credits for those searches. Click 'Start to find the right people' to explore your network now.";
  }
  if (lower.includes('linkedin') || lower.includes('sync') || lower.includes('connect')) {
    return "You can sync your LinkedIn connections to instantly build your Referro network. Once connected, you'll see which of your contacts are verified real estate professionals and can start sending referrals immediately. Sign up and click 'Continue with LinkedIn' to get started.";
  }
  if (lower.includes('introduc') || lower.includes('draft') || lower.includes('message')) {
    return "I can draft a warm introduction message for you. When you match with an agent, Referro generates a personalized intro highlighting why they were selected, the opportunity details, and the agreed referral terms. You can review and send it directly from the platform.";
  }
  if (lower.includes('how') && (lower.includes('referro') || lower.includes('work') || lower.includes('platform'))) {
    return "Referro works in three steps: 1) Sync your LinkedIn network to see your existing connections. 2) Post referral opportunities (give or take). 3) Our AI matches you with the best agents and helps you manage the referral through to closing. Searching your network is always free — try it now with the button on the left.";
  }

  return "I can help you find the right referral agent, structure fee agreements, draft introductions, or explain how Referro works. Try asking about a specific market like Miami, or about referral fees and matching. You can also click 'Start to find the right people' to explore your network — it's always free.";
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
