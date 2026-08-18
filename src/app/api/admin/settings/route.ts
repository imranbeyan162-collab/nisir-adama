import { NextRequest, NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/blobDb';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const db = await getDb();
    const settings = db.siteSettings || {};
    return NextResponse.json({ settings, list: Object.entries(settings).map(([key, value]) => ({ key, value })) });
  } catch (error: any) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ settings: {}, list: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { settings } = body;

    if (!settings || typeof settings !== 'object') {
      return NextResponse.json({ error: 'Invalid settings payload' }, { status: 400 });
    }

    const db = await getDb();
    const updatedSettings = { ...(db.siteSettings || {}) };

    for (const [key, val] of Object.entries(settings)) {
      const stringVal = typeof val === 'object' && val !== null ? (val as any).value : String(val);
      updatedSettings[key] = stringVal;

      try {
        await prisma.siteSetting.upsert({
          where: { key },
          update: { value: stringVal },
          create: { key, value: stringVal, group: 'general' },
        });
      } catch (err) {
        // Prisma fallback
      }
    }

    await saveDb({ siteSettings: updatedSettings });

    return NextResponse.json({ success: true, settings: updatedSettings });
  } catch (error: any) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: error.message || 'Update failed' }, { status: 500 });
  }
}
