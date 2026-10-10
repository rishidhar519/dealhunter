import { NextResponse } from 'next/server';
import { SEED_LAPTOP_DEALS } from '@/lib/deals-database';
import { calculateEffectiveDeal, analyzeDealsWithAI } from '@/lib/ai-analyzer';
import { DealSearchQuery } from '@/types/deal';

export async function POST(req: Request) {
  try {
    const body: DealSearchQuery = await req.json();
    const apiKey = req.headers.get('x-gemini-api-key') || process.env.GEMINI_API_KEY || '';

    const selectedBank = body.selectedBank || 'SBI';

    // Filter deals according to spec constraints
    let filtered = [...SEED_LAPTOP_DEALS];

    if (body.brand && body.brand.trim() !== '' && body.brand.toLowerCase() !== 'all') {
      filtered = filtered.filter(
        (p) => p.brand.toLowerCase() === body.brand?.toLowerCase()
      );
    }

    if (body.minRamGb) {
      filtered = filtered.filter((p) => p.specs.ramGb >= (body.minRamGb || 16));
    }

    if (body.minStorageGb) {
      filtered = filtered.filter((p) => p.specs.storageGb >= (body.minStorageGb || 512));
    }

    if (body.gpuFilter && body.gpuFilter !== 'all') {
      if (body.gpuFilter.includes('4050')) {
        filtered = filtered.filter((p) => p.specs.gpu.includes('4050'));
      } else if (body.gpuFilter.includes('3050')) {
        filtered = filtered.filter((p) => p.specs.gpu.includes('3050'));
      }
    }

    if (body.vramMinGb) {
      filtered = filtered.filter((p) => p.specs.vramGb >= (body.vramMinGb || 6));
    }

    // Calculate effective prices with selected bank offer
    const calculated = filtered.map((product) =>
      calculateEffectiveDeal(product, selectedBank)
    );

    // Sort by effective price ascending
    calculated.sort((a, b) => a.effectivePrice - b.effectivePrice);

    // Run AI analysis
    const querySummary = `CPU: ${body.cpuFilter || 'AMD Ryzen 7 7735HS / Equivalent'}, RAM: ${body.minRamGb || 16}GB, Storage: ${body.minStorageGb || 512}GB, GPU: ${body.gpuFilter || 'RTX 3050 6GB / RTX 4050 6GB'}, Brand: ${body.brand || 'Any Brand'}`;
    const aiAnalysis = await analyzeDealsWithAI(calculated, querySummary, selectedBank, apiKey);

    return NextResponse.json({
      deals: calculated,
      aiAnalysis,
      totalFound: calculated.length,
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
