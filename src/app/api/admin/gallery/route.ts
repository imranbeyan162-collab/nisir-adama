import { NextRequest, NextResponse } from 'next/server';
import { getDb, saveDb, GalleryItemData } from '@/lib/blobDb';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const mediaType = searchParams.get('type');

    // 1. Fetch from permanent Vercel Blob Database
    const db = await getDb();
    let items = (db.galleryItems || []).filter((item) => Boolean(item && item.id && item.mediaUrl));

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
      id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      title: title.trim(),
      description: description ? description.trim() : null,
      mediaType: mediaType || 'photo',
      mediaUrl: mediaUrl.trim(),
      videoUrl: videoUrl ? videoUrl.trim() : null,
      thumbnail: thumbnail ? thumbnail.trim() : mediaUrl.trim(),
      category: category || 'Match',
      featured: Boolean(featured),
      createdAt: new Date().toISOString(),
    };

    // 1. Save permanently to Vercel Blob Database
    const db = await getDb();
    const currentItems = (db.galleryItems || []).filter((i) => i && i.id !== newItem.id);
    currentItems.unshift(newItem);
    await saveDb({ galleryItems: currentItems });

    console.log(`✅ Gallery item added: "${newItem.title}" (${newItem.id}). Total items: ${currentItems.length}`);

    return NextResponse.json({ success: true, item: newItem, total: currentItems.length });
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

    const cleanId = decodeURIComponent(id).trim();

    // 1. Delete permanently from Vercel Blob Database
    const db = await getDb();
    const initialCount = (db.galleryItems || []).length;
    const updatedItems = (db.galleryItems || []).filter((i) => i && i.id !== id && i.id !== cleanId);

    await saveDb({ galleryItems: updatedItems });

    console.log(`🗑️ Gallery item deleted: ${cleanId}. Previous count: ${initialCount}, New count: ${updatedItems.length}`);

    return NextResponse.json({ success: true, remaining: updatedItems.length });
  } catch (error: any) {
    console.error('Error deleting gallery item:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
