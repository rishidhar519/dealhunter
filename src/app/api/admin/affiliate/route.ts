import { NextResponse } from 'next/server';
import { getAllStoreAffiliateRules, updateStoreAffiliateRules, StoreAffiliateRule } from '@/lib/affiliate-config';
import { Platform } from '@/types/deal';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'dealhunter@admin2026';

function isAuthorized(req: Request): boolean {
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = Buffer.from(token, 'base64').toString('utf-8');
      if (decoded.includes(ADMIN_PASSWORD)) return true;
    } catch {
      // invalid token
    }
  }

  // Also check cookie
  const cookieHeader = req.headers.get('cookie') || '';
  if (cookieHeader.includes('dealhunter_admin_token=')) {
    return true;
  }

  return false;
}

export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized admin access' }, { status: 401 });
  }

  const rules = getAllStoreAffiliateRules();
  return NextResponse.json({ rules });
}

export async function POST(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized admin access' }, { status: 401 });
  }

  try {
    const { rules } = (await req.json()) as { rules: Record<Platform, StoreAffiliateRule> };
    if (!rules || typeof rules !== 'object') {
      return NextResponse.json({ error: 'Invalid rules object' }, { status: 400 });
    }

    updateStoreAffiliateRules(rules);
    return NextResponse.json({ success: true, message: 'Affiliate parameters updated successfully.' });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update rules', details: String(err) }, { status: 500 });
  }
}
