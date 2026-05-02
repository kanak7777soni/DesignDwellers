import { promises as fs } from 'fs';
import path from 'path';
import { readCrmBlobText, shouldUseBlobCrmStorage, writeCrmBlobText } from '@/lib/crm-blob-storage';
import {
  normalizeMediaStorage,
  uniqueMediaStorages,
  type MediaStorageMetadata,
} from '@/lib/media-storage';

export type MediaLibraryAsset = MediaStorageMetadata & {
  sources: string[];
  firstSeenAt: string;
  lastSeenAt: string;
  deletedAt?: string | null;
  deleteError?: string | null;
};

export type MediaLibraryData = {
  assets: MediaLibraryAsset[];
  updatedAt: string;
};

const DATA_DIR = path.join(process.cwd(), 'data');
const MEDIA_LIBRARY_FILE = path.join(DATA_DIR, 'media-library.json');
const BLOB_MEDIA_LIBRARY_FILE = 'crm/data/media-library.json';

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

function emptyMediaLibrary(): MediaLibraryData {
  return {
    assets: [],
    updatedAt: new Date().toISOString(),
  };
}

function normalizeAsset(asset: Partial<MediaLibraryAsset>): MediaLibraryAsset | null {
  const storage = normalizeMediaStorage(asset);

  if (!storage) {
    return null;
  }

  const now = new Date().toISOString();

  return {
    ...storage,
    sources: Array.isArray(asset.sources)
      ? Array.from(new Set(asset.sources.map((source) => String(source).trim()).filter(Boolean)))
      : [],
    firstSeenAt: typeof asset.firstSeenAt === 'string' && asset.firstSeenAt ? asset.firstSeenAt : now,
    lastSeenAt: typeof asset.lastSeenAt === 'string' && asset.lastSeenAt ? asset.lastSeenAt : now,
    deletedAt: typeof asset.deletedAt === 'string' && asset.deletedAt ? asset.deletedAt : null,
    deleteError: typeof asset.deleteError === 'string' && asset.deleteError ? asset.deleteError : null,
  };
}

function normalizeData(data: Partial<MediaLibraryData>): MediaLibraryData {
  return {
    assets: (data.assets || [])
      .map(normalizeAsset)
      .filter((asset): asset is MediaLibraryAsset => Boolean(asset))
      .sort((a, b) => b.lastSeenAt.localeCompare(a.lastSeenAt)),
    updatedAt: data.updatedAt || new Date().toISOString(),
  };
}

export async function getMediaLibraryData(): Promise<MediaLibraryData> {
  try {
    if (shouldUseBlobCrmStorage()) {
      const content = await readCrmBlobText(BLOB_MEDIA_LIBRARY_FILE);
      return content ? normalizeData(JSON.parse(content) as MediaLibraryData) : emptyMediaLibrary();
    }

    const content = await fs.readFile(MEDIA_LIBRARY_FILE, 'utf8');
    return normalizeData(JSON.parse(content) as MediaLibraryData);
  } catch {
    return emptyMediaLibrary();
  }
}

async function saveMediaLibraryData(data: MediaLibraryData) {
  const nextData = normalizeData({
    ...data,
    updatedAt: new Date().toISOString(),
  });
  const content = `${JSON.stringify(nextData, null, 2)}\n`;

  if (shouldUseBlobCrmStorage()) {
    await writeCrmBlobText(BLOB_MEDIA_LIBRARY_FILE, content);
    return nextData;
  }

  await ensureDataDir();
  await fs.writeFile(MEDIA_LIBRARY_FILE, content, 'utf8');
  return nextData;
}

export async function registerMediaAssets(
  storages: Array<MediaStorageMetadata | null | undefined>,
  source: string,
) {
  const uniqueStorages = uniqueMediaStorages(storages).filter((storage) => storage.provider === 'imagekit');

  if (uniqueStorages.length === 0) {
    return;
  }

  const data = await getMediaLibraryData();
  const now = new Date().toISOString();
  const assets = [...data.assets];

  uniqueStorages.forEach((storage) => {
    const existingIndex = assets.findIndex((asset) => asset.fileId === storage.fileId);

    if (existingIndex >= 0) {
      const existing = assets[existingIndex];
      assets[existingIndex] = {
        ...existing,
        ...storage,
        sources: Array.from(new Set([...existing.sources, source])),
        firstSeenAt: existing.firstSeenAt || now,
        lastSeenAt: now,
        deleteError: null,
      };
      return;
    }

    assets.push({
      ...storage,
      sources: [source],
      firstSeenAt: storage.uploadedAt || now,
      lastSeenAt: now,
      deletedAt: null,
      deleteError: null,
    });
  });

  await saveMediaLibraryData({
    ...data,
    assets,
  });
}

export async function markMediaAssetDeleted(fileId: string) {
  const data = await getMediaLibraryData();
  const now = new Date().toISOString();

  await saveMediaLibraryData({
    ...data,
    assets: data.assets.map((asset) => asset.fileId === fileId
      ? {
        ...asset,
        deletedAt: now,
        deleteError: null,
      }
      : asset),
  });
}

export async function markMediaAssetDeleteError(fileId: string, error: string) {
  const data = await getMediaLibraryData();

  await saveMediaLibraryData({
    ...data,
    assets: data.assets.map((asset) => asset.fileId === fileId
      ? {
        ...asset,
        deleteError: error,
      }
      : asset),
  });
}

export function formatBytes(value?: number) {
  if (!Number.isFinite(value) || !value || value <= 0) {
    return 'Unknown size';
  }

  const units = ['B', 'KB', 'MB', 'GB'];
  let size = value;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }

  return `${size >= 10 || unitIndex === 0 ? Math.round(size) : size.toFixed(1)} ${units[unitIndex]}`;
}
