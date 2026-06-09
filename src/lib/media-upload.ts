import type { ProjectMedia } from '@/lib/portfolio';

const MB = 1024 * 1024;

export const VERCEL_FUNCTION_BODY_LIMIT_BYTES = 4.5 * 1024 * 1024;
export const IMAGEKIT_IMAGE_UPLOAD_LIMIT_BYTES = 40 * MB;
export const IMAGEKIT_VIDEO_UPLOAD_LIMIT_BYTES = 300 * MB;
export const IMAGE_UPLOAD_MAX_DIMENSION = 4096;
export const IMAGE_UPLOAD_MAX_PIXELS = 16_000_000;
export const IMAGE_UPLOAD_QUALITY = 0.86;
export const IMAGEKIT_IMAGE_PRE_TRANSFORMATION = `w-${IMAGE_UPLOAD_MAX_DIMENSION},h-${IMAGE_UPLOAD_MAX_DIMENSION},c-at_max,q-85`;

export const ALLOWED_UPLOAD_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'video/mp4',
  'video/webm',
  'video/quicktime',
];

const allowedUploadTypes = new Set(ALLOWED_UPLOAD_TYPES);

function formatBytes(bytes: number) {
  return `${Math.round(bytes / MB)} MB`;
}

export function mediaTypeFromContentType(type: string): ProjectMedia['type'] {
  return type.startsWith('video/') ? 'video' : 'image';
}

export function getUploadValidationErrorForFile(file: { size: number; type: string } | null | undefined) {
  if (!file || file.size === 0) {
    return null;
  }

  if (!allowedUploadTypes.has(file.type)) {
    return 'Unsupported file type.';
  }

  const uploadLimit = file.type.startsWith('video/')
    ? IMAGEKIT_VIDEO_UPLOAD_LIMIT_BYTES
    : IMAGEKIT_IMAGE_UPLOAD_LIMIT_BYTES;

  if (file.size > uploadLimit) {
    return `${file.type.startsWith('video/') ? 'Video' : 'Image'} uploads must be ${formatBytes(uploadLimit)} or smaller.`;
  }

  return null;
}

export function mediaTypeFromUrl(value: string | null | undefined): ProjectMedia['type'] {
  const src = value?.toString().toLowerCase() || '';
  return /\.(mp4|webm|mov|m4v)(\?|#|$)/.test(src) ? 'video' : 'image';
}
