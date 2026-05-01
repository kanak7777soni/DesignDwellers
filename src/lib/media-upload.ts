import type { ProjectMedia } from '@/lib/portfolio';

export const VERCEL_FUNCTION_BODY_LIMIT_BYTES = 4.5 * 1024 * 1024;

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

  return null;
}

export function mediaTypeFromUrl(value: string | null | undefined): ProjectMedia['type'] {
  const src = value?.toString().toLowerCase() || '';
  return /\.(mp4|webm|mov|m4v)(\?|#|$)/.test(src) ? 'video' : 'image';
}
