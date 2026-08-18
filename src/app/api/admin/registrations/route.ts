import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const globalStore = globalThis as unknown as {
  __nisir_registrations?: any[];
};

if (!globalStore.__nisir_registrations) {
  globalStore.__nisir_registrations = [];
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const ageCategory = searchParams.get('category');
    const search = searchParams.get('search');

    let dbRegistrations: any[] = [];
    let dbStats: any = null;

    try {
      let whereClause: any = {};
      if (status && status !== 'ALL') whereClause.status = status;
      if (ageCategory && ageCategory !== 'ALL') {
        whereClause.players = { some: { ageCategory } };
      }
      if (search) {
        whereClause.OR = [
          { parentName: { contains: search } },
          { parentPhone: { contains: search } },
          { registrationCode: { contains: search } },
          { transactionNumber: { contains: search } },
          { players: { some: { fullName: { contains: search } } } },
        ];
      }

      dbRegistrations = await prisma.registrationGroup.findMany({
        where: whereClause,
        include: { players: true },
        orderBy: { submittedAt: 'desc' },
      });

      dbStats = {
        total: await prisma.registrationGroup.count(),
        pending: await prisma.registrationGroup.count({ where: { status: 'PENDING' } }),
        verified: await prisma.registrationGroup.count({ where: { status: 'VERIFIED' } }),
        rejected: await prisma.registrationGroup.count({ where: { status: 'REJECTED' } }),
        totalPlayers: await prisma.player.count(),
      };
    } catch (dbErr) {
      console.warn('Registrations DB read fallback:', dbErr);
    }

    const memRegistrations = globalStore.__nisir_registrations || [];
    const combined = [...memRegistrations, ...dbRegistrations];
    const uniqueMap = new Map();
    combined.forEach((r) => {
      const key = r.registrationCode || r.id;
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, r);
      }
    });

    let registrations = Array.from(uniqueMap.values());
    if (status && status !== 'ALL') {
      registrations = registrations.filter((r) => r.status === status);
    }
    if (search) {
      const q = search.toLowerCase();
      registrations = registrations.filter(
        (r) =>
          r.parentName?.toLowerCase().includes(q) ||
          r.parentPhone?.includes(q) ||
          r.registrationCode?.toLowerCase().includes(q) ||
          r.transactionNumber?.toLowerCase().includes(q)
      );
    }

    const stats = dbStats || {
      total: registrations.length,
      pending: registrations.filter((r) => r.status === 'PENDING').length,
      verified: registrations.filter((r) => r.status === 'VERIFIED').length,
      rejected: registrations.filter((r) => r.status === 'REJECTED').length,
      totalPlayers: registrations.reduce((acc, r) => acc + (r.players?.length || 0), 0),
    };

    return NextResponse.json({ registrations, stats });
  } catch (error: any) {
    console.error('Admin fetch registrations error:', error);
    return NextResponse.json({ registrations: [], stats: { total: 0, pending: 0, verified: 0, rejected: 0, totalPlayers: 0 } });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, adminNotes } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: 'Registration ID and new status are required' },
        { status: 400 }
      );
    }

    if (globalStore.__nisir_registrations) {
      const idx = globalStore.__nisir_registrations.findIndex((r) => r.id === id || r.registrationCode === id);
      if (idx !== -1) {
        globalStore.__nisir_registrations[idx].status = status;
        if (adminNotes !== undefined) globalStore.__nisir_registrations[idx].adminNotes = adminNotes;
        if (status === 'VERIFIED') globalStore.__nisir_registrations[idx].verifiedAt = new Date().toISOString();
      }
    }

    try {
      const updated = await prisma.registrationGroup.update({
        where: { id },
        data: {
          status,
          adminNotes: adminNotes !== undefined ? adminNotes : undefined,
          verifiedAt: status === 'VERIFIED' ? new Date() : undefined,
        },
        include: { players: true },
      });
      return NextResponse.json({ success: true, registration: updated });
    } catch (dbErr) {
      console.warn('DB update bypassed, updated in memory:', dbErr);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Update failed' }, { status: 500 });
  }
}
