import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const globalStore = globalThis as unknown as {
  __nisir_page_media?: Record<string, any>;
};

if (!globalStore.__nisir_page_media) {
  globalStore.__nisir_page_media = {};
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get('page');
    const sectionKey = searchParams.get('sectionKey');

    // 1. Single section request
    if (sectionKey) {
      if (globalStore.__nisir_page_media && globalStore.__nisir_page_media[sectionKey]) {
        return NextResponse.json({ item: globalStore.__nisir_page_media[sectionKey] });
      }
      try {
        const item = await prisma.pageMedia.findUnique({
          where: { sectionKey },
        });
        if (item) return NextResponse.json({ item });
      } catch (dbErr) {
        console.warn('PageMedia findUnique fallback:', dbErr);
      }
      return NextResponse.json({ item: null });
    }

    // 2. All or page items
    let dbItems: any[] = [];
    let settings: any[] = [];
    try {
      let whereClause: any = {};
      if (page && page !== 'all') whereClause.page = page;

      dbItems = await prisma.pageMedia.findMany({
        where: whereClause,
        orderBy: { updatedAt: 'desc' },
      });
      settings = await prisma.siteSetting.findMany();
    } catch (dbErr) {
      console.warn('PageMedia DB read fallback:', dbErr);
    }

    const memItems = Object.values(globalStore.__nisir_page_media || {});
    const combined = [...memItems, ...dbItems];
    const uniqueMap = new Map();
    combined.forEach((item) => {
      if (item && item.sectionKey && !uniqueMap.has(item.sectionKey)) {
        uniqueMap.set(item.sectionKey, item);
      }
    });

    let items = Array.from(uniqueMap.values());
    if (page && page !== 'all') {
      items = items.filter((i) => i.page === page);
    }

    return NextResponse.json({ items, settings });
  } catch (error: any) {
    console.error('Error fetching page media:', error);
    return NextResponse.json({ items: [], settings: [] });
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

    // 1. Save to in-memory store
    if (!globalStore.__nisir_page_media) globalStore.__nisir_page_media = {};
    globalStore.__nisir_page_media[sectionKey] = mediaObj;

    // 2. Attempt DB write if available
    try {
      const mediaItem = await prisma.pageMedia.upsert({
        where: { sectionKey },
        update: {
          page,
          title,
          subtitle: subtitle || null,
          mediaType: mediaType || 'photo',
          mediaUrl,
          embedUrl: embedUrl || null,
          thumbnail: thumbnail || mediaUrl,
          caption: caption || null,
        },
        create: {
          sectionKey,
          page,
          title,
          subtitle: subtitle || null,
          mediaType: mediaType || 'photo',
          mediaUrl,
          embedUrl: embedUrl || null,
          thumbnail: thumbnail || mediaUrl,
          caption: caption || null,
        },
      });
      return NextResponse.json({ success: true, item: mediaItem });
    } catch (dbErr) {
      console.warn('DB upsert bypassed, saved to server memory:', dbErr);
    }

    return NextResponse.json({ success: true, item: mediaObj });
  } catch (error: any) {
    console.error('Error upserting page media:', error);
    return NextResponse.json({ error: error.message || 'Save failed' }, { status: 500 });
  }
}
