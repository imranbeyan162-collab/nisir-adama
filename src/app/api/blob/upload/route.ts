import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const token = process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL_BLOB_TOKEN || process.env.BLOB_TOKEN;

    const jsonResponse = await handleUpload({
      body,
      request,
      ...(token ? { token } : {}),
      onBeforeGenerateToken: async (pathname) => {
        return {
          allowedContentTypes: [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/webp',
            'image/gif',
            'image/svg+xml',
            'video/mp4',
            'video/webm',
            'video/quicktime',
            'video/x-matroska',
            'video/3gpp',
            'video/ogg',
            'application/pdf',
          ],
          tokenPayload: JSON.stringify({
            uploadedBy: 'nisir-admin',
          }),
        };
      },
      onUploadCompleted: async ({ blob }) => {
        console.log('✅ Large file directly uploaded to Vercel Blob:', blob.url);
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error: any) {
    console.error('Blob token generation error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to initialize direct blob upload' },
      { status: 400 }
    );
  }
}
