import { NextResponse } from 'next/server';
import { checkRateLimit, getClientIp } from '@/lib/rate-limiter';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'dealhunter@admin2026';

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    // Rate limit: 5 login attempts per minute per IP
    const rateCheck = checkRateLimit(`login_${ip}`, 5, 60000);
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: `Too many login attempts. Please wait ${rateCheck.resetInSeconds} seconds.` },
        { status: 429 }
      );
    }

    const { password } = await req.json();

    if (!password || password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Invalid admin password. Access denied.' },
        { status: 401 }
      );
    }

    // Generate session token
    const token = Buffer.from(`admin:${Date.now()}:${ADMIN_PASSWORD}`).toString('base64');

    const res = NextResponse.json({
      success: true,
      message: 'Admin authentication successful.',
      token,
    });

    // Set secure HTTP-only cookie
    res.cookies.set('dealhunter_admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return res;
  } catch (err) {
    return NextResponse.json({ error: 'Login failed', details: String(err) }, { status: 500 });
  }
}
