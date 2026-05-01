export function getMediaBlobToken() {
  return process.env.MEDIA_BLOB_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN || '';
}

export function hasMediaBlobToken() {
  return Boolean(getMediaBlobToken());
}

export function getCrmBlobToken() {
  return process.env.CRM_BLOB_READ_WRITE_TOKEN || '';
}

export function hasCrmBlobToken() {
  return Boolean(getCrmBlobToken());
}
