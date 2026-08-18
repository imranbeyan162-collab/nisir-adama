import { NextRequest, NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/blobDb';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get('page');
    const sectionKey = searchParams.get('sectionKey');

    const db = await getDb();
    const mediaMap = db.pageMedia || {};
    const settings = db.siteSettings || {};

    if (sectionKey) {
      return NextResponse.json({ item: mediaMap[sectionKey] || null });
    }

    let items = Object.values(mediaMap);
    if (page && page !== 'all') {
      items = items.filter((i: any) => i.page === page);
    }

    return NextResponse.json({ items, settings });
  } catch (error: any) {
    console.error('Error fetching page media:', error);
    return NextResponse.json({ items: [], settings: {} });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      sectionKey,
      page,
      title,
      subtitle,
      mediaType,
      mediaUrl,
      embedUrl,
      thumbnail,
      caption,
    } = body;

    if (!sectionKey || !page || !title || !mediaUrl) {
      return NextResponse.json(
        { error: 'sectionKey, page, title, and mediaUrl are required' },
        { status: 400 }
      );
    }

    const mediaObj = {
      id: `media_${sectionKey}`,
      sectionKey,
      page,
      title,
      subtitle: subtitle || null,
      mediaType: mediaType || 'photo',
      mediaUrl,
      embedUrl: embedUrl || null,
      thumbnail: thumbnail || mediaUrl,
      caption: caption || null,
      updatedAt: new Date().toISOString(),
    };

    // 1. Save permanently to Vercel Blob Database
    const db = await getDb();
    const currentMedia = { ...(db.pageMedia || {}) };
    currentMedia[sectionKey] = mediaObj;
    await saveDb({ pageMedia: currentMedia });

    // 2. Prisma sync
    try {
      await prisma.pageMedia.upsert({
        where: { sectionKey },
        update: mediaObj,
        create: mediaObj,
      });
    } catch (dbErr) {
      // Prisma fallback
    }

    return NextResponse.json({ success: true, item: mediaObj });
  } catch (error: any) {
    console.error('Error upserting page media:', error);
    return NextResponse.json({ error: error.message || 'Save failed' }, { status: 500 });
  }
}
