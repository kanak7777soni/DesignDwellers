import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { getMediaBlobToken } from '@/lib/blob-tokens';
import { getUploadValidationErrorForFile, VERCEL_FUNCTION_BODY_LIMIT_BYTES } from '@/lib/media-upload';

function isSafeCrmPathname(pathname: string) {
  return pathname.startsWith('crm/')
    && pathname.length <= 950
    && !pathname.includes('..')
    && !pathname.includes('\\');
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const token = getMediaBlobToken();

  if (!token) {
    return NextResponse.json({ error: 'Public media Blob storage is not configured.' }, { status: 400 });
  }

  const formData = await request.formData();
  const pathname = String(formData.get('pathname') || '');
  const file = formData.get('file');

  if (!isSafeCrmPathname(pathname)) {
    return NextResponse.json({ error: 'Invalid upload path.' }, { status: 400 });
  }

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: 'Missing upload file.' }, { status: 400 });
  }

  if (file.size > VERCEL_FUNCTION_BODY_LIMIT_BYTES) {
    return NextResponse.json({ error: 'This file needs direct Blob upload because it is larger than the site upload limit.' }, { status: 413 });
  }

  const validationError = getUploadValidationErrorForFile(file);

  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  try {
    const blob = await put(pathname, file, {
      access: 'public',
      addRandomSuffix: true,
      cacheControlMaxAge: 31536000,
      contentType: file.type,
      token,
    });

    return NextResponse.json(blob);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed.' },
      { status: 502 },
    );
  }
}
