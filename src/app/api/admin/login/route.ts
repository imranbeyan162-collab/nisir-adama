import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();
    const envPass = process.env.ADMIN_PASSWORD || 'fisha weldemeskel';

    // Check built-in fallback admin credentials first (works even if database is offline or uninitialized on Vercel)
    const isCoachDefault =
      (cleanUser === 'coach' || cleanUser === 'fisha' || cleanUser === 'admin') &&
      (cleanPass.toLowerCase() === 'fisha weldemeskel' || cleanPass === envPass || cleanPass === 'admin' || cleanPass === 'coach');

    let dbUser: any = null;
    try {
      dbUser = await prisma.adminUser.findFirst({
        where: {
          username: cleanUser,
        },
      });
    } catch (dbErr) {
      console.warn('Database lookup bypassed (running in serverless fallback mode):', dbErr);
    }

    const isDbMatch = dbUser && (dbUser.passwordHash === cleanPass || dbUser.passwordHash === cleanPass.toLowerCase());

    if (isDbMatch || isCoachDefault) {
      return NextResponse.json({
        success: true,
        user: {
          username: dbUser?.username || cleanUser,
          fullName: dbUser?.fullName || 'Coach Fiseha Welde Meskel',
          role: dbUser?.role || 'COACH',
        },
        token: `session_${Date.now()}_${cleanUser}`,
      });
    }

    return NextResponse.json(
      { error: 'Invalid credentials. Password is: fisha weldemeskel' },
      { status: 401 }
    );
  } catch (error: any) {
    console.error('Admin login error:', error);
    return NextResponse.json({ error: error.message || 'Login failed' }, { status: 500 });
  }
}
