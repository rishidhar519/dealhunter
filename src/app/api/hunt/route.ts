import { NextResponse } from 'next/server';
import { COMPREHENSIVE_STORE_CATALOG } from '@/lib/deals-database';
import { calculateEffectiveDeal, analyzeDealsWithAI } from '@/lib/ai-analyzer';
import { DealSearchQuery } from '@/types/deal';
import { checkRateLimit } from '@/lib/rate-limiter';

export async function POST(req: Request) {
  try {
    // 1. Anti-bot IP Rate Limiter
    const forwardedFor = req.headers.get('x-forwarded-for');
    const clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';
    const rateCheck = checkRateLimit(clientIp, 45, 60000); // 45 queries/min per IP

    if (!rateCheck.success) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded. Too many requests. Please wait before refreshing.',
          retryAfterSeconds: rateCheck.resetInSeconds,
        },
        { status: 429 }
      );
    }

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

    // Filter by Category if specified and not 'all'
    const category = body.category || 'all';
    if (category !== 'all') {
      candidateListings = candidateListings.filter((p) => p.category === category);
    }

    // Filter by Brand if specified
    if (body.brand && body.brand.trim() !== '' && body.brand.toLowerCase() !== 'all' && body.brand.toLowerCase() !== 'any') {
      candidateListings = candidateListings.filter(
        (p) => p.brand.toLowerCase() === body.brand?.toLowerCase()
      );
    }

    // Only apply hardware specs filters for laptop category
    if (category === 'laptops' || category === 'all') {
      // Filter by Min RAM
      if (body.minRamGb && body.minRamGb > 0) {
        candidateListings = candidateListings.filter((p) => {
          if (p.category !== 'laptops') return true;
          return (p.specs.ramGb || 0) >= body.minRamGb!;
        });
      }

      // Filter by Min Storage
      if (body.minStorageGb && body.minStorageGb > 0) {
        candidateListings = candidateListings.filter((p) => {
          if (p.category !== 'laptops') return true;
          return (p.specs.storageGb || 0) >= body.minStorageGb!;
        });
      }

      // Filter by Min VRAM
      if (body.vramMinGb && body.vramMinGb > 0) {
        candidateListings = candidateListings.filter((p) => {
          if (p.category !== 'laptops') return true;
          return (p.specs.vramGb || 0) >= body.vramMinGb!;
        });
      }
    }

    // Filter by Max Budget if specified
    if (body.budgetMax && body.budgetMax > 0) {
      candidateListings = candidateListings.filter((p) => p.basePrice <= body.budgetMax! * 1.25); // Allow slight buffer before discounts
    }

    // If filtering left zero listings, fall back to category items
    if (candidateListings.length === 0) {
      candidateListings = COMPREHENSIVE_STORE_CATALOG.filter((p) =>
        category === 'all' ? true : p.category === category
      );
    }

    // Calculate effective price using user's multi-card wallet
    const calculatedDeals = candidateListings.map((product) =>
      calculateEffectiveDeal(product, activeWallet)
    );

    // Sort by effective price ascending
    calculatedDeals.sort((a, b) => a.effectivePrice - b.effectivePrice);

    // Separate into exact/primary matches vs alternative deals
    let exactMatches = [];
    let alternativeDeals = [];

    if (category === 'laptops') {
      exactMatches = calculatedDeals.filter(
        (d) => d.product.modelNumber?.includes('83S0009SIN') || d.product.title.toLowerCase().includes('essential')
      );
      alternativeDeals = calculatedDeals.filter(
        (d) => !d.product.modelNumber?.includes('83S0009SIN') && !d.product.title.toLowerCase().includes('essential')
      );
    } else {
      // For smartphones, audio, or smart-tvs, top 3-4 lowest effective prices are exact/primary matches
      exactMatches = calculatedDeals.slice(0, 3);
      alternativeDeals = calculatedDeals.slice(3);
    }

    // Run AI analysis
    const querySummary = `Category: ${category}. Wallet Cards: [${activeWallet.join(', ')}]. Budget Max: ₹${(body.budgetMax || 95000).toLocaleString('en-IN')}.`;
    const aiAnalysis = await analyzeDealsWithAI(
      calculatedDeals,
      querySummary,
      activeWallet.join(' / '),
      apiKey
    );

    return NextResponse.json({
      exactStoreMatches: exactMatches.length > 0 ? exactMatches : calculatedDeals.slice(0, 3),
      alternativeDeals: alternativeDeals.length > 0 ? alternativeDeals : calculatedDeals.slice(3),
      allDeals: calculatedDeals,
      aiAnalysis,
      activeWallet,
      totalStoresScanned: 13,
    });
  } catch (error) {
    console.error('Error in /api/hunt:', error);
    return NextResponse.json(
      { error: 'Failed to process deal search', details: String(error) },
      { status: 500 }
    );
  }
}
