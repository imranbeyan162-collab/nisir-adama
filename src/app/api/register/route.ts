import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const globalStore = globalThis as unknown as {
  __nisir_registrations?: any[];
};

if (!globalStore.__nisir_registrations) {
  globalStore.__nisir_registrations = [];
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      parentName,
      parentPhone,
      parentEmail,
      paymentMethod,
      transactionNumber,
      receiptUrl,
      players,
    } = body;

    if (!players || !Array.isArray(players) || players.length === 0) {
      return NextResponse.json(
        { error: 'At least one player registration is required' },
        { status: 400 }
      );
    }

    if (!transactionNumber || !paymentMethod) {
      return NextResponse.json(
        { error: 'Payment method and transaction number are required' },
        { status: 400 }
      );
    }

    let calculatedTotalRegFee = 0;
    let calculatedTotalMonthlyFee = 0;

    const validatedPlayers = players.map((p: any) => {
      let regFee = 4000;
      if (p.ageCategory === 'U15' || p.ageCategory === '17' || p.ageCategory === 'U17') {
        regFee = 5000;
      } else {
        regFee = 4000;
      }
      const monthlyFee = 500;

      calculatedTotalRegFee += regFee;
      calculatedTotalMonthlyFee += monthlyFee;

      return {
        id: `pl_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        fullName: p.fullName || 'Unnamed Trainee',
        birthDate: p.birthDate || '',
        playerPhone: p.playerPhone || null,
        playerPhotoUrl: p.playerPhotoUrl || null,
        fatherName: p.fatherName || parentName || '',
        motherName: p.motherName || '',
        guardianPhone: p.guardianPhone || parentPhone || '',
        position: p.position || 'Midfielder',
        ageCategory: p.ageCategory || 'U10',
        regFee,
        monthlyFee,
        parentConsent: Boolean(p.parentConsent),
      };
    });

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const registrationCode = `NISIR-2026-${randomSuffix}`;

    const regRecord = {
      id: `reg_${Date.now()}_${randomSuffix}`,
      registrationCode,
      parentName: parentName || validatedPlayers[0].fatherName || 'Parent / Guardian',
      parentPhone: parentPhone || validatedPlayers[0].guardianPhone || '',
      parentEmail: parentEmail || null,
      paymentMethod: paymentMethod.toUpperCase(),
      transactionNumber: transactionNumber.trim(),
      receiptUrl: receiptUrl || null,
      totalRegFee: calculatedTotalRegFee,
      totalMonthlyFee: calculatedTotalMonthlyFee,
      status: 'PENDING',
      submittedAt: new Date().toISOString(),
      players: validatedPlayers,
    };

    if (!globalStore.__nisir_registrations) globalStore.__nisir_registrations = [];
    globalStore.__nisir_registrations.unshift(regRecord);

    try {
      const dbRegistration = await prisma.registrationGroup.create({
        data: {
          registrationCode,
          parentName: regRecord.parentName,
          parentPhone: regRecord.parentPhone,
          parentEmail: regRecord.parentEmail,
          paymentMethod: regRecord.paymentMethod,
          transactionNumber: regRecord.transactionNumber,
          receiptUrl: regRecord.receiptUrl,
          totalRegFee: calculatedTotalRegFee,
          totalMonthlyFee: calculatedTotalMonthlyFee,
          status: 'PENDING',
          players: {
            create: validatedPlayers.map((p) => ({
              fullName: p.fullName,
              birthDate: p.birthDate,
              playerPhone: p.playerPhone,
              playerPhotoUrl: p.playerPhotoUrl,
              fatherName: p.fatherName,
              motherName: p.motherName,
              guardianPhone: p.guardianPhone,
              position: p.position,
              ageCategory: p.ageCategory,
              regFee: p.regFee,
              monthlyFee: p.monthlyFee,
              parentConsent: p.parentConsent,
            })),
          },
        },
        include: {
          players: true,
        },
      });

      return NextResponse.json({
        success: true,
        registrationCode: dbRegistration.registrationCode,
        registrationId: dbRegistration.id,
        totalRegFee: calculatedTotalRegFee,
        totalMonthlyFee: calculatedTotalMonthlyFee,
        status: dbRegistration.status,
        playerCount: validatedPlayers.length,
        notice: 'Keep receipt and report to Chapi Stadium',
      });
    } catch (dbErr) {
      console.warn('Registration DB create bypassed, saved to memory:', dbErr);
    }

    return NextResponse.json({
      success: true,
      registrationCode: regRecord.registrationCode,
      registrationId: regRecord.id,
      totalRegFee: calculatedTotalRegFee,
      totalMonthlyFee: calculatedTotalMonthlyFee,
      status: regRecord.status,
      playerCount: validatedPlayers.length,
      notice: 'Keep receipt and report to Chapi Stadium',
    });
  } catch (error: any) {
    console.error('Registration submission error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to submit registration' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json({ error: 'Registration code is required' }, { status: 400 });
    }

    if (globalStore.__nisir_registrations) {
      const found = globalStore.__nisir_registrations.find((r) => r.registrationCode === code);
      if (found) return NextResponse.json({ registration: found });
    }

    try {
      const registration = await prisma.registrationGroup.findUnique({
        where: { registrationCode: code },
        include: { players: true },
      });
      if (registration) return NextResponse.json({ registration });
    } catch (dbErr) {
      console.warn('Registration findUnique fallback:', dbErr);
    }

    return NextResponse.json({ error: 'Registration record not found' }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
