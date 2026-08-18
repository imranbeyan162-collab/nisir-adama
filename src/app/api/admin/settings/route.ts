import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const group = searchParams.get('group');

    let whereClause: any = {};
    if (group && group !== 'all') {
      whereClause.group = group;
    }

    const settingsList = await prisma.siteSetting.findMany({
      where: whereClause,
    });

    const settingsMap: Record<string, string> = {};
    settingsList.forEach((s) => {
      settingsMap[s.key] = s.value;
    });

    return NextResponse.json({ settings: settingsMap, list: settingsList });
  } catch (error: any) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { settings } = body; // Record<string, { value: string, group?: string }> or Record<string, string>

    if (!settings || typeof settings !== 'object') {
      return NextResponse.json({ error: 'Invalid settings payload' }, { status: 400 });
    }

    for (const [key, val] of Object.entries(settings)) {
      const stringVal = typeof val === 'object' && val !== null ? (val as any).value : String(val);
      const groupVal = typeof val === 'object' && val !== null && (val as any).group ? (val as any).group : 'general';

      await prisma.siteSetting.upsert({
        where: { key },
        update: { value: stringVal },
        create: { key, value: stringVal, group: groupVal },
      });
    }

    const updated = await prisma.siteSetting.findMany();
    return NextResponse.json({ success: true, updatedCount: updated.length });
  } catch (error: any) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
