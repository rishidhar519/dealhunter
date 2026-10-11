import { Platform } from '@/types/deal';

// Default affiliate tracking tags (configurable via env variables)
const AMAZON_TAG = process.env.NEXT_PUBLIC_AMAZON_AFFILIATE_TAG || 'dealhunter-21';
const FLIPKART_AFFID = process.env.NEXT_PUBLIC_FLIPKART_AFFILIATE_ID || 'dealhunter';
const CUELINKS_PUB_ID = process.env.NEXT_PUBLIC_CUELINKS_PUB_ID || '';

/**
 * Transforms a raw retailer URL into a monetizable affiliate link
 */
export function buildAffiliateUrl(rawUrl: string, platform: Platform): string {
  try {
    const urlObj = new URL(rawUrl);

    // If Cuelinks publisher ID is set, wrap arbitrary URLs
    if (CUELINKS_PUB_ID && CUELINKS_PUB_ID.trim().length > 0) {
      return `https://linksredirect.com/?pub_id=${CUELINKS_PUB_ID}&url=${encodeURIComponent(rawUrl)}`;
    }

    switch (platform) {
      case 'amazon':
        urlObj.searchParams.set('tag', AMAZON_TAG);
        return urlObj.toString();

      case 'flipkart':
        urlObj.searchParams.set('affid', FLIPKART_AFFID);
        return urlObj.toString();

      case 'croma':
      case 'reliancedigital':
      case 'vijaysales':
      case 'dell':
      case 'hp':
      case 'lenovo':
      case 'acer':
      case 'asus':
      case 'samsung':
      case 'apple':
      case 'tatacliq':
      default:
        // Append standard UTM campaign tracking
        urlObj.searchParams.set('utm_source', 'dealhunter');
        urlObj.searchParams.set('utm_medium', 'affiliate_comparison');
        return urlObj.toString();
    }
  } catch {
    return rawUrl;
  }
}

/**
 * Standard legal affiliate disclosures compliant with Amazon Associates and ASCI India
 */
export const AFFILIATE_DISCLOSURES = {
  short: 'DealHunter participates in affiliate programs and may earn a commission from qualifying purchases at no extra cost to you.',
  amazonExplicit: 'As an Amazon Associate, DealHunter earns from qualifying purchases.',
  fullDisclaimer:
    'DealHunter is an independent product comparison and deal discovery platform. We may earn an affiliate commission when you purchase through links on our site. This does not impact product prices, ranking integrity, or editorial evaluations.',
};
