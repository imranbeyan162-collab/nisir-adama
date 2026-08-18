import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';

    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // 1. Handle JSON payload with base64 data or direct URL
    if (contentType.includes('application/json')) {
      const body = await req.json();
      const image = body.image || body.file || body.mediaUrl;
      if (!image) {
        return NextResponse.json({ error: 'No media data provided' }, { status: 400 });
      }

      // If base64 data URL, decode and save to file for persistent static delivery
      if (typeof image === 'string' && image.startsWith('data:')) {
        const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          const mimeType = matches[1];
          const ext = mimeType.split('/')[1]?.replace('jpeg', 'jpg') || 'png';
          const buffer = Buffer.from(matches[2], 'base64');
          const safeName = `upload-${Date.now()}.${ext}`;
          const filePath = path.join(uploadsDir, safeName);
          fs.writeFileSync(filePath, buffer);
          return NextResponse.json({ success: true, url: `/uploads/${safeName}` });
        }
      }

      return NextResponse.json({ success: true, url: image });
    }

    // 2. Handle multipart form-data (file upload from input or drag-and-drop)
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file was received in upload request' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = path.extname(file.name) || '.jpg';
    const baseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const safeName = `${Date.now()}-${baseName}${ext}`;
    const filePath = path.join(uploadsDir, safeName);
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${safeName}`;
    return NextResponse.json({ success: true, url: publicUrl, filename: safeName });
  } catch (error: any) {
    console.error('Upload handler error:', error);
    return NextResponse.json({ error: error.message || 'File upload failed' }, { status: 500 });
  }
}
