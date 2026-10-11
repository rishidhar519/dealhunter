'use client';

import React, { useState } from 'react';
import { Sparkles, Sliders, ShieldAlert, Cpu, HardDrive, Monitor, CheckCircle, ArrowRight, RefreshCw, Send } from 'lucide-react';
import { ParsedRequirementJSON, PriorityLevel } from '@/types/requirements';

interface RequirementNegotiatorProps {
  onConfirmRequirements: (req: ParsedRequirementJSON) => void;
  isLoading: boolean;
}

const PRESET_PROMPTS = [
  'Lenovo LOQ Ryzen 7 7735HS with RTX 3050 6GB and 16GB RAM (Screenshot Spec)',
  'Gaming laptop under 85,000 with minimum 6GB VRAM, brand agnostic',
  'Laptop for heavy gaming and video editing with RTX 4050 6GB and 16GB RAM',
  'Best value laptop under 70k with dedicated graphics for casual gaming',
];

export const RequirementNegotiator: React.FC<RequirementNegotiatorProps> = ({
  onConfirmRequirements,
  isLoading,
}) => {
  const [prompt, setPrompt] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [parsedReq, setParsedReq] = useState<ParsedRequirementJSON | null>(null);

  const handleParsePrompt = async (inputPrompt?: string) => {
    const text = inputPrompt || prompt;
    if (!text.trim()) return;

    setIsParsing(true);
    try {
      const res = await fetch('/api/parse-requirements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: text }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.requirement) {
          setParsedReq(data.requirement);
        }
      }
    } catch (err) {
      console.error('Error parsing requirement:', err);
    } finally {
      setIsParsing(false);
    }
  };

  const getPriorityBadge = (priority: PriorityLevel) => {
    switch (priority) {
      case 'critical':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">CRITICAL DEALBREAKER</span>;
      case 'high':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">MUST-HAVE</span>;
      case 'medium':
        return <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">FLEXIBLE</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-400">OPTIONAL</span>;
    }
  };

  return (
    <div className="bg-slate-900/90 border border-indigo-500/30 rounded-2xl p-6 shadow-2xl space-y-6">
      {/* Step Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-indigo-600 text-white font-black text-xs">STEP 1</span>
          <h2 className="text-base font-extrabold text-white flex items-center gap-2">
            Tell DealHunter What You Need (Natural Language Intent)
          </h2>
        </div>
        <p className="text-xs text-slate-400">
          Describe your requirements, constraints, or paste a link. Gemini AI will convert it into a prioritized requirement schema for your confirmation.
        </p>
      </div>

      {/* Input Box */}
      <div className="space-y-2">
        <div className="relative">
          <textarea
            rows={2}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. I need a gaming laptop under 85,000. Must have at least 6GB VRAM, 16GB RAM, for AAA titles. I don't care about brand as long as thermals are good."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 pr-28 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 resize-none shadow-inner"
          />
          <button
            onClick={() => handleParsePrompt()}
            disabled={isParsing || !prompt.trim()}
            className="absolute right-3 top-3 px-4 py-2 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
          >
            {isParsing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            {isParsing ? 'Analyzing...' : 'Parse Intent'}
          </button>
        </div>

        {/* Preset suggestions */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] text-slate-500 font-semibold">Try examples:</span>
          {PRESET_PROMPTS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setPrompt(p);
                handleParsePrompt(p);
              }}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800/80 hover:border-slate-700 text-slate-400 hover:text-indigo-300 transition-all truncate max-w-xs"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Understood Requirements Negotiation Modal / Box */}
      {parsedReq && (
        <div className="bg-slate-950 border border-indigo-500/40 rounded-xl p-5 space-y-5 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 font-black text-xs">STEP 2</span>
              <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                What We Understood (Confirm or Fine-Tune Parameters)
              </h3>
            </div>
            <span className="text-[11px] text-slate-400">
              {parsedReq.userIntentSummary}
            </span>
          </div>

          {/* Dynamic Filter Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* GPU & VRAM */}
            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-white flex items-center gap-1">
                  <Monitor className="w-3.5 h-3.5 text-indigo-400" />
                  Min VRAM
                </label>
                {getPriorityBadge(parsedReq.gpu.priority)}
              </div>
              <select
                value={parsedReq.gpu.value.minVramGb}
                onChange={(e) =>
                  setParsedReq({
                    ...parsedReq,
                    gpu: {
                      ...parsedReq.gpu,
                      value: { ...parsedReq.gpu.value, minVramGb: Number(e.target.value) },
                    },
                  })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
              >
                <option value={4}>4 GB VRAM (Budget)</option>
                <option value={6}>6 GB VRAM (Recommended for AAA)</option>
                <option value={8}>8 GB VRAM (High-End)</option>
              </select>
            </div>

            {/* RAM */}
            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-white flex items-center gap-1">
                  <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                  Min RAM
                </label>
                {getPriorityBadge(parsedReq.ramGb.priority)}
              </div>
              <select
                value={parsedReq.ramGb.value}
                onChange={(e) =>
                  setParsedReq({
                    ...parsedReq,
                    ramGb: { ...parsedReq.ramGb, value: Number(e.target.value) },
                  })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
              >
                <option value={8}>8 GB RAM</option>
                <option value={16}>16 GB RAM (Standard)</option>
                <option value={24}>24 GB RAM</option>
                <option value={32}>32 GB RAM</option>
              </select>
            </div>

            {/* Max Budget */}
            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-white flex items-center gap-1">
                  <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                  Budget Ceiling
                </label>
                {getPriorityBadge(parsedReq.budgetMax.priority)}
              </div>
              <input
                type="number"
                step="5000"
                value={parsedReq.budgetMax.value}
                onChange={(e) =>
                  setParsedReq({
                    ...parsedReq,
                    budgetMax: { ...parsedReq.budgetMax, value: Number(e.target.value) },
                  })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
              />
            </div>

            {/* Brand Preference */}
            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-white">Brand</label>
                {getPriorityBadge(parsedReq.brandPreference.priority)}
              </div>
              <select
                value={parsedReq.brandPreference.value}
                onChange={(e) =>
                  setParsedReq({
                    ...parsedReq,
                    brandPreference: { ...parsedReq.brandPreference, value: e.target.value },
                  })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
              >
                <option value="any">🌟 Any Brand (Maximum Savings)</option>
                <option value="Lenovo">Lenovo Only</option>
                <option value="Acer">Acer Only</option>
                <option value="ASUS">ASUS Only</option>
                <option value="HP">HP Only</option>
              </select>
            </div>
          </div>

          {/* Confirmation button */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-slate-400">
              Ready to hunt across Amazon, Flipkart, Croma, Reliance Digital, Vijay Sales & Brand Stores.
            </span>
            <button
              onClick={() => onConfirmRequirements(parsedReq)}
              disabled={isLoading}
              className="px-6 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2"
            >
              {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              {isLoading ? 'Scanning 9 Stores...' : 'Confirm & Hunt Deals across 9 Stores'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
