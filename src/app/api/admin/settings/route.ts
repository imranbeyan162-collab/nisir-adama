import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const globalStore = globalThis as unknown as {
  __nisir_site_settings?: Record<string, string>;
};

if (!globalStore.__nisir_site_settings) {
  globalStore.__nisir_site_settings = {
    training_ground: 'Chapi Meda / Chapi Stadium, Adama',
    office_address: 'Franco Batu Tower, 2nd Floor, Adama, Ethiopia',
    coach_phone_1: '+251 911 651 214',
    coach_phone_2: '+251 908 171 773',
    tiktok_handle: '@nisiradama',
  };
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const group = searchParams.get('group');

    let settingsList: any[] = [];
    try {
      let whereClause: any = {};
      if (group && group !== 'all') whereClause.group = group;
      settingsList = await prisma.siteSetting.findMany({ where: whereClause });
    } catch (dbErr) {
      console.warn('Settings DB read fallback:', dbErr);
    }

    const settingsMap: Record<string, string> = { ...(globalStore.__nisir_site_settings || {}) };
    settingsList.forEach((s) => {
      settingsMap[s.key] = s.value;
    });

    return NextResponse.json({ settings: settingsMap, list: settingsList });
  } catch (error: any) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ settings: globalStore.__nisir_site_settings || {}, list: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { settings } = body;

    if (!settings || typeof settings !== 'object') {
      return NextResponse.json({ error: 'Invalid settings payload' }, { status: 400 });
    }

    if (!globalStore.__nisir_site_settings) globalStore.__nisir_site_settings = {};

    for (const [key, val] of Object.entries(settings)) {
      const stringVal = typeof val === 'object' && val !== null ? (val as any).value : String(val);
      const groupVal = typeof val === 'object' && val !== null && (val as any).group ? (val as any).group : 'general';

      globalStore.__nisir_site_settings[key] = stringVal;

      try {
        await prisma.siteSetting.upsert({
          where: { key },
          update: { value: stringVal },
          create: { key, value: stringVal, group: groupVal },
        });
      } catch (dbErr) {
        console.warn('DB settings upsert bypassed:', dbErr);
      }
    }

    return NextResponse.json({ success: true, settings: globalStore.__nisir_site_settings });
  } catch (error: any) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: error.message || 'Update failed' }, { status: 500 });
  }
}
