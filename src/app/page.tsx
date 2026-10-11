'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { WalletSelector } from '@/components/WalletSelector';
import { RequirementNegotiator } from '@/components/RequirementNegotiator';
import { AIAnalysisCard } from '@/components/AIAnalysisCard';
import { DealCard } from '@/components/DealCard';
import { CalculatedDeal, AIAnalysisSummary } from '@/types/deal';
import { ParsedRequirementJSON } from '@/types/requirements';
import { Sparkles, ShoppingBag, ShieldCheck, RefreshCw, CheckCircle2, Layers, Store } from 'lucide-react';

export default function Home() {
  const [apiKey, setApiKey] = useState<string>('');
  const [selectedCards, setSelectedCards] = useState<string[]>([
    'SBI_CC',
    'SBI_DC',
    'AMAZON_PAY_ICICI',
  ]);
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
    // Perform initial hunt with default wallet and spec
    fetchDeals(['SBI_CC', 'SBI_DC', 'AMAZON_PAY_ICICI']);
  }, []);

  const fetchDeals = async (
    cardsToUse: string[],
    reqOverride?: ParsedRequirementJSON
  ) => {
    setIsLoading(true);
    try {
      const activeKey = apiKey || '';
      const req = reqOverride || activeRequirement;

      const body = {
        selectedCards: cardsToUse,
        brand: req?.brandPreference?.value || 'all',
        minRamGb: req?.ramGb?.value || 16,
        minStorageGb: req?.storageGb?.value || 512,
        vramMinGb: req?.gpu?.value?.minVramGb || 6,
        budgetMax: req?.budgetMax?.value || 95000,
      };

      const res = await fetch('/api/hunt', {
        method: 'POST',
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
    fetchDeals(newCards);
  };

  const handleConfirmRequirements = (confirmedReq: ParsedRequirementJSON) => {
    setActiveRequirement(confirmedReq);
    fetchDeals(selectedCards, confirmedReq);
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
            Scanning 9 Major Indian Retailers • Multi-Card Wallet Engine
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Smart Deal Hunter with <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-indigo-400 to-cyan-400">AI Intent Negotiation</span> & Multi-Card Wallet
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Tell DealHunter what you want in natural language. We analyze your requirements, prioritize critical dealbreakers, and search <strong>Amazon, Flipkart, Croma, Reliance Digital, Vijay Sales & Brand Stores</strong> applying your wallet cards automatically.
          </p>
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

        {/* 4. Tab Navigation across 9 Stores */}
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
                Target Product Across Stores ({exactDeals.length})
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
                Hardware Upgrades & Value Alternatives ({alternativeDeals.length})
              </button>
            </div>

            {isLoading && (
              <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-medium">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Optimizing discounts for your {selectedCards.length} wallet cards across 9 stores...
              </div>
            )}
          </div>

          {activeTab === 'exact' ? (
            <div className="space-y-4">
              <div className="bg-indigo-950/30 border border-indigo-500/20 rounded-xl p-4 text-xs text-indigo-300 flex items-center justify-between flex-wrap gap-2">
                <div>
                  <strong>Head-to-Head Comparison:</strong> Live pricing across Amazon, Flipkart, Croma, Reliance Digital, Vijay Sales & Lenovo Store.
                </div>
                <div className="text-emerald-400 font-bold">
                  ★ Amazon wins with SBI Card (Save ₹16,250 on-page offer $\rightarrow$ ₹83,740).
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
                <strong>Alternative Hardware Tiers:</strong> Includes RTX 4050 upgrades (+35% gaming FPS & Frame Gen) and value options from Acer and ASUS stores.
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

      <footer className="border-t border-slate-900 bg-slate-950 py-8 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-400 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            DealHunter • Amazon, Flipkart, Croma, Reliance Digital, Vijay Sales & Brand Stores
          </div>
          <p>Multi-Card Wallet & Dynamic Requirement Engine deployed on Vercel</p>
        </div>
      </footer>
    </div>
  );
}
