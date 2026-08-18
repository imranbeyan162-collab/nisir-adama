import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const globalStore = globalThis as unknown as {
  __nisir_gallery_items?: any[];
  __nisir_deleted_gallery_ids?: Set<string>;
};

if (!globalStore.__nisir_gallery_items) {
  globalStore.__nisir_gallery_items = [
    {
      id: 'seed_init_1',
      title: 'Morning Training at Chapi Stadium',
      description: 'Tactical drills, agility work, and team spirit.',
      mediaType: 'photo',
      mediaUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?q=80&w=1200&auto=format&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?q=80&w=600&auto=format&fit=crop',
      category: 'Training',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'seed_init_2',
      title: 'U15 Championship Match',
      description: 'Nisir Academy championship match action.',
      mediaType: 'photo',
      mediaUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200&auto=format&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=600&auto=format&fit=crop',
      category: 'Match',
      createdAt: new Date().toISOString(),
    },
  ];
}

if (!globalStore.__nisir_deleted_gallery_ids) {
  globalStore.__nisir_deleted_gallery_ids = new Set<string>();
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const mediaType = searchParams.get('type');

    let dbItems: any[] = [];
    try {
      let whereClause: any = {};
      if (category && category !== 'ALL') whereClause.category = category;
      if (mediaType && mediaType !== 'ALL') whereClause.mediaType = mediaType;

      dbItems = await prisma.galleryItem.findMany({
        where: whereClause,
        orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
      });
    } catch (dbErr) {
      console.warn('Gallery DB fallback in GET:', dbErr);
    }

    const memItems = globalStore.__nisir_gallery_items || [];
    const deletedIds = globalStore.__nisir_deleted_gallery_ids || new Set<string>();

    const combined = [...memItems, ...dbItems];
    const uniqueMap = new Map();
    combined.forEach((item) => {
      const key = item.id || item.mediaUrl;
      if (item && !deletedIds.has(item.id) && !deletedIds.has(key) && !uniqueMap.has(key)) {
        uniqueMap.set(key, item);
      }
    });

    let items = Array.from(uniqueMap.values());
    if (category && category !== 'ALL') {
      items = items.filter((i) => i.category === category);
    }
    if (mediaType && mediaType !== 'ALL') {
      items = items.filter((i) => i.mediaType === mediaType);
    }

    return NextResponse.json({ items });
  } catch (error: any) {
    console.error('Error fetching gallery:', error);
    return NextResponse.json({ items: globalStore.__nisir_gallery_items || [] });
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

    const newItem = {
      id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      title,
      description: description || null,
      mediaType: mediaType || 'photo',
      mediaUrl,
      videoUrl: videoUrl || null,
      thumbnail: thumbnail || mediaUrl,
      category: category || 'Match',
      featured: Boolean(featured),
      createdAt: new Date().toISOString(),
    };

    // 1. Save to in-memory store
    if (!globalStore.__nisir_gallery_items) globalStore.__nisir_gallery_items = [];
    globalStore.__nisir_gallery_items.unshift(newItem);

    // 2. Attempt DB write if available
    try {
      const dbItem = await prisma.galleryItem.create({
        data: {
          title,
          description: description || null,
          mediaType: mediaType || 'photo',
          mediaUrl,
          videoUrl: videoUrl || null,
          thumbnail: thumbnail || mediaUrl,
          category: category || 'Match',
          featured: Boolean(featured),
        },
      });
      return NextResponse.json({ success: true, item: dbItem });
    } catch (dbErr) {
      console.warn('DB write bypassed, saved to memory store:', dbErr);
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

    // Track deleted ID so it is NEVER restored
    if (!globalStore.__nisir_deleted_gallery_ids) {
      globalStore.__nisir_deleted_gallery_ids = new Set<string>();
    }
    globalStore.__nisir_deleted_gallery_ids.add(id);

    if (globalStore.__nisir_gallery_items) {
      globalStore.__nisir_gallery_items = globalStore.__nisir_gallery_items.filter((i) => i.id !== id);
    }

    try {
      await prisma.galleryItem.delete({
        where: { id },
      });
    } catch (dbErr) {
      console.warn('DB delete bypassed:', dbErr);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
