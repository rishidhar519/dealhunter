import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Megaphone, DollarSign, ExternalLink, CheckCircle } from 'lucide-react';

export const metadata = {
  title: 'Affiliate Disclosure | DealHunter',
  description: 'Full affiliate transparency statement complying with Amazon Associates Operating Agreement and ASCI India guidelines.',
};

export default function AffiliateDisclosurePage() {
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-400">
            <Megaphone className="w-3.5 h-3.5" />
            Full Commercial Transparency • ASCI &amp; Amazon Associates Compliant
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Affiliate Disclosure
          </h1>
          <p className="text-xs text-slate-400">
            In compliance with the Advertising Standards Council of India (ASCI) and merchant partner terms
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8 text-sm text-slate-300 leading-relaxed">
          {/* Statutory Amazon Statement */}
          <section className="bg-amber-950/20 border border-amber-500/30 rounded-2xl p-6 space-y-3">
            <h2 className="text-lg font-bold text-amber-300 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-amber-400" />
              Amazon Associates Operating Statement
            </h2>
            <p className="text-amber-100 font-medium text-base">
              &quot;DealHunter is a participant in the Amazon Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.in.&quot;
            </p>
            <p className="text-xs text-amber-300/80">
              As an Amazon Associate, DealHunter earns from qualifying purchases.
            </p>
          </section>

          {/* Section 2 - Other Affiliate Partners */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-indigo-400" />
              Partner Merchant Networks
            </h2>
            <p>
              In addition to Amazon, DealHunter maintains affiliate, publisher, and referral partnerships with various leading consumer electronics retailers and brand official stores, including:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs font-medium text-slate-300 pt-2">
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">Flipkart Affiliate</div>
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">Croma Partner Program</div>
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">Reliance Digital</div>
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">Vijay Sales</div>
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">Lenovo Store India</div>
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">Dell Technologies India</div>
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">HP Online Store</div>
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">Acer Store India</div>
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">ASUS eShop India</div>
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">Samsung Shop India</div>
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">TataCliq</div>
            </div>
          </section>

          {/* Section 3 - Does This Affect What You Pay? */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ExternalLink className="w-5 h-5 text-indigo-400" />
              Does This Impact The Price You Pay?
            </h2>
            <p className="text-white font-semibold">
              No. Not by even a single rupee.
            </p>
            <p>
              When you purchase through an affiliate link generated by DealHunter, the retail price, bank discount, exchange value, and promotional coupon you receive are <strong>100% identical</strong> to navigating directly to the retailer. The commission we receive is paid entirely by the merchant from their existing marketing budget at zero extra cost to you.
            </p>
          </section>

          {/* Section 4 - Editorial Independence */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-lg font-bold text-white">Editorial &amp; Algorithmic Independence</h2>
            <p>
              DealHunter&apos;s AI analysis and ranking algorithm prioritize genuine net price savings and hardware specifications (such as VRAM, CPU generation, display refresh rate, and verified customer ratings) above commission rates.
            </p>
            <p>
              If a store offers the superior price or highest card discount, our engine highlights that store as the #1 Winner Deal regardless of whether we earn an affiliate referral on that specific transaction.
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
