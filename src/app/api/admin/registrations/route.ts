import { NextRequest, NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/blobDb';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const ageCategory = searchParams.get('category');
    const search = searchParams.get('search');

    const db = await getDb();
    let registrations = db.registrations || [];

    // Prisma sync attempt
    try {
      let whereClause: any = {};
      if (status && status !== 'ALL') whereClause.status = status;
      if (ageCategory && ageCategory !== 'ALL') {
        whereClause.players = { some: { ageCategory } };
      }

      const dbRegistrations = await prisma.registrationGroup.findMany({
        where: whereClause,
        include: { players: true },
        orderBy: { submittedAt: 'desc' },
      });

      const uniqueMap = new Map();
      registrations.forEach((r: any) => uniqueMap.set(r.registrationCode, r));
      dbRegistrations.forEach((r: any) => {
        if (!uniqueMap.has(r.registrationCode)) {
          uniqueMap.set(r.registrationCode, r);
        }
      });
      registrations = Array.from(uniqueMap.values());
    } catch (err) {
      // Prisma fallback
    }

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

    const stats = {
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

    const db = await getDb();
    const currentRegs = db.registrations || [];
    const idx = currentRegs.findIndex((r: any) => r.id === id || r.registrationCode === id);
    if (idx !== -1) {
      currentRegs[idx].status = status;
      if (adminNotes !== undefined) currentRegs[idx].adminNotes = adminNotes;
      if (status === 'VERIFIED') currentRegs[idx].verifiedAt = new Date().toISOString();
    }
    await saveDb({ registrations: currentRegs });

    try {
      await prisma.registrationGroup.update({
        where: { id },
        data: {
          status,
          adminNotes: adminNotes !== undefined ? adminNotes : undefined,
          verifiedAt: status === 'VERIFIED' ? new Date() : undefined,
        },
      });
    } catch (err) {
      // Prisma fallback
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Update failed' }, { status: 500 });
  }
}
