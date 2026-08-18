import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';

    // 1. Handle JSON payload (base64 or direct URL)
    if (contentType.includes('application/json')) {
      const body = await req.json();
      const image = body.image || body.file || body.mediaUrl;
      if (!image) {
        return NextResponse.json({ error: 'No media data provided' }, { status: 400 });
      }

      // If already a valid web URL, return it directly
      if (typeof image === 'string' && (image.startsWith('http://') || image.startsWith('https://'))) {
        return NextResponse.json({ success: true, url: image });
      }

      // If base64 data URL, attempt Vercel Blob upload
      if (typeof image === 'string' && image.startsWith('data:')) {
        try {
          const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
          if (matches && matches.length === 3) {
            const mimeType = matches[1];
            const ext = mimeType.split('/')[1]?.replace('jpeg', 'jpg') || 'png';
            const buffer = Buffer.from(matches[2], 'base64');
            const safeName = `nisir-upload-${Date.now()}.${ext}`;
            
            const token = process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL_BLOB_TOKEN || process.env.BLOB_TOKEN;
            const blob = await put(safeName, buffer, {
              access: 'public',
              contentType: mimeType,
              ...(token ? { token } : {}),
            });
            return NextResponse.json({ success: true, url: blob.url });
          }
        } catch (blobErr) {
          console.warn('Vercel blob base64 upload fallback:', blobErr);
        }
      }

      // Return base64 URL directly if blob upload is not available
      return NextResponse.json({ success: true, url: image });
    }

    // 2. Handle Multipart Form-Data (file uploaded from phone or computer)
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file received in upload request' }, { status: 400 });
    }

    const ext = path.extname(file.name) || (file.type.includes('video') ? '.mp4' : '.jpg');
    const baseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const safeName = `nisir-${Date.now()}-${baseName}${ext}`;

    // A. Priority 1: VERCEL BLOB STORAGE (Permanent Cloud Storage on Vercel)
    try {
      const token = process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL_BLOB_TOKEN || process.env.BLOB_TOKEN;
      const blob = await put(safeName, file, {
        access: 'public',
        contentType: file.type || 'application/octet-stream',
        ...(token ? { token } : {}),
      });
      return NextResponse.json({ success: true, url: blob.url, filename: safeName });
    } catch (blobErr: any) {
      console.warn('Vercel Blob direct upload attempt:', blobErr?.message || blobErr);
    }

    // B. Priority 2: Safe Local Disk File Storage (Local Dev / VPS / Railway)
    try {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      const filePath = path.join(uploadsDir, safeName);
      fs.writeFileSync(filePath, buffer);

      return NextResponse.json({ success: true, url: `/uploads/${safeName}`, filename: safeName });
    } catch (fsErr: any) {
      console.warn('Filesystem write not available (read-only environment), using base64 fallback');
    }

    // C. Priority 3: Universal Base64 Data URL (Never Fails)
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Data = buffer.toString('base64');
    const mime = file.type || (ext === '.mp4' ? 'video/mp4' : 'image/jpeg');
    const dataUrl = `data:${mime};base64,${base64Data}`;

    return NextResponse.json({ success: true, url: dataUrl, filename: safeName });
  } catch (error: any) {
    console.error('Universal upload handler error:', error);
    return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 });
  }
}
