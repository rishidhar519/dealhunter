import { NextResponse } from 'next/server';
import { EXACT_PRODUCT_STORE_LISTINGS, ALTERNATIVE_HARDWARE_DEALS, ALL_LAPTOP_DEALS } from '@/lib/deals-database';
import { calculateEffectiveDeal, analyzeDealsWithAI } from '@/lib/ai-analyzer';
import { DealSearchQuery } from '@/types/deal';

export async function POST(req: Request) {
  try {
    const body: DealSearchQuery = await req.json();
    const apiKey = req.headers.get('x-gemini-api-key') || process.env.GEMINI_API_KEY || '';
    const selectedBank = body.selectedBank || 'SBI';

    // 1. Calculate deals for the Exact Laptop across all stores
    const exactMatches = EXACT_PRODUCT_STORE_LISTINGS.map((product) =>
      calculateEffectiveDeal(product, selectedBank)
    );
    // Sort exact matches by effective price
    exactMatches.sort((a, b) => a.effectivePrice - b.effectivePrice);

    // 2. Filter and calculate alternative hardware deals
    let alternativeListings = [...ALTERNATIVE_HARDWARE_DEALS];

    if (body.brand && body.brand.trim() !== '' && body.brand.toLowerCase() !== 'all') {
      alternativeListings = alternativeListings.filter(
        (p) => p.brand.toLowerCase() === body.brand?.toLowerCase()
      );
    }

    if (body.gpuFilter && body.gpuFilter !== 'all') {
      if (body.gpuFilter.includes('4050')) {
        alternativeListings = alternativeListings.filter((p) => p.specs.gpu.includes('4050'));
      } else if (body.gpuFilter.includes('3050')) {
        alternativeListings = alternativeListings.filter((p) => p.specs.gpu.includes('3050'));
      }
    }

    const alternativeDeals = alternativeListings.map((product) =>
      calculateEffectiveDeal(product, selectedBank)
    );
    alternativeDeals.sort((a, b) => a.effectivePrice - b.effectivePrice);

    // All deals combined
    const allCalculated = [...exactMatches, ...alternativeDeals];

    // AI Analysis
    const querySummary = `Target Laptop: Lenovo LOQ Essential (83S0009SIN) [AMD Ryzen 7 7735HS, RTX 3050 6GB, 16GB RAM, 512GB SSD]. Comparing live across Amazon, Flipkart, Croma, and Lenovo Store with ${selectedBank} payment.`;
    const aiAnalysis = await analyzeDealsWithAI(allCalculated, querySummary, selectedBank, apiKey);

    return NextResponse.json({
      exactStoreMatches: exactMatches,
      alternativeDeals,
      allDeals: allCalculated,
      aiAnalysis,
      selectedBank,
    });
  } catch (error) {
    console.error('Error in /api/hunt:', error);
    return NextResponse.json(
      { error: 'Failed to process deal search', details: String(error) },
      { status: 500 }
    );
  }
}
