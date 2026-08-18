import { NextRequest, NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/blobDb';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { username, currentPassword, newPassword } = await req.json();

    if (!newPassword) {
      return NextResponse.json(
        { error: 'New password is required' },
        { status: 400 }
      );
    }

    const cleanNewPass = newPassword.trim();
    if (cleanNewPass.length < 4) {
      return NextResponse.json(
        { error: 'Password must be at least 4 characters long' },
        { status: 400 }
      );
    }

    // 1. Save permanently to Vercel Blob Database
    await saveDb({ adminPassword: cleanNewPass });

    // 2. Attempt Prisma update if database is active
    try {
      const cleanUser = (username || 'admin').trim().toLowerCase();
      await prisma.adminUser.upsert({
        where: { username: cleanUser },
        update: { passwordHash: cleanNewPass },
        create: {
          username: cleanUser,
          passwordHash: cleanNewPass,
          fullName: 'Coach Fiseha Welde Meskel',
          role: 'COACH',
        },
      });
    } catch (dbErr) {
      // Prisma fallback
    }

    return NextResponse.json({
      success: true,
      message: 'Password updated permanently. You can now use it to log in.',
    });
  } catch (error: any) {
    console.error('Password update error:', error);
    return NextResponse.json({ error: error.message || 'Password update failed' }, { status: 500 });
  }
}
