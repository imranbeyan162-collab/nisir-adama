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
      // First insert blob items
      registrations.forEach((r: any) => {
        if (r && r.registrationCode) uniqueMap.set(r.registrationCode, r);
      });
      // Then insert any Prisma items not yet in blob
      dbRegistrations.forEach((r: any) => {
        if (r && r.registrationCode && !uniqueMap.has(r.registrationCode)) {
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
    return NextResponse.json({
      registrations: [],
      stats: { total: 0, pending: 0, verified: 0, rejected: 0, totalPlayers: 0 },
    });
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

    const cleanId = String(id).trim();
    const cleanStatus = status.trim().toUpperCase();

    const db = await getDb();
    const currentRegs = [...(db.registrations || [])];

    let foundIdx = currentRegs.findIndex(
      (r: any) => r.id === cleanId || r.registrationCode === cleanId
    );

    const nowIso = new Date().toISOString();

    if (foundIdx !== -1) {
      currentRegs[foundIdx] = {
        ...currentRegs[foundIdx],
        status: cleanStatus,
        adminNotes: adminNotes !== undefined ? adminNotes : currentRegs[foundIdx].adminNotes,
        verifiedAt: cleanStatus === 'VERIFIED' ? nowIso : currentRegs[foundIdx].verifiedAt,
        updatedAt: nowIso,
      };
    } else {
      // If not yet in blob list, look up in Prisma and create a verified record
      try {
        const pReg = await prisma.registrationGroup.findFirst({
          where: {
            OR: [{ id: cleanId }, { registrationCode: cleanId }],
          },
          include: { players: true },
        });
        if (pReg) {
          const newBlobReg = {
            ...pReg,
            status: cleanStatus,
            adminNotes: adminNotes !== undefined ? adminNotes : pReg.adminNotes,
            verifiedAt: cleanStatus === 'VERIFIED' ? nowIso : pReg.verifiedAt,
            updatedAt: nowIso,
          };
          currentRegs.unshift(newBlobReg);
          foundIdx = 0;
        }
      } catch (e) {}
    }

    // Save permanently to Vercel Blob Database
    await saveDb({ registrations: currentRegs });

    // Update in Prisma
    try {
      await prisma.registrationGroup.updateMany({
        where: {
          OR: [{ id: cleanId }, { registrationCode: cleanId }],
        },
        data: {
          status: cleanStatus,
          adminNotes: adminNotes !== undefined ? adminNotes : undefined,
          verifiedAt: cleanStatus === 'VERIFIED' ? new Date() : undefined,
        },
      });
    } catch (err) {
      // Prisma fallback
    }

    console.log(`✅ Registration status updated: ID ${cleanId} -> ${cleanStatus}`);

    return NextResponse.json({
      success: true,
      id: cleanId,
      status: cleanStatus,
      message: `Registration ${cleanStatus.toLowerCase()} successfully`,
    });
  } catch (error: any) {
    console.error('Registration status update error:', error);
    return NextResponse.json({ error: error.message || 'Update failed' }, { status: 500 });
  }
}
