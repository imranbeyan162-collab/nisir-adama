import { NextRequest, NextResponse } from 'next/server';
import { getDb, saveDb, GalleryItemData } from '@/lib/blobDb';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const mediaType = searchParams.get('type');

    // 1. Fetch from permanent Vercel Blob Database
    const db = await getDb();
    let items = db.galleryItems || [];
    const deletedSet = new Set(db.deletedGalleryIds || []);

    // Filter out deleted items
    items = items.filter((item) => item && !deletedSet.has(item.id));

    // Try merging any Prisma items if available
    try {
      let whereClause: any = {};
      if (category && category !== 'ALL') whereClause.category = category;
      if (mediaType && mediaType !== 'ALL') whereClause.mediaType = mediaType;

      const dbItems = await prisma.galleryItem.findMany({
        where: whereClause,
        orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
      });

      const uniqueMap = new Map();
      items.forEach((i) => uniqueMap.set(i.id, i));
      dbItems.forEach((i) => {
        if (!deletedSet.has(i.id) && !uniqueMap.has(i.id)) {
          uniqueMap.set(i.id, i);
        }
      });
      items = Array.from(uniqueMap.values()) as GalleryItemData[];
    } catch (err) {
      // Prisma fallback
    }

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
    const currentItems = (db.galleryItems || []).filter((i) => i.id !== newItem.id);
    currentItems.unshift(newItem);
    await saveDb({ galleryItems: currentItems });

    // 2. Prisma sync
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

    // 1. Delete permanently in Vercel Blob Database
    const db = await getDb();
    const updatedItems = (db.galleryItems || []).filter((i) => i.id !== id);
    const deletedIds = Array.from(new Set([...(db.deletedGalleryIds || []), id]));
    await saveDb({ galleryItems: updatedItems, deletedGalleryIds: deletedIds });

    // 2. Prisma delete
    try {
      await prisma.galleryItem.delete({
        where: { id },
      });
    } catch (dbErr) {
      // Prisma fallback
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
