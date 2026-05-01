import crypto from 'crypto';

export function getImageKitPublicKey() {
  return process.env.IMAGEKIT_PUBLIC_KEY || '';
}

export function getImageKitPrivateKey() {
  return process.env.IMAGEKIT_PRIVATE_KEY || '';
}

export function getImageKitUrlEndpoint() {
  return process.env.IMAGEKIT_URL_ENDPOINT || '';
}

export function hasImageKitUploadConfig() {
  return Boolean(getImageKitPublicKey() && getImageKitPrivateKey());
}

export function createImageKitUploadAuth() {
  const publicKey = getImageKitPublicKey();
  const privateKey = getImageKitPrivateKey();

  if (!publicKey || !privateKey) {
    return null;
  }

  const token = crypto.randomUUID();
  const expire = Math.floor(Date.now() / 1000) + 30 * 60;
  const signature = crypto
    .createHmac('sha1', privateKey)
    .update(`${token}${expire}`)
    .digest('hex');

  return {
    publicKey,
    token,
    expire,
    signature,
    urlEndpoint: getImageKitUrlEndpoint(),
  };
}
