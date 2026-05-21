import {
  cleanHttpUrl,
  cleanMediaUrl,
  type InstagramSyncSettings,
  type ManagedInstagramReel,
} from '@/lib/instagram-reels-store';

export type InstagramGraphMedia = {
  id?: string;
  caption?: string;
  media_type?: string;
  media_product_type?: string;
  media_url?: string;
  thumbnail_url?: string;
  permalink?: string;
  timestamp?: string;
  username?: string;
};

type InstagramGraphResponse = {
  data?: InstagramGraphMedia[];
  error?: {
    message?: string;
  };
};

type InstagramUserResponse = {
  data?: Array<{
    user_id?: string;
    username?: string;
  }>;
  user_id?: string;
  username?: string;
  error?: {
    message?: string;
  };
};

function getInstagramUserId(payload: InstagramUserResponse) {
  return payload.user_id?.trim() || payload.data?.[0]?.user_id?.trim() || null;
}

async function resolveInstagramUserId(settings: InstagramSyncSettings) {
  if (settings.userId) {
    return settings.userId;
  }

  const endpoints = [
    `https://graph.instagram.com/${settings.apiVersion}/me`,
    'https://graph.instagram.com/me',
  ];
  let lastError = '';

  for (const endpoint of endpoints) {
    const url = new URL(endpoint);
    url.searchParams.set('fields', 'user_id,username');
    url.searchParams.set('access_token', settings.accessToken || '');

    const response = await fetch(url, { cache: 'no-store' });
    const payload = await response.json().catch(() => ({})) as InstagramUserResponse;
    const userId = response.ok && !payload.error ? getInstagramUserId(payload) : null;

    if (userId) {
      return userId;
    }

    lastError = payload.error?.message || lastError;
  }

  throw new Error(lastError || 'Instagram user ID could not be resolved from this access token.');
}

function getInstagramMediaEndpoints(settings: InstagramSyncSettings, userId: string) {
  const encodedUserId = encodeURIComponent(userId);

  return [
    `https://graph.facebook.com/${settings.apiVersion}/${encodedUserId}/media`,
    `https://graph.instagram.com/${settings.apiVersion}/${encodedUserId}/media`,
  ];
}

export async function fetchInstagramMedia(settings: InstagramSyncSettings) {
  if (!settings.accessToken) {
    throw new Error('Add an Instagram access token before syncing.');
  }

  const userId = await resolveInstagramUserId(settings);
  let lastError = 'Instagram sync failed.';

  for (const endpoint of getInstagramMediaEndpoints(settings, userId)) {
    const url = new URL(endpoint);
    url.searchParams.set('fields', 'id,caption,media_type,media_product_type,media_url,thumbnail_url,permalink,timestamp,username');
    url.searchParams.set('limit', String(settings.lookupLimit));
    url.searchParams.set('access_token', settings.accessToken);

    const response = await fetch(url, { cache: 'no-store' });
    const payload = await response.json().catch(() => ({})) as InstagramGraphResponse;

    if (response.ok && !payload.error) {
      return payload.data || [];
    }

    lastError = payload.error?.message || lastError;
  }

  throw new Error(lastError);
}

export function isVideoLikeMedia(media: InstagramGraphMedia) {
  return media.media_type === 'VIDEO' || media.media_product_type === 'REELS';
}

export function mergeImportedReels({
  currentReels,
  importedMedia,
  profileUsername,
  pruneMissingImported,
}: {
  currentReels: ManagedInstagramReel[];
  importedMedia: InstagramGraphMedia[];
  profileUsername: string | null;
  pruneMissingImported?: boolean;
}) {
  const importedVideoMedia = importedMedia.filter((media) => media.id && isVideoLikeMedia(media));
  const importedSourceIds = new Set(importedVideoMedia.map((media) => String(media.id)));
  const nextReels = currentReels
    .filter((reel) => !pruneMissingImported || !reel.sourceId || importedSourceIds.has(reel.sourceId))
    .map((reel) => ({ ...reel }));
  const findImportedReelIndex = (sourceId: string) => nextReels.findIndex((reel) => reel.sourceId === sourceId || reel.id === sourceId || reel.id === `ig-${sourceId}`);
  const existingSortOrders = nextReels
    .map((reel) => reel.sortOrder)
    .filter((sortOrder) => Number.isFinite(sortOrder));
  const hasExistingReels = existingSortOrders.length > 0;
  const minExistingSortOrder = hasExistingReels ? Math.min(...existingSortOrders) : 10;
  const newImportedCount = importedVideoMedia.filter((media) => findImportedReelIndex(String(media.id)) < 0).length;
  let nextNewSortOrder = hasExistingReels ? minExistingSortOrder - newImportedCount * 10 : 10;

  importedVideoMedia
    .forEach((media, index) => {
      const sourceId = String(media.id);
      const existingIndex = findImportedReelIndex(sourceId);
      const existing = existingIndex >= 0 ? nextReels[existingIndex] : null;
      const permalink = cleanHttpUrl(media.permalink) || existing?.permalink || '';
      const importedVideoUrl = cleanMediaUrl(media.media_url);
      const importedThumbnailUrl = cleanMediaUrl(media.thumbnail_url);
      const videoUrl = importedVideoUrl || existing?.videoUrl || null;
      const thumbnailUrl = importedThumbnailUrl || existing?.thumbnailUrl || null;
      const sortOrder = existing?.sortOrder ?? (hasExistingReels ? nextNewSortOrder : (index + 1) * 10);

      if (!permalink) {
        return;
      }

      if (!existing) {
        nextNewSortOrder += 10;
      }

      const reel: ManagedInstagramReel = {
        id: existing?.id || `ig-${sourceId}`,
        sourceId,
        caption: media.caption?.trim() || existing?.caption || 'Design Dwellers Studio',
        videoUrl,
        thumbnailUrl,
        videoStorage: existing?.videoUrl === videoUrl ? existing?.videoStorage || null : null,
        thumbnailStorage: existing?.thumbnailUrl === thumbnailUrl ? existing?.thumbnailStorage || null : null,
        permalink,
        timestamp: media.timestamp?.trim() || existing?.timestamp || null,
        username: media.username?.trim() || existing?.username || profileUsername,
        isReel: existing?.isReel ?? true,
        active: existing?.active ?? true,
        sortOrder,
      };

      if (existingIndex >= 0) {
        nextReels[existingIndex] = reel;
      } else {
        nextReels.push(reel);
      }
    });

  return nextReels;
}
