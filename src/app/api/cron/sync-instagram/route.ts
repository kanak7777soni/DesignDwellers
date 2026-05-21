import { NextResponse } from 'next/server';
import {
  getInstagramReelsData,
  saveInstagramReelsData,
} from '@/lib/instagram-reels-store';
import { fetchInstagramMedia, isVideoLikeMedia, mergeImportedReels } from '@/lib/instagram-sync';

export const dynamic = 'force-dynamic';

function isAuthorized(request: Request) {
  // Vercel Cron sends the CRON_SECRET as a Bearer token.
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    // No secret configured — allow in development, block in production.
    return !process.env.VERCEL;
  }

  const authHeader = request.headers.get('authorization');
  return authHeader === `Bearer ${cronSecret}`;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await getInstagramReelsData();

  // If no access token is configured, skip silently.
  if (!data.settings.accessToken) {
    return NextResponse.json({
      status: 'skipped',
      reason: 'No Instagram access token configured.',
    });
  }

  try {
    const importedMedia = await fetchInstagramMedia(data.settings);
    const videoMedia = importedMedia.filter(isVideoLikeMedia);

    await saveInstagramReelsData({
      ...data,
      reels: mergeImportedReels({
        currentReels: data.reels,
        importedMedia,
        profileUsername: data.profile.username,
        pruneMissingImported: videoMedia.length < data.settings.lookupLimit,
      }),
      settings: {
        ...data.settings,
        lastSyncedAt: new Date().toISOString(),
        lastSyncError: null,
      },
    });

    return NextResponse.json({
      status: 'synced',
      count: videoMedia.length,
      syncedAt: new Date().toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Instagram sync failed.';

    // Persist the error so it shows in the admin panel.
    await saveInstagramReelsData({
      ...data,
      settings: {
        ...data.settings,
        lastSyncError: message,
      },
    });

    console.error('[cron] Instagram sync failed:', message);

    return NextResponse.json(
      { status: 'error', error: message },
      { status: 500 },
    );
  }
}
