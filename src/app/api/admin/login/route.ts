import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

    // 1. Check database admin user
    const user = await prisma.adminUser.findFirst({
      where: {
        username: cleanUser,
      },
    });

    const envPass = process.env.ADMIN_PASSWORD || 'fisha weldemeskel';

    // Allow coach or admin with stored hash or default password
    const isCoachDefault =
      (cleanUser === 'coach' || cleanUser === 'fisha' || cleanUser === 'admin') &&
      (cleanPass === 'fisha weldemeskel' || cleanPass === envPass);

    const isDbMatch = user && user.passwordHash === cleanPass;

    if (isDbMatch || isCoachDefault) {
      return NextResponse.json({
        success: true,
        user: {
          username: user?.username || cleanUser,
          fullName: user?.fullName || 'Coach Fisha Welde Meskel',
          role: user?.role || 'COACH',
        },
        token: `session_${Date.now()}_${cleanUser}`,
      });
    }

    return NextResponse.json(
      { error: 'Invalid credentials. Default coach password is "fisha weldemeskel"' },
      { status: 401 }
    );
  } catch (error: any) {
    console.error('Admin login error:', error);
    return NextResponse.json({ error: error.message || 'Login failed' }, { status: 500 });
  }
}
