import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const mediaType = searchParams.get('type');

    let whereClause: any = {};
    if (category && category !== 'ALL') {
      whereClause.category = category;
    }
    if (mediaType && mediaType !== 'ALL') {
      whereClause.mediaType = mediaType;
    }

    const items = await prisma.galleryItem.findMany({
      where: whereClause,
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json({ items });
  } catch (error: any) {
    console.error('Error fetching gallery:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
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

    const item = await prisma.galleryItem.create({
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

    return NextResponse.json({ success: true, item });
  } catch (error: any) {
    console.error('Error creating gallery item:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, title, description, mediaType, mediaUrl, videoUrl, thumbnail, category, featured } = body;

    if (!id) {
      return NextResponse.json({ error: 'Gallery item ID is required' }, { status: 400 });
    }

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

    await prisma.galleryItem.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
