export type MediaStorageMetadata = {
  provider: 'imagekit';
  fileId: string;
  url: string;
  filePath?: string;
  name?: string;
  size?: number;
  fileType?: string;
  uploadedAt?: string;
};

export function normalizeMediaStorage(value: unknown): MediaStorageMetadata | undefined {
  if (!value || typeof value !== 'object') {
    return undefined;
  }

  const item = value as Partial<MediaStorageMetadata>;

  if (item.provider !== 'imagekit' || !item.fileId || !item.url) {
    return undefined;
  }

  return {
    provider: 'imagekit',
    fileId: item.fileId,
    url: item.url,
    ...(item.filePath ? { filePath: item.filePath } : {}),
    ...(item.name ? { name: item.name } : {}),
    ...(Number.isFinite(item.size) ? { size: Number(item.size) } : {}),
    ...(item.fileType ? { fileType: item.fileType } : {}),
    ...(item.uploadedAt ? { uploadedAt: item.uploadedAt } : {}),
  };
}

export function parseMediaStorageJson(value: unknown): MediaStorageMetadata | undefined {
  if (typeof value !== 'string' || !value.trim()) {
    return undefined;
  }

  try {
    return normalizeMediaStorage(JSON.parse(value));
  } catch {
    return undefined;
  }
}

export function uniqueMediaStorages(items: Array<MediaStorageMetadata | null | undefined>) {
  const seen = new Set<string>();
  const unique: MediaStorageMetadata[] = [];

  items.forEach((item) => {
    if (!item || seen.has(item.fileId)) {
      return;
    }

    seen.add(item.fileId);
    unique.push(item);
  });

  return unique;
}
