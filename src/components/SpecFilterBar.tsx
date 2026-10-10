'use client';

import React from 'react';
import { SlidersHorizontal, Cpu, HardDrive, Laptop, Sparkles, Link as LinkIcon } from 'lucide-react';
import { DealSearchQuery } from '@/types/deal';

interface SpecFilterBarProps {
  query: DealSearchQuery;
  setQuery: React.Dispatch<React.SetStateAction<DealSearchQuery>>;
  onSearch: () => void;
  onLoadScreenshotPreset: () => void;
  customUrl: string;
  setCustomUrl: (url: string) => void;
  onScanUrl: () => void;
  isLoading: boolean;
}

export const SpecFilterBar: React.FC<SpecFilterBarProps> = ({
  query,
  setQuery,
  onSearch,
  onLoadScreenshotPreset,
  customUrl,
  setCustomUrl,
  onScanUrl,
  isLoading,
}) => {
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      {/* Quick Screenshot Preset Banner */}
      <div className="bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-slate-950 p-3.5 rounded-xl border border-indigo-500/20 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-600/20 text-indigo-400 rounded-lg shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              Configuration Target: AMD Ryzen 7 / RTX 3050 6GB / 16GB / 512GB
            </h4>
            <p className="text-[11px] text-slate-400">
              Matches your uploaded Lenovo LOQ 83S0009SIN specification.
            </p>
          </div>
        </div>
        <button
          onClick={onLoadScreenshotPreset}
          className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/30 flex items-center justify-center gap-1.5 shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Reset to Screenshot Config
        </button>
      </div>

      {/* Filter Controls Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Brand Selector */}
        <div>
          <label className="text-[11px] font-semibold text-slate-400 mb-1 flex items-center gap-1">
            <Laptop className="w-3.5 h-3.5 text-indigo-400" />
            Brand Preference
          </label>
          <select
            value={query.brand || 'all'}
            onChange={(e) => setQuery((prev) => ({ ...prev, brand: e.target.value }))}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="all">🌟 All Brands (Find Cheaper Alternatives)</option>
            <option value="Lenovo">Lenovo Only</option>
            <option value="Acer">Acer Only</option>
            <option value="ASUS">ASUS Only</option>
            <option value="HP">HP Only</option>
          </select>
        </div>

        {/* GPU & VRAM */}
        <div>
          <label className="text-[11px] font-semibold text-slate-400 mb-1 flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            Graphics Card (GPU)
          </label>
          <select
            value={query.gpuFilter || 'all'}
            onChange={(e) => setQuery((prev) => ({ ...prev, gpuFilter: e.target.value }))}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="all">Any (Include RTX 4050 Upgrade Alerts)</option>
            <option value="3050">NVIDIA RTX 3050 6GB Only</option>
            <option value="4050">NVIDIA RTX 4050 6GB Only</option>
          </select>
        </div>

        {/* Minimum RAM */}
        <div>
          <label className="text-[11px] font-semibold text-slate-400 mb-1 flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
            RAM
          </label>
          <select
            value={query.minRamGb || 16}
            onChange={(e) =>
              setQuery((prev) => ({ ...prev, minRamGb: Number(e.target.value) }))
            }
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
          >
            <option value={16}>16 GB RAM (Recommended)</option>
            <option value={24}>24 GB RAM</option>
            <option value={32}>32 GB RAM</option>
          </select>
        </div>

        {/* Minimum Storage */}
        <div>
          <label className="text-[11px] font-semibold text-slate-400 mb-1 flex items-center gap-1">
            <HardDrive className="w-3.5 h-3.5 text-indigo-400" />
            Storage SSD
          </label>
          <select
            value={query.minStorageGb || 512}
            onChange={(e) =>
              setQuery((prev) => ({ ...prev, minStorageGb: Number(e.target.value) }))
            }
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
          >
            <option value={512}>512 GB SSD</option>
            <option value={1000}>1 TB SSD</option>
          </select>
        </div>
      </div>

      {/* URL Scan Bar */}
      <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row items-center gap-2">
        <div className="relative flex-1 w-full">
          <LinkIcon className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Or paste Amazon / Flipkart laptop URL (e.g., https://amazon.in/dp/B0GTZJVD3Y)"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <button
          onClick={onScanUrl}
          disabled={isLoading || !customUrl.trim()}
          className="w-full sm:w-auto px-4 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white transition-all shrink-0"
        >
          {isLoading ? 'Scanning...' : 'Scan Product URL'}
        </button>
        <button
          onClick={onSearch}
          disabled={isLoading}
          className="w-full sm:w-auto px-5 py-2 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/30 shrink-0"
        >
          {isLoading ? 'Hunting Deals...' : 'Hunt All Stores'}
        </button>
      </div>
    </div>
  );
};
