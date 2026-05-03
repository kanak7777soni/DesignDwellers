import { NextResponse } from 'next/server';
import { getActiveInstagramReels, getInstagramReelsData } from '@/lib/instagram-reels-store';

export const dynamic = 'force-dynamic';

export async function GET() {
  const data = await getInstagramReelsData();
  const videos = getActiveInstagramReels(data).map((reel) => ({
    id: reel.id,
    sourceId: reel.sourceId || reel.id,
    caption: reel.caption,
    mediaType: 'VIDEO',
    videoUrl: reel.videoUrl,
    thumbnailUrl: reel.thumbnailUrl,
    permalink: reel.permalink,
    timestamp: reel.timestamp,
    username: reel.username || data.profile.username,
    isReel: reel.isReel,
  }));

  return NextResponse.json(
    {
      configured: videos.length > 0,
      videos,
      profile: data.profile,
    },
    {
      headers: {
        'Cache-Control': 'no-store',
      },
    }
  );
}
