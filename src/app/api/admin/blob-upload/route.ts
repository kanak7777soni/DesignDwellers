import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { getMediaBlobToken } from '@/lib/blob-tokens';
import { ALLOWED_UPLOAD_TYPES, MAX_BLOB_UPLOAD_BYTES } from '@/lib/media-upload';

export async function POST(request: Request) {
  const token = getMediaBlobToken();

  if (!token) {
    return NextResponse.json({ error: 'Public media Blob storage is not configured.' }, { status: 400 });
  }

  const body = (await request.json()) as HandleUploadBody;

  if (body.type === 'blob.generate-client-token' && !(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const response = await handleUpload({
      body,
      request,
      token,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        if (!pathname.startsWith('crm/')) {
          throw new Error('Invalid upload path.');
        }

        return {
          allowedContentTypes: ALLOWED_UPLOAD_TYPES,
          maximumSizeInBytes: MAX_BLOB_UPLOAD_BYTES,
          addRandomSuffix: true,
          cacheControlMaxAge: 31536000,
          tokenPayload: clientPayload,
        };
      },
    });

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed.' },
      { status: 400 },
    );
  }
}
