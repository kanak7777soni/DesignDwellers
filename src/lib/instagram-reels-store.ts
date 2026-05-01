import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';
import { readCrmBlobText, shouldUseBlobCrmStorage, writeCrmBlobText } from '@/lib/crm-blob-storage';

export type ManagedInstagramReel = {
  id: string;
  sourceId: string | null;
  caption: string;
  videoUrl: string | null;
  thumbnailUrl: string | null;
  permalink: string;
  timestamp: string | null;
  username: string | null;
  isReel: boolean;
  active: boolean;
  sortOrder: number;
};

export type InstagramSyncSettings = {
  accessToken: string | null;
  userId: string | null;
  apiVersion: string;
  lookupLimit: number;
  lastSyncedAt: string | null;
  lastSyncError: string | null;
};

export type InstagramReelsData = {
  profile: {
    username: string | null;
    url: string | null;
  };
  reels: ManagedInstagramReel[];
  settings: InstagramSyncSettings;
  updatedAt: string;
};

const DATA_DIR = path.join(process.cwd(), 'data');
const REELS_FILE = path.join(DATA_DIR, 'instagram-reels.json');
const BLOB_REELS_FILE = 'crm/data/instagram-reels.json';

const defaultProfile = {
  username: 'DesignDwellersstudio',
  url: 'https://www.instagram.com/designdwellersstudio/',
};

const defaultSettings: InstagramSyncSettings = {
  accessToken: null,
  userId: null,
  apiVersion: 'v25.0',
  lookupLimit: 24,
  lastSyncedAt: null,
  lastSyncError: null,
};

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

const ENCRYPTED_TOKEN_PREFIX = 'enc:v1:';

function getTokenEncryptionKey() {
  const secret = process.env.ADMIN_SESSION_SECRET || '';

  if (!secret) {
    return null;
  }

  return crypto.createHash('sha256').update(secret).digest();
}

function encryptAccessToken(value: string | null) {
  if (!value) {
    return null;
  }

  const key = getTokenEncryptionKey();

  if (!key) {
    return value;
  }

  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();

  return `${ENCRYPTED_TOKEN_PREFIX}${iv.toString('base64url')}.${tag.toString('base64url')}.${encrypted.toString('base64url')}`;
}

function decryptAccessToken(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  if (!value.startsWith(ENCRYPTED_TOKEN_PREFIX)) {
    return value;
  }

  const key = getTokenEncryptionKey();

  if (!key) {
    return null;
  }

  try {
    const [ivValue, tagValue, encryptedValue] = value.slice(ENCRYPTED_TOKEN_PREFIX.length).split('.');

    if (!ivValue || !tagValue || !encryptedValue) {
      return null;
    }

    const decipher = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(ivValue, 'base64url'));
    decipher.setAuthTag(Buffer.from(tagValue, 'base64url'));

    return Buffer.concat([
      decipher.update(Buffer.from(encryptedValue, 'base64url')),
      decipher.final(),
    ]).toString('utf8');
  } catch {
    return null;
  }
}

export function getSeedInstagramReelsData(): InstagramReelsData {
  return {
    profile: defaultProfile,
    reels: [],
    settings: defaultSettings,
    updatedAt: new Date().toISOString(),
  };
}

export function cleanHttpUrl(value: unknown) {
  const nextValue = typeof value === 'string' ? value.trim() : '';

  if (!nextValue) {
    return null;
  }

  try {
    const parsed = new URL(nextValue);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:' ? parsed.toString() : null;
  } catch {
    return null;
  }
}

export function cleanMediaUrl(value: unknown) {
  const nextValue = typeof value === 'string' ? value.trim() : '';

  if (!nextValue) {
    return null;
  }

  if (nextValue.startsWith('/uploads/portfolio/')) {
    return nextValue;
  }

  return cleanHttpUrl(nextValue);
}

function normalizeSettings(settings?: Partial<InstagramSyncSettings>): InstagramSyncSettings {
  const lookupLimit = Number(settings?.lookupLimit);

  return {
    accessToken: decryptAccessToken(settings?.accessToken?.trim()),
    userId: settings?.userId?.trim() || null,
    apiVersion: settings?.apiVersion?.trim() || defaultSettings.apiVersion,
    lookupLimit: Number.isFinite(lookupLimit) ? Math.min(Math.max(Math.round(lookupLimit), 1), 100) : defaultSettings.lookupLimit,
    lastSyncedAt: settings?.lastSyncedAt?.trim() || null,
    lastSyncError: settings?.lastSyncError?.trim() || null,
  };
}

function normalizeReel(reel: Partial<ManagedInstagramReel>, index: number): ManagedInstagramReel {
  return {
    id: reel.id || `reel-${index + 1}`,
    sourceId: reel.sourceId?.trim() || null,
    caption: reel.caption?.trim() || 'Design Dwellers Studio',
    videoUrl: cleanMediaUrl(reel.videoUrl),
    thumbnailUrl: cleanMediaUrl(reel.thumbnailUrl),
    permalink: cleanHttpUrl(reel.permalink) || defaultProfile.url,
    timestamp: reel.timestamp?.trim() || null,
    username: reel.username?.trim() || defaultProfile.username,
    isReel: reel.isReel ?? true,
    active: reel.active ?? true,
    sortOrder: Number.isFinite(reel.sortOrder) ? Number(reel.sortOrder) : (index + 1) * 10,
  };
}

function normalizeData(data: Partial<InstagramReelsData>): InstagramReelsData {
  return {
    profile: {
      username: data.profile?.username?.trim() || defaultProfile.username,
      url: cleanHttpUrl(data.profile?.url) || defaultProfile.url,
    },
    reels: (data.reels || [])
      .map(normalizeReel)
      .sort((a, b) => a.sortOrder - b.sortOrder),
    settings: normalizeSettings(data.settings),
    updatedAt: data.updatedAt || new Date().toISOString(),
  };
}

export async function getInstagramReelsData(): Promise<InstagramReelsData> {
  try {
    if (shouldUseBlobCrmStorage()) {
      const content = await readCrmBlobText(BLOB_REELS_FILE);
      return content ? normalizeData(JSON.parse(content) as InstagramReelsData) : normalizeData(getSeedInstagramReelsData());
    }

    const content = await fs.readFile(REELS_FILE, 'utf8');
    return normalizeData(JSON.parse(content) as InstagramReelsData);
  } catch {
    return normalizeData(getSeedInstagramReelsData());
  }
}

export async function saveInstagramReelsData(data: InstagramReelsData) {
  const nextData = normalizeData({
    ...data,
    updatedAt: new Date().toISOString(),
  });
  const diskData = {
    ...nextData,
    settings: {
      ...nextData.settings,
      accessToken: encryptAccessToken(nextData.settings.accessToken),
    },
  };
  const content = `${JSON.stringify(diskData, null, 2)}\n`;

  if (shouldUseBlobCrmStorage()) {
    await writeCrmBlobText(BLOB_REELS_FILE, content);
    return nextData;
  }

  await ensureDataDir();
  await fs.writeFile(REELS_FILE, content, 'utf8');
  return nextData;
}

export function getActiveInstagramReels(data: InstagramReelsData, limit = 6) {
  return data.reels
    .filter((reel) => reel.active)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .slice(0, limit);
}
