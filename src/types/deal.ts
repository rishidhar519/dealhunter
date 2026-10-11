export interface LaptopSpec {
  brand: string;
  modelName: string;
  cpu: string;
  cpuTier: 'Ryzen 7 / i7' | 'Ryzen 5 / i5' | 'Other';
  gpu: string;
  vramGb: number;
  ramGb: number;
  ramType: string;
  storageGb: number;
  displaySizeInches: number;
  refreshRateHz: number;
  weightKg?: number;
  os: string;
}

export type Platform =
  | 'amazon'
  | 'flipkart'
  | 'croma'
  | 'reliancedigital'
  | 'vijaysales'
  | 'lenovo'
  | 'acer'
  | 'asus'
  | 'tatacliq';

export interface BankOffer {
  id: string;
  bank: 'SBI' | 'HDFC' | 'ICICI' | 'Axis' | 'Kotak' | 'Flipkart Axis' | 'Amazon Pay ICICI' | 'Any Credit Card' | 'Other';
  cardType: 'credit' | 'debit' | 'all';
  discountAmount: number;
  discountPercentage?: number;
  minTransaction?: number;
  maxDiscount?: number;
  description: string;
  isNoCostEmi?: boolean;
  emiMonths?: number;
  emiMonthlyAmount?: number;
}

export interface ProductListing {
  id: string;
  title: string;
  brand: string;
  modelNumber?: string;
  platform: Platform;
  url: string;
  imageUrl: string;
  basePrice: number;
  mrp: number;
  inStock: boolean;
  rating: number;
  ratingCount: number;
  specs: LaptopSpec;
  offers: BankOffer[];
  dealBadge?: 'Winner Deal' | 'Spec Upgrade' | 'Budget Champion' | 'Best Direct Match' | 'Top Pick';
  badgeReason?: string;
}

export interface DealSearchQuery {
  cpuFilter?: string;
  minRamGb?: number;
  minStorageGb?: number;
  gpuFilter?: string;
  vramMinGb?: number;
  budgetMax?: number;
  brand?: string; // empty means all brands
  selectedCards?: string[]; // Multi-card wallet list e.g. ['SBI', 'ICICI', 'HDFC']
  selectedBank?: string; // legacy single card fallback
  urlToCompare?: string;
}

export interface CalculatedDeal {
  product: ProductListing;
  effectivePrice: number;
  appliedOffer?: BankOffer;
  totalSavings: number;
  savingsPercentage: number;
  matchScore: number; // 0-100
  matchTier: 'Exact Match' | 'Spec Upgrade' | 'Budget Equivalent' | 'Partial Match';
  aiNotes?: string;
}

export interface AIAnalysisSummary {
  bestDirectMatch?: CalculatedDeal;
  bestValueUpgrade?: CalculatedDeal;
  budgetChampion?: CalculatedDeal;
  editorialVerdict: string;
  specComparisonHighlights: string[];
  hiddenSavingsNotes: string[];
  usedAiModel: 'gemini-3.8-flash' | 'heuristic-engine';
}
