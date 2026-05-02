/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import AdminHeader from '@/components/admin/AdminHeader';
import ConfirmSubmitButton from '@/components/admin/ConfirmSubmitButton';
import { requireAdmin } from '@/lib/admin-auth';
import { hasImageKitAdminConfig } from '@/lib/imagekit-admin';
import { getMediaCleanupSummary, type MediaCleanupAsset } from '@/lib/media-cleanup';
import { formatBytes } from '@/lib/media-library-store';
import { deleteUnusedMediaAssetAction } from './actions';

export const dynamic = 'force-dynamic';

const badgeStyle = {
  borderRadius: '999px',
  padding: '4px 9px',
  fontSize: '12px',
  lineHeight: '1em',
};

function statusText(status?: string) {
  if (status === 'deleted') return 'Unused media deleted from ImageKit.';
  return null;
}

function errorText(error?: string) {
  if (error === 'delete') return 'Media could not be deleted. It may still be referenced, already deleted, or ImageKit credentials may be missing.';
  return null;
}

function formatDate(value?: string) {
  if (!value) {
    return 'Unknown date';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function isVideoAsset(asset: MediaCleanupAsset) {
  return asset.fileType?.startsWith('video/')
    || /\.(mp4|webm|mov)(\?|$)/i.test(asset.url);
}

function AssetPreview({ asset }: { asset: MediaCleanupAsset }) {
  if (isVideoAsset(asset)) {
    return (
      <video
        src={asset.url}
        muted
        playsInline
        preload="metadata"
        style={{ width: '116px', height: '78px', objectFit: 'cover', borderRadius: '6px', background: '#141300' }}
      />
    );
  }

  return (
    <img
      src={asset.url}
      alt={asset.name || 'Tracked media asset'}
      style={{ width: '116px', height: '78px', objectFit: 'cover', borderRadius: '6px', background: '#141300' }}
    />
  );
}

function AssetRow({ asset, canDelete }: { asset: MediaCleanupAsset; canDelete: boolean }) {
  const isDeleted = Boolean(asset.deletedAt);
  const isUnused = !asset.referenced && !isDeleted;

  return (
    <div className="grid items-center" style={{ gridTemplateColumns: '116px 1fr 125px 130px 150px', gap: '14px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '14px' }}>
      <AssetPreview asset={asset} />
      <div style={{ minWidth: 0 }}>
        <div className="flex items-center" style={{ gap: '8px', marginBottom: '7px' }}>
          <span
            className="font-body"
            style={{
              ...badgeStyle,
              background: isDeleted ? 'rgba(255,255,255,0.08)' : isUnused ? 'rgba(215,166,72,0.16)' : 'rgba(255,255,255,0.08)',
              color: isUnused ? '#D7A648' : 'rgba(255,255,255,0.72)',
            }}
          >
            {isDeleted ? 'Deleted' : isUnused ? 'Unused' : 'In use'}
          </span>
          <span className="font-body" style={{ color: 'rgba(255,255,255,0.55)', fontSize: '12px' }}>
            {asset.fileType || 'unknown type'}
          </span>
        </div>
        <p className="font-heading" style={{ color: '#D7A648', fontSize: '20px', overflowWrap: 'anywhere' }}>
          {asset.name || asset.filePath || asset.fileId}
        </p>
        <p className="font-body" style={{ color: 'rgba(255,255,255,0.58)', fontSize: '12px', marginTop: '5px', overflowWrap: 'anywhere' }}>
          {asset.url}
        </p>
        {asset.references.length > 0 ? (
          <p className="font-body" style={{ color: 'rgba(255,255,255,0.68)', fontSize: '12px', marginTop: '7px' }}>
            Used by {asset.references.slice(0, 3).join(', ')}{asset.references.length > 3 ? ` and ${asset.references.length - 3} more` : ''}
          </p>
        ) : null}
        {asset.deleteError ? (
          <p className="font-body" style={{ color: '#D7A648', fontSize: '12px', marginTop: '7px' }}>
            Last delete error: {asset.deleteError}
          </p>
        ) : null}
      </div>
      <span className="font-body" style={{ color: '#FFFFFF', fontSize: '13px' }}>
        {formatBytes(asset.size)}
      </span>
      <span className="font-body" style={{ color: 'rgba(255,255,255,0.68)', fontSize: '13px' }}>
        {formatDate(asset.lastSeenAt)}
      </span>
      {isUnused && canDelete ? (
        <form action={deleteUnusedMediaAssetAction}>
          <input type="hidden" name="fileId" value={asset.fileId} />
          <ConfirmSubmitButton
            message={`Permanently delete ${asset.name || 'this unused media file'} from ImageKit?`}
            className="font-body"
            style={{ background: '#D7A648', color: '#FFFFFF', border: 'none', borderRadius: '55px', padding: '9px 13px', cursor: 'pointer' }}
          >
            Delete File
          </ConfirmSubmitButton>
        </form>
      ) : (
        <span className="font-body" style={{ color: 'rgba(255,255,255,0.45)', fontSize: '13px' }}>
          {isDeleted ? 'Already deleted' : isUnused ? 'Needs ImageKit key' : 'Protected'}
        </span>
      )}
    </div>
  );
}

export default async function AdminMediaCleanupPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; error?: string }>;
}) {
  await requireAdmin();
  const [{ status, error }, summary] = await Promise.all([searchParams, getMediaCleanupSummary()]);
  const message = statusText(status);
  const errorMessage = errorText(error);
  const imageKitReady = hasImageKitAdminConfig();

  return (
    <main className="min-h-screen" style={{ background: '#141300', color: '#FFFFFF', padding: '34px' }}>
      <div className="mx-auto" style={{ maxWidth: '1180px' }}>
        <AdminHeader />

        <div style={{ marginBottom: '24px' }}>
          <Link href="/admin" className="font-body" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px' }}>
            Back to dashboard
          </Link>
          <h1 className="font-heading" style={{ color: '#FFFFFF', fontSize: '44px', marginTop: '18px' }}>
            Media Cleanup
          </h1>
          <p className="font-body" style={{ color: 'rgba(255,255,255,0.62)', fontSize: '14px', marginTop: '8px', maxWidth: '780px' }}>
            Delete ImageKit uploads that are no longer used by any portfolio project, SEO image, hero/gallery item, or Instagram reel. Tracked direct URLs without an ImageKit file id stay protected from automatic deletion.
          </p>
        </div>

        {message ? (
          <p className="font-body" style={{ border: '1px solid rgba(215,166,72,0.4)', background: 'rgba(215,166,72,0.12)', borderRadius: '6px', padding: '12px', marginBottom: '22px' }}>
            {message}
          </p>
        ) : null}

        {errorMessage ? (
          <p className="font-body" style={{ border: '1px solid rgba(215,166,72,0.55)', background: 'rgba(215,166,72,0.16)', borderRadius: '6px', padding: '12px', marginBottom: '22px' }}>
            {errorMessage}
          </p>
        ) : null}

        {!imageKitReady ? (
          <p className="font-body" style={{ border: '1px solid rgba(215,166,72,0.55)', background: 'rgba(215,166,72,0.16)', borderRadius: '6px', padding: '12px', marginBottom: '22px' }}>
            ImageKit private key is not configured, so deletion is disabled until IMAGEKIT_PRIVATE_KEY is set and deployed.
          </p>
        ) : null}

        <section className="grid grid-cols-4" style={{ gap: '16px', marginBottom: '28px' }}>
          {[
            { label: 'Tracked', value: summary.activeCount },
            { label: 'In use', value: summary.referencedCount },
            { label: 'Unused', value: summary.unusedCount },
            { label: 'Deleted', value: summary.deletedCount },
          ].map((item) => (
            <div key={item.label} style={{ background: '#000000', border: '1px solid rgba(215,166,72,0.25)', borderRadius: '8px', padding: '22px' }}>
              <p className="font-body" style={{ color: 'rgba(255,255,255,0.65)', fontSize: '13px', marginBottom: '8px' }}>{item.label}</p>
              <p className="font-heading" style={{ color: '#D7A648', fontSize: '42px', lineHeight: '1em' }}>{item.value}</p>
            </div>
          ))}
        </section>

        <section style={{ background: '#000000', border: '1px solid rgba(215,166,72,0.25)', borderRadius: '8px', padding: '24px' }}>
          {summary.totalCount === 0 ? (
            <p className="font-body" style={{ color: 'rgba(255,255,255,0.62)' }}>
              No tracked ImageKit uploads yet. New uploads will appear here after a project or reel is saved.
            </p>
          ) : (
            <div className="flex flex-col" style={{ gap: '14px' }}>
              {summary.assets.map((asset) => (
                <AssetRow key={asset.fileId} asset={asset} canDelete={imageKitReady} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
