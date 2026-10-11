import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldAlert, Scale, AlertTriangle, Cpu, Ban } from 'lucide-react';

export const metadata = {
  title: 'Terms of Use | DealHunter',
  description: 'Terms of Use, anti-scraping policy, and automated access conditions for DealHunter.',
};

export default function TermsOfUsePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 py-12 px-4 sm:px-6 lg:px-8 selection:bg-indigo-500 selection:text-white">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Back navigation */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to DealHunter
          </Link>
        </div>

        {/* Header */}
        <div className="border-b border-slate-800 pb-6 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-400">
            <Scale className="w-3.5 h-3.5" />
            Legal Agreement &amp; Acceptable Use
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Terms of Use
          </h1>
          <p className="text-xs text-slate-400">
            Last updated: October 11, 2026 • Effective immediately
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8 text-sm text-slate-300 leading-relaxed">
          {/* Section 1 */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Scale className="w-5 h-5 text-indigo-400" />
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using DealHunter (&quot;we&quot;, &quot;our&quot;, or &quot;the Service&quot;), you agree to comply with and be bound by these Terms of Use. If you do not agree with any part of these terms, you must discontinue using DealHunter immediately.
            </p>
          </section>

          {/* Section 2 - Anti-Scraping & Anti-Bot Protection */}
          <section className="bg-rose-950/20 border border-rose-800/40 rounded-2xl p-6 space-y-3">
            <h2 className="text-lg font-bold text-rose-300 flex items-center gap-2">
              <Ban className="w-5 h-5 text-rose-400" />
              2. Strict Anti-Scraping and Anti-Automation Policy
            </h2>
            <p className="text-rose-200">
              DealHunter provides curated intelligence and AI-computed discount evaluations for bona fide human consumers. Automated access is strictly restricted.
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-rose-300/90">
              <li>
                <strong>Automated Extraction Prohibited:</strong> You shall not use web crawlers, scrapers, data miners, headless browsers, or any automated scripts to harvest product data, deal indexes, or API outputs from DealHunter without prior express written permission.
              </li>
              <li>
                <strong>API Misuse:</strong> Sending bulk, non-human, or abusive requests to internal endpoints (including <code className="bg-slate-950 px-1 py-0.5 rounded text-white">/api/hunt</code> and <code className="bg-slate-950 px-1 py-0.5 rounded text-white">/api/parse-requirements</code>) is strictly prohibited.
              </li>
              <li>
                <strong>Technical Protections:</strong> We enforce automated IP rate-limiting, challenge mechanisms, and robots.txt rules. Bypassing or circumventing these measures constitutes a direct breach of these Terms and may trigger IP bans and legal action.
              </li>
            </ul>
          </section>

          {/* Section 3 - Real-time Price Fluctuations */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              3. Pricing, Bank Offers &amp; Availability Disclaimer
            </h2>
            <p>
              Prices, bank discounts, instant cashback offers, coupon codes, and inventory levels are controlled exclusively by the underlying merchants (Amazon India, Flipkart, Croma, Reliance Digital, Vijay Sales, Lenovo, Dell, HP, Acer, ASUS, Samsung, and Apple).
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
              <li>
                DealHunter calculates effective savings based on publicly published merchant promotional carousels and card rules.
              </li>
              <li>
                Merchants may alter, cap, or terminate bank offers and listed prices at any time without prior notice.
              </li>
              <li>
                <strong>The final transaction price displayed at the merchant&apos;s checkout page is the binding price.</strong> DealHunter does not guarantee that any deal or offer will remain valid at the time of your visit.
              </li>
            </ul>
          </section>

          {/* Section 4 - External Links & Affiliate Relationships */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-indigo-400" />
              4. External Links &amp; Third-Party Stores
            </h2>
            <p>
              DealHunter contains links leading to third-party commercial storefronts. We do not sell products directly and do not hold inventory. All transactions, warranties, returns, and customer service inquiries are solely the responsibility of the respective retailer where the purchase occurs.
            </p>
          </section>

          {/* Section 5 - Limitation of Liability & Jurisdiction */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-indigo-400" />
              5. Limitation of Liability &amp; Governing Law
            </h2>
            <p>
              DealHunter is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis without warranties of any kind. Under no circumstances shall DealHunter or its operators be liable for indirect, punitive, or consequential damages resulting from price differences, expired offers, or hardware performance.
            </p>
            <p>
              These Terms are governed by and construed in accordance with the laws of India. Any disputes arising hereunder shall be subject to the exclusive jurisdiction of the courts located in Bengaluru, Karnataka, India.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-800 pt-6 text-center text-xs text-slate-500">
          <p>© 2026 DealHunter. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
