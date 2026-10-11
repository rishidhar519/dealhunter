export type PriorityLevel = 'critical' | 'high' | 'medium' | 'flexible';

export interface SpecRequirement<T> {
  value: T;
  priority: PriorityLevel;
  label: string;
  enabled?: boolean;
}

export interface ParsedRequirementJSON {
  userIntentSummary: string;
  category: 'laptop' | 'smartphone' | 'electronics' | 'other';
  budgetMax: SpecRequirement<number>;
  budgetMin?: SpecRequirement<number>;
  gpu: SpecRequirement<{
    modelOrTier: string;
    minVramGb: number;
    requiresDedicated: boolean;
  }>;
  cpu: SpecRequirement<{
    tier: string;
    minCores: number;
  }>;
  ramGb: SpecRequirement<number>;
  storageGb: SpecRequirement<number>;
  displayHz: SpecRequirement<number>;
  brandPreference: SpecRequirement<string>;
  screenSizeInches?: SpecRequirement<number>;
  extractedRawTokens: string[];
}

export type SupportedBankCard =
  | 'SBI_CC'
  | 'SBI_DC'
  | 'ICICI_CC'
  | 'AMAZON_PAY_ICICI'
  | 'HDFC_CC'
  | 'HDFC_DC'
  | 'AXIS_CC'
  | 'FLIPKART_AXIS'
  | 'KOTAK_CC'
  | 'ANY_CREDIT_CARD'
  | 'AMAZON_PAY_UPI';

export interface WalletCardDefinition {
  id: SupportedBankCard;
  name: string;
  issuer: 'SBI' | 'ICICI' | 'HDFC' | 'Axis' | 'Kotak' | 'Any' | 'UPI';
  type: 'credit' | 'debit' | 'upi';
  popularOfferTag: string;
}
