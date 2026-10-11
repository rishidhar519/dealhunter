'use client';

import React from 'react';
import { Wallet, Check, Sparkles } from 'lucide-react';
import { SupportedBankCard, WalletCardDefinition } from '@/types/requirements';

interface WalletSelectorProps {
  selectedCards: string[];
  onChangeWallet: (cards: string[]) => void;
}

const AVAILABLE_CARDS: WalletCardDefinition[] = [
  { id: 'SBI_CC', name: 'SBI Credit Card', issuer: 'SBI', type: 'credit', popularOfferTag: 'Amazon ₹16,250 Off' },
  { id: 'SBI_DC', name: 'SBI Debit Card', issuer: 'SBI', type: 'debit', popularOfferTag: 'Amazon ₹16,250 Off' },
  { id: 'AMAZON_PAY_ICICI', name: 'Amazon Pay ICICI', issuer: 'ICICI', type: 'credit', popularOfferTag: '₹4,999 Cashback' },
  { id: 'ICICI_CC', name: 'ICICI Bank Card', issuer: 'ICICI', type: 'credit', popularOfferTag: 'Croma/Reliance ₹4,500 Off' },
  { id: 'HDFC_CC', name: 'HDFC Bank Card', issuer: 'HDFC', type: 'credit', popularOfferTag: 'Flipkart/Acer ₹4,500 Off' },
  { id: 'FLIPKART_AXIS', name: 'Flipkart Axis Card', issuer: 'Axis', type: 'credit', popularOfferTag: '5% Unlimited Cashback' },
  { id: 'ANY_CREDIT_CARD', name: 'Any Credit Card', issuer: 'Any', type: 'credit', popularOfferTag: 'Lenovo Store 5% Cashback' },
  { id: 'AMAZON_PAY_UPI', name: 'Amazon Pay UPI / Cash', issuer: 'UPI', type: 'upi', popularOfferTag: 'Instant UPI Cashback' },
];

export const WalletSelector: React.FC<WalletSelectorProps> = ({
  selectedCards,
  onChangeWallet,
}) => {
  const toggleCard = (cardId: string) => {
    if (selectedCards.includes(cardId)) {
      if (selectedCards.length > 1) {
        onChangeWallet(selectedCards.filter((c) => c !== cardId));
      }
    } else {
      onChangeWallet([...selectedCards, cardId]);
    }
  };

  const selectAll = () => {
    onChangeWallet(AVAILABLE_CARDS.map((c) => c.id));
  };

  const selectSbiOnly = () => {
    onChangeWallet(['SBI_CC', 'SBI_DC']);
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Wallet className="w-4 h-4 text-amber-400" />
            Your Multi-Card Wallet ({selectedCards.length} Cards Selected)
          </h3>
          <p className="text-xs text-slate-400">
            Select all cards you or your family hold. DealHunter automatically applies the highest discount card for each store.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={selectSbiOnly}
            className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all"
          >
            SBI Only
          </button>
          <button
            onClick={selectAll}
            className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/30 transition-all"
          >
            Select All Cards
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-2.5">
        {AVAILABLE_CARDS.map((card) => {
          const isSelected = selectedCards.includes(card.id);
          return (
            <button
              key={card.id}
              onClick={() => toggleCard(card.id)}
              className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all relative overflow-hidden group ${
                isSelected
                  ? 'bg-amber-500/10 border-amber-500/50 text-white shadow-md'
                  : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-300'
              }`}
            >
              <div className="flex items-start justify-between mb-1.5">
                <span className="text-xs font-bold leading-tight">
                  {card.name}
                </span>
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ml-1.5 transition-all ${
                    isSelected
                      ? 'bg-amber-500 border-amber-500 text-slate-950'
                      : 'border-slate-700 bg-slate-900'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>
              <span className="text-[10px] font-medium text-amber-300/90 block truncate">
                {card.popularOfferTag}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
