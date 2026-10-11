'use client';

import React from 'react';
import { CreditCard, Percent, CheckCircle2 } from 'lucide-react';

interface BankCardSelectorProps {
  selectedBank: string;
  onSelectBank: (bank: string) => void;
}

export const BankCardSelector: React.FC<BankCardSelectorProps> = ({
  selectedBank,
  onSelectBank,
}) => {
  const cards = [
    {
      id: 'SBI',
      name: 'SBI Credit Card',
      badge: 'Save ₹16,250 on Amazon',
      badgeColor: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
      activeBorder: 'border-amber-500 bg-amber-500/10 text-white',
    },
    {
      id: 'HDFC',
      name: 'HDFC Bank Card',
      badge: 'Up to ₹5,000 Off (Flipkart)',
      badgeColor: 'text-sky-400 bg-sky-400/10 border-sky-400/20',
      activeBorder: 'border-sky-500 bg-sky-500/10 text-white',
    },
    {
      id: 'ICICI',
      name: 'ICICI Bank Card',
      badge: 'Up to ₹6,000 Off',
      badgeColor: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
      activeBorder: 'border-orange-500 bg-orange-500/10 text-white',
    },
    {
      id: 'Axis',
      name: 'Flipkart Axis Bank',
      badge: '5% Unlimited Cashback',
      badgeColor: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
      activeBorder: 'border-purple-500 bg-purple-500/10 text-white',
    },
    {
      id: 'Any Credit Card',
      name: 'Any Credit Card',
      badge: '5% Lenovo Store Cashback',
      badgeColor: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
      activeBorder: 'border-emerald-500 bg-emerald-500/10 text-white',
    },
    {
      id: 'NONE',
      name: 'No Card / UPI Only',
      badge: 'Base Listed Price',
      badgeColor: 'text-slate-400 bg-slate-800 border-slate-700',
      activeBorder: 'border-slate-500 bg-slate-800 text-slate-200',
    },
  ];

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-indigo-400" />
            Select Your Payment Method / Card
          </h3>
          <p className="text-xs text-slate-400">
            Click your bank to instantly unlock hidden instant discounts and recalculate effective buy prices across all stores.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
          <Percent className="w-3.5 h-3.5" />
          Live Offer Calculator
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {cards.map((card) => {
          const isSelected = selectedBank === card.id;
          return (
            <button
              key={card.id}
              onClick={() => onSelectBank(card.id)}
              className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all relative overflow-hidden group ${
                isSelected
                  ? card.activeBorder + ' shadow-md'
                  : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-300'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs font-semibold leading-tight text-white/90">
                  {card.name}
                </span>
                {isSelected && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-1" />
                )}
              </div>
              <span
                className={`text-[10px] font-medium px-2 py-0.5 rounded border inline-block w-fit ${card.badgeColor}`}
              >
                {card.badge}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
