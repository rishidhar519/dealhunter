'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { WalletSelector } from '@/components/WalletSelector';
import { RequirementNegotiator } from '@/components/RequirementNegotiator';
import { AIAnalysisCard } from '@/components/AIAnalysisCard';
import { DealCard } from '@/components/DealCard';
import { CalculatedDeal, AIAnalysisSummary, ProductCategory } from '@/types/deal';
import { ParsedRequirementJSON } from '@/types/requirements';
import { ShieldCheck, RefreshCw, CheckCircle2, Layers, Store, Laptop, Smartphone, Headphones, Tv, Globe } from 'lucide-react';

const CATEGORIES: { id: ProductCategory; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'laptops', label: 'Laptops', icon: Laptop },
  { id: 'smartphones', label: 'Smartphones', icon: Smartphone },
  { id: 'audio', label: 'Audio & Wearables', icon: Headphones },
  { id: 'smart-tvs', label: 'Smart TVs', icon: Tv },
  { id: 'all', label: 'All Deals', icon: Globe },
];

export default function Home() {
  const [apiKey, setApiKey] = useState<string>('');
  const [selectedCards, setSelectedCards] = useState<string[]>([
    'SBI_CC',
    'SBI_DC',
    'AMAZON_PAY_ICICI',
  ]);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('laptops');
  const [activeRequirement, setActiveRequirement] = useState<ParsedRequirementJSON | null>(null);
  const [exactDeals, setExactDeals] = useState<CalculatedDeal[]>([]);
  const [alternativeDeals, setAlternativeDeals] = useState<CalculatedDeal[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'exact' | 'alternatives'>('exact');

  useEffect(() => {
    const savedKey = localStorage.getItem('dealhunter_gemini_api_key');
    if (savedKey) {
      setApiKey(savedKey);
    }
    // Perform initial hunt with default wallet and category
    fetchDeals(['SBI_CC', 'SBI_DC', 'AMAZON_PAY_ICICI'], null, 'laptops');
  }, []);

  const fetchDeals = async (
    cardsToUse: string[],
    reqOverride?: ParsedRequirementJSON | null,
    categoryToUse?: ProductCategory
  ) => {
    setIsLoading(true);
    try {
      const activeKey = apiKey || '';
      const req = reqOverride !== undefined ? reqOverride : activeRequirement;
      const cat = categoryToUse || selectedCategory;

      // Check if parameters are enabled / not ignored
      const isBrandEnabled = req?.brandPreference?.enabled !== false && req?.brandPreference?.value && req.brandPreference.value !== 'any';
      const isRamEnabled = req?.ramGb?.enabled !== false && typeof req?.ramGb?.value === 'number' && req.ramGb.value > 0;
      const isStorageEnabled = req?.storageGb?.enabled !== false && typeof req?.storageGb?.value === 'number' && req.storageGb.value > 0;
      const isVramEnabled = req?.gpu?.enabled !== false && typeof req?.gpu?.value?.minVramGb === 'number' && req.gpu.value.minVramGb > 0;
      const isBudgetEnabled = req?.budgetMax?.enabled !== false && typeof req?.budgetMax?.value === 'number' && req.budgetMax.value > 0;

      const body = {
        category: cat,
        selectedCards: cardsToUse,
        brand: isBrandEnabled ? req!.brandPreference.value : 'all',
        minRamGb: cat === 'laptops' && isRamEnabled ? req!.ramGb.value : undefined,
        minStorageGb: cat === 'laptops' && isStorageEnabled ? req!.storageGb.value : undefined,
        vramMinGb: cat === 'laptops' && isVramEnabled ? req!.gpu.value.minVramGb : undefined,
        budgetMax: isBudgetEnabled ? req!.budgetMax.value : undefined,
      };

      const res = await fetch('/api/hunt', {
        method: 'POST',
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
          'x-gemini-api-key': activeKey,
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const data = await res.json();
        setExactDeals(data.exactStoreMatches || []);
        setAlternativeDeals(data.alternativeDeals || []);
        setAiAnalysis(data.aiAnalysis || null);
      }
    } catch (err) {
      console.error('Failed to hunt deals:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWalletChange = (newCards: string[]) => {
    setSelectedCards(newCards);
    fetchDeals(newCards, activeRequirement, selectedCategory);
  };

  const handleCategoryChange = (category: ProductCategory) => {
    setSelectedCategory(category);
    fetchDeals(selectedCards, activeRequirement, category);
  };

  const handleConfirmRequirements = (confirmedReq: ParsedRequirementJSON) => {
    setActiveRequirement(confirmedReq);
    fetchDeals(selectedCards, confirmedReq, selectedCategory);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      <Header
        apiKey={apiKey}
        setApiKey={setApiKey}
        isAiActive={Boolean(apiKey)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero title */}
        <div className="text-center space-y-3 max-w-3xl mx-auto pt-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-400">
            <Store className="w-3.5 h-3.5" />
            Scanning 13 Indian Retailers &amp; Official Stores • Multi-Card Wallet Engine
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Smart Deal Hunter with <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-indigo-400 to-cyan-400">AI Intent Negotiation</span> &amp; Multi-Card Wallet
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Describe what you need in plain English. We prioritize critical specs, scan <strong>Amazon, Flipkart, Croma, Reliance Digital, Vijay Sales, Dell, HP, Lenovo, Acer, ASUS, Samsung &amp; Apple</strong>, and automatically apply maximum discounts from your cards.
          </p>
        </div>

        {/* Category Switcher Tabs */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all border ${
                  isSelected
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                    : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* 1. Multi-Card Wallet Selector */}
        <WalletSelector
          selectedCards={selectedCards}
          onChangeWallet={handleWalletChange}
        />

        {/* 2. Natural Language Intent to Prioritized Requirement JSON */}
        <RequirementNegotiator
          onConfirmRequirements={handleConfirmRequirements}
          isLoading={isLoading}
        />

        {/* 3. AI Analysis Report */}
        {aiAnalysis && (
          <AIAnalysisCard
            analysis={aiAnalysis}
            selectedBank={selectedCards.join(' + ')}
          />
        )}

        {/* 4. Tab Navigation across Stores */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab('exact')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  activeTab === 'exact'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Featured Store Picks ({exactDeals.length})
              </button>
              <button
                onClick={() => setActiveTab('alternatives')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  activeTab === 'alternatives'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Layers className="w-4 h-4 text-amber-400" />
                Alternative Stores &amp; Upgrades ({alternativeDeals.length})
              </button>
            </div>

            {isLoading && (
              <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-medium">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Optimizing discounts for your {selectedCards.length} wallet cards across 13 stores...
              </div>
            )}
          </div>

          {activeTab === 'exact' ? (
            <div className="space-y-4">
              <div className="bg-indigo-950/30 border border-indigo-500/20 rounded-xl p-4 text-xs text-indigo-300 flex items-center justify-between flex-wrap gap-2">
                <div>
                  <strong>Store Comparison:</strong> Comparing live pricing across Amazon, Flipkart, Croma, Reliance Digital, Vijay Sales &amp; Official Brand Stores.
                </div>
                <div className="text-emerald-400 font-bold">
                  ★ Active Card Wallet applied automatically across all store listings.
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {exactDeals.map((deal, idx) => (
                  <DealCard key={deal.product.id} deal={deal} rankIndex={idx} />
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs text-slate-400">
                <strong>Alternative Hardware Tiers:</strong> Spec upgrades, official direct-to-consumer store variants, and high-value alternatives.
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {alternativeDeals.map((deal, idx) => (
                  <DealCard key={deal.product.id} deal={deal} rankIndex={idx} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer with Legal Compliance & Affiliate Disclosure */}
      <footer className="border-t border-slate-900 bg-slate-950 py-10 mt-16 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Statutory Affiliate Disclaimer Banner */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 text-slate-400 text-center leading-relaxed max-w-4xl mx-auto space-y-1.5">
            <p className="font-semibold text-slate-300">
              Affiliate &amp; Price Transparency Statement
            </p>
            <p className="text-[11px]">
              DealHunter participates in the Amazon Associates Program and various merchant affiliate programs. When you click outward links and make purchases, we may earn a referral fee at zero additional cost to you. Product prices, bank discounts, and coupon availability are subject to real-time changes by merchants.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-900/80">
            <div className="flex items-center gap-2 text-slate-400 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              DealHunter • 13 Stores Scanned Across India
            </div>

            {/* Legal Navigation Links */}
            <div className="flex items-center gap-5 text-slate-400 font-medium">
              <Link href="/privacy" className="hover:text-indigo-400 transition-colors">
                Privacy Policy
              </Link>
              <span>•</span>
              <Link href="/terms" className="hover:text-indigo-400 transition-colors">
                Terms of Use
              </Link>
              <span>•</span>
              <Link href="/disclosure" className="hover:text-indigo-400 transition-colors">
                Affiliate Disclosure
              </Link>
            </div>
          </div>

          <div className="text-center text-[11px] text-slate-600">
            © 2026 DealHunter. Built with Gemini 3.8 Flash &amp; Next.js 16. Deployed on Vercel.
          </div>
        </div>
      </footer>
    </div>
  );
}
