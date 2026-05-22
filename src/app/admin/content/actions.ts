'use server';

import crypto from 'crypto';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/admin-auth';
import {
  getContentImageUploadError,
  getSiteContentData,
  saveSiteContentData,
  saveUploadedContentImage,
  type AboutStat,
  type AboutStudioCard,
  type AboutTeamMember,
  type AboutTimelineItem,
  type AboutValue,
  type BrandPartner,
  type LegalSection,
  type SiteContentData,
} from '@/lib/content-store';
import { registerMediaAssets } from '@/lib/media-library-store';
import { parseMediaStorageJson, type MediaStorageMetadata } from '@/lib/media-storage';

function formString(formData: FormData, key: string) {
  return String(formData.get(key) || '').trim();
}

function formNumber(formData: FormData, key: string, fallback: number) {
  const rawValue = formData.get(key);

  if (rawValue === null || rawValue === '') {
    return fallback;
  }

  const parsed = Number(rawValue);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function formFile(formData: FormData, key: string) {
  const value = formData.get(key);
  return value instanceof File && value.size > 0 ? value : null;
}

function formStorage(formData: FormData, key: string) {
  return parseMediaStorageJson(formData.get(key));
}

function lineId(prefix: string, index: number) {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}-${index + 1}`;
}

function withErrorParam(pathname: string, error: string) {
  const separator = pathname.includes('?') ? '&' : '?';
  return `${pathname}${separator}error=${encodeURIComponent(error)}`;
}

function logStorageError(action: string, error: unknown) {
  console.error(`[admin-content] ${action} failed`, {
    message: error instanceof Error ? error.message : String(error),
  });
}

async function saveContentOrRedirect(data: SiteContentData, redirectPath: string) {
  try {
    return await saveSiteContentData(data);
  } catch (error) {
    logStorageError('Site content save', error);
    redirect(withErrorParam(redirectPath, 'storage'));
  }
}

function mediaStorageForSrc({
  src,
  uploadedStorage,
  existingStorage,
  existingSrc,
}: {
  src: string;
  uploadedStorage?: MediaStorageMetadata;
  existingStorage?: MediaStorageMetadata | null;
  existingSrc?: string;
}) {
  if (uploadedStorage && uploadedStorage.url === src) {
    return uploadedStorage;
  }

  return src && existingSrc === src ? existingStorage || undefined : undefined;
}

async function registerContentMediaAssets(data: SiteContentData, source: string) {
  try {
    await registerMediaAssets([
      data.seo.openGraphImageStorage,
      ...data.brands.items.map((item) => item.logoStorage),
      ...data.about.studios.map((item) => item.imageStorage),
      ...data.about.teamMembers.map((item) => item.imageStorage),
    ], source);
  } catch (error) {
    logStorageError('Media library register', error);
  }
}

function revalidateContentPaths() {
  revalidatePath('/', 'layout');
  revalidatePath('/');
  revalidatePath('/about');
  revalidatePath('/terms-and-conditions');
  revalidatePath('/admin/content');
}

function parseStats(value: string): AboutStat[] {
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
    .filter((item) => item.value && item.label);
}

function parseValues(value: string): AboutValue[] {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const [rawNum, rawTitle, ...rawDescParts] = line.split('|');

      return {
        id: lineId('value', index),
        num: rawNum?.trim() || `${String(index + 1).padStart(2, '0')}.`,
        title: rawTitle?.trim() || '',
        desc: rawDescParts.join('|').trim(),
        sortOrder: (index + 1) * 10,
        active: true,
      };
    })
    .filter((item) => item.title && item.desc);
}

function formatBodyLines(value: string) {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

async function getUploadedContentImage(formData: FormData, key: string, namespace: string) {
  const file = formFile(formData, key);
  const uploadError = getContentImageUploadError(file);

  if (uploadError) {
    redirect(`/admin/content?error=upload`);
  }

  return saveUploadedContentImage(file, namespace);
}

export async function saveGlobalSeoAction(formData: FormData) {
  await requireAdmin();

  const data = await getSiteContentData();
  const uploadedImage = await getUploadedContentImage(formData, 'seoOpenGraphFile', 'seo');
  const openGraphImage = uploadedImage || formString(formData, 'openGraphImage') || data.seo.openGraphImage;

  const nextData: SiteContentData = {
    ...data,
    seo: {
      title: formString(formData, 'seoTitle') || data.seo.title,
      description: formString(formData, 'seoDescription') || data.seo.description,
      openGraphImage,
      openGraphImageAlt: formString(formData, 'openGraphImageAlt') || data.seo.openGraphImageAlt,
      openGraphImageStorage: mediaStorageForSrc({
        src: openGraphImage,
        uploadedStorage: formStorage(formData, 'openGraphImageStorage'),
        existingStorage: data.seo.openGraphImageStorage,
        existingSrc: data.seo.openGraphImage,
      }) || null,
    },
  };

  await saveContentOrRedirect(nextData, '/admin/content');
  await registerContentMediaAssets(nextData, 'site-content:seo');
  revalidateContentPaths();
  redirect('/admin/content?status=seo-saved');
}

export async function saveBrandsAction(formData: FormData) {
  await requireAdmin();

  const data = await getSiteContentData();
  const existingById = new Map(data.brands.items.map((item) => [item.id, item]));
  const rows = await Promise.all(formData.getAll('brandIndexes')
    .map((value) => String(value))
    .map(async (rowKey, rowIndex) => {
      const existingId = formString(formData, `brandId-${rowKey}`);
      const existing = existingById.get(existingId);
      const type = formString(formData, `brandType-${rowKey}`) === 'text' ? 'text' : 'logo';
      const uploadedLogo = await getUploadedContentImage(formData, `brandLogoFile-${rowKey}`, 'brand');
      const logoSrc = uploadedLogo || formString(formData, `brandLogoSrc-${rowKey}`) || existing?.logoSrc || '';
      const label = formString(formData, `brandLabel-${rowKey}`);

      if (type === 'logo' && !logoSrc) {
        return null;
      }

      if (type === 'text' && !label) {
        return null;
      }

      const brand: BrandPartner = {
        id: existingId || lineId('brand', rowIndex),
        type,
        label,
        logoSrc,
        alt: formString(formData, `brandAlt-${rowKey}`) || label || existing?.alt || 'Brand logo',
        width: formNumber(formData, `brandWidth-${rowKey}`, existing?.width || 146),
        height: formNumber(formData, `brandHeight-${rowKey}`, existing?.height || (type === 'text' ? 72 : 146)),
        sortOrder: formNumber(formData, `brandSortOrder-${rowKey}`, (rowIndex + 1) * 10),
        active: formData.get(`brandActive-${rowKey}`) === 'on',
        logoStorage: mediaStorageForSrc({
          src: logoSrc,
          uploadedStorage: formStorage(formData, `brandLogoStorage-${rowKey}`),
          existingStorage: existing?.logoStorage,
          existingSrc: existing?.logoSrc,
        }) || null,
      };

      return brand;
    }));

  const nextBrands = rows.filter((item): item is BrandPartner => Boolean(item));
  const nextData: SiteContentData = {
    ...data,
    brands: {
      title: formString(formData, 'brandsTitle') || data.brands.title,
      items: nextBrands,
    },
  };

  await saveContentOrRedirect(nextData, '/admin/content');
  await registerContentMediaAssets(nextData, 'site-content:brands');
  revalidateContentPaths();
  redirect('/admin/content?status=brands-saved');
}

export async function saveAboutAction(formData: FormData) {
  await requireAdmin();

  const data = await getSiteContentData();
  const existingStudiosById = new Map(data.about.studios.map((item) => [item.id, item]));
  const existingTeamById = new Map(data.about.teamMembers.map((item) => [item.id, item]));
  const studios = await Promise.all(formData.getAll('studioIndexes')
    .map((value) => String(value))
    .map(async (rowKey, rowIndex) => {
      const existingId = formString(formData, `studioId-${rowKey}`);
      const existing = existingStudiosById.get(existingId);
      const uploadedImage = await getUploadedContentImage(formData, `studioImageFile-${rowKey}`, 'studio');
      const imageSrc = uploadedImage || formString(formData, `studioImageSrc-${rowKey}`) || existing?.imageSrc || '';
      const title = formString(formData, `studioTitle-${rowKey}`);
      const subtitle = formString(formData, `studioSubtitle-${rowKey}`);

      if (!title && !subtitle && !imageSrc) {
        return null;
      }

      const studio: AboutStudioCard = {
        id: existingId || lineId('studio', rowIndex),
        title,
        subtitle,
        imageSrc,
        alt: formString(formData, `studioAlt-${rowKey}`) || title || existing?.alt || 'Studio photo',
        sortOrder: formNumber(formData, `studioSortOrder-${rowKey}`, (rowIndex + 1) * 10),
        active: formData.get(`studioActive-${rowKey}`) === 'on',
        imageStorage: mediaStorageForSrc({
          src: imageSrc,
          uploadedStorage: formStorage(formData, `studioImageStorage-${rowKey}`),
          existingStorage: existing?.imageStorage,
          existingSrc: existing?.imageSrc,
        }) || null,
      };

      return studio;
    }));
  const teamMembers = await Promise.all(formData.getAll('teamIndexes')
    .map((value) => String(value))
    .map(async (rowKey, rowIndex) => {
      const existingId = formString(formData, `teamId-${rowKey}`);
      const existing = existingTeamById.get(existingId);
      const uploadedImage = await getUploadedContentImage(formData, `teamImageFile-${rowKey}`, 'team');
      const imageSrc = uploadedImage || formString(formData, `teamImageSrc-${rowKey}`) || existing?.imageSrc || '';
      const name = formString(formData, `teamName-${rowKey}`);
      const role = formString(formData, `teamRole-${rowKey}`);
      const desc = formString(formData, `teamDesc-${rowKey}`);

      if (!name && !role && !desc && !imageSrc) {
        return null;
      }

      const member: AboutTeamMember = {
        id: existingId || lineId('team', rowIndex),
        name,
        role,
        desc,
        imageSrc,
        alt: formString(formData, `teamAlt-${rowKey}`) || name || existing?.alt || 'Team member',
        sortOrder: formNumber(formData, `teamSortOrder-${rowKey}`, (rowIndex + 1) * 10),
        active: formData.get(`teamActive-${rowKey}`) === 'on',
        imageStorage: mediaStorageForSrc({
          src: imageSrc,
          uploadedStorage: formStorage(formData, `teamImageStorage-${rowKey}`),
          existingStorage: existing?.imageStorage,
          existingSrc: existing?.imageSrc,
        }) || null,
      };

      return member;
    }));

  const timeline = formData.getAll('timelineIndexes')
    .map((value) => String(value))
    .map((rowKey, rowIndex) => {
      const title = formString(formData, `timelineTitle-${rowKey}`);
      const desc = formString(formData, `timelineDesc-${rowKey}`);

      if (!title && !desc) {
        return null;
      }

      return {
        id: formString(formData, `timelineId-${rowKey}`) || lineId('timeline', rowIndex),
        year: formString(formData, `timelineYear-${rowKey}`) || '24',
        title,
        desc,
        side: formString(formData, `timelineSide-${rowKey}`) === 'left' ? 'left' : 'right',
        sortOrder: formNumber(formData, `timelineSortOrder-${rowKey}`, (rowIndex + 1) * 10),
        active: formData.get(`timelineActive-${rowKey}`) === 'on',
      } satisfies AboutTimelineItem;
    })
    .filter((item): item is AboutTimelineItem => Boolean(item));

  const nextData: SiteContentData = {
    ...data,
    about: {
      hero: {
        label: formString(formData, 'heroLabel') || data.about.hero.label,
        heading: formString(formData, 'heroHeading') || data.about.hero.heading,
        subtitle: formString(formData, 'heroSubtitle') || data.about.hero.subtitle,
        primaryCtaLabel: formString(formData, 'heroPrimaryCtaLabel') || data.about.hero.primaryCtaLabel,
        primaryCtaHref: formString(formData, 'heroPrimaryCtaHref') || data.about.hero.primaryCtaHref,
        secondaryCtaLabel: formString(formData, 'heroSecondaryCtaLabel') || data.about.hero.secondaryCtaLabel,
        secondaryCtaHref: formString(formData, 'heroSecondaryCtaHref') || data.about.hero.secondaryCtaHref,
      },
      stats: parseStats(formString(formData, 'aboutStatsLines')),
      studios: studios.filter((item): item is AboutStudioCard => Boolean(item)),
      mission: {
        label: formString(formData, 'missionLabel') || data.about.mission.label,
        heading: formString(formData, 'missionHeading') || data.about.mission.heading,
        body: formString(formData, 'missionBody') || data.about.mission.body,
        primaryCtaLabel: formString(formData, 'missionPrimaryCtaLabel') || data.about.mission.primaryCtaLabel,
        primaryCtaHref: formString(formData, 'missionPrimaryCtaHref') || data.about.mission.primaryCtaHref,
        secondaryCtaLabel: formString(formData, 'missionSecondaryCtaLabel') || data.about.mission.secondaryCtaLabel,
        secondaryCtaHref: formString(formData, 'missionSecondaryCtaHref') || data.about.mission.secondaryCtaHref,
        quote: formString(formData, 'missionQuote') || data.about.mission.quote,
        quoteAttribution: formString(formData, 'missionQuoteAttribution') || data.about.mission.quoteAttribution,
      },
      teamIntro: {
        label: formString(formData, 'teamLabel') || data.about.teamIntro.label,
        heading: formString(formData, 'teamHeading') || data.about.teamIntro.heading,
        subtitle: formString(formData, 'teamSubtitle') || data.about.teamIntro.subtitle,
      },
      teamMembers: teamMembers.filter((item): item is AboutTeamMember => Boolean(item)),
      valuesIntro: {
        label: formString(formData, 'valuesLabel') || data.about.valuesIntro.label,
        heading: formString(formData, 'valuesHeading') || data.about.valuesIntro.heading,
        subtitle: formString(formData, 'valuesSubtitle') || data.about.valuesIntro.subtitle,
      },
      values: parseValues(formString(formData, 'aboutValuesLines')),
      timelineIntro: {
        label: formString(formData, 'timelineLabel') || data.about.timelineIntro.label,
        heading: formString(formData, 'timelineHeading') || data.about.timelineIntro.heading,
      },
      timeline,
    },
  };

  await saveContentOrRedirect(nextData, '/admin/content');
  await registerContentMediaAssets(nextData, 'site-content:about');
  revalidateContentPaths();
  redirect('/admin/content?status=about-saved');
}

export async function saveLegalAction(formData: FormData) {
  await requireAdmin();

  const data = await getSiteContentData();
  const sections = formData.getAll('legalIndexes')
    .map((value) => String(value))
    .map((rowKey, rowIndex) => {
      const title = formString(formData, `legalTitle-${rowKey}`);
      const body = formatBodyLines(formString(formData, `legalBody-${rowKey}`));

      if (!title && body.length === 0) {
        return null;
      }

      return {
        id: formString(formData, `legalId-${rowKey}`) || lineId('legal', rowIndex),
        title,
        body,
        sortOrder: formNumber(formData, `legalSortOrder-${rowKey}`, (rowIndex + 1) * 10),
        active: formData.get(`legalActive-${rowKey}`) === 'on',
      } satisfies LegalSection;
    })
    .filter((item): item is LegalSection => Boolean(item));

  const nextData: SiteContentData = {
    ...data,
    legal: {
      label: formString(formData, 'legalLabel') || data.legal.label,
      heading: formString(formData, 'legalHeading') || data.legal.heading,
      companyName: formString(formData, 'legalCompanyName') || data.legal.companyName,
      gstNumber: formString(formData, 'legalGstNumber') || data.legal.gstNumber,
      sections,
    },
  };

  await saveContentOrRedirect(nextData, '/admin/content');
  revalidateContentPaths();
  redirect('/admin/content?status=legal-saved');
}
