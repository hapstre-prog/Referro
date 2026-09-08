/**
 * MLS Property Data Service
 * 
 * Pulls real property listings from the US Real Estate Listings API (RapidAPI)
 * so the AI can reference actual market data when explaining why an agent or
 * home is recommended. This data is backend-only — users never see raw MLS
 * output; it enriches AI reasoning.
 */

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || '';
const RAPIDAPI_HOST = 'us-real-estate-listings.p.rapidapi.com';
const BASE_URL = `https://${RAPIDAPI_HOST}`;

export interface MLSProperty {
  id: string;
  address: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  propertyType: string;
  status: string; // for_sale, sold, etc.
  daysOnMarket: number;
  photoUrl?: string;
  latitude?: number;
  longitude?: number;
  description?: string;
}

export interface MLSMarketSummary {
  location: string;
  totalListings: number;
  medianPrice: number;
  avgDaysOnMarket: number;
  avgPricePerSqft: number;
  priceRangeLow: number;
  priceRangeHigh: number;
  properties: MLSProperty[];
}

function headers() {
  return {
    'X-RapidAPI-Key': RAPIDAPI_KEY,
    'X-RapidAPI-Host': RAPIDAPI_HOST,
  };
}

/**
 * Search for-sale listings in a given location with optional price filters.
 * Returns a normalized list of properties.
 */
export async function searchForSaleListings(
  location: string,
  priceMin?: number,
  priceMax?: number,
  limit = 10
): Promise<MLSProperty[]> {
  if (!RAPIDAPI_KEY) return [];

  try {
    const params = new URLSearchParams({ location, sort: 'newest' });
    if (priceMin) params.set('price_min', String(priceMin));
    if (priceMax) params.set('price_max', String(priceMax));

    const res = await fetch(`${BASE_URL}/for-sale?${params}`, {
      headers: headers(),
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) return [];
    const data = await res.json() as any;
    const listings = data?.listings || [];

    return listings.slice(0, limit).map((item: any): MLSProperty => ({
      id: item.listing_id || item.property_id || `mls_${Math.random().toString(36).slice(2)}`,
      address: item.location?.address?.line || 'Address unavailable',
      price: item.list_price || 0,
      beds: item.description?.beds || 0,
      baths: item.description?.baths || 0,
      sqft: item.description?.sqft || 0,
      propertyType: item.description?.type || 'residential',
      status: 'for_sale',
      daysOnMarket: item.list_date
        ? Math.max(0, Math.floor((Date.now() - new Date(item.list_date).getTime()) / 86400000))
        : 0,
      photoUrl: item.primary_photo?.href || undefined,
      latitude: item.location?.address?.coordinate?.lat || undefined,
      longitude: item.location?.address?.coordinate?.lon || undefined,
      description: item.description?.text || undefined,
    }));
  } catch {
    return [];
  }
}

/**
 * Search recently sold properties for comparable market data.
 */
export async function searchSoldListings(
  location: string,
  limit = 8
): Promise<MLSProperty[]> {
  if (!RAPIDAPI_KEY) return [];

  try {
    const params = new URLSearchParams({ location, sort: 'sold_date' });
    const res = await fetch(`${BASE_URL}/sold-homes?${params}`, {
      headers: headers(),
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) return [];
    const data = await res.json() as any;
    const listings = data?.listings || [];

    return listings.slice(0, limit).map((item: any): MLSProperty => ({
      id: item.listing_id || item.property_id || `mls_sold_${Math.random().toString(36).slice(2)}`,
      address: item.location?.address?.line || 'Address unavailable',
      price: item.last_sold_price || item.list_price || 0,
      beds: item.description?.beds || 0,
      baths: item.description?.baths || 0,
      sqft: item.description?.sqft || 0,
      propertyType: item.description?.type || 'residential',
      status: 'sold',
      daysOnMarket: 0,
      photoUrl: item.primary_photo?.href || undefined,
    }));
  } catch {
    return [];
  }
}

/**
 * Build a concise market summary from raw listings — this is what the AI
 * receives so it can ground its recommendations in real data.
 */
export function buildMarketSummary(
  location: string,
  forSale: MLSProperty[],
  sold: MLSProperty[]
): MLSMarketSummary {
  const allPrices = [...forSale, ...sold].map(p => p.price).filter(p => p > 0);
  const allSqft = [...forSale, ...sold].map(p => p.sqft).filter(s => s > 0);
  const allDOM = [...forSale, ...sold].map(p => p.daysOnMarket).filter(d => d > 0);

  const sorted = allPrices.sort((a, b) => a - b);
  const median = sorted.length > 0
    ? sorted[Math.floor(sorted.length / 2)]
    : 0;

  return {
    location,
    totalListings: forSale.length,
    medianPrice: median,
    avgDaysOnMarket: allDOM.length > 0
      ? Math.round(allDOM.reduce((a, b) => a + b, 0) / allDOM.length)
      : 0,
    avgPricePerSqft: allSqft.length > 0 && allPrices.length > 0
      ? Math.round(allPrices.reduce((a, b) => a + b, 0) / allPrices.length / (allSqft.reduce((a, b) => a + b, 0) / allSqft.length))
      : 0,
    priceRangeLow: sorted.length > 0 ? sorted[0] : 0,
    priceRangeHigh: sorted.length > 0 ? sorted[sorted.length - 1] : 0,
    properties: forSale,
  };
}

/**
 * Format the market summary into a compact text block the AI can consume
 * in its prompt context.
 */
export function formatMarketDataForAI(summary: MLSMarketSummary): string {
  if (summary.totalListings === 0 && summary.medianPrice === 0) {
    return '';
  }

  const lines: string[] = [
    `[LIVE MLS MARKET DATA — ${summary.location}]`,
    `Active listings: ${summary.totalListings}`,
    `Median price: $${summary.medianPrice.toLocaleString()}`,
    `Price range: $${summary.priceRangeLow.toLocaleString()} – $${summary.priceRangeHigh.toLocaleString()}`,
    `Avg days on market: ${summary.avgDaysOnMarket}`,
    `Avg price/sqft: $${summary.avgPricePerSqft}`,
  ];

  if (summary.properties.length > 0) {
    lines.push('Sample active listings:');
    summary.properties.slice(0, 5).forEach(p => {
      lines.push(
        `  • ${p.address} — $${p.price.toLocaleString()}, ${p.beds}bd/${p.baths}ba, ${p.sqft.toLocaleString()} sqft, ${p.daysOnMarket} DOM`
      );
    });
  }

  return lines.join('\n');
}

/**
 * Fetch real MLS data for a market and return a formatted string for AI context.
 * Returns empty string if no data available (graceful degradation).
 */
export async function getMarketDataForAI(
  location: string,
  priceMin?: number,
  priceMax?: number
): Promise<string> {
  const [forSale, sold] = await Promise.all([
    searchForSaleListings(location, priceMin, priceMax),
    searchSoldListings(location),
  ]);

  if (forSale.length === 0 && sold.length === 0) return '';

  const summary = buildMarketSummary(location, forSale, sold);
  return formatMarketDataForAI(summary);
}
