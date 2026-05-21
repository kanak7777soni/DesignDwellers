'use server';

import crypto from 'crypto';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/admin-auth';
import { registerMediaAssets } from '@/lib/media-library-store';
import { parseMediaStorageJson, type MediaStorageMetadata } from '@/lib/media-storage';
import { getUploadValidationError, saveUploadedMedia } from '@/lib/portfolio-store';
import {
  cleanHttpUrl,
  cleanMediaUrl,
  getInstagramReelsData,
  saveInstagramReelsData,
  type ManagedInstagramReel,
} from '@/lib/instagram-reels-store';
import { fetchInstagramMedia, isVideoLikeMedia, mergeImportedReels } from '@/lib/instagram-sync';

function formString(formData: FormData, key: string) {
  return String(formData.get(key) || '').trim();
}

function formMediaStorage(formData: FormData, key: string) {
  return parseMediaStorageJson(formData.get(key));
}

function mediaStorageForUrl({
  url,
  uploadedStorage,
  existingStorage,
  existingUrl,
}: {
  url: string | null;
  uploadedStorage?: MediaStorageMetadata;
  existingStorage?: MediaStorageMetadata | null;
  existingUrl?: string | null;
}) {
  if (uploadedStorage && uploadedStorage.url === url) {
    return uploadedStorage;
  }

  return url && existingUrl === url ? existingStorage || null : null;
}

async function registerReelMediaAssets(reel: ManagedInstagramReel) {
  try {
    await registerMediaAssets([reel.videoStorage, reel.thumbnailStorage], `instagram:${reel.id}`);
  } catch (error) {
    console.error('[admin] Instagram media library register failed', {
      message: error instanceof Error ? error.message : String(error),
    });
  }
}

function formNumber(formData: FormData, key: string, fallback: number) {
  const rawValue = formData.get(key);

  if (rawValue === null || rawValue === '') {
    return fallback;
  }

  const value = Number(rawValue);
  return Number.isFinite(value) ? value : fallback;
}

function formOptionalString(formData: FormData, key: string) {
  const value = formString(formData, key);
  return value || null;
}

function formHttpUrl(formData: FormData, key: string) {
  return cleanHttpUrl(formString(formData, key));
}

function formMediaUrl(formData: FormData, key: string) {
  return cleanMediaUrl(formString(formData, key));
}

function formFile(formData: FormData, key: string) {
  const value = formData.get(key);
  return value instanceof File && value.size > 0 ? value : null;
}

function getInstagramUploadError(formData: FormData) {
  const videoFile = formFile(formData, 'videoFile');
  const thumbnailFile = formFile(formData, 'thumbnailFile');
  const validationError = [videoFile, thumbnailFile].map(getUploadValidationError).find(Boolean);

  if (validationError) {
    return validationError;
  }

  if (videoFile && !videoFile.type.startsWith('video/')) {
    return 'Video upload must be a video file.';
  }

  if (thumbnailFile && !thumbnailFile.type.startsWith('image/')) {
    return 'Thumbnail upload must be an image file.';
  }

  return null;
}

function getReelUrlError(formData: FormData) {
  const permalink = formString(formData, 'permalink');
  const videoUrl = formString(formData, 'videoUrl');
  const thumbnailUrl = formString(formData, 'thumbnailUrl');

  if (!permalink || !cleanHttpUrl(permalink)) {
    return 'permalink';
  }

  if ((videoUrl && !cleanMediaUrl(videoUrl)) || (thumbnailUrl && !cleanMediaUrl(thumbnailUrl))) {
    return 'media-url';
  }

  return null;
}

function getApiVersion(value: string) {
  const trimmed = value.trim();
  return /^v\d+\.\d+$/.test(trimmed) ? trimmed : 'v25.0';
}

function getLookupLimit(value: number) {
  return Number.isFinite(value) ? Math.min(Math.max(Math.round(value), 1), 100) : 24;
}

function touchInstagramPaths() {
  revalidatePath('/');
  revalidatePath('/admin/instagram');
  revalidatePath('/api/instagram/videos');
}

export async function saveInstagramProfileAction(formData: FormData) {
  await requireAdmin();

  const data = await getInstagramReelsData();
  const profileUrl = formString(formData, 'url');

  if (profileUrl && !cleanHttpUrl(profileUrl)) {
    redirect('/admin/instagram?error=profile-url');
  }

  await saveInstagramReelsData({
    ...data,
    profile: {
      username: formOptionalString(formData, 'username'),
      url: formHttpUrl(formData, 'url'),
    },
  });

  touchInstagramPaths();
  redirect('/admin/instagram?status=profile-saved');
}

export async function saveInstagramReelAction(formData: FormData) {
  await requireAdmin();

  const data = await getInstagramReelsData();
  const id = formString(formData, 'id') || crypto.randomUUID();
  const existing = data.reels.find((reel) => reel.id === id);
  const urlError = getReelUrlError(formData);

  if (urlError) {
    redirect(existing ? `/admin/instagram?error=${urlError}#reel-${id}` : `/admin/instagram?error=${urlError}#new-reel`);
  }

  const uploadError = getInstagramUploadError(formData);

  if (uploadError) {
    redirect(existing ? `/admin/instagram?error=upload#reel-${id}` : '/admin/instagram?error=upload#new-reel');
  }

  const videoUpload = await saveUploadedMedia(formFile(formData, 'videoFile'), 'instagram-reels');
  const thumbnailUpload = await saveUploadedMedia(formFile(formData, 'thumbnailFile'), 'instagram-reels');
  const videoUrl = videoUpload || formMediaUrl(formData, 'videoUrl');
  const thumbnailUrl = thumbnailUpload || formMediaUrl(formData, 'thumbnailUrl');

  const reel: ManagedInstagramReel = {
    id,
    sourceId: existing?.sourceId || null,
    caption: formString(formData, 'caption') || existing?.caption || 'Design Dwellers Studio',
    videoUrl,
    thumbnailUrl,
    videoStorage: mediaStorageForUrl({
      url: videoUrl,
      uploadedStorage: formMediaStorage(formData, 'videoStorage'),
      existingStorage: existing?.videoStorage,
      existingUrl: existing?.videoUrl,
    }),
    thumbnailStorage: mediaStorageForUrl({
      url: thumbnailUrl,
      uploadedStorage: formMediaStorage(formData, 'thumbnailStorage'),
      existingStorage: existing?.thumbnailStorage,
      existingUrl: existing?.thumbnailUrl,
    }),
    permalink: formHttpUrl(formData, 'permalink') || '',
    timestamp: formOptionalString(formData, 'timestamp'),
    username: formOptionalString(formData, 'username') || data.profile.username,
    isReel: formData.get('isReel') === 'on',
    active: formData.get('active') === 'on',
    sortOrder: formNumber(formData, 'sortOrder', existing?.sortOrder ?? data.reels.length * 10 + 10),
  };

  const nextReels = existing
    ? data.reels.map((item) => item.id === id ? reel : item)
    : [...data.reels, reel];

  await saveInstagramReelsData({
    ...data,
    reels: nextReels,
  });
  await registerReelMediaAssets(reel);

  touchInstagramPaths();
  redirect('/admin/instagram?status=reel-saved');
}

export async function saveInstagramSettingsAction(formData: FormData) {
  await requireAdmin();

  const data = await getInstagramReelsData();
  const token = formString(formData, 'accessToken');
  const shouldClearToken = formData.get('clearToken') === 'on';

  await saveInstagramReelsData({
    ...data,
    settings: {
      ...data.settings,
      accessToken: shouldClearToken ? null : token || data.settings.accessToken,
      userId: formOptionalString(formData, 'userId'),
      apiVersion: getApiVersion(formString(formData, 'apiVersion')),
      lookupLimit: getLookupLimit(formNumber(formData, 'lookupLimit', data.settings.lookupLimit)),
      lastSyncError: null,
    },
  });

  revalidatePath('/admin/instagram');
  redirect('/admin/instagram?status=settings-saved');
}

export async function syncInstagramReelsAction() {
  await requireAdmin();

  const data = await getInstagramReelsData();
  let redirectTo = '/admin/instagram?status=synced';

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

    redirectTo = `/admin/instagram?status=synced&count=${videoMedia.length}`;
  } catch (error) {
    await saveInstagramReelsData({
      ...data,
      settings: {
        ...data.settings,
        lastSyncError: error instanceof Error ? error.message : 'Instagram sync failed.',
      },
    });

    redirectTo = '/admin/instagram?error=sync';
  }

  touchInstagramPaths();
  redirect(redirectTo);
}

export async function deleteInstagramReelAction(formData: FormData) {
  await requireAdmin();

  const data = await getInstagramReelsData();
  const id = formString(formData, 'id');

  await saveInstagramReelsData({
    ...data,
    reels: data.reels.filter((reel) => reel.id !== id),
  });

  touchInstagramPaths();
  redirect('/admin/instagram?status=reel-deleted');
}
