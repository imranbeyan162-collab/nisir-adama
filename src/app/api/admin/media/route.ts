import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get('page');
    const sectionKey = searchParams.get('sectionKey');

    if (sectionKey) {
      const item = await prisma.pageMedia.findUnique({
        where: { sectionKey },
      });
      return NextResponse.json({ item });
    }

    let whereClause: any = {};
    if (page && page !== 'all') {
      whereClause.page = page;
    }

    const items = await prisma.pageMedia.findMany({
      where: whereClause,
      orderBy: { updatedAt: 'desc' },
    });

    const settings = await prisma.siteSetting.findMany();

    return NextResponse.json({ items, settings });
  } catch (error: any) {
    console.error('Error fetching page media:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
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
  } catch (error: any) {
    console.error('Error upserting page media:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
