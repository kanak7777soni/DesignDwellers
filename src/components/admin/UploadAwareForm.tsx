'use client';

import { upload } from '@vercel/blob/client';
import type { ComponentPropsWithoutRef, FormEvent, ReactNode } from 'react';
import { useRef, useState } from 'react';
import {
  getUploadValidationErrorForFile,
  mediaTypeFromContentType,
  VERCEL_FUNCTION_BODY_LIMIT_BYTES,
} from '@/lib/media-upload';

type UploadAwareFormProps = Omit<ComponentPropsWithoutRef<'form'>, 'action' | 'onSubmit'> & {
  action: (formData: FormData) => Promise<void>;
  children: ReactNode;
  clientUploadsEnabled: boolean;
  serverUploadFallbackEnabled: boolean;
};

type FileUploadTarget = {
  input: HTMLInputElement;
  file: File;
};

type SingleFileTarget = {
  srcField: string;
  typeField?: string;
  altField?: string;
  expectedType?: 'image' | 'video';
};

const singleFileTargets: Record<string, SingleFileTarget> = {
  cardFile: { srcField: 'cardSrc', typeField: 'cardType', altField: 'cardAlt' },
  cardPosterFile: { srcField: 'cardPoster', expectedType: 'image' },
  featuredFile: { srcField: 'featuredSrc', typeField: 'featuredType', altField: 'featuredAlt' },
  featuredPosterFile: { srcField: 'featuredPoster', expectedType: 'image' },
  seoImageFile: { srcField: 'seoImage', expectedType: 'image' },
  videoFile: { srcField: 'videoUrl', expectedType: 'video' },
  thumbnailFile: { srcField: 'thumbnailUrl', expectedType: 'image' },
};

const multiFileTargets: Record<string, 'heroMedia' | 'galleryMedia'> = {
  heroFiles: 'heroMedia',
  galleryFiles: 'galleryMedia',
};

function safePathPart(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90) || 'upload';
}

function setFieldValue(form: HTMLFormElement, name: string, value: string) {
  const field = form.elements.namedItem(name);

  if (field instanceof HTMLInputElement || field instanceof HTMLSelectElement || field instanceof HTMLTextAreaElement) {
    field.value = value;
    return;
  }

  appendHiddenInput(form, name, value);
}

function appendHiddenInput(form: HTMLFormElement, name: string, value: string) {
  const input = document.createElement('input');
  input.type = 'hidden';
  input.name = name;
  input.value = value;
  form.appendChild(input);
}

function setSubmitButtons(form: HTMLFormElement, disabled: boolean, label?: string) {
  const buttons = Array.from(form.querySelectorAll<HTMLButtonElement>('button[type="submit"]'));

  buttons.forEach((button) => {
    button.disabled = disabled;
    button.style.cursor = disabled ? 'wait' : 'pointer';

    if (label) {
      if (!button.dataset.originalText) {
        button.dataset.originalText = button.textContent || '';
      }
      button.textContent = label;
    } else if (button.dataset.originalText) {
      button.textContent = button.dataset.originalText;
      delete button.dataset.originalText;
    }
  });
}

function collectFileUploads(form: HTMLFormElement): FileUploadTarget[] {
  return Array.from(form.querySelectorAll<HTMLInputElement>('input[type="file"]'))
    .flatMap((input) => Array.from(input.files || []).map((file) => ({ input, file })));
}

function getRowPosterTarget(inputName: string) {
  const match = /^(heroMedia|galleryMedia)PosterFile-(.+)$/.exec(inputName);

  if (!match) {
    return null;
  }

  return {
    groupName: match[1] as 'heroMedia' | 'galleryMedia',
    key: match[2],
  };
}

function getRowMediaTarget(inputName: string) {
  const match = /^(heroMedia|galleryMedia)File-(.+)$/.exec(inputName);

  if (!match) {
    return null;
  }

  return {
    groupName: match[1] as 'heroMedia' | 'galleryMedia',
    key: match[2],
  };
}

function getExpectedTypeError(file: File, expectedType?: 'image' | 'video') {
  if (expectedType === 'image' && !file.type.startsWith('image/')) {
    return 'This upload must be an image file.';
  }

  if (expectedType === 'video' && !file.type.startsWith('video/')) {
    return 'This upload must be a video file.';
  }

  return null;
}

function appendUploadedMediaRow({
  form,
  groupName,
  file,
  url,
  index,
}: {
  form: HTMLFormElement;
  groupName: 'heroMedia' | 'galleryMedia';
  file: File;
  url: string;
  index: number;
}) {
  const key = `blob-${Date.now()}-${index}`;
  const existingRows = form.querySelectorAll(`input[name="${groupName}Indexes"]`).length;
  const order = existingRows + index + 1;
  const mediaType = mediaTypeFromContentType(file.type);
  const altText = file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').trim() || 'Uploaded media';

  appendHiddenInput(form, `${groupName}Indexes`, key);
  appendHiddenInput(form, `${groupName}Id-${key}`, '');
  appendHiddenInput(form, `${groupName}Order-${key}`, String(order));
  appendHiddenInput(form, `${groupName}Type-${key}`, mediaType);
  appendHiddenInput(form, `${groupName}Src-${key}`, url);
  appendHiddenInput(form, `${groupName}Alt-${key}`, altText);
  appendHiddenInput(form, `${groupName}Poster-${key}`, '');
}

export default function UploadAwareForm({
  action,
  children,
  clientUploadsEnabled,
  serverUploadFallbackEnabled,
  className,
  style,
  ...props
}: UploadAwareFormProps) {
  const allowNextSubmit = useRef(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (allowNextSubmit.current) {
      allowNextSubmit.current = false;
      return;
    }

    const form = event.currentTarget;
    const fileUploads = collectFileUploads(form);

    if (fileUploads.length === 0) {
      return;
    }

    if (!clientUploadsEnabled) {
      if (serverUploadFallbackEnabled && fileUploads.every(({ file }) => file.size <= VERCEL_FUNCTION_BODY_LIMIT_BYTES)) {
        return;
      }

      event.preventDefault();
      setError('File upload storage is not configured for this deployment. Paste a media URL instead, or connect Vercel Blob.');
      return;
    }

    event.preventDefault();
    setError(null);
    setStatus(`Uploading 0/${fileUploads.length} files...`);
    setSubmitButtons(form, true, 'Uploading...');

    try {
      for (const [index, { input, file }] of fileUploads.entries()) {
        const validationError = getUploadValidationErrorForFile(file);

        if (validationError) {
          throw new Error(validationError);
        }

        const singleTarget = singleFileTargets[input.name];
        const rowMediaTarget = getRowMediaTarget(input.name);
        const rowPosterTarget = getRowPosterTarget(input.name);
        const expectedTypeError = getExpectedTypeError(file, singleTarget?.expectedType || (rowPosterTarget ? 'image' : undefined));

        if (expectedTypeError) {
          throw new Error(rowPosterTarget ? 'Poster image upload must be an image file. Use Media upload for videos.' : expectedTypeError);
        }

        const pathname = [
          'crm',
          safePathPart(input.name || 'media'),
          `${Date.now()}-${index + 1}-${safePathPart(file.name)}`,
        ].join('/');

        const blob = await upload(pathname, file, {
          access: 'public',
          contentType: file.type,
          handleUploadUrl: '/api/admin/blob-upload',
          multipart: file.size > VERCEL_FUNCTION_BODY_LIMIT_BYTES,
          onUploadProgress: ({ percentage }) => {
            setStatus(`Uploading ${index + 1}/${fileUploads.length} files (${Math.round(percentage)}%)...`);
          },
        });

        const multiTarget = multiFileTargets[input.name];

        if (singleTarget) {
          setFieldValue(form, singleTarget.srcField, blob.url);

          if (singleTarget.typeField) {
            setFieldValue(form, singleTarget.typeField, mediaTypeFromContentType(file.type));
          }

          if (singleTarget.altField) {
            const altField = form.elements.namedItem(singleTarget.altField);
            const altText = file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').trim();

            if (altText && altField instanceof HTMLInputElement && !altField.value.trim()) {
              altField.value = altText;
            }
          }
        } else if (multiTarget) {
          appendUploadedMediaRow({
            form,
            groupName: multiTarget,
            file,
            url: blob.url,
            index,
          });
        } else if (rowMediaTarget) {
          setFieldValue(form, `${rowMediaTarget.groupName}Src-${rowMediaTarget.key}`, blob.url);
          setFieldValue(form, `${rowMediaTarget.groupName}Type-${rowMediaTarget.key}`, mediaTypeFromContentType(file.type));

          const altField = form.elements.namedItem(`${rowMediaTarget.groupName}Alt-${rowMediaTarget.key}`);
          const altText = file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').trim();

          if (altText && altField instanceof HTMLInputElement && !altField.value.trim()) {
            altField.value = altText;
          }
        } else if (rowPosterTarget) {
          setFieldValue(form, `${rowPosterTarget.groupName}Poster-${rowPosterTarget.key}`, blob.url);
        }
      }

      fileUploads.forEach(({ input }) => {
        input.value = '';
      });

      setStatus('Upload complete. Saving...');
      setSubmitButtons(form, true, 'Saving...');
      allowNextSubmit.current = true;
      form.requestSubmit();
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Upload failed. Please try again.');
      setStatus(null);
      setSubmitButtons(form, false);
    }
  }

  return (
    <form action={action} className={className} style={style} onSubmit={handleSubmit} {...props}>
      {children}
      {status ? (
        <p className="font-body" aria-live="polite" style={{ color: '#D7A648', fontSize: '13px', marginTop: '-12px' }}>
          {status}
        </p>
      ) : null}
      {error ? (
        <p className="font-body" aria-live="assertive" style={{ border: '1px solid rgba(215,166,72,0.55)', background: 'rgba(215,166,72,0.16)', color: '#FFFFFF', borderRadius: '6px', padding: '12px' }}>
          {error}
        </p>
      ) : null}
    </form>
  );
}
