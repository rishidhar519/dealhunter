'use client';

import React, { useState, useEffect } from 'react';
import { Lock, ShieldCheck, Save, ExternalLink, RefreshCw, Key, CheckCircle, AlertCircle, Link2, Eye } from 'lucide-react';
import { StoreAffiliateRule } from '@/lib/affiliate-config';
import { Platform } from '@/types/deal';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [token, setToken] = useState<string>('');
  const [rules, setRules] = useState<Record<Platform, StoreAffiliateRule> | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  useEffect(() => {
    const savedToken = localStorage.getItem('dealhunter_admin_token');
    if (savedToken) {
      setToken(savedToken);
      fetchRules(savedToken);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (res.ok && data.token) {
        setToken(data.token);
        localStorage.setItem('dealhunter_admin_token', data.token);
        setIsAuthenticated(true);
        fetchRules(data.token);
      } else {
        setErrorMsg(data.error || 'Authentication failed. Please check password.');
      }
    } catch {
      setErrorMsg('Failed to connect to authentication service.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRules = async (authToken: string) => {
    try {
      const res = await fetch('/api/admin/affiliate', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setRules(data.rules);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        localStorage.removeItem('dealhunter_admin_token');
      }
    } catch {
      setIsAuthenticated(false);
    }
  };

  const handleRuleChange = (
    platform: Platform,
    field: keyof StoreAffiliateRule,
    value: any
  ) => {
    if (!rules) return;
    setRules({
      ...rules,
      [platform]: {
        ...rules[platform],
        [field]: value,
      },
    });
    setSaveSuccess(false);
  };

  const handleSaveAll = async () => {
    if (!rules) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/affiliate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rules }),
      });

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      }
    } catch (err) {
      console.error('Failed to save rules:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setToken('');
    localStorage.removeItem('dealhunter_admin_token');
  };

  // Preview generator for test link
  const generatePreviewUrl = (rule: StoreAffiliateRule) => {
    const sampleBase = `https://www.${rule.platform === 'amazon' ? 'amazon.in' : rule.platform === 'flipkart' ? 'flipkart.com' : rule.platform + '.com'}/sample-product`;
    if (!rule.enabled || !rule.paramName || !rule.paramValue) return sampleBase;
    return `${sampleBase}?${rule.paramName}=${encodeURIComponent(rule.paramValue)}`;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 bg-indigo-600/20 text-indigo-400 rounded-2xl border border-indigo-500/30">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-black text-white">DealHunter Admin Portal</h1>
            <p className="text-xs text-slate-400">
              Direct access restricted. Please authenticate to manage store affiliate parameters.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-amber-400" />
                Admin Access Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !password.trim()}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
            >
              {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
              {isLoading ? 'Authenticating...' : 'Access Portal'}
            </button>
          </form>

          <div className="text-center text-[11px] text-slate-500">
            Protected with anti-bot sliding-window rate limiting.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Admin Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-600/30">
              <Link2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-base text-white">Affiliate Parameters Management</h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Live Session
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Manage tags & tracking strings across all 13 supported stores</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveAll}
              disabled={isLoading}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white transition-all shadow-md shadow-emerald-600/30 flex items-center gap-1.5"
            >
              {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              Save All Rules
            </button>
            <button
              onClick={handleLogout}
              className="px-3 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {saveSuccess && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-300 text-xs font-bold flex items-center gap-2 shadow-lg">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>All affiliate rules saved! Live product links across DealHunter now include these updated parameters.</span>
          </div>
        )}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-2">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            Configuring Store Affiliate & Partner Tracking
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            When a user clicks &quot;View on Retailer&quot;, DealHunter automatically appends these parameter names and values to the outbound URLs. You can enable/disable tracking per retailer, update affiliate IDs, or add wrapper redirection prefixes.
          </p>
        </div>

        {/* Store Grid */}
        {rules && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(Object.keys(rules) as Platform[]).map((platform) => {
              const rule = rules[platform];
              return (
                <div
                  key={platform}
                  className={`bg-slate-900/80 border rounded-2xl p-5 shadow-lg space-y-4 transition-all ${
                    rule.enabled ? 'border-slate-800 hover:border-slate-700' : 'border-slate-800/40 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                        {rule.displayName}
                        <span className="text-[10px] font-mono text-slate-500 uppercase">({platform})</span>
                      </h3>
                      <p className="text-[11px] text-slate-400">{rule.notes}</p>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rule.enabled}
                        onChange={(e) => handleRuleChange(platform, 'enabled', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                        URL Param Name
                      </label>
                      <input
                        type="text"
                        value={rule.paramName}
                        onChange={(e) => handleRuleChange(platform, 'paramName', e.target.value)}
                        placeholder="e.g. tag, affid, ref"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                        Affiliate / Tracking Value
                      </label>
                      <input
                        type="text"
                        value={rule.paramValue}
                        onChange={(e) => handleRuleChange(platform, 'paramValue', e.target.value)}
                        placeholder="e.g. your-tag-21"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Test preview */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                    <div className="text-slate-400 flex items-center gap-1.5 truncate max-w-xs">
                      <Eye className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span className="font-mono truncate">{generatePreviewUrl(rule)}</span>
                    </div>
                    <a
                      href={generatePreviewUrl(rule)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-indigo-300 font-semibold flex items-center gap-1 shrink-0"
                    >
                      Test Link <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
