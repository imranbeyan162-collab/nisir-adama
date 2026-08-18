import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const globalStore = globalThis as unknown as {
  __nisir_gallery_items?: any[];
};

if (!globalStore.__nisir_gallery_items) {
  globalStore.__nisir_gallery_items = [];
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
    
    // Combine and deduplicate
    const combined = [...memItems, ...dbItems];
    const uniqueMap = new Map();
    combined.forEach((item) => {
      const key = item.id || item.mediaUrl;
      if (!uniqueMap.has(key)) {
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

    if (items.length === 0) {
      items = [
        {
          id: 'def_1',
          title: 'Morning Training at Chapi Stadium',
          description: 'Tactical drills, agility work, and team spirit.',
          mediaType: 'photo',
          mediaUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?q=80&w=1200&auto=format&fit=crop',
          thumbnail: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?q=80&w=600&auto=format&fit=crop',
          category: 'Training',
        },
        {
          id: 'def_2',
          title: 'U15 Championship Match',
          description: 'Nisir Academy championship match action.',
          mediaType: 'photo',
          mediaUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200&auto=format&fit=crop',
          thumbnail: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=600&auto=format&fit=crop',
          category: 'Match',
        },
      ];
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
      category: category || 'Training',
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
          category: category || 'Training',
          featured: Boolean(featured),
        },
      });
      return NextResponse.json({ success: true, item: dbItem });
    } catch (dbErr) {
      console.warn('DB write bypassed, saved to memory:', dbErr);
    }

    return NextResponse.json({ success: true, item: newItem });
  } catch (error: any) {
    console.error('Error creating gallery item:', error);
    return NextResponse.json({ error: error.message || 'Failed to create item' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, title, description, mediaType, mediaUrl, videoUrl, thumbnail, category, featured } = body;

    if (!id) {
      return NextResponse.json({ error: 'Gallery item ID is required' }, { status: 400 });
    }

    if (globalStore.__nisir_gallery_items) {
      const idx = globalStore.__nisir_gallery_items.findIndex((i) => i.id === id);
      if (idx !== -1) {
        globalStore.__nisir_gallery_items[idx] = {
          ...globalStore.__nisir_gallery_items[idx],
          ...(title !== undefined && { title }),
          ...(description !== undefined && { description }),
          ...(mediaType !== undefined && { mediaType }),
          ...(mediaUrl !== undefined && { mediaUrl }),
          ...(videoUrl !== undefined && { videoUrl }),
          ...(thumbnail !== undefined && { thumbnail }),
          ...(category !== undefined && { category }),
          ...(featured !== undefined && { featured }),
        };
      }
    }

    try {
      const updated = await prisma.galleryItem.update({
        where: { id },
        data: {
          title: title !== undefined ? title : undefined,
          description: description !== undefined ? description : undefined,
          mediaType: mediaType !== undefined ? mediaType : undefined,
          mediaUrl: mediaUrl !== undefined ? mediaUrl : undefined,
          videoUrl: videoUrl !== undefined ? videoUrl : undefined,
          thumbnail: thumbnail !== undefined ? thumbnail : undefined,
          category: category !== undefined ? category : undefined,
          featured: featured !== undefined ? Boolean(featured) : undefined,
        },
      });
      return NextResponse.json({ success: true, item: updated });
    } catch (dbErr) {
      console.warn('DB update bypassed:', dbErr);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Gallery item ID is required' }, { status: 400 });
    }

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
