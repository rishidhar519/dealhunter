'use client';

import React, { useState } from 'react';
import { ExternalLink, Tag, ChevronDown, ChevronUp, Cpu, HardDrive, Monitor, ShieldAlert, Sparkles, Check } from 'lucide-react';
import { CalculatedDeal, Platform } from '@/types/deal';

interface DealCardProps {
  deal: CalculatedDeal;
  rankIndex: number;
}

const PLATFORM_STYLES: Record<Platform, { name: string; bg: string; text: string; border: string }> = {
  amazon: { name: 'Amazon India', bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
  flipkart: { name: 'Flipkart', bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
  tatacliq: { name: 'TataCliq', bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/30' },
  croma: { name: 'Croma', bg: 'bg-teal-500/10', text: 'text-teal-400', border: 'border-teal-500/30' },
  lenovo: { name: 'Lenovo Store', bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/30' },
};

export const DealCard: React.FC<DealCardProps> = ({ deal, rankIndex }) => {
  const [showAllOffers, setShowAllOffers] = useState(false);
  const { product, effectivePrice, appliedOffer, savingsPercentage } = deal;
  const platformStyle = PLATFORM_STYLES[product.platform] || PLATFORM_STYLES.amazon;

  const isLowVram = product.specs.vramGb < 6;

  return (
    <div
      className={`bg-slate-900/70 border rounded-2xl overflow-hidden transition-all hover:border-slate-700 flex flex-col justify-between shadow-lg relative ${
        product.dealBadge
          ? 'border-indigo-500/40 ring-1 ring-indigo-500/20'
          : 'border-slate-800'
      }`}
    >
      {/* Top badges */}
      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${platformStyle.bg} ${platformStyle.text} ${platformStyle.border}`}
            >
              {platformStyle.name}
            </span>
            <span className="text-xs text-slate-400 font-medium">#{rankIndex + 1} Best Deal</span>
          </div>

          {product.dealBadge && (
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-indigo-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              {product.dealBadge}
            </span>
          )}
        </div>

        {/* Title */}
        <div>
          <h3 className="text-sm font-bold text-white line-clamp-2 leading-snug hover:text-indigo-300 transition-colors">
            {product.title}
          </h3>
          {product.modelNumber && (
            <span className="text-[11px] font-mono text-slate-500">
              Part No: {product.modelNumber}
            </span>
          )}
        </div>

        {/* Spec Pills */}
        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
          <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="truncate">{product.specs.cpu.split('(')[0]}</span>
          </div>

          <div
            className={`p-2 rounded-lg border flex items-center gap-1.5 ${
              isLowVram
                ? 'bg-rose-950/30 border-rose-800/50 text-rose-300'
                : 'bg-slate-950/60 border-slate-800/80 text-slate-300'
            }`}
          >
            <Monitor className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="truncate">
              {product.specs.gpu} {isLowVram ? '(4GB Warning)' : ''}
            </span>
          </div>

          <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80 flex items-center gap-1.5">
            <HardDrive className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>{product.specs.ramGb}GB RAM • {product.specs.storageGb}GB SSD</span>
          </div>

          <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80 flex items-center gap-1.5">
            <Monitor className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>{product.specs.refreshRateHz}Hz FHD Display</span>
          </div>
        </div>

        {isLowVram && (
          <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
            <span>Caution: Only 4GB VRAM. 6GB is recommended for modern gaming textures.</span>
          </div>
        )}

        {/* Pricing Box */}
        <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-baseline justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                Effective Net Price
              </span>
              <div className="text-2xl font-black text-white flex items-center gap-2">
                <span>₹{effectivePrice.toLocaleString('en-IN')}</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {savingsPercentage}% OFF
                </span>
              </div>
            </div>

            <div className="text-right text-xs">
              <div className="text-slate-500 line-through">
                M.R.P. ₹{product.mrp.toLocaleString('en-IN')}
              </div>
              <div className="text-slate-400 text-[11px]">
                Listed: ₹{product.basePrice.toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          {/* Applied offer tag */}
          {appliedOffer ? (
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-start gap-1.5">
              <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong>{appliedOffer.bank} Card Applied:</strong> Saves ₹{appliedOffer.discountAmount.toLocaleString('en-IN')}
                <p className="text-[10px] text-emerald-400/80 mt-0.5">{appliedOffer.description}</p>
              </div>
            </div>
          ) : (
            <div className="text-[11px] text-slate-400 italic">
              Base price shown (select a card above to unlock up to ₹26,250 instant discount).
            </div>
          )}
        </div>

        {/* Toggle all offers */}
        <div>
          <button
            onClick={() => setShowAllOffers(!showAllOffers)}
            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
          >
            <Tag className="w-3.5 h-3.5" />
            {showAllOffers ? 'Hide all card & EMI offers' : `View all ${product.offers.length} available offers & EMI`}
            {showAllOffers ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showAllOffers && (
            <div className="mt-2 space-y-1.5 text-xs text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800/80">
              {product.offers.map((offer) => (
                <div key={offer.id} className="flex items-start gap-2 py-1 border-b border-slate-900 last:border-0">
                  <span className="font-semibold text-white px-1.5 py-0.5 rounded bg-slate-800 text-[10px] shrink-0">
                    {offer.bank}
                  </span>
                  <span className="text-[11px] text-slate-400 leading-tight">
                    {offer.description}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between gap-3">
        <div className="text-[11px] text-slate-400">
          Rating: <strong className="text-white">★ {product.rating}</strong> ({product.ratingCount})
        </div>
        <a
          href={product.url}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/30"
        >
          View on {platformStyle.name}
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
