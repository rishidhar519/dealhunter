'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { BankCardSelector } from '@/components/BankCardSelector';
import { SpecFilterBar } from '@/components/SpecFilterBar';
import { AIAnalysisCard } from '@/components/AIAnalysisCard';
import { DealCard } from '@/components/DealCard';
import { DealSearchQuery, CalculatedDeal, AIAnalysisSummary } from '@/types/deal';
import { Sparkles, ShoppingBag, ShieldCheck, RefreshCw, CheckCircle2, Layers } from 'lucide-react';

const SCREENSHOT_PRESET_QUERY: DealSearchQuery = {
  cpuFilter: 'AMD Ryzen 7 7735HS / Equivalent',
  gpuFilter: 'all',
  minRamGb: 16,
  minStorageGb: 512,
  vramMinGb: 6,
  brand: 'all',
  selectedBank: 'SBI',
};

export default function Home() {
  const [apiKey, setApiKey] = useState<string>('');
  const [selectedBank, setSelectedBank] = useState<string>('SBI');
  const [query, setQuery] = useState<DealSearchQuery>(SCREENSHOT_PRESET_QUERY);
  const [customUrl, setCustomUrl] = useState<string>('https://www.amazon.in/dp/B0GTZJVD3Y');
  const [exactDeals, setExactDeals] = useState<CalculatedDeal[]>([]);
  const [alternativeDeals, setAlternativeDeals] = useState<CalculatedDeal[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'exact' | 'alternatives'>('exact');

  // Load saved Google AI Studio key from localStorage on mount
  useEffect(() => {
    const savedKey = localStorage.getItem('dealhunter_gemini_api_key');
    if (savedKey) {
      setApiKey(savedKey);
    }
    fetchDeals(SCREENSHOT_PRESET_QUERY, 'SBI', savedKey || '');
  }, []);

  const fetchDeals = async (
    searchQuery: DealSearchQuery,
    bank: string,
    keyOverride?: string
  ) => {
    setIsLoading(true);
    try {
      const activeKey = keyOverride !== undefined ? keyOverride : apiKey;
      const res = await fetch('/api/hunt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-gemini-api-key': activeKey,
        },
        body: JSON.stringify({
          ...searchQuery,
          selectedBank: bank,
        }),
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

  const handleBankChange = (newBank: string) => {
    setSelectedBank(newBank);
    fetchDeals(query, newBank);
  };

  const handleSearch = () => {
    fetchDeals(query, selectedBank);
  };

  const handleLoadScreenshotPreset = () => {
    setQuery(SCREENSHOT_PRESET_QUERY);
    setSelectedBank('SBI');
    setCustomUrl('https://www.amazon.in/dp/B0GTZJVD3Y');
    setActiveTab('exact');
    fetchDeals(SCREENSHOT_PRESET_QUERY, 'SBI');
  };

  const handleScanUrl = async () => {
    if (!customUrl.trim()) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/parse-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: customUrl }),
      });
      if (res.ok) {
        setActiveTab('exact');
        fetchDeals(query, selectedBank);
      }
    } catch (err) {
      console.error('Error scanning URL:', err);
    } finally {
      setIsLoading(false);
    }
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
            <Sparkles className="w-3.5 h-3.5" />
            Live Verified Multi-Platform Deal Scanner
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Compare Across <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-indigo-400 to-cyan-400">Amazon, Flipkart & Croma</span> with Live Card Discounts
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Direct functional links, verified market pricing, and automated fine-print card discount calculations powered by Google Gemini AI.
          </p>
        </div>

        {/* 1. Payment Method & Bank Selector */}
        <BankCardSelector
          selectedBank={selectedBank}
          onSelectBank={handleBankChange}
        />

        {/* 2. Hardware Spec Controls & Preset */}
        <SpecFilterBar
          query={query}
          setQuery={setQuery}
          onSearch={handleSearch}
          onLoadScreenshotPreset={handleLoadScreenshotPreset}
          customUrl={customUrl}
          setCustomUrl={setCustomUrl}
          onScanUrl={handleScanUrl}
          isLoading={isLoading}
        />

        {/* 3. AI Analysis Report */}
        {aiAnalysis && (
          <AIAnalysisCard
            analysis={aiAnalysis}
            selectedBank={selectedBank}
          />
        )}

        {/* 4. Tab Navigation for Exact Product vs Alternative Deals */}
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
                Target Product Head-to-Head ({exactDeals.length} Stores)
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
                Alternative Brands & Upgrades ({alternativeDeals.length})
              </button>
            </div>

            {isLoading && (
              <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-medium">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Updating prices with {selectedBank} card...
              </div>
            )}
          </div>

          {activeTab === 'exact' ? (
            <div className="space-y-4">
              <div className="bg-indigo-950/30 border border-indigo-500/20 rounded-xl p-4 text-xs text-indigo-300">
                <strong>Comparing Target Product:</strong> Lenovo LOQ Essential (83S0009SIN) across authorized Indian stores.
                {selectedBank === 'SBI' && (
                  <span className="text-emerald-400 ml-1 font-semibold">
                    ★ Amazon wins with the ₹16,250 instant SBI Card discount (Effective: ₹83,740).
                  </span>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {exactDeals.map((deal, idx) => (
                  <DealCard key={deal.product.id} deal={deal} rankIndex={idx} />
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs text-slate-400">
                <strong>Brand-Agnostic Alternatives:</strong> Explore equivalent hardware (Acer Nitro, ASUS TUF) or consider the RTX 4050 edition for faster gaming performance.
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            DealHunter • Verified Indian Ecommerce Bank Discount & Spec Aggregator
          </div>
          <p>Deployable to Vercel with serverless edge execution</p>
        </div>
      </footer>
    </div>
  );
}
