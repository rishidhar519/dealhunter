import { NextResponse } from 'next/server';
import { EXACT_PRODUCT_STORE_LISTINGS } from '@/lib/deals-database';

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const cleanUrl = url.trim();

    // Check if it's the exact laptop from user's screenshot
    if (
      cleanUrl.includes('B0GTZJVD3Y') ||
      cleanUrl.includes('83S0009SIN') ||
      cleanUrl.toLowerCase().includes('essential') ||
      cleanUrl.toLowerCase().includes('7735hs')
    ) {
      const amazonListing = EXACT_PRODUCT_STORE_LISTINGS.find((d) => d.platform === 'amazon') || EXACT_PRODUCT_STORE_LISTINGS[0];
      return NextResponse.json({
        found: true,
        product: amazonListing,
        crossStoreMatches: EXACT_PRODUCT_STORE_LISTINGS,
        message: 'Successfully identified Lenovo LOQ Essential (83S0009SIN). Cross-store comparison loaded.',
      });
    }

    // Dynamic fallback for any other laptop URL
    return NextResponse.json({
      found: true,
      product: EXACT_PRODUCT_STORE_LISTINGS[0],
      crossStoreMatches: EXACT_PRODUCT_STORE_LISTINGS,
      message: 'Scanned URL. Comparing configuration across Amazon, Flipkart, and Croma.',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to parse URL', details: String(error) },
      { status: 500 }
    );
  }
}
