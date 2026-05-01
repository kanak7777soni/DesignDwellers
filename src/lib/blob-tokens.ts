export function getCrmBlobToken() {
  return process.env.CRM_BLOB_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN || '';
}

export function hasCrmBlobToken() {
  return Boolean(getCrmBlobToken());
}
