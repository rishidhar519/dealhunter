'use client';

import React, { useState } from 'react';
import { Sparkles, Sliders, Cpu, Monitor, CheckCircle, ArrowRight, RefreshCw, X, Plus } from 'lucide-react';
import { ParsedRequirementJSON, PriorityLevel } from '@/types/requirements';

interface RequirementNegotiatorProps {
  onConfirmRequirements: (req: ParsedRequirementJSON) => void;
  isLoading: boolean;
}

const PRESET_PROMPTS = [
  'Lenovo LOQ Ryzen 7 7735HS with RTX 3050 6GB and 16GB RAM',
  'Gaming laptop under 85,000 with minimum 6GB VRAM, brand agnostic',
  'Best value laptop under 70k with dedicated graphics for casual gaming',
  'Flagship smartphone with high-end camera under 75,000',
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
          // Initialize enabled flags
          const req: ParsedRequirementJSON = {
            ...data.requirement,
            gpu: { ...data.requirement.gpu, enabled: true },
            ramGb: { ...data.requirement.ramGb, enabled: true },
            budgetMax: { ...data.requirement.budgetMax, enabled: true },
            brandPreference: { ...data.requirement.brandPreference, enabled: true },
          };
          setParsedReq(req);
        }
      }
    } catch (err) {
      console.error('Error parsing requirement:', err);
    } finally {
      setIsParsing(false);
    }
  };

  const getPriorityBadge = (priority: PriorityLevel, isEnabled: boolean = true) => {
    if (!isEnabled) {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
          FILTER IGNORED
        </span>
      );
    }
    switch (priority) {
      case 'critical':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
            CRITICAL DEALBREAKER
          </span>
        );
      case 'high':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            MUST-HAVE
          </span>
        );
      case 'medium':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            FLEXIBLE
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-400">
            OPTIONAL
          </span>
        );
    }
  };

  const toggleGpuFilter = () => {
    if (!parsedReq) return;
    const isCurrentlyEnabled = parsedReq.gpu.enabled !== false;
    setParsedReq({
      ...parsedReq,
      gpu: {
        ...parsedReq.gpu,
        enabled: !isCurrentlyEnabled,
        value: {
          ...parsedReq.gpu.value,
          minVramGb: !isCurrentlyEnabled ? 6 : 0,
        },
      },
    });
  };

  const toggleRamFilter = () => {
    if (!parsedReq) return;
    const isCurrentlyEnabled = parsedReq.ramGb.enabled !== false;
    setParsedReq({
      ...parsedReq,
      ramGb: {
        ...parsedReq.ramGb,
        enabled: !isCurrentlyEnabled,
        value: !isCurrentlyEnabled ? 16 : 0,
      },
    });
  };

  const toggleBudgetFilter = () => {
    if (!parsedReq) return;
    const isCurrentlyEnabled = parsedReq.budgetMax.enabled !== false;
    setParsedReq({
      ...parsedReq,
      budgetMax: {
        ...parsedReq.budgetMax,
        enabled: !isCurrentlyEnabled,
      },
    });
  };

  const toggleBrandFilter = () => {
    if (!parsedReq) return;
    const isCurrentlyEnabled = parsedReq.brandPreference.enabled !== false;
    setParsedReq({
      ...parsedReq,
      brandPreference: {
        ...parsedReq.brandPreference,
        enabled: !isCurrentlyEnabled,
        value: !isCurrentlyEnabled ? 'any' : 'any',
      },
    });
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
          Describe your requirements, constraints, or budget in natural language. Gemini AI converts it into prioritized parameters that you can customize or ignore.
        </p>
      </div>

      {/* Input Box */}
      <div className="space-y-2">
        <div className="relative">
          <textarea
            rows={2}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. I need a gaming laptop under 85,000. Must have at least 6GB VRAM, 16GB RAM, for AAA titles. I don't care about brand."
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
                What We Understood (Confirm, Fine-Tune, or Ignore Parameters)
              </h3>
            </div>
            <span className="text-[11px] text-slate-400 max-w-xl truncate">
              {parsedReq.userIntentSummary}
            </span>
          </div>

          {/* Dynamic Filter Controls with Ignore/Remove Support */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* 1. GPU & VRAM */}
            <div
              className={`p-3 rounded-xl border transition-all space-y-2 ${
                parsedReq.gpu.enabled !== false
                  ? 'bg-slate-900/90 border-slate-800'
                  : 'bg-slate-950/60 border-slate-800/50 border-dashed opacity-60'
              }`}
            >
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-white flex items-center gap-1.5">
                  <Monitor className="w-3.5 h-3.5 text-indigo-400" />
                  Min VRAM
                </label>
                <div className="flex items-center gap-1.5">
                  {getPriorityBadge(parsedReq.gpu.priority, parsedReq.gpu.enabled !== false)}
                  <button
                    onClick={toggleGpuFilter}
                    title={parsedReq.gpu.enabled !== false ? 'Ignore this filter' : 'Enable filter'}
                    className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors text-[10px]"
                  >
                    {parsedReq.gpu.enabled !== false ? <X className="w-3.5 h-3.5 text-rose-400" /> : <Plus className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                </div>
              </div>

              {parsedReq.gpu.enabled !== false ? (
                <select
                  value={parsedReq.gpu.value.minVramGb}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setParsedReq({
                      ...parsedReq,
                      gpu: {
                        ...parsedReq.gpu,
                        enabled: val > 0,
                        value: { ...parsedReq.gpu.value, minVramGb: val },
                      },
                    });
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value={6}>6 GB VRAM (Recommended for AAA)</option>
                  <option value={8}>8 GB VRAM (High-End)</option>
                  <option value={4}>4 GB VRAM (Budget Casual)</option>
                  <option value={0}>🚫 Any VRAM / No Minimum (Ignore)</option>
                </select>
              ) : (
                <div className="flex items-center justify-between text-[11px] text-slate-500 py-1">
                  <span>Any VRAM accepted</span>
                  <button
                    onClick={toggleGpuFilter}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                  >
                    + Enable
                  </button>
                </div>
              )}
            </div>

            {/* 2. Min RAM */}
            <div
              className={`p-3 rounded-xl border transition-all space-y-2 ${
                parsedReq.ramGb.enabled !== false
                  ? 'bg-slate-900/90 border-slate-800'
                  : 'bg-slate-950/60 border-slate-800/50 border-dashed opacity-60'
              }`}
            >
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-white flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                  Min RAM
                </label>
                <div className="flex items-center gap-1.5">
                  {getPriorityBadge(parsedReq.ramGb.priority, parsedReq.ramGb.enabled !== false)}
                  <button
                    onClick={toggleRamFilter}
                    title={parsedReq.ramGb.enabled !== false ? 'Ignore this filter' : 'Enable filter'}
                    className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors text-[10px]"
                  >
                    {parsedReq.ramGb.enabled !== false ? <X className="w-3.5 h-3.5 text-rose-400" /> : <Plus className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                </div>
              </div>

              {parsedReq.ramGb.enabled !== false ? (
                <select
                  value={parsedReq.ramGb.value}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setParsedReq({
                      ...parsedReq,
                      ramGb: {
                        ...parsedReq.ramGb,
                        enabled: val > 0,
                        value: val,
                      },
                    });
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value={16}>16 GB RAM (Standard)</option>
                  <option value={32}>32 GB RAM (Heavy Workload)</option>
                  <option value={24}>24 GB RAM</option>
                  <option value={8}>8 GB RAM (Basic)</option>
                  <option value={0}>🚫 Any RAM / No Minimum (Ignore)</option>
                </select>
              ) : (
                <div className="flex items-center justify-between text-[11px] text-slate-500 py-1">
                  <span>Any RAM accepted</span>
                  <button
                    onClick={toggleRamFilter}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                  >
                    + Enable
                  </button>
                </div>
              )}
            </div>

            {/* 3. Budget Ceiling */}
            <div
              className={`p-3 rounded-xl border transition-all space-y-2 ${
                parsedReq.budgetMax.enabled !== false
                  ? 'bg-slate-900/90 border-slate-800'
                  : 'bg-slate-950/60 border-slate-800/50 border-dashed opacity-60'
              }`}
            >
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-white flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                  Budget Ceiling
                </label>
                <div className="flex items-center gap-1.5">
                  {getPriorityBadge(parsedReq.budgetMax.priority, parsedReq.budgetMax.enabled !== false)}
                  <button
                    onClick={toggleBudgetFilter}
                    title={parsedReq.budgetMax.enabled !== false ? 'Ignore budget ceiling' : 'Set budget'}
                    className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors text-[10px]"
                  >
                    {parsedReq.budgetMax.enabled !== false ? <X className="w-3.5 h-3.5 text-rose-400" /> : <Plus className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                </div>
              </div>

              {parsedReq.budgetMax.enabled !== false ? (
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-slate-500">₹</span>
                    <input
                      type="number"
                      step="5000"
                      value={parsedReq.budgetMax.value || ''}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setParsedReq({
                          ...parsedReq,
                          budgetMax: {
                            ...parsedReq.budgetMax,
                            value: val,
                            enabled: val > 0,
                          },
                        });
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>
                  <button
                    onClick={toggleBudgetFilter}
                    className="text-[10px] text-slate-500 hover:text-rose-400 transition-colors"
                  >
                    Remove budget limit
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between text-[11px] text-slate-500 py-1">
                  <span>No budget ceiling</span>
                  <button
                    onClick={toggleBudgetFilter}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                  >
                    + Set Limit
                  </button>
                </div>
              )}
            </div>

            {/* 4. Brand Preference */}
            <div
              className={`p-3 rounded-xl border transition-all space-y-2 ${
                parsedReq.brandPreference.enabled !== false && parsedReq.brandPreference.value !== 'any'
                  ? 'bg-slate-900/90 border-slate-800'
                  : 'bg-slate-900/50 border-slate-800/70'
              }`}
            >
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-white">Brand Preference</label>
                <div className="flex items-center gap-1.5">
                  {getPriorityBadge(parsedReq.brandPreference.priority, parsedReq.brandPreference.enabled !== false)}
                  {parsedReq.brandPreference.value !== 'any' && (
                    <button
                      onClick={() =>
                        setParsedReq({
                          ...parsedReq,
                          brandPreference: {
                            ...parsedReq.brandPreference,
                            value: 'any',
                            enabled: true,
                          },
                        })
                      }
                      title="Reset to all brands"
                      className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                    >
                      <X className="w-3.5 h-3.5 text-rose-400" />
                    </button>
                  )}
                </div>
              </div>

              <select
                value={parsedReq.brandPreference.value || 'any'}
                onChange={(e) =>
                  setParsedReq({
                    ...parsedReq,
                    brandPreference: {
                      ...parsedReq.brandPreference,
                      value: e.target.value,
                      enabled: e.target.value !== 'any',
                    },
                  })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="any">🌟 Any Brand / Ignore (Maximum Savings)</option>
                <option value="Lenovo">Lenovo Only</option>
                <option value="Dell">Dell Only</option>
                <option value="HP">HP Only</option>
                <option value="Acer">Acer Only</option>
                <option value="ASUS">ASUS Only</option>
                <option value="Apple">Apple Only</option>
                <option value="Samsung">Samsung Only</option>
              </select>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-900">
            <span className="text-[11px] text-slate-400">
              Ready to hunt across Amazon, Flipkart, Croma, Reliance Digital, Vijay Sales &amp; Official Stores.
            </span>
            <button
              onClick={() => onConfirmRequirements(parsedReq)}
              disabled={isLoading}
              className="px-6 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              {isLoading ? 'Scanning 13 Stores...' : 'Confirm & Hunt Deals across 13 Stores'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
