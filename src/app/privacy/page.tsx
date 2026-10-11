import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft, Lock, FileText, Database, Eye } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | DealHunter',
  description: 'DealHunter Privacy Policy compliant with the Digital Personal Data Protection Act (DPDP Act 2023) and global data privacy standards.',
};

export default function PrivacyPolicyPage() {
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            DPDP Act (India) & Global Privacy Compliant
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Privacy Policy
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
              <Lock className="w-5 h-5 text-indigo-400" />
              1. Zero Financial Data Storage (Zero Knowledge Architecture)
            </h2>
            <p>
              DealHunter offers an AI-powered deal scanner and Multi-Card Wallet optimizer. We emphasize that:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
              <li>
                <strong>We never ask for, collect, or store card numbers, CVVs, expiry dates, or PINs.</strong>
              </li>
              <li>
                The &quot;Multi-Card Wallet&quot; only tracks card labels (e.g. &quot;SBI Credit Card&quot;, &quot;Amazon Pay ICICI&quot;) solely to calculate on-page merchant discounts.
              </li>
              <li>
                Card selections and custom preferences are stored locally in your device&apos;s browser (<code className="text-indigo-300 bg-slate-950 px-1.5 py-0.5 rounded">localStorage</code>) and are never transmitted to or archived on our backend databases.
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Eye className="w-5 h-5 text-indigo-400" />
              2. Information We Collect
            </h2>
            <p>When you interact with DealHunter, we collect minimal data strictly required to deliver our deal comparison services:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
              <li>
                <strong>User Prompts &amp; Queries:</strong> Natural language search queries provided to our Intent Negotiator to generate spec requirements.
              </li>
              <li>
                <strong>Technical Logs:</strong> Anonymized IP addresses, browser user-agents, and timestamps to enforce bot defense, DDoS prevention, and rate-limiting.
              </li>
              <li>
                <strong>Custom AI Studio Keys:</strong> If you supply your personal Google AI Studio key, it is kept in your local browser session storage and transmitted directly in header tokens strictly for your active sessions.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-indigo-400" />
              3. Cookies and Outbound Affiliate Links
            </h2>
            <p>
              When you click on an external merchant link (such as Amazon India, Flipkart, Croma, Dell, Lenovo, HP, etc.), you are redirected to the merchant&apos;s website.
            </p>
            <p>
              These retailers may place third-party cookies on your browser to attribute eligible purchases and track referral sales in compliance with their respective affiliate programs. We encourage you to review each merchant&apos;s independent privacy policy.
            </p>
          </section>

          {/* Section 4 */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-400" />
              4. Data Retention and User Rights under DPDP Act 2023
            </h2>
            <p>
              Under India&apos;s Digital Personal Data Protection Act (DPDP Act 2023) and applicable international privacy laws, you possess the right to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
              <li>Clear all locally stored wallet card data at any time via your browser settings.</li>
              <li>Request information regarding technical logging data retained by DealHunter.</li>
              <li>Request grievance redressal by contacting our privacy compliance officer.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-lg font-bold text-white">5. Contact and Grievance Officer</h2>
            <p>
              If you have any questions or grievances concerning data handling or privacy, please reach out to:
            </p>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 space-y-1">
              <div>DealHunter Privacy Grievance Cell</div>
              <div>Email: <a href="mailto:privacy@dealhunter.app" className="text-indigo-400 underline">privacy@dealhunter.app</a></div>
              <div>Location: Bengaluru, Karnataka, India</div>
            </div>
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
