import { getImageKitPrivateKey } from '@/lib/imagekit';

export function hasImageKitAdminConfig() {
  return Boolean(getImageKitPrivateKey());
}

export async function deleteImageKitFile(fileId: string) {
  const privateKey = getImageKitPrivateKey();

  if (!privateKey) {
    throw new Error('ImageKit private key is not configured.');
  }

  const response = await fetch(`https://api.imagekit.io/v1/files/${encodeURIComponent(fileId)}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Basic ${Buffer.from(`${privateKey}:`).toString('base64')}`,
    },
  });

  if (!response.ok) {
    const message = await response.text().catch(() => '');
    throw new Error(message || `ImageKit delete failed with status ${response.status}.`);
  }
}
