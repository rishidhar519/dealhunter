import { Platform } from '@/types/deal';

export interface StoreAffiliateRule {
  platform: Platform;
  displayName: string;
  paramName: string; // e.g. 'tag', 'affid', 'ref', 'subid'
  paramValue: string; // e.g. 'dealhunter-21'
  urlPrefix?: string; // e.g. optional redirection wrapper
  enabled: boolean;
  notes: string;
}

// In-memory runtime store (defaults to standard compliant tags, can be updated dynamically via Admin Portal)
let STORE_AFFILIATE_CONFIG: Record<Platform, StoreAffiliateRule> = {
  amazon: {
    platform: 'amazon',
    displayName: 'Amazon India',
    paramName: 'tag',
    paramValue: process.env.NEXT_PUBLIC_AMAZON_AFFILIATE_TAG || 'dealhunter-21',
    enabled: true,
    notes: 'Amazon Associates India Tracking ID',
  },
  flipkart: {
    platform: 'flipkart',
    displayName: 'Flipkart',
    paramName: 'affid',
    paramValue: process.env.NEXT_PUBLIC_FLIPKART_AFFILIATE_ID || 'dealhunter',
    enabled: true,
    notes: 'Flipkart Affiliate / Partner ID',
  },
  croma: {
    platform: 'croma',
    displayName: 'Croma',
    paramName: 'utm_source',
    paramValue: 'dealhunter',
    enabled: true,
    notes: 'Croma Partner / UTM Tracking',
  },
  reliancedigital: {
    platform: 'reliancedigital',
    displayName: 'Reliance Digital',
    paramName: 'utm_source',
    paramValue: 'dealhunter',
    enabled: true,
    notes: 'Reliance Digital Campaign Tag',
  },
  vijaysales: {
    platform: 'vijaysales',
    displayName: 'Vijay Sales',
    paramName: 'utm_source',
    paramValue: 'dealhunter',
    enabled: true,
    notes: 'Vijay Sales Affiliate Tag',
  },
  dell: {
    platform: 'dell',
    displayName: 'Dell India Store',
    paramName: 'ref',
    paramValue: 'dealhunter',
    enabled: true,
    notes: 'Dell Official Store Referral ID',
  },
  hp: {
    platform: 'hp',
    displayName: 'HP India Store',
    paramName: 'affiliate_id',
    paramValue: 'dealhunter',
    enabled: true,
    notes: 'HP Official Store Affiliate ID',
  },
  lenovo: {
    platform: 'lenovo',
    displayName: 'Lenovo Store India',
    paramName: 'subid',
    paramValue: 'dealhunter',
    enabled: true,
    notes: 'Lenovo Official D2C Tracking ID',
  },
  acer: {
    platform: 'acer',
    displayName: 'Acer Store India',
    paramName: 'ref',
    paramValue: 'dealhunter',
    enabled: true,
    notes: 'Acer Official Store Partner Tag',
  },
  asus: {
    platform: 'asus',
    displayName: 'ASUS eShop India',
    paramName: 'partner_id',
    paramValue: 'dealhunter',
    enabled: true,
    notes: 'ASUS Official eShop Tracking Tag',
  },
  samsung: {
    platform: 'samsung',
    displayName: 'Samsung Shop India',
    paramName: 'affiliate',
    paramValue: 'dealhunter',
    enabled: true,
    notes: 'Samsung Store Referral ID',
  },
  apple: {
    platform: 'apple',
    displayName: 'Apple Store India',
    paramName: 'cid',
    paramValue: 'dealhunter',
    enabled: false,
    notes: 'Apple Store Campaign Tracking (Optional)',
  },
  tatacliq: {
    platform: 'tatacliq',
    displayName: 'TataCliq',
    paramName: 'utm_source',
    paramValue: 'dealhunter',
    enabled: true,
    notes: 'TataCliq Affiliate / Campaign Tag',
  },
};

export function getAllStoreAffiliateRules(): Record<Platform, StoreAffiliateRule> {
  return STORE_AFFILIATE_CONFIG;
}

export function updateStoreAffiliateRules(
  updated: Record<Platform, StoreAffiliateRule>
): void {
  STORE_AFFILIATE_CONFIG = { ...STORE_AFFILIATE_CONFIG, ...updated };
}

/**
 * Transforms any raw product or search link into an affiliate link
 * using the actively configured rules in the Admin Portal.
 */
export function buildLiveAffiliateLink(rawUrl: string, platform: Platform): string {
  try {
    const rule = STORE_AFFILIATE_CONFIG[platform];
    if (!rule || !rule.enabled || !rule.paramName || !rule.paramValue) {
      return rawUrl;
    }

    const urlObj = new URL(rawUrl);
    urlObj.searchParams.set(rule.paramName, rule.paramValue);

    if (rule.urlPrefix && rule.urlPrefix.trim().length > 0) {
      return `${rule.urlPrefix}${encodeURIComponent(urlObj.toString())}`;
    }

    return urlObj.toString();
  } catch {
    return rawUrl;
  }
}
