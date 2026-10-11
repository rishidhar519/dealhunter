'use client';

import React, { useState } from 'react';
import { ExternalLink, Tag, ChevronDown, ChevronUp, Cpu, HardDrive, Monitor, ShieldAlert, Sparkles, Check, Smartphone, Headphones, Tv } from 'lucide-react';
import { CalculatedDeal, Platform } from '@/types/deal';
import { buildLiveAffiliateLink } from '@/lib/affiliate-config';

interface DealCardProps {
  deal: CalculatedDeal;
  rankIndex: number;
}

const PLATFORM_STYLES: Record<Platform, { name: string; bg: string; text: string; border: string }> = {
  amazon: { name: 'Amazon India', bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
  flipkart: { name: 'Flipkart', bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
  croma: { name: 'Croma', bg: 'bg-teal-500/10', text: 'text-teal-400', border: 'border-teal-500/30' },
  reliancedigital: { name: 'Reliance Digital', bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30' },
  vijaysales: { name: 'Vijay Sales', bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30' },
  dell: { name: 'Dell Store', bg: 'bg-blue-600/10', text: 'text-blue-400', border: 'border-blue-600/30' },
  hp: { name: 'HP Store', bg: 'bg-sky-500/10', text: 'text-sky-400', border: 'border-sky-500/30' },
  lenovo: { name: 'Lenovo Store', bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/30' },
  acer: { name: 'Acer Store', bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  asus: { name: 'ASUS eShop', bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30' },
  samsung: { name: 'Samsung Shop', bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/30' },
  apple: { name: 'Apple Store', bg: 'bg-slate-400/10', text: 'text-slate-300', border: 'border-slate-400/30' },
  tatacliq: { name: 'TataCliq', bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/30' },
};

export const DealCard: React.FC<DealCardProps> = ({ deal, rankIndex }) => {
  const [showAllOffers, setShowAllOffers] = useState(false);
  const { product, effectivePrice, appliedOffer, savingsPercentage } = deal;
  const platformStyle = PLATFORM_STYLES[product.platform] || PLATFORM_STYLES.amazon;

  // Build live affiliate outbound link
  const outboundAffiliateLink = buildLiveAffiliateLink(product.url, product.platform);

  // Check category and spec attributes safely
  const isLaptop = !product.category || product.category === 'laptops';
  const isSmartphone = product.category === 'smartphones';
  const isAudio = product.category === 'audio';
  const isTv = product.category === 'smart-tvs';
  const specs: any = product.specs;

  const isLowVram = isLaptop && typeof specs.vramGb === 'number' && specs.vramGb > 0 && specs.vramGb < 6;

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
              Part / Model: {product.modelNumber}
            </span>
          )}
        </div>

        {/* Spec Pills (Flexible by Category) */}
        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
          {isLaptop && (
            <>
              <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span className="truncate">{specs.cpu?.split('(')[0] || 'High Performance CPU'}</span>
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
                  {specs.gpu || 'Graphics'} {isLowVram ? '(4GB Warning)' : ''}
                </span>
              </div>

              <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80 flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>{specs.ramGb || 16}GB RAM • {specs.storageGb || 512}GB SSD</span>
              </div>

              <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80 flex items-center gap-1.5">
                <Monitor className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>{specs.refreshRateHz || 144}Hz Display</span>
              </div>
            </>
          )}

          {isSmartphone && (
            <>
              <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span className="truncate">{specs.screen || 'OLED Display'}</span>
              </div>
              <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span className="truncate">{specs.chip || 'Flagship SoC'}</span>
              </div>
              <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80 flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>{specs.ramGb || 8}GB RAM • {specs.storageGb || 128}GB Storage</span>
              </div>
              <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span className="truncate">{specs.camera || 'Advanced Camera System'}</span>
              </div>
            </>
          )}

          {isAudio && (
            <>
              <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80 flex items-center gap-1.5">
                <Headphones className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span className="truncate">{specs.driver || 'Hi-Res Audio Driver'}</span>
              </div>
              <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span className="truncate">{specs.noiseCancelling || 'Active Noise Cancellation'}</span>
              </div>
              <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>{specs.batteryHours ? `${specs.batteryHours}h Battery Life` : 'All-Day Battery'}</span>
              </div>
              <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80 flex items-center gap-1.5">
                <Monitor className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>{specs.weightGrams ? `${specs.weightGrams}g Ultra-light` : 'Lightweight'}</span>
              </div>
            </>
          )}

          {isTv && (
            <>
              <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80 flex items-center gap-1.5">
                <Tv className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span className="truncate">{specs.panel || '4K Ultra HD Display'}</span>
              </div>
              <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span className="truncate">{specs.processor || 'Cognitive / AI Processor'}</span>
              </div>
              <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80 flex items-center gap-1.5">
                <Monitor className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>{specs.refreshRateHz || 60}Hz • Dolby Vision / Atmos</span>
              </div>
              <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>{specs.os || 'Google TV / Smart OS'}</span>
              </div>
            </>
          )}
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
              Base price shown (select a card in your wallet above to unlock instant card discounts).
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

      {/* Action Footer with Live Affiliate Outbound Link */}
      <div className="p-4 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between gap-3">
        <div className="text-[11px] text-slate-400">
          Rating: <strong className="text-white">★ {product.rating}</strong> ({product.ratingCount})
        </div>
        <a
          href={outboundAffiliateLink}
          target="_blank"
          rel="sponsored nofollow noopener noreferrer"
          className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/30"
          title={`Opens ${platformStyle.name} store`}
        >
          View on {platformStyle.name}
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
