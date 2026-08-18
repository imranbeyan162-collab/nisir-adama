import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

    // Calculate official fee per player based on age category
    let calculatedTotalRegFee = 0;
    let calculatedTotalMonthlyFee = 0;

    const validatedPlayers = players.map((p: any) => {
      let regFee = 4000;
      if (p.ageCategory === 'U15' || p.ageCategory === '17' || p.ageCategory === 'U17') {
        regFee = 5000;
      } else {
        regFee = 4000; // U10 and U13
      }
      const monthlyFee = 500;

      calculatedTotalRegFee += regFee;
      calculatedTotalMonthlyFee += monthlyFee;

      return {
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

    const registrationGroup = await prisma.registrationGroup.create({
      data: {
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
        players: {
          create: validatedPlayers,
        },
      },
      include: {
        players: true,
      },
    });

    return NextResponse.json({
      success: true,
      registrationCode: registrationGroup.registrationCode,
      registrationId: registrationGroup.id,
      totalRegFee: calculatedTotalRegFee,
      totalMonthlyFee: calculatedTotalMonthlyFee,
      status: registrationGroup.status,
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

    if (code) {
      const reg = await prisma.registrationGroup.findUnique({
        where: { registrationCode: code },
        include: { players: true },
      });
      if (!reg) {
        return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
      }
      return NextResponse.json({ registration: reg });
    }

    const registrations = await prisma.registrationGroup.findMany({
      include: { players: true },
      orderBy: { submittedAt: 'desc' },
      take: 50,
    });

    return NextResponse.json({ registrations });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
