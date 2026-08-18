import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const ageCategory = searchParams.get('category');
    const search = searchParams.get('search');

    let whereClause: any = {};
    if (status && status !== 'ALL') {
      whereClause.status = status;
    }

    if (ageCategory && ageCategory !== 'ALL') {
      whereClause.players = {
        some: {
          ageCategory: ageCategory,
        },
      };
    }

    if (search) {
      whereClause.OR = [
        { parentName: { contains: search } },
        { parentPhone: { contains: search } },
        { registrationCode: { contains: search } },
        { transactionNumber: { contains: search } },
        {
          players: {
            some: {
              fullName: { contains: search },
            },
          },
        },
      ];
    }

    const registrations = await prisma.registrationGroup.findMany({
      where: whereClause,
      include: {
        players: true,
      },
      orderBy: {
        submittedAt: 'desc',
      },
    });

    const stats = {
      total: await prisma.registrationGroup.count(),
      pending: await prisma.registrationGroup.count({ where: { status: 'PENDING' } }),
      verified: await prisma.registrationGroup.count({ where: { status: 'VERIFIED' } }),
      rejected: await prisma.registrationGroup.count({ where: { status: 'REJECTED' } }),
      totalPlayers: await prisma.player.count(),
    };

    return NextResponse.json({ registrations, stats });
  } catch (error: any) {
    console.error('Admin fetch registrations error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, status, adminNotes } = await req.json();

    if (!id || !status) {
      return NextResponse.json({ error: 'Registration ID and status are required' }, { status: 400 });
    }

    const updated = await prisma.registrationGroup.update({
      where: { id },
      data: {
        status: status.toUpperCase(),
        adminNotes: adminNotes !== undefined ? adminNotes : undefined,
        verifiedAt: status.toUpperCase() === 'VERIFIED' ? new Date() : null,
      },
      include: {
        players: true,
      },
    });

    return NextResponse.json({ success: true, registration: updated });
  } catch (error: any) {
    console.error('Admin update registration error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Registration ID is required' }, { status: 400 });
    }

    await prisma.registrationGroup.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
