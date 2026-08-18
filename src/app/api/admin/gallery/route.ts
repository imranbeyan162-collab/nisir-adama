import { NextRequest, NextResponse } from 'next/server';
import { getDb, saveDb, GalleryItemData } from '@/lib/blobDb';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const DUMMY_TITLES = [
  'Manafesha Meda Championship Match',
  'Chapi Stadium Championship Match',
  'Morning Training at Manafesha Meda',
  'Tactical Ball Mastery Drills',
  'COVID-Era Distance Training (2013 E.C.)',
  'Annual Trophy Presentation Ceremony',
  'Coach Fisha Strategy Briefing',
  'Youth Striker Shooting Practice',
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const mediaType = searchParams.get('type');

    // 1. Fetch from permanent Vercel Blob Database (Single Source of Truth)
    const db = await getDb();
    let items = (db.galleryItems || []).filter((item) => {
      if (!item) return false;
      // Filter out dummy items
      if (DUMMY_TITLES.includes(item.title)) return false;
      if (item.id === 'init_item_1' || item.id === 'init_item_2') return false;
      // Filter out deleted items
      if (db.deletedGalleryIds && db.deletedGalleryIds.includes(item.id)) return false;
      return true;
    });

    if (category && category !== 'ALL') {
      items = items.filter((i) => i.category === category);
    }
    if (mediaType && mediaType !== 'ALL') {
      items = items.filter((i) => i.mediaType === mediaType);
    }

    return NextResponse.json({ items });
  } catch (error: any) {
    console.error('Error fetching gallery:', error);
    return NextResponse.json({ items: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title,
      description,
      mediaType,
      mediaUrl,
      videoUrl,
      thumbnail,
      category,
      featured,
    } = body;

    if (!title || !mediaUrl) {
      return NextResponse.json({ error: 'Title and media URL are required' }, { status: 400 });
    }

    const newItem: GalleryItemData = {
      id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      title,
      description: description || null,
      mediaType: mediaType || 'photo',
      mediaUrl,
      videoUrl: videoUrl || null,
      thumbnail: thumbnail || mediaUrl,
      category: category || 'Training',
      featured: Boolean(featured),
      createdAt: new Date().toISOString(),
    };

    // 1. Save permanently to Vercel Blob Database
    const db = await getDb();
    const currentItems = (db.galleryItems || []).filter((i) => i.id !== newItem.id && !DUMMY_TITLES.includes(i.title));
    currentItems.unshift(newItem);
    await saveDb({ galleryItems: currentItems });

    // 2. Prisma sync (optional secondary cache)
    try {
      await prisma.galleryItem.create({
        data: {
          title,
          description: description || null,
          mediaType: mediaType || 'photo',
          mediaUrl,
          videoUrl: videoUrl || null,
          thumbnail: thumbnail || mediaUrl,
          category: category || 'Training',
          featured: Boolean(featured),
        },
      });
    } catch (dbErr) {
      // Prisma fallback
    }

    return NextResponse.json({ success: true, item: newItem });
  } catch (error: any) {
    console.error('Error creating gallery item:', error);
    return NextResponse.json({ error: error.message || 'Failed to create item' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Gallery item ID is required' }, { status: 400 });
    }

    // 1. Delete permanently from Vercel Blob Database
    const db = await getDb();
    const updatedItems = (db.galleryItems || []).filter(
      (i) => i.id !== id && i.id !== decodeURIComponent(id) && !DUMMY_TITLES.includes(i.title)
    );
    const deletedIds = Array.from(new Set([...(db.deletedGalleryIds || []), id, decodeURIComponent(id)]));
    await saveDb({ galleryItems: updatedItems, deletedGalleryIds: deletedIds });

    // 2. Prisma delete
    try {
      await prisma.galleryItem.deleteMany({
        where: {
          OR: [{ id }, { id: decodeURIComponent(id) }],
        },
      });
    } catch (dbErr) {
      // Prisma fallback
    }

    return NextResponse.json({ success: true, remaining: updatedItems.length });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
