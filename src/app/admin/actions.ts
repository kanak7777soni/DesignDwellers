'use server';

import { revalidatePath } from 'next/cache';
import crypto from 'crypto';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/admin-auth';
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
} from '@/lib/portfolio-store';
import { logoutAction } from './login/actions';

export { logoutAction };

function formString(formData: FormData, key: string) {
  return String(formData.get(key) || '').trim();
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

function formFile(formData: FormData, key: string) {
  const value = formData.get(key);
  return value instanceof File && value.size > 0 ? value : null;
}

function formFiles(formData: FormData, key: string) {
  return formData.getAll(key).filter((value): value is File => value instanceof File && value.size > 0);
}

function getProjectFormUploadError(formData: FormData) {
  const files = [
    formFile(formData, 'cardFile'),
    formFile(formData, 'featuredFile'),
    ...formFiles(formData, 'heroFiles'),
    ...formFiles(formData, 'galleryFiles'),
  ];

  return files.map(getUploadValidationError).find(Boolean) || null;
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

function parseMediaRows(formData: FormData, groupName: 'heroMedia' | 'galleryMedia', fallbackAlt: string, idPrefix: string) {
  return formData.getAll(`${groupName}Indexes`)
    .map((value) => String(value))
    .map((index, rowPosition) => {
      const existingId = formString(formData, `${groupName}Id-${index}`);
      const src = formString(formData, `${groupName}Src-${index}`);
      const isExisting = Boolean(existingId);
      const keepExisting = formData.get(`${groupName}Keep-${index}`) === 'on';

      if (!src || (isExisting && !keepExisting)) {
        return null;
      }

      const typeValue = formString(formData, `${groupName}Type-${index}`);
      const media = createMediaFromSrc({
        id: existingId || `${idPrefix}-url-${rowPosition + 1}`,
        src,
        alt: formString(formData, `${groupName}Alt-${index}`) || `${fallbackAlt} media ${rowPosition + 1}`,
        type: typeValue === 'video' || typeValue === 'image' ? typeValue : mediaTypeFromValue(src),
        poster: formString(formData, `${groupName}Poster-${index}`),
      });

      return {
        order: formNumber(formData, `${groupName}Order-${index}`, rowPosition + 1),
        media,
      };
    })
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
  existing?: ProjectMedia;
  id: string;
  projectSlug: string;
  fallbackAlt: string;
}) {
  const file = formFile(formData, fileKey);
  const uploadedSrc = await saveUploadedMedia(file, projectSlug);
  const src = uploadedSrc || formString(formData, srcKey) || existing?.src || '';
  const typeValue = formString(formData, typeKey);
  const type = typeValue === 'video' || typeValue === 'image' ? typeValue : mediaTypeFromValue(file || src);
  const alt = formString(formData, altKey) || existing?.alt || fallbackAlt;

  return createMediaFromSrc({
    id,
    src,
    alt,
    type,
    poster: existing?.poster,
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

  await savePortfolioData({
    ...data,
    categories: nextCategories,
  }, { backupReason: originalSlug ? 'category saved' : 'category created' });
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

  await savePortfolioData({
    ...data,
    categories: nextCategories,
    projects: nextProjects,
  }, { backupReason: 'category deleted' });
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
  const removeFeaturedMedia = formData.get('removeFeaturedMedia') === 'on';
  const featuredMedia = !removeFeaturedMedia && (featuredUpload || featuredSrc || existing?.featuredMedia?.src)
    ? createMediaFromSrc({
      id: `${slug}-featured`,
      src: featuredUpload || featuredSrc || existing?.featuredMedia?.src || '',
      alt: formString(formData, 'featuredAlt') || existing?.featuredMedia?.alt || name,
      type: mediaTypeFromValue(featuredFile || featuredUpload || featuredSrc || existing?.featuredMedia?.src),
      poster: existing?.featuredMedia?.poster,
    })
    : undefined;

  const heroMedia = [
    ...parseMediaRows(formData, 'heroMedia', name, `${slug}-hero`),
    ...await appendUploadedMedia({
      files: formFiles(formData, 'heroFiles'),
      projectSlug: slug,
      idPrefix: `${slug}-hero`,
      fallbackAlt: `${name} hero`,
    }),
  ];
  const galleryMedia = [
    ...parseMediaRows(formData, 'galleryMedia', name, `${slug}-gallery`),
    ...await appendUploadedMedia({
      files: formFiles(formData, 'galleryFiles'),
      projectSlug: slug,
      idPrefix: `${slug}-gallery`,
      fallbackAlt: `${name} gallery`,
    }),
  ];
  const stats = parseStats(formString(formData, 'statsLines'));

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
      image: formString(formData, 'seoImage'),
    },
    detail: {
      heroMedia: heroMedia.length > 0 ? heroMedia.slice(0, 2) : existing?.detail.heroMedia || [cardMedia],
      stats: stats.length > 0 ? stats : existing?.detail.stats || [],
      description: formString(formData, 'description') || existing?.detail.description || '',
      galleryMedia: galleryMedia.length > 0 ? galleryMedia : existing?.detail.galleryMedia || [cardMedia],
    },
  };

  const nextProjects = existing
    ? data.projects.map((item) => item.id === id ? project : item)
    : [...data.projects, project];

  await savePortfolioData({
    ...data,
    projects: nextProjects,
  }, { backupReason: existing ? 'project saved' : 'project created' });
  touchPublicPaths(project.slug);
  redirect(`/admin/projects/${project.id}?status=saved`);
}

export async function deleteProjectAction(formData: FormData) {
  await requireAdmin();

  const data = await getPortfolioData();
  const id = formString(formData, 'id');
  const project = data.projects.find((item) => item.id === id);

  await savePortfolioData({
    ...data,
    projects: data.projects.filter((item) => item.id !== id),
  }, { backupReason: 'project deleted' });
  touchPublicPaths(project?.slug);
  redirect('/admin?status=project-deleted');
}

export async function restoreBackupAction(formData: FormData) {
  await requireAdmin();

  const id = formString(formData, 'id');
  await restorePortfolioBackup(id);
  touchPublicPaths();
  revalidatePath('/admin/backups');
  redirect('/admin/backups?status=restored');
}

export async function deleteBackupAction(formData: FormData) {
  await requireAdmin();

  const id = formString(formData, 'id');
  await deletePortfolioBackup(id);
  revalidatePath('/admin/backups');
  redirect('/admin/backups?status=backup-deleted');
}
