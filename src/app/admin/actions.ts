'use server';

import { revalidatePath } from 'next/cache';
import crypto from 'crypto';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/admin-auth';
import { registerMediaAssets } from '@/lib/media-library-store';
import {
  parseMediaStorageJson,
  uniqueMediaStorages,
  type MediaStorageMetadata,
} from '@/lib/media-storage';
import type { PortfolioCategory, PortfolioProject, ProjectMedia } from '@/lib/portfolio';
import {
  createMediaFromSrc,
  deletePortfolioBackup,
  getPortfolioData,
  getUploadValidationError,
  mediaTypeFromValue,
  parseList,
  parseStats,
  restorePortfolioBackup,
  savePortfolioData,
  saveUploadedMedia,
  slugify,
  type PortfolioData,
} from '@/lib/portfolio-store';

function formString(formData: FormData, key: string) {
  return String(formData.get(key) || '').trim();
}

function formMediaStorage(formData: FormData, key: string) {
  return parseMediaStorageJson(formData.get(key));
}

function mediaStorageForSrc({
  src,
  uploadedStorage,
  existingStorage,
  existingSrc,
}: {
  src: string;
  uploadedStorage?: MediaStorageMetadata;
  existingStorage?: MediaStorageMetadata;
  existingSrc?: string;
}) {
  if (uploadedStorage && uploadedStorage.url === src) {
    return uploadedStorage;
  }

  return src && existingSrc === src ? existingStorage : undefined;
}

function formNumber(formData: FormData, key: string, fallback: number) {
  const rawValue = formData.get(key);

  if (rawValue === null || rawValue === '') {
    return fallback;
  }

  const value = Number(rawValue);
  return Number.isFinite(value) ? value : fallback;
}

function formOptionalNumber(formData: FormData, key: string) {
  const value = formData.get(key);
  const parsed = Number(value);
  return value !== null && value !== '' && Number.isFinite(parsed) ? parsed : undefined;
}

function withErrorParam(pathname: string, error: string) {
  const separator = pathname.includes('?') ? '&' : '?';
  return `${pathname}${separator}error=${encodeURIComponent(error)}`;
}

function logStorageError(action: string, error: unknown) {
  console.error(`[admin] ${action} failed`, {
    message: error instanceof Error ? error.message : String(error),
  });
}

function collectMediaStorages(media: ProjectMedia | null | undefined) {
  return [media?.storage, media?.posterStorage];
}

function collectProjectMediaStorages(project: PortfolioProject) {
  return uniqueMediaStorages([
    ...collectMediaStorages(project.cardMedia),
    ...collectMediaStorages(project.featuredMedia),
    project.seo?.imageStorage,
    ...project.detail.heroMedia.flatMap(collectMediaStorages),
    ...project.detail.galleryMedia.flatMap(collectMediaStorages),
  ]);
}

async function registerProjectMediaAssets(project: PortfolioProject) {
  try {
    await registerMediaAssets(collectProjectMediaStorages(project), `project:${project.id}`);
  } catch (error) {
    logStorageError('Media library register', error);
  }
}

async function savePortfolioDataOrRedirect(
  data: PortfolioData,
  options: Parameters<typeof savePortfolioData>[1],
  errorRedirectPath: string,
) {
  try {
    return await savePortfolioData(data, options);
  } catch (error) {
    logStorageError('Portfolio data save', error);
    redirect(withErrorParam(errorRedirectPath, 'storage'));
  }
}

function formFile(formData: FormData, key: string) {
  const value = formData.get(key);
  return value instanceof File && value.size > 0 ? value : null;
}

function formFiles(formData: FormData, key: string) {
  return formData.getAll(key).filter((value): value is File => value instanceof File && value.size > 0);
}

function formIndexedFiles(formData: FormData, groupName: 'heroMedia' | 'galleryMedia', fileKey: string) {
  return formData.getAll(`${groupName}Indexes`)
    .map((value) => formFile(formData, `${groupName}${fileKey}-${String(value)}`))
    .filter((file): file is File => Boolean(file));
}

function getImageUploadValidationError(file: File | null | undefined) {
  const validationError = getUploadValidationError(file);

  if (validationError) {
    return validationError;
  }

  if (file && !file.type.startsWith('image/')) {
    return 'Image upload must be an image file.';
  }

  return null;
}

function getProjectFormUploadError(formData: FormData) {
  const mediaFiles = [
    formFile(formData, 'cardFile'),
    formFile(formData, 'featuredFile'),
    ...formFiles(formData, 'heroFiles'),
    ...formFiles(formData, 'galleryFiles'),
    ...formIndexedFiles(formData, 'heroMedia', 'File'),
    ...formIndexedFiles(formData, 'galleryMedia', 'File'),
  ];
  const imageFiles = [
    formFile(formData, 'cardPosterFile'),
    formFile(formData, 'featuredPosterFile'),
    formFile(formData, 'seoImageFile'),
    ...formIndexedFiles(formData, 'heroMedia', 'PosterFile'),
    ...formIndexedFiles(formData, 'galleryMedia', 'PosterFile'),
  ];
  const mediaError = mediaFiles.map(getUploadValidationError).find(Boolean);

  return mediaError || imageFiles.map(getImageUploadValidationError).find(Boolean) || null;
}

function resolveSubmittedMediaType(typeValue: string, value: string | File | null | undefined): ProjectMedia['type'] {
  if (mediaTypeFromValue(value) === 'video') {
    return 'video';
  }

  return typeValue === 'video' ? 'video' : 'image';
}

function getUniqueProjectSlug(data: { projects: PortfolioProject[] }, desiredSlug: string, projectId: string) {
  const baseSlug = slugify(desiredSlug) || 'project';
  let candidate = baseSlug;
  let suffix = 2;

  while (data.projects.some((project) => project.slug === candidate && project.id !== projectId)) {
    candidate = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return candidate;
}

function getUniqueCategorySlug(data: { categories: PortfolioCategory[] }, desiredSlug: string, currentSlug?: string) {
  const baseSlug = slugify(desiredSlug) || 'category';
  let candidate = baseSlug;
  let suffix = 2;

  while (data.categories.some((category) => category.slug === candidate && category.slug !== currentSlug)) {
    candidate = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return candidate;
}

async function parseMediaRows(
  formData: FormData,
  groupName: 'heroMedia' | 'galleryMedia',
  fallbackAlt: string,
  idPrefix: string,
  projectSlug: string,
  existingMedia: ProjectMedia[] = [],
) {
  const rows = await Promise.all(formData.getAll(`${groupName}Indexes`)
    .map((value) => String(value))
    .map(async (index, rowPosition) => {
      const existingId = formString(formData, `${groupName}Id-${index}`);
      const existingItem = existingMedia.find((media) => media.id === existingId);
      const mediaFile = formFile(formData, `${groupName}File-${index}`);
      const uploadedSrc = await saveUploadedMedia(mediaFile, projectSlug);
      const src = uploadedSrc || formString(formData, `${groupName}Src-${index}`);
      const isExisting = Boolean(existingId);
      const keepExisting = formData.get(`${groupName}Keep-${index}`) === 'on';

      if (!src || (isExisting && !keepExisting && !uploadedSrc)) {
        return null;
      }

      const posterUpload = await saveUploadedMedia(formFile(formData, `${groupName}PosterFile-${index}`), projectSlug);
      const poster = posterUpload || formString(formData, `${groupName}Poster-${index}`);
      const typeValue = formString(formData, `${groupName}Type-${index}`);
      const media = createMediaFromSrc({
        id: existingId || `${idPrefix}-url-${rowPosition + 1}`,
        src,
        alt: formString(formData, `${groupName}Alt-${index}`) || `${fallbackAlt} media ${rowPosition + 1}`,
        type: resolveSubmittedMediaType(typeValue, mediaFile || src),
        poster,
        storage: mediaStorageForSrc({
          src,
          uploadedStorage: formMediaStorage(formData, `${groupName}Storage-${index}`),
          existingStorage: existingItem?.storage,
          existingSrc: existingItem?.src,
        }),
        posterStorage: mediaStorageForSrc({
          src: poster,
          uploadedStorage: formMediaStorage(formData, `${groupName}PosterStorage-${index}`),
          existingStorage: existingItem?.posterStorage,
          existingSrc: existingItem?.poster,
        }),
      });

      return {
        order: formNumber(formData, `${groupName}Order-${index}`, rowPosition + 1),
        media,
      };
    }));

  return rows
    .filter((item): item is { order: number; media: ProjectMedia } => Boolean(item))
    .sort((a, b) => a.order - b.order)
    .map((item) => item.media);
}

async function resolveSingleMedia({
  formData,
  fileKey,
  srcKey,
  altKey,
  typeKey,
  posterKey,
  posterFileKey,
  storageKey,
  posterStorageKey,
  existing,
  id,
  projectSlug,
  fallbackAlt,
}: {
  formData: FormData;
  fileKey: string;
  srcKey: string;
  altKey: string;
  typeKey: string;
  posterKey?: string;
  posterFileKey?: string;
  storageKey?: string;
  posterStorageKey?: string;
  existing?: ProjectMedia;
  id: string;
  projectSlug: string;
  fallbackAlt: string;
}) {
  const file = formFile(formData, fileKey);
  const uploadedSrc = await saveUploadedMedia(file, projectSlug);
  const uploadedPoster = await saveUploadedMedia(posterFileKey ? formFile(formData, posterFileKey) : null, projectSlug);
  const src = uploadedSrc || formString(formData, srcKey) || existing?.src || '';
  const typeValue = formString(formData, typeKey);
  const type = resolveSubmittedMediaType(typeValue, file || src);
  const alt = formString(formData, altKey) || existing?.alt || fallbackAlt;
  const poster = uploadedPoster || (posterKey ? formString(formData, posterKey) : '') || existing?.poster || '';

  return createMediaFromSrc({
    id,
    src,
    alt,
    type,
    poster,
    storage: mediaStorageForSrc({
      src,
      uploadedStorage: storageKey ? formMediaStorage(formData, storageKey) : undefined,
      existingStorage: existing?.storage,
      existingSrc: existing?.src,
    }),
    posterStorage: mediaStorageForSrc({
      src: poster,
      uploadedStorage: posterStorageKey ? formMediaStorage(formData, posterStorageKey) : undefined,
      existingStorage: existing?.posterStorage,
      existingSrc: existing?.poster,
    }),
  });
}

async function appendUploadedMedia({
  files,
  projectSlug,
  idPrefix,
  fallbackAlt,
}: {
  files: File[];
  projectSlug: string;
  idPrefix: string;
  fallbackAlt: string;
}) {
  const uploaded: ProjectMedia[] = [];

  for (const [index, file] of files.entries()) {
    const src = await saveUploadedMedia(file, projectSlug);

    if (!src) {
      continue;
    }

    uploaded.push(createMediaFromSrc({
      id: `${idPrefix}-upload-${Date.now()}-${index + 1}`,
      src,
      alt: `${fallbackAlt} upload ${index + 1}`,
      type: mediaTypeFromValue(file),
    }));
  }

  return uploaded;
}

function touchPublicPaths(projectSlug?: string) {
  revalidatePath('/');
  revalidatePath('/portfolio');
  revalidatePath('/admin');

  if (projectSlug) {
    revalidatePath(`/portfolio/${projectSlug}`);
  }
}

export async function saveCategoryAction(formData: FormData) {
  await requireAdmin();

  const data = await getPortfolioData();
  const originalSlug = formString(formData, 'originalSlug');
  const label = formString(formData, 'label');

  if (!label) {
    redirect('/admin?error=category-label');
  }

  const desiredSlug = formString(formData, 'slug') || label;
  const slug = getUniqueCategorySlug(data, desiredSlug, originalSlug || undefined);
  const category: PortfolioCategory = {
    slug,
    label,
    sortOrder: formNumber(formData, 'sortOrder', data.categories.length * 10 + 10),
    visibleInFilters: formData.get('visibleInFilters') === 'on',
  };

  const existingIndex = data.categories.findIndex((item) => item.slug === originalSlug);
  const nextCategories = [...data.categories];

  if (existingIndex >= 0) {
    const oldSlug = nextCategories[existingIndex].slug;
    nextCategories[existingIndex] = category;

    if (oldSlug !== slug) {
      data.projects = data.projects.map((project) => ({
        ...project,
        primaryCategorySlug: project.primaryCategorySlug === oldSlug ? slug : project.primaryCategorySlug,
        categorySlugs: project.categorySlugs.map((categorySlug) => categorySlug === oldSlug ? slug : categorySlug),
      }));
    }
  } else {
    nextCategories.push(category);
  }

  await savePortfolioDataOrRedirect({
    ...data,
    categories: nextCategories,
  }, { backupReason: originalSlug ? 'category saved' : 'category created' }, '/admin');
  touchPublicPaths();
  redirect('/admin?status=category-saved');
}

export async function deleteCategoryAction(formData: FormData) {
  await requireAdmin();

  const data = await getPortfolioData();
  const slug = formString(formData, 'slug');

  if (!slug) {
    redirect('/admin');
  }

  const nextCategories = data.categories.filter((category) => category.slug !== slug);

  if (nextCategories.length === 0) {
    redirect('/admin?error=last-category');
  }

  const fallbackCategory = nextCategories[0]?.slug || 'other';
  const nextProjects = data.projects.map((project) => {
    const categorySlugs = project.categorySlugs.filter((categorySlug) => categorySlug !== slug);
    return {
      ...project,
      categorySlugs: categorySlugs.length > 0 ? categorySlugs : [fallbackCategory],
      primaryCategorySlug: project.primaryCategorySlug === slug ? fallbackCategory : project.primaryCategorySlug,
    };
  });

  await savePortfolioDataOrRedirect({
    ...data,
    categories: nextCategories,
    projects: nextProjects,
  }, { backupReason: 'category deleted' }, '/admin');
  touchPublicPaths();
  redirect('/admin?status=category-deleted');
}

export async function saveProjectAction(formData: FormData) {
  await requireAdmin();

  const data = await getPortfolioData();
  const id = formString(formData, 'id') || crypto.randomUUID();
  const existing = data.projects.find((project) => project.id === id);
  const name = formString(formData, 'name');

  if (!name) {
    redirect(existing ? `/admin/projects/${id}?error=name` : '/admin/projects/new?error=name');
  }

  const slug = getUniqueProjectSlug(data, formString(formData, 'slug') || name, id);
  const uploadError = getProjectFormUploadError(formData);

  if (uploadError) {
    redirect(existing ? `/admin/projects/${id}?error=upload` : '/admin/projects/new?error=upload');
  }

  const categorySlugs = formData.getAll('categorySlugs').map((value) => String(value)).filter(Boolean);
  const primaryCategorySlug = formString(formData, 'primaryCategorySlug') || categorySlugs[0] || data.categories[0]?.slug || 'other';
  const selectedCategorySlugs = Array.from(new Set([primaryCategorySlug, ...categorySlugs]));
  const featuredOrder = formData.get('isFeatured') === 'on'
    ? formOptionalNumber(formData, 'featuredOrder') ?? existing?.featuredOrder ?? data.projects.length * 10 + 10
    : undefined;

  const cardMedia = await resolveSingleMedia({
    formData,
    fileKey: 'cardFile',
    srcKey: 'cardSrc',
    altKey: 'cardAlt',
    typeKey: 'cardType',
    posterKey: 'cardPoster',
    posterFileKey: 'cardPosterFile',
    storageKey: 'cardStorage',
    posterStorageKey: 'cardPosterStorage',
    existing: existing?.cardMedia,
    id: `${slug}-card`,
    projectSlug: slug,
    fallbackAlt: name,
  });

  if (!cardMedia.src) {
    redirect(existing ? `/admin/projects/${id}?error=card-media` : '/admin/projects/new?error=card-media');
  }

  const featuredSrc = formString(formData, 'featuredSrc');
  const featuredFile = formFile(formData, 'featuredFile');
  const featuredUpload = await saveUploadedMedia(featuredFile, slug);
  const featuredPosterUpload = await saveUploadedMedia(formFile(formData, 'featuredPosterFile'), slug);
  const removeFeaturedMedia = formData.get('removeFeaturedMedia') === 'on';
  const featuredTypeValue = formString(formData, 'featuredType');
  const nextFeaturedSrc = featuredUpload || featuredSrc || existing?.featuredMedia?.src || '';
  const nextFeaturedPoster = featuredPosterUpload || formString(formData, 'featuredPoster') || existing?.featuredMedia?.poster || '';
  const featuredMedia = !removeFeaturedMedia && (featuredUpload || featuredSrc || existing?.featuredMedia?.src)
    ? createMediaFromSrc({
      id: `${slug}-featured`,
      src: nextFeaturedSrc,
      alt: formString(formData, 'featuredAlt') || existing?.featuredMedia?.alt || name,
      type: resolveSubmittedMediaType(featuredTypeValue, featuredFile || featuredUpload || featuredSrc || existing?.featuredMedia?.src),
      poster: nextFeaturedPoster,
      storage: mediaStorageForSrc({
        src: nextFeaturedSrc,
        uploadedStorage: formMediaStorage(formData, 'featuredStorage'),
        existingStorage: existing?.featuredMedia?.storage,
        existingSrc: existing?.featuredMedia?.src,
      }),
      posterStorage: mediaStorageForSrc({
        src: nextFeaturedPoster,
        uploadedStorage: formMediaStorage(formData, 'featuredPosterStorage'),
        existingStorage: existing?.featuredMedia?.posterStorage,
        existingSrc: existing?.featuredMedia?.poster,
      }),
    })
    : undefined;

  const heroMedia = [
    ...(await parseMediaRows(formData, 'heroMedia', name, `${slug}-hero`, slug, existing?.detail.heroMedia || [])),
    ...await appendUploadedMedia({
      files: formFiles(formData, 'heroFiles'),
      projectSlug: slug,
      idPrefix: `${slug}-hero`,
      fallbackAlt: `${name} hero`,
    }),
  ];
  const galleryMedia = [
    ...(await parseMediaRows(formData, 'galleryMedia', name, `${slug}-gallery`, slug, existing?.detail.galleryMedia || [])),
    ...await appendUploadedMedia({
      files: formFiles(formData, 'galleryFiles'),
      projectSlug: slug,
      idPrefix: `${slug}-gallery`,
      fallbackAlt: `${name} gallery`,
    }),
  ];
  const stats = parseStats(formString(formData, 'statsLines'));
  const seoImageUpload = await saveUploadedMedia(formFile(formData, 'seoImageFile'), slug);
  const seoImage = seoImageUpload || formString(formData, 'seoImage');
  const seoImageStorage = mediaStorageForSrc({
    src: seoImage,
    uploadedStorage: formMediaStorage(formData, 'seoImageStorage'),
    existingStorage: existing?.seo?.imageStorage,
    existingSrc: existing?.seo?.image,
  });

  const project: PortfolioProject = {
    id,
    slug,
    name,
    details: formString(formData, 'details'),
    primaryCategorySlug,
    categorySlugs: selectedCategorySlugs,
    cardMedia,
    ...(featuredMedia ? { featuredMedia } : {}),
    portfolioOrder: formNumber(formData, 'portfolioOrder', existing?.portfolioOrder ?? data.projects.length * 10 + 10),
    ...(typeof featuredOrder === 'number' ? { featuredOrder } : {}),
    published: formData.get('published') === 'on',
    meta: {
      projectType: formString(formData, 'projectType'),
      location: formString(formData, 'location'),
      city: formString(formData, 'city'),
      area: formString(formData, 'area'),
      duration: formString(formData, 'duration'),
      budget: formString(formData, 'budget'),
      year: formString(formData, 'year'),
      style: formString(formData, 'style'),
      services: parseList(formString(formData, 'services')),
      materials: parseList(formString(formData, 'materials')),
      clientBrief: formString(formData, 'clientBrief'),
    },
    seo: {
      title: formString(formData, 'seoTitle'),
      description: formString(formData, 'seoDescription'),
      image: seoImage,
      ...(seoImageStorage ? { imageStorage: seoImageStorage } : {}),
    },
    detail: {
      heroMedia: heroMedia.length > 0 ? heroMedia : existing?.detail.heroMedia || [cardMedia],
      stats: stats.length > 0 ? stats : existing?.detail.stats || [],
      description: formString(formData, 'description') || existing?.detail.description || '',
      galleryMedia: galleryMedia.length > 0 ? galleryMedia : existing?.detail.galleryMedia || [cardMedia],
    },
  };

  const nextProjects = existing
    ? data.projects.map((item) => item.id === id ? project : item)
    : [...data.projects, project];

  await savePortfolioDataOrRedirect({
    ...data,
    projects: nextProjects,
  }, { backupReason: existing ? 'project saved' : 'project created' }, existing ? `/admin/projects/${id}` : '/admin/projects/new');
  await registerProjectMediaAssets(project);
  if (existing?.slug && existing.slug !== project.slug) {
    touchPublicPaths(existing.slug);
  }
  touchPublicPaths(project.slug);
  redirect(`/admin/projects/${project.id}?status=saved`);
}

export async function deleteProjectAction(formData: FormData) {
  await requireAdmin();

  const data = await getPortfolioData();
  const id = formString(formData, 'id');
  const project = data.projects.find((item) => item.id === id);

  await savePortfolioDataOrRedirect({
    ...data,
    projects: data.projects.filter((item) => item.id !== id),
  }, { backupReason: 'project deleted' }, '/admin');
  touchPublicPaths(project?.slug);
  redirect('/admin?status=project-deleted');
}

export async function restoreBackupAction(formData: FormData) {
  await requireAdmin();

  const id = formString(formData, 'id');
  try {
    await restorePortfolioBackup(id);
  } catch (error) {
    logStorageError('Portfolio backup restore', error);
    redirect('/admin/backups?error=storage');
  }

  touchPublicPaths();
  revalidatePath('/admin/backups');
  redirect('/admin/backups?status=restored');
}

export async function deleteBackupAction(formData: FormData) {
  await requireAdmin();

  const id = formString(formData, 'id');
  try {
    await deletePortfolioBackup(id);
  } catch (error) {
    logStorageError('Portfolio backup delete', error);
    redirect('/admin/backups?error=storage');
  }

  revalidatePath('/admin/backups');
  redirect('/admin/backups?status=backup-deleted');
}
