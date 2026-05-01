import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { createImageKitUploadAuth } from '@/lib/imagekit';

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const auth = createImageKitUploadAuth();

  if (!auth) {
    return NextResponse.json(
      { error: 'ImageKit media storage is not configured. Add IMAGEKIT_PUBLIC_KEY and IMAGEKIT_PRIVATE_KEY.' },
      { status: 400 },
    );
  }

  return NextResponse.json(auth);
}
