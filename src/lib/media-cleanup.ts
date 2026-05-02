import { deleteImageKitFile } from '@/lib/imagekit-admin';
import {
  getMediaLibraryData,
  markMediaAssetDeleted,
  markMediaAssetDeleteError,
  type MediaLibraryAsset,
} from '@/lib/media-library-store';
import { normalizeMediaStorage, type MediaStorageMetadata } from '@/lib/media-storage';
import type { PortfolioProject, ProjectMedia } from '@/lib/portfolio';
import { getPortfolioData } from '@/lib/portfolio-store';
import { getInstagramReelsData, type ManagedInstagramReel } from '@/lib/instagram-reels-store';

export type MediaCleanupAsset = MediaLibraryAsset & {
  referenced: boolean;
  references: string[];
};

export type MediaCleanupSummary = {
  totalCount: number;
  activeCount: number;
  referencedCount: number;
  unusedCount: number;
  deletedCount: number;
  assets: MediaCleanupAsset[];
};

type ReferenceRegistry = {
  fileIds: Set<string>;
  urls: Set<string>;
  byFileId: Map<string, string[]>;
  byUrl: Map<string, string[]>;
};

function createReferenceRegistry(): ReferenceRegistry {
  return {
    fileIds: new Set(),
    urls: new Set(),
    byFileId: new Map(),
    byUrl: new Map(),
  };
}

function appendMapItem(map: Map<string, string[]>, key: string, value: string) {
  const current = map.get(key) || [];

  if (!current.includes(value)) {
    map.set(key, [...current, value]);
  }
}

function addReference(
  registry: ReferenceRegistry,
  storage: MediaStorageMetadata | null | undefined,
  url: string | null | undefined,
  label: string,
) {
  const normalizedStorage = normalizeMediaStorage(storage);
  const cleanUrl = typeof url === 'string' ? url.trim() : '';

  if (normalizedStorage) {
    registry.fileIds.add(normalizedStorage.fileId);
    appendMapItem(registry.byFileId, normalizedStorage.fileId, label);
  }

  if (cleanUrl) {
    registry.urls.add(cleanUrl);
    appendMapItem(registry.byUrl, cleanUrl, label);
  }
}

function addMediaReference(registry: ReferenceRegistry, media: ProjectMedia | undefined, label: string) {
  if (!media) {
    return;
  }

  addReference(registry, media.storage, media.src, label);
  addReference(registry, media.posterStorage, media.poster, `${label} poster`);
}

function addProjectReferences(registry: ReferenceRegistry, project: PortfolioProject) {
  addMediaReference(registry, project.cardMedia, `${project.name} card`);
  addMediaReference(registry, project.featuredMedia, `${project.name} home featured`);
  addReference(registry, project.seo?.imageStorage, project.seo?.image, `${project.name} SEO image`);

  project.detail.heroMedia.forEach((media, index) => {
    addMediaReference(registry, media, `${project.name} hero ${index + 1}`);
  });

  project.detail.galleryMedia.forEach((media, index) => {
    addMediaReference(registry, media, `${project.name} gallery ${index + 1}`);
  });
}

function addReelReferences(registry: ReferenceRegistry, reel: ManagedInstagramReel, index: number) {
  const label = reel.caption || `Instagram reel ${index + 1}`;
  addReference(registry, reel.videoStorage || undefined, reel.videoUrl, `${label} video`);
  addReference(registry, reel.thumbnailStorage || undefined, reel.thumbnailUrl, `${label} thumbnail`);
}

async function getReferenceRegistry() {
  const registry = createReferenceRegistry();
  const [portfolioData, instagramData] = await Promise.all([
    getPortfolioData(),
    getInstagramReelsData(),
  ]);

  portfolioData.projects.forEach((project) => addProjectReferences(registry, project));
  instagramData.reels.forEach((reel, index) => addReelReferences(registry, reel, index));

  return registry;
}

function getAssetReferences(asset: MediaLibraryAsset, registry: ReferenceRegistry) {
  const references = [
    ...(registry.byFileId.get(asset.fileId) || []),
    ...(registry.byUrl.get(asset.url) || []),
  ];

  return Array.from(new Set(references));
}

export async function getMediaCleanupSummary(): Promise<MediaCleanupSummary> {
  const [libraryData, registry] = await Promise.all([
    getMediaLibraryData(),
    getReferenceRegistry(),
  ]);

  const assets = libraryData.assets.map((asset) => {
    const references = getAssetReferences(asset, registry);
    const referenced = references.length > 0
      || registry.fileIds.has(asset.fileId)
      || registry.urls.has(asset.url);

    return {
      ...asset,
      referenced,
      references,
    };
  });
  const activeAssets = assets.filter((asset) => !asset.deletedAt);

  return {
    totalCount: assets.length,
    activeCount: activeAssets.length,
    referencedCount: activeAssets.filter((asset) => asset.referenced).length,
    unusedCount: activeAssets.filter((asset) => !asset.referenced).length,
    deletedCount: assets.filter((asset) => asset.deletedAt).length,
    assets: assets.sort((a, b) => {
      if (Boolean(a.deletedAt) !== Boolean(b.deletedAt)) {
        return a.deletedAt ? 1 : -1;
      }

      if (a.referenced !== b.referenced) {
        return a.referenced ? 1 : -1;
      }

      return b.lastSeenAt.localeCompare(a.lastSeenAt);
    }),
  };
}

export async function deleteUnusedMediaAsset(fileId: string) {
  const summary = await getMediaCleanupSummary();
  const asset = summary.assets.find((item) => item.fileId === fileId);

  if (!asset || asset.deletedAt) {
    throw new Error('This media asset is not available for deletion.');
  }

  if (asset.referenced) {
    throw new Error('This media asset is still referenced by the website.');
  }

  try {
    await deleteImageKitFile(asset.fileId);
    await markMediaAssetDeleted(asset.fileId);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'ImageKit delete failed.';
    await markMediaAssetDeleteError(asset.fileId, message);
    throw error;
  }
}
