import { promises as fs } from 'fs';
import path from 'path';
import {
  portfolioCategories,
  portfolioProjects,
  type PortfolioCategory,
  type PortfolioProject,
  type ProjectMedia,
  type ProjectStat,
} from '@/lib/portfolio';
import {
  getUploadValidationErrorForFile,
  mediaTypeFromContentType,
  mediaTypeFromUrl,
} from '@/lib/media-upload';
import {
  deleteCrmBlobFile,
  listCrmBlobFiles,
  readCrmBlobText,
  shouldUseBlobCrmStorage,
  writeCrmBlobText,
} from '@/lib/crm-blob-storage';

export type PortfolioData = {
  categories: PortfolioCategory[];
  projects: PortfolioProject[];
  updatedAt: string;
};

export type PortfolioBackup = {
  id: string;
  createdAt: string;
  reason: string;
  projectCount: number;
  categoryCount: number;
};

const DATA_DIR = path.join(process.cwd(), 'data');
const PORTFOLIO_FILE = path.join(DATA_DIR, 'portfolio.json');
const BACKUP_DIR = path.join(DATA_DIR, 'backups', 'portfolio');
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'portfolio');
const PUBLIC_UPLOAD_PATH = '/uploads/portfolio';
const BLOB_PORTFOLIO_FILE = 'crm/data/portfolio.json';
const BLOB_BACKUP_PREFIX = 'crm/backups/portfolio/';
const MAX_PORTFOLIO_BACKUPS = 30;

export function getSeedPortfolioData(): PortfolioData {
  return {
    categories: portfolioCategories,
    projects: portfolioProjects,
    updatedAt: new Date().toISOString(),
  };
}

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function ensureBackupDir() {
  await fs.mkdir(BACKUP_DIR, { recursive: true });
}

async function ensureUploadDir() {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
}

function sortData(data: PortfolioData): PortfolioData {
  return {
    ...data,
    categories: [...data.categories].sort((a, b) => a.sortOrder - b.sortOrder),
    projects: [...data.projects].map(normalizeProject).sort((a, b) => a.portfolioOrder - b.portfolioOrder),
  };
}

function normalizeProject(project: PortfolioProject): PortfolioProject {
  return {
    ...project,
    categorySlugs: project.categorySlugs?.length ? project.categorySlugs : [project.primaryCategorySlug],
    meta: project.meta || {},
    seo: project.seo || {},
    detail: {
      heroMedia: project.detail?.heroMedia || [project.cardMedia],
      stats: project.detail?.stats || [],
      description: project.detail?.description || '',
      galleryMedia: project.detail?.galleryMedia || [project.cardMedia],
    },
  };
}

export async function getPortfolioData(): Promise<PortfolioData> {
  try {
    if (shouldUseBlobCrmStorage()) {
      const content = await readCrmBlobText(BLOB_PORTFOLIO_FILE);
      return content ? sortData(JSON.parse(content) as PortfolioData) : sortData(getSeedPortfolioData());
    }

    const content = await fs.readFile(PORTFOLIO_FILE, 'utf8');
    return sortData(JSON.parse(content) as PortfolioData);
  } catch {
    return sortData(getSeedPortfolioData());
  }
}

function backupId(createdAt: string, reason: string) {
  const datePart = createdAt.replace(/[:.]/g, '-');
  const reasonPart = slugify(reason).slice(0, 32) || 'change';

  return `${datePart}-${reasonPart}.json`;
}

async function readBackupSourceData() {
  try {
    if (shouldUseBlobCrmStorage()) {
      const content = await readCrmBlobText(BLOB_PORTFOLIO_FILE);
      return content ? sortData(JSON.parse(content) as PortfolioData) : sortData(getSeedPortfolioData());
    }

    const content = await fs.readFile(PORTFOLIO_FILE, 'utf8');
    return sortData(JSON.parse(content) as PortfolioData);
  } catch {
    return sortData(getSeedPortfolioData());
  }
}

async function prunePortfolioBackups() {
  try {
    if (shouldUseBlobCrmStorage()) {
      const backups = await listCrmBlobFiles(BLOB_BACKUP_PREFIX);
      const staleBackups = backups
        .filter((blob) => blob.pathname.endsWith('.json'))
        .sort((a, b) => b.pathname.localeCompare(a.pathname))
        .slice(MAX_PORTFOLIO_BACKUPS);

      if (staleBackups.length > 0) {
        await deleteCrmBlobFile(staleBackups.map((blob) => blob.pathname));
      }

      return;
    }

    const files = (await fs.readdir(BACKUP_DIR))
      .filter((file) => file.endsWith('.json'))
      .sort()
      .reverse();
    const staleFiles = files.slice(MAX_PORTFOLIO_BACKUPS);

    await Promise.all(staleFiles.map((file) => fs.unlink(path.join(BACKUP_DIR, file))));
  } catch {
    // Backups are a safety net. A prune failure should not block a content save.
  }
}

async function createPortfolioBackup(reason = 'change') {
  const data = await readBackupSourceData();
  const createdAt = new Date().toISOString();
  const id = backupId(createdAt, reason);
  const backupContent = `${JSON.stringify({
    id,
    createdAt,
    reason,
    data,
  }, null, 2)}\n`;

  if (shouldUseBlobCrmStorage()) {
    await writeCrmBlobText(`${BLOB_BACKUP_PREFIX}${id}`, backupContent);
    await prunePortfolioBackups();

    return {
      id,
      createdAt,
      reason,
      projectCount: data.projects.length,
      categoryCount: data.categories.length,
    };
  }

  await ensureBackupDir();
  await fs.writeFile(path.join(BACKUP_DIR, id), backupContent, 'utf8');
  await prunePortfolioBackups();

  return {
    id,
    createdAt,
    reason,
    projectCount: data.projects.length,
    categoryCount: data.categories.length,
  };
}

function safeBackupId(id: string) {
  const base = path.basename(id);
  return base === id && /^[a-z0-9_.-]+$/i.test(id) && id.endsWith('.json') ? id : null;
}

export async function listPortfolioBackups(): Promise<PortfolioBackup[]> {
  try {
    if (shouldUseBlobCrmStorage()) {
      const files = (await listCrmBlobFiles(BLOB_BACKUP_PREFIX))
        .filter((blob) => blob.pathname.endsWith('.json'));
      const backups = await Promise.all(files.map(async (blob) => {
        try {
          const id = blob.pathname.slice(BLOB_BACKUP_PREFIX.length);
          const content = await readCrmBlobText(blob.pathname);

          if (!content) {
            return null;
          }

          const parsed = JSON.parse(content) as {
            id?: string;
            createdAt?: string;
            reason?: string;
            data?: PortfolioData;
          };
          const data = parsed.data || (parsed as unknown as PortfolioData);

          return {
            id: parsed.id || id,
            createdAt: parsed.createdAt || id.slice(0, 24),
            reason: parsed.reason || 'legacy backup',
            projectCount: data.projects?.length || 0,
            categoryCount: data.categories?.length || 0,
          };
        } catch {
          return null;
        }
      }));

      return backups
        .filter((backup): backup is PortfolioBackup => Boolean(backup))
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }

    const files = (await fs.readdir(BACKUP_DIR)).filter((file) => file.endsWith('.json'));
    const backups = await Promise.all(files.map(async (file) => {
      try {
        const content = await fs.readFile(path.join(BACKUP_DIR, file), 'utf8');
        const parsed = JSON.parse(content) as {
          id?: string;
          createdAt?: string;
          reason?: string;
          data?: PortfolioData;
        };
        const data = parsed.data || (parsed as unknown as PortfolioData);

        return {
          id: parsed.id || file,
          createdAt: parsed.createdAt || file.slice(0, 24),
          reason: parsed.reason || 'legacy backup',
          projectCount: data.projects?.length || 0,
          categoryCount: data.categories?.length || 0,
        };
      } catch {
        return null;
      }
    }));

    return backups
      .filter((backup): backup is PortfolioBackup => Boolean(backup))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } catch {
    return [];
  }
}

export async function restorePortfolioBackup(id: string) {
  const safeId = safeBackupId(id);

  if (!safeId) {
    throw new Error('Invalid backup id.');
  }

  const content = shouldUseBlobCrmStorage()
    ? await readCrmBlobText(`${BLOB_BACKUP_PREFIX}${safeId}`)
    : await fs.readFile(path.join(BACKUP_DIR, safeId), 'utf8');

  if (!content) {
    throw new Error('Backup not found.');
  }

  const parsed = JSON.parse(content) as { data?: PortfolioData };
  const data = parsed.data || (parsed as PortfolioData);

  await createPortfolioBackup('before restore');
  return savePortfolioData(data, { skipBackup: true });
}

export async function deletePortfolioBackup(id: string) {
  const safeId = safeBackupId(id);

  if (!safeId) {
    throw new Error('Invalid backup id.');
  }

  if (shouldUseBlobCrmStorage()) {
    await deleteCrmBlobFile(`${BLOB_BACKUP_PREFIX}${safeId}`);
    return;
  }

  await fs.unlink(path.join(BACKUP_DIR, safeId));
}

export async function savePortfolioData(data: PortfolioData, options?: { backupReason?: string; skipBackup?: boolean }) {
  if (!options?.skipBackup) {
    await createPortfolioBackup(options?.backupReason || 'content change');
  }

  const nextData = sortData({
    ...data,
    updatedAt: new Date().toISOString(),
  });

  const content = `${JSON.stringify(nextData, null, 2)}\n`;

  if (shouldUseBlobCrmStorage()) {
    await writeCrmBlobText(BLOB_PORTFOLIO_FILE, content);
    return nextData;
  }

  await ensureDataDir();
  await fs.writeFile(PORTFOLIO_FILE, content, 'utf8');
  return nextData;
}

export function getPublishedProjectsFromData(data: PortfolioData) {
  return data.projects
    .filter((project) => project.published)
    .sort((a, b) => a.portfolioOrder - b.portfolioOrder);
}

export function getVisibleCategoriesFromData(data: PortfolioData) {
  return data.categories
    .filter((category) => category.visibleInFilters)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getFeaturedProjectsFromData(data: PortfolioData, limit = 6) {
  return getPublishedProjectsFromData(data)
    .filter((project) => typeof project.featuredOrder === 'number')
    .sort((a, b) => (a.featuredOrder ?? 0) - (b.featuredOrder ?? 0))
    .slice(0, limit);
}

export function getProjectsByCategoryFromData(data: PortfolioData, categorySlug: string) {
  if (categorySlug === 'all-projects') {
    return getPublishedProjectsFromData(data);
  }

  return getPublishedProjectsFromData(data).filter((project) => project.categorySlugs.includes(categorySlug));
}

export function getCategoryLabelFromData(data: PortfolioData, slug: string) {
  return data.categories.find((category) => category.slug === slug)?.label || slug;
}

export async function getProjectBySlugFromStore(slug: string) {
  const data = await getPortfolioData();
  const project = getPublishedProjectsFromData(data).find((item) => item.slug === slug) || null;
  return { data, project };
}

export function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function safeFileBase(value: string) {
  return slugify(value).replace(/^-+|-+$/g, '') || 'media';
}

function getExtension(file: File) {
  if (file.type === 'image/png') return 'png';
  if (file.type === 'image/webp') return 'webp';
  if (file.type === 'image/gif') return 'gif';
  if (file.type === 'video/mp4') return 'mp4';
  if (file.type === 'video/webm') return 'webm';
  if (file.type === 'video/quicktime') return 'mov';

  return file.type.startsWith('video/') ? 'mp4' : 'jpg';
}

export function getUploadValidationError(file: File | null | undefined) {
  return getUploadValidationErrorForFile(file);
}

export function mediaTypeFromValue(value: string | File | null | undefined): ProjectMedia['type'] {
  if (value instanceof File) {
    return mediaTypeFromContentType(value.type);
  }

  return mediaTypeFromUrl(value?.toString());
}

export async function saveUploadedMedia(file: File | null | undefined, projectSlug: string) {
  if (!file || file.size === 0) {
    return null;
  }

  const uploadError = getUploadValidationError(file);

  if (uploadError) {
    throw new Error(uploadError);
  }

  await ensureUploadDir();
  const extension = getExtension(file);
  const base = safeFileBase(file.name.replace(/\.[^.]+$/, ''));
  const projectBase = safeFileBase(projectSlug);
  const filename = `${Date.now()}-${projectBase}-${base}.${extension}`;
  const filePath = path.join(UPLOAD_DIR, filename);
  const buffer = Buffer.from(await file.arrayBuffer());

  await fs.writeFile(filePath, buffer);
  return `${PUBLIC_UPLOAD_PATH}/${filename}`;
}

export function createMediaFromSrc({
  id,
  src,
  alt,
  type,
  poster,
}: {
  id: string;
  src: string;
  alt: string;
  type?: ProjectMedia['type'];
  poster?: string;
}): ProjectMedia {
  return {
    id,
    type: type || mediaTypeFromValue(src),
    src,
    alt,
    ...(poster ? { poster } : {}),
  };
}

export function parseStats(value: string): ProjectStat[] {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [rawValue, rawLabel] = line.split('|');
      return {
        value: rawValue?.trim() || '',
        label: rawLabel?.trim() || '',
      };
    })
    .filter((stat) => stat.value && stat.label)
    .slice(0, 3);
}

export function formatStats(stats: ProjectStat[]) {
  return stats.map((stat) => `${stat.value}|${stat.label}`).join('\n');
}

export function parseList(value: string) {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

export function formatList(items: string[] = []) {
  return items.join('\n');
}

export function parseMediaLines(value: string, fallbackAlt: string, idPrefix: string): ProjectMedia[] {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const [typeValue, srcValue, altValue, posterValue] = line.split('|').map((item) => item?.trim() || '');
      const hasExplicitType = typeValue === 'image' || typeValue === 'video';
      const src = hasExplicitType ? srcValue : typeValue;
      const type = hasExplicitType ? typeValue : mediaTypeFromValue(src);
      const alt = hasExplicitType ? altValue : srcValue;
      const poster = hasExplicitType ? posterValue : altValue;

      return createMediaFromSrc({
        id: `${idPrefix}-${index + 1}`,
        type,
        src,
        alt: alt || `${fallbackAlt} media ${index + 1}`,
        poster,
      });
    })
    .filter((media) => Boolean(media.src));
}

export function formatMediaLines(media: ProjectMedia[]) {
  return media
    .map((item) => [item.type, item.src, item.alt, item.poster || ''].join('|').replace(/\|$/, ''))
    .join('\n');
}
