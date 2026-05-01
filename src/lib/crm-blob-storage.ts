import { del, get, list, put, type ListBlobResultBlob } from '@vercel/blob';
import { getCrmBlobToken, hasCrmBlobToken } from '@/lib/blob-tokens';

const JSON_CACHE_MAX_AGE_SECONDS = 60;

export function shouldUseBlobCrmStorage() {
  return Boolean(process.env.VERCEL && hasCrmBlobToken());
}

export async function readCrmBlobText(pathname: string) {
  const result = await get(pathname, { access: 'private', token: getCrmBlobToken(), useCache: false });

  if (!result || result.statusCode !== 200) {
    return null;
  }

  return new Response(result.stream).text();
}

export async function writeCrmBlobText(pathname: string, content: string) {
  await put(pathname, content, {
    access: 'private',
    allowOverwrite: true,
    contentType: 'application/json',
    cacheControlMaxAge: JSON_CACHE_MAX_AGE_SECONDS,
    token: getCrmBlobToken(),
  });
}

export async function listCrmBlobFiles(prefix: string) {
  const blobs: ListBlobResultBlob[] = [];
  let cursor: string | undefined;

  do {
    const result = await list({ prefix, cursor, token: getCrmBlobToken() });
    blobs.push(...result.blobs);
    cursor = result.cursor;
  } while (cursor);

  return blobs;
}

export async function deleteCrmBlobFile(pathname: string | string[]) {
  await del(pathname, { token: getCrmBlobToken() });
}
