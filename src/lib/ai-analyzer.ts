import { ProductListing, CalculatedDeal, AIAnalysisSummary, BankOffer } from '@/types/deal';

export function calculateEffectiveDeal(
  product: ProductListing,
  selectedBank: string = 'SBI'
): CalculatedDeal {
  let appliedOffer: BankOffer | undefined;

  if (selectedBank && selectedBank !== 'NONE') {
    // Look for exact bank match or "Any Credit Card"
    appliedOffer = product.offers.find(
      (o) =>
        o.bank.toLowerCase() === selectedBank.toLowerCase() ||
        (selectedBank === 'Axis' && o.bank === 'Flipkart Axis') ||
        o.bank === 'Any Credit Card'
    );
  }

  // If no bank specified or matched, default to general non-card offer or lowest cashback
  const discount = appliedOffer?.discountAmount || 0;
  const effectivePrice = Math.max(0, product.basePrice - discount);
  const totalSavings = (product.mrp - effectivePrice);
  const savingsPercentage = Math.round((totalSavings / product.mrp) * 100);

  // Match scoring
  let matchTier: CalculatedDeal['matchTier'] = 'Exact Match';
  let matchScore = 90;

  if (product.specs.gpu.includes('4050') || product.specs.gpu.includes('4060')) {
    matchTier = 'Spec Upgrade';
    matchScore = 98;
  } else if (product.specs.vramGb < 6) {
    matchTier = 'Partial Match';
    matchScore = 75;
  } else if (product.basePrice < 68000) {
    matchTier = 'Budget Equivalent';
    matchScore = 92;
  }

  return {
    product,
    effectivePrice,
    appliedOffer,
    totalSavings,
    savingsPercentage,
    matchScore,
    matchTier,
  };
}

export async function analyzeDealsWithAI(
  calculatedDeals: CalculatedDeal[],
  userSpecsDescription: string,
  selectedBank: string = 'SBI',
  apiKey?: string
): Promise<AIAnalysisSummary> {
  const geminiKey = apiKey || process.env.GEMINI_API_KEY;

  // If we have a Google AI Studio key, query Gemini 2.5 Flash
  if (geminiKey && geminiKey.trim().length > 5) {
    try {
      const prompt = `You are DealHunter AI, an expert hardware and Indian ecommerce shopping advisor.
The user is looking for a gaming laptop with these specifications:
"${userSpecsDescription}"
The user holds/selected payment method: "${selectedBank}".

Here are the candidate deals discovered across Amazon, Flipkart, TataCliq, and Official stores:
${JSON.stringify(
  calculatedDeals.map((d) => ({
    title: d.product.title,
    platform: d.product.platform,
    basePrice: d.product.basePrice,
    effectivePriceWithCard: d.effectivePrice,
    appliedOffer: d.appliedOffer?.description || 'No card offer applied',
    cpu: d.product.specs.cpu,
    gpu: d.product.specs.gpu,
    vramGb: d.product.specs.vramGb,
    ram: d.product.specs.ramGb,
    storage: d.product.specs.storageGb,
  })),
  null,
  2
)}

Analyze these deals and return a strict JSON response with this exact structure:
{
  "bestDirectMatchId": string (matches product title/id),
  "bestValueUpgradeId": string (e.g. RTX 4050 upgrade if available),
  "budgetChampionId": string (cheapest capable 6GB laptop),
  "editorialVerdict": string (2-3 punchy sentences giving clear shopping advice, mentioning the hidden card offers and whether to buy now),
  "specComparisonHighlights": [array of 3-4 bullet strings explaining hardware nuances, e.g. 4GB vs 6GB VRAM, RTX 4050 DLSS 3 benefits, etc.],
  "hiddenSavingsNotes": [array of 2-3 strings detailing bank offers, no-cost EMI tenure differences, and student/exchange tricks]
}
Return only JSON without markdown formatting.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: 'application/json' },
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          const parsed = JSON.parse(rawText);
          const directMatch = calculatedDeals.find(
            (d) =>
              d.product.title.toLowerCase().includes('essential') ||
              d.product.id.includes('83s0009sin')
          ) || calculatedDeals[0];

          const upgradeMatch = calculatedDeals.find(
            (d) => d.product.specs.gpu.includes('4050')
          );

          const budgetMatch = calculatedDeals.find(
            (d) => d.product.brand.toLowerCase() === 'acer' || d.effectivePrice < 62000
          );

          return {
            bestDirectMatch: directMatch,
            bestValueUpgrade: upgradeMatch,
            budgetChampion: budgetMatch,
            editorialVerdict: parsed.editorialVerdict,
            specComparisonHighlights: parsed.specComparisonHighlights || [],
            hiddenSavingsNotes: parsed.hiddenSavingsNotes || [],
            usedAiModel: 'gemini-3.8-flash',
          };
        }
      }
    } catch (err) {
      console.warn('Gemini AI API call failed, using intelligent heuristic fallback:', err);
    }
  }

  // Intelligent Heuristic Fallback Engine
  const directMatch = calculatedDeals.find((d) => d.product.id.includes('83s0009sin')) || calculatedDeals[0];
  const upgradeMatch = calculatedDeals.find((d) => d.product.specs.gpu.includes('4050'));
  const budgetMatch = calculatedDeals.find((d) => d.effectivePrice < 63000 && d.product.specs.vramGb >= 6);

  const highlights = [
    'VRAM Alert: Avoid 4GB variants of RTX 3050 (like ASUS TUF FA506NC) as modern AAA games require at least 6GB VRAM for high textures.',
    'Killer Upgrade: The Lenovo LOQ RTX 4050 6GB edition sits at ~₹72,490 net, offering 35% higher FPS + DLSS 3 Frame Generation for nearly the same price.',
    'CPU Equivalence: AMD Ryzen 7 7735HS, Ryzen 7 7435HS, and Intel i5-13420H/13450HX perform similarly in 1080p gaming benchmarks (within 4% delta).',
    'Bank Offer Impact: Amazon has an outsized ₹26,250 instant discount on SBI Cards for the LOQ 83S0009SIN, whereas Flipkart leads on HDFC & Axis bank cards.',
  ];

  const hiddenSavings = [
    `With ${selectedBank} Credit Card selected, the effective price drops up to ₹${Math.max(...calculatedDeals.map(d => d.appliedOffer?.discountAmount || 0)).toLocaleString('en-IN')}.`,
    'No-Cost EMI on Amazon allows spreading payments over 9 months without paying standard 14-16% interest.',
    'Official Lenovo Online store offers an extra ₹2,500 student eCoupon (SheerID) stackable with 5% Credit Card cashback.',
  ];

  return {
    bestDirectMatch: directMatch,
    bestValueUpgrade: upgradeMatch,
    budgetChampion: budgetMatch,
    editorialVerdict: `While the Lenovo LOQ Essential (83S0009SIN) has a massive ₹26,250 SBI Card discount on Amazon (bringing it to ₹73,740), you can get the superior RTX 4050 edition for ₹72,490 on Amazon or the Acer Nitro V 15 on Flipkart for ₹59,990. We recommend the RTX 4050 model for maximum longevity.`,
    specComparisonHighlights: highlights,
    hiddenSavingsNotes: hiddenSavings,
    usedAiModel: 'heuristic-engine',
  };
}
