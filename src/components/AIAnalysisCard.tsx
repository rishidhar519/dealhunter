'use client';

import React from 'react';
import { Sparkles, Trophy, Rocket, DollarSign, AlertTriangle, ShieldCheck, ArrowRight } from 'lucide-react';
import { AIAnalysisSummary } from '@/types/deal';

interface AIAnalysisCardProps {
  analysis: AIAnalysisSummary;
  selectedBank: string;
}

export const AIAnalysisCard: React.FC<AIAnalysisCardProps> = ({ analysis, selectedBank }) => {
  return (
    <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-indigo-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden space-y-6">
      {/* Decorative gradient glow */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              AI Deal Intelligence & Verdict
            </h2>
            <p className="text-xs text-slate-400">
              Evaluated using {analysis.usedAiModel === 'gemini-2.5-flash' ? 'Google Gemini 2.5 Flash' : 'Hardware Benchmark AI Engine'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-medium">
            Active Payment: <strong className="text-white">{selectedBank}</strong>
          </span>
        </div>
      </div>

      {/* Editorial Verdict Box */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4">
        <h4 className="text-xs font-semibold text-amber-400 mb-1 flex items-center gap-1.5">
          <Trophy className="w-4 h-4 text-amber-400" />
          The Bottom Line:
        </h4>
        <p className="text-sm text-slate-200 leading-relaxed font-medium">
          {analysis.editorialVerdict}
        </p>
      </div>

      {/* 3 Featured Tiers: Direct Match, Upgrade, Budget Champion */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Best Direct Match */}
        {analysis.bestDirectMatch && (
          <div className="bg-slate-900/90 border border-emerald-500/30 rounded-xl p-4 flex flex-col justify-between relative group hover:border-emerald-500/60 transition-all">
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 inline-flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Best Direct Match
              </span>
              <h4 className="text-xs font-bold text-white line-clamp-2">
                {analysis.bestDirectMatch.product.title}
              </h4>
              <div className="text-[11px] text-slate-400">
                Platform: <span className="text-white capitalize font-medium">{analysis.bestDirectMatch.product.platform}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800">
              <div className="text-[10px] text-slate-400">Effective Net Price</div>
              <div className="text-lg font-extrabold text-emerald-400">
                ₹{analysis.bestDirectMatch.effectivePrice.toLocaleString('en-IN')}
              </div>
              <div className="text-[10px] text-slate-400 line-through">
                M.R.P. ₹{analysis.bestDirectMatch.product.mrp.toLocaleString('en-IN')}
              </div>
              {analysis.bestDirectMatch.appliedOffer && (
                <div className="text-[10px] text-emerald-300 font-medium mt-1">
                  Includes {analysis.bestDirectMatch.appliedOffer.bank} Card discount (-₹{analysis.bestDirectMatch.appliedOffer.discountAmount.toLocaleString('en-IN')})
                </div>
              )}
            </div>
          </div>
        )}

        {/* Best Value Upgrade */}
        {analysis.bestValueUpgrade && (
          <div className="bg-slate-900/90 border border-indigo-500/40 rounded-xl p-4 flex flex-col justify-between relative group hover:border-indigo-500/70 transition-all shadow-lg shadow-indigo-500/10">
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 inline-flex items-center gap-1">
                <Rocket className="w-3 h-3" /> Superior Spec Upgrade
              </span>
              <h4 className="text-xs font-bold text-white line-clamp-2">
                {analysis.bestValueUpgrade.product.title}
              </h4>
              <div className="text-[11px] text-indigo-300 font-medium">
                RTX 4050 6GB (+35% Gaming FPS & DLSS 3)
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800">
              <div className="text-[10px] text-slate-400">Effective Net Price</div>
              <div className="text-lg font-extrabold text-indigo-400">
                ₹{analysis.bestValueUpgrade.effectivePrice.toLocaleString('en-IN')}
              </div>
              <div className="text-[10px] text-slate-400 line-through">
                M.R.P. ₹{analysis.bestValueUpgrade.product.mrp.toLocaleString('en-IN')}
              </div>
              <div className="text-[10px] text-indigo-300 font-medium mt-1">
                Costs less than the 3050 model with festive offers!
              </div>
            </div>
          </div>
        )}

        {/* Budget Champion */}
        {analysis.budgetChampion && (
          <div className="bg-slate-900/90 border border-amber-500/30 rounded-xl p-4 flex flex-col justify-between relative group hover:border-amber-500/60 transition-all">
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 inline-flex items-center gap-1">
                <DollarSign className="w-3 h-3" /> Budget Champion
              </span>
              <h4 className="text-xs font-bold text-white line-clamp-2">
                {analysis.budgetChampion.product.title}
              </h4>
              <div className="text-[11px] text-slate-400">
                Platform: <span className="text-white capitalize font-medium">{analysis.budgetChampion.product.platform}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800">
              <div className="text-[10px] text-slate-400">Effective Net Price</div>
              <div className="text-lg font-extrabold text-amber-400">
                ₹{analysis.budgetChampion.effectivePrice.toLocaleString('en-IN')}
              </div>
              <div className="text-[10px] text-slate-400 line-through">
                M.R.P. ₹{analysis.budgetChampion.product.mrp.toLocaleString('en-IN')}
              </div>
              <div className="text-[10px] text-amber-300 font-medium mt-1">
                Saves ₹13,000+ for equivalent gaming tier
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hardware & Hidden Savings Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-2">
          <h4 className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            Hardware & VRAM Nuances to Know
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-400">
            {analysis.specComparisonHighlights.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-indigo-400 font-bold">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-2">
          <h4 className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Hidden Card & Fine-Print Savings
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-400">
            {analysis.hiddenSavingsNotes.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
