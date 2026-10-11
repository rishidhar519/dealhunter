import { NextResponse } from 'next/server';
import { COMPREHENSIVE_STORE_CATALOG } from '@/lib/deals-database';
import { calculateEffectiveDeal, analyzeDealsWithAI } from '@/lib/ai-analyzer';
import { DealSearchQuery } from '@/types/deal';

export async function POST(req: Request) {
  try {
    const body: DealSearchQuery & { userWallet?: string[] } = await req.json();
    const apiKey = req.headers.get('x-gemini-api-key') || process.env.GEMINI_API_KEY || '';

    // Multi-card wallet
    const activeWallet: string[] =
      body.selectedCards && body.selectedCards.length > 0
        ? body.selectedCards
        : body.selectedBank
        ? [body.selectedBank]
        : ['SBI_CC', 'AMAZON_PAY_ICICI'];

    let candidateListings = [...COMPREHENSIVE_STORE_CATALOG];

    // Filter by Brand if specified
    if (body.brand && body.brand.trim() !== '' && body.brand.toLowerCase() !== 'all' && body.brand.toLowerCase() !== 'any') {
      candidateListings = candidateListings.filter(
        (p) => p.brand.toLowerCase() === body.brand?.toLowerCase()
      );
    }

    // Filter by Min RAM
    if (body.minRamGb) {
      candidateListings = candidateListings.filter((p) => p.specs.ramGb >= (body.minRamGb || 16));
    }

    // Filter by Min Storage
    if (body.minStorageGb) {
      candidateListings = candidateListings.filter((p) => p.specs.storageGb >= (body.minStorageGb || 512));
    }

    // Filter by Min VRAM
    if (body.vramMinGb) {
      candidateListings = candidateListings.filter((p) => p.specs.vramGb >= (body.vramMinGb || 6));
    }

    // Filter by Max Budget if specified
    if (body.budgetMax && body.budgetMax > 0) {
      candidateListings = candidateListings.filter((p) => p.basePrice <= body.budgetMax! * 1.15); // Allow slight buffer before discounts
    }

    // Calculate effective price using user's multi-card wallet
    const calculatedDeals = candidateListings.map((product) =>
      calculateEffectiveDeal(product, activeWallet)
    );

    // Sort by effective price ascending
    calculatedDeals.sort((a, b) => a.effectivePrice - b.effectivePrice);

    // Separate into exact SKU matches vs alternative deals
    const exactMatches = calculatedDeals.filter(
      (d) => d.product.modelNumber?.includes('83S0009SIN') || d.product.title.toLowerCase().includes('essential')
    );

    const alternativeDeals = calculatedDeals.filter(
      (d) => !d.product.modelNumber?.includes('83S0009SIN') && !d.product.title.toLowerCase().includes('essential')
    );

    // Run AI analysis
    const querySummary = `Wallet Cards: [${activeWallet.join(', ')}]. Specs: Min ${body.minRamGb || 16}GB RAM, ${body.vramMinGb || 6}GB+ VRAM, Budget Max ₹${(body.budgetMax || 95000).toLocaleString('en-IN')}.`;
    const aiAnalysis = await analyzeDealsWithAI(
      calculatedDeals,
      querySummary,
      activeWallet.join(' / '),
      apiKey
    );

    return NextResponse.json({
      exactStoreMatches: exactMatches.length > 0 ? exactMatches : calculatedDeals.slice(0, 4),
      alternativeDeals: alternativeDeals.length > 0 ? alternativeDeals : calculatedDeals.slice(4),
      allDeals: calculatedDeals,
      aiAnalysis,
      activeWallet,
      totalStoresScanned: 9,
    });
  } catch (error) {
    console.error('Error in /api/hunt:', error);
    return NextResponse.json(
      { error: 'Failed to process deal search', details: String(error) },
      { status: 500 }
    );
  }
}
