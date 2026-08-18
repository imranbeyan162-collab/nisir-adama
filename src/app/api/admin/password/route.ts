import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { username, currentPassword, newPassword } = await req.json();

    if (!username || !newPassword) {
      return NextResponse.json(
        { error: 'Username and new password are required' },
        { status: 400 }
      );
    }

    const cleanUser = username.trim().toLowerCase();
    const cleanNewPass = newPassword.trim();

    if (cleanNewPass.length < 4) {
      return NextResponse.json(
        { error: 'Password must be at least 4 characters long' },
        { status: 400 }
      );
    }

    // Upsert admin user
    const user = await prisma.adminUser.upsert({
      where: { username: cleanUser },
      update: {
        passwordHash: cleanNewPass,
      },
      create: {
        username: cleanUser,
        passwordHash: cleanNewPass,
        fullName: cleanUser === 'coach' ? 'Coach Fisha Welde Meskel' : 'Admin Staff',
        role: cleanUser === 'coach' ? 'COACH' : 'ADMIN',
      },
    });

    return NextResponse.json({
      success: true,
      message: `Password updated successfully for ${user.username}`,
    });
  } catch (error: any) {
    console.error('Password update error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
