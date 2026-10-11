import { NextResponse } from 'next/server';
import { ParsedRequirementJSON } from '@/types/requirements';
import { checkRateLimit } from '@/lib/rate-limiter';

export async function POST(req: Request) {
  try {
    const forwardedFor = req.headers.get('x-forwarded-for');
    const clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';
    const rateCheck = checkRateLimit(clientIp, 25, 60000); // 25 AI queries/min per IP

    if (!rateCheck.success) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded for AI requirement parsing. Please wait a minute before trying again.',
          retryAfterSeconds: rateCheck.resetInSeconds,
        },
        { status: 429 }
      );
    }

    const { prompt } = await req.json();
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const apiKey = req.headers.get('x-gemini-api-key') || process.env.GEMINI_API_KEY || '';

    // If Gemini API Key exists, use Gemini 3.8 Flash
    if (apiKey && apiKey.trim().length > 5) {
      try {
        const systemPrompt = `You are DealHunter's Requirement Negotiation AI.
Convert the user's natural language shopping request into a strictly structured Prioritized Requirement JSON.
Distinguish between priorities:
- 'critical': Non-negotiable deal-breaker (e.g., minimum 6GB VRAM to avoid modern gaming texture bottlenecks, specific budget ceiling).
- 'high': Strongly desired (e.g., 16GB RAM).
- 'medium': Desirable but adjustable (e.g., 512GB vs 1TB SSD).
- 'flexible': Open to suggestions / alternatives (e.g., brand: 'any').

User Request: "${prompt}"

Return ONLY valid JSON matching this schema:
{
  "userIntentSummary": "1-2 sentence concise summary of what user needs, highlighting primary workload and constraints",
  "category": "laptop",
  "budgetMax": { "value": number, "priority": "high", "label": "Max Budget" },
  "budgetMin": { "value": number, "priority": "flexible", "label": "Min Budget" },
  "gpu": {
    "value": {
      "modelOrTier": "RTX 3050 6GB / RTX 4050 6GB",
      "minVramGb": 6,
      "requiresDedicated": true
    },
    "priority": "critical",
    "label": "GPU & Minimum VRAM"
  },
  "cpu": {
    "value": {
      "tier": "Ryzen 7 / i7 or equivalent",
      "minCores": 8
    },
    "priority": "high",
    "label": "CPU Performance Tier"
  },
  "ramGb": { "value": 16, "priority": "high", "label": "RAM (GB)" },
  "storageGb": { "value": 512, "priority": "medium", "label": "SSD Storage (GB)" },
  "displayHz": { "value": 144, "priority": "medium", "label": "Display Refresh Rate (Hz)" },
  "brandPreference": { "value": "any", "priority": "flexible", "label": "Brand Preference" },
  "screenSizeInches": { "value": 15.6, "priority": "flexible", "label": "Display Size" },
  "extractedRawTokens": ["tokens", "identified"]
}`;

        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: systemPrompt }] }],
              generationConfig: { responseMimeType: 'application/json' },
            }),
          }
        );

        if (res.ok) {
          const data = await res.json();
          const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (raw) {
            const parsed: ParsedRequirementJSON = JSON.parse(raw);
            return NextResponse.json({ success: true, requirement: parsed, source: 'gemini-3.8-flash' });
          }
        }
      } catch (err) {
        console.warn('Gemini requirement parser failed, using heuristic fallback:', err);
      }
    }

    // Heuristic Fallback Parser
    const lower = prompt.toLowerCase();
    const isGaming = lower.includes('game') || lower.includes('gaming') || lower.includes('rtx') || lower.includes('gpu');
    const minVram = lower.includes('4gb') ? 4 : 6;
    const ram = lower.includes('32gb') ? 32 : lower.includes('8gb') ? 8 : 16;
    const storage = lower.includes('1tb') ? 1000 : 512;

    let budget = 90000;
    const budgetMatch = prompt.match(/(?:under|below|around|budget of|max)\s*₹?\s*(\d+)(?:k|000)?/i);
    if (budgetMatch) {
      let b = parseInt(budgetMatch[1], 10);
      if (b < 500) b = b * 1000;
      budget = b;
    }

    const fallback: ParsedRequirementJSON = {
      userIntentSummary: `Targeting a ${isGaming ? 'high-performance gaming' : 'multitasking'} laptop with at least ${minVram}GB VRAM and ${ram}GB RAM within a budget around ₹${budget.toLocaleString('en-IN')}.`,
      category: 'laptop',
      budgetMax: { value: budget, priority: 'high', label: 'Max Budget (₹)' },
      budgetMin: { value: Math.max(50000, budget - 25000), priority: 'flexible', label: 'Min Budget (₹)' },
      gpu: {
        value: {
          modelOrTier: lower.includes('4050') ? 'RTX 4050 6GB' : 'RTX 3050 6GB or superior',
          minVramGb: minVram,
          requiresDedicated: isGaming,
        },
        priority: 'critical',
        label: 'Graphics & Min VRAM',
      },
      cpu: {
        value: {
          tier: lower.includes('ryzen 7') ? 'AMD Ryzen 7' : 'Ryzen 7 / Core i7 or equivalent',
          minCores: 8,
        },
        priority: 'high',
        label: 'CPU Tier',
      },
      ramGb: { value: ram, priority: 'high', label: 'RAM (GB)' },
      storageGb: { value: storage, priority: 'medium', label: 'Storage (GB SSD)' },
      displayHz: { value: 144, priority: 'medium', label: 'Refresh Rate (Hz)' },
      brandPreference: {
        value: lower.includes('lenovo') ? 'Lenovo' : lower.includes('acer') ? 'Acer' : lower.includes('asus') ? 'ASUS' : 'any',
        priority: 'flexible',
        label: 'Brand Preference',
      },
      extractedRawTokens: prompt.split(/\s+/).slice(0, 10),
    };

    return NextResponse.json({ success: true, requirement: fallback, source: 'heuristic-engine' });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to parse requirements', details: String(err) }, { status: 500 });
  }
}
