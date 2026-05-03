import Link from 'next/link';
import AdminHeader from '@/components/admin/AdminHeader';
import ConfirmSubmitButton from '@/components/admin/ConfirmSubmitButton';
import InstagramReelMediaFields from '@/components/admin/InstagramReelMediaFields';
import SubmitButton from '@/components/admin/SubmitButton';
import UploadAwareForm from '@/components/admin/UploadAwareForm';
import { requireAdmin } from '@/lib/admin-auth';
import { hasImageKitUploadConfig } from '@/lib/imagekit';
import { getInstagramReelsData, type ManagedInstagramReel } from '@/lib/instagram-reels-store';
import {
  deleteInstagramReelAction,
  saveInstagramProfileAction,
  saveInstagramReelAction,
  saveInstagramSettingsAction,
  syncInstagramReelsAction,
} from './actions';

export const dynamic = 'force-dynamic';

const inputStyle = {
  height: '38px',
  borderRadius: '6px',
  border: '1px solid rgba(215,166,72,0.35)',
  background: '#141300',
  color: '#FFFFFF',
  padding: '0 10px',
  outline: 'none',
};

const textAreaStyle = {
  minHeight: '72px',
  borderRadius: '6px',
  border: '1px solid rgba(215,166,72,0.35)',
  background: '#141300',
  color: '#FFFFFF',
  padding: '10px',
  outline: 'none',
  resize: 'vertical' as const,
};

function statusText(status?: string, count?: string) {
  if (status === 'profile-saved') return 'Instagram profile saved.';
  if (status === 'reel-saved') return 'Instagram reel saved.';
  if (status === 'reel-deleted') return 'Instagram reel deleted.';
  if (status === 'settings-saved') return 'Instagram sync settings saved.';
  if (status === 'synced') return `Instagram sync completed${count ? ` with ${count} video/reel item${count === '1' ? '' : 's'}` : ''}.`;
  return null;
}

function errorText(error?: string) {
  if (error === 'permalink') return 'Instagram reel link is required.';
  if (error === 'profile-url') return 'Profile URL must start with http:// or https://.';
  if (error === 'media-url') return 'Video and thumbnail URLs must be http://, https://, or a saved upload path.';
  if (error === 'upload') return 'Upload JPG, PNG, WebP, GIF thumbnails or MP4, WebM, MOV videos only.';
  if (error === 'sync') return 'Instagram sync failed. Check the saved sync message below.';
  return null;
}

function ReelForm({
  reel,
  isNew = false,
  fallbackOrder,
}: {
  reel?: ManagedInstagramReel;
  isNew?: boolean;
  fallbackOrder: number;
}) {
  const formId = isNew ? 'new-reel' : `reel-${reel?.id}`;
  const clientUploadsEnabled = hasImageKitUploadConfig();
  const serverUploadFallbackEnabled = !process.env.VERCEL;

  return (
    <div className="flex flex-col" style={{ gap: '12px' }}>
      <UploadAwareForm
        id={formId}
        action={saveInstagramReelAction}
        clientUploadsEnabled={clientUploadsEnabled}
        serverUploadFallbackEnabled={serverUploadFallbackEnabled}
        className="flex flex-col"
        style={{ gap: '14px' }}
      >
        <input type="hidden" name="id" value={reel?.id || ''} />
        <input type="hidden" name="videoStorage" value={reel?.videoStorage ? JSON.stringify(reel.videoStorage) : ''} />
        <input type="hidden" name="thumbnailStorage" value={reel?.thumbnailStorage ? JSON.stringify(reel.thumbnailStorage) : ''} />
        <div className="grid" style={{ gridTemplateColumns: '1.3fr 1fr 130px', gap: '10px' }}>
          <label className="font-body flex flex-col" style={{ gap: '8px', color: '#D7A648', fontSize: '13px' }}>
            Caption
            <textarea name="caption" defaultValue={reel?.caption || ''} className="font-body" style={textAreaStyle} />
          </label>
          <label className="font-body flex flex-col" style={{ gap: '8px', color: '#D7A648', fontSize: '13px' }}>
            Instagram reel link
            <input name="permalink" defaultValue={reel?.permalink || ''} placeholder="https://www.instagram.com/reel/..." className="font-body" style={inputStyle} />
          </label>
          <label className="font-body flex flex-col" style={{ gap: '8px', color: '#D7A648', fontSize: '13px' }}>
            Website order
            <input name="sortOrder" type="number" defaultValue={reel?.sortOrder ?? fallbackOrder} className="font-body number-input-clean" style={inputStyle} />
            <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: '12px' }}>
              Lower shows first
            </span>
          </label>
        </div>

        <InstagramReelMediaFields
          videoUrl={reel?.videoUrl || ''}
          thumbnailUrl={reel?.thumbnailUrl || ''}
          caption={reel?.caption || ''}
        />

        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <label className="font-body flex flex-col" style={{ gap: '8px', color: '#D7A648', fontSize: '13px' }}>
            Username
            <input name="username" defaultValue={reel?.username || ''} placeholder="designdwellersstudio" className="font-body" style={inputStyle} />
          </label>
          <label className="font-body flex flex-col" style={{ gap: '8px', color: '#D7A648', fontSize: '13px' }}>
            Date/time
            <input name="timestamp" defaultValue={reel?.timestamp || ''} placeholder="Optional ISO date" className="font-body" style={inputStyle} />
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex" style={{ gap: '14px' }}>
            <label className="font-body flex items-center" style={{ gap: '8px', color: '#FFFFFF', fontSize: '14px' }}>
              <input type="checkbox" name="active" defaultChecked={reel?.active ?? true} />
              Show on home page
            </label>
            <label className="font-body flex items-center" style={{ gap: '8px', color: '#FFFFFF', fontSize: '14px' }}>
              <input type="checkbox" name="isReel" defaultChecked={reel?.isReel ?? true} />
              Reel badge
            </label>
          </div>
          <SubmitButton pendingLabel={isNew ? 'Adding...' : 'Saving...'} className="font-body" style={{ background: '#D7A648', color: '#FFFFFF', border: 'none', borderRadius: '55px', padding: '9px 14px', cursor: 'pointer' }}>
            {isNew ? 'Add Reel' : 'Save Reel'}
          </SubmitButton>
        </div>
      </UploadAwareForm>
      {!isNew && reel ? (
        <form action={deleteInstagramReelAction} className="flex justify-end">
          <input type="hidden" name="id" value={reel.id} />
          <ConfirmSubmitButton message="Delete this Instagram reel from the CRM?" pendingLabel="Deleting..." className="font-body" style={{ background: 'transparent', color: '#FFFFFF', opacity: 0.65, border: 'none', padding: '0', cursor: 'pointer' }}>
            Delete Reel
          </ConfirmSubmitButton>
        </form>
      ) : null}
    </div>
  );
}

export default async function AdminInstagramPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; error?: string; count?: string }>;
}) {
  await requireAdmin();
  const [{ status, error, count }, data] = await Promise.all([searchParams, getInstagramReelsData()]);
  const message = statusText(status, count);
  const errorMessage = errorText(error);
  const hasSavedToken = Boolean(data.settings.accessToken);
  const newReelOrder = data.reels[0] ? data.reels[0].sortOrder - 10 : 10;

  return (
    <main className="min-h-screen" style={{ background: '#141300', color: '#FFFFFF', padding: '34px' }}>
      <div className="mx-auto" style={{ maxWidth: '1180px' }}>
        <AdminHeader />

        <div style={{ marginBottom: '24px' }}>
          <Link href="/admin" className="font-body" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px' }}>
            Back to dashboard
          </Link>
          <h1 className="font-heading" style={{ color: '#FFFFFF', fontSize: '44px', marginTop: '18px' }}>
            Instagram Reels
          </h1>
          <p className="font-body" style={{ color: 'rgba(255,255,255,0.62)', fontSize: '14px', marginTop: '8px', maxWidth: '760px' }}>
            Control the home page Instagram section from here. Save an Instagram token, sync reels from Instagram, or add reel cards manually with uploads and links.
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

        <section style={{ background: '#000000', border: '1px solid rgba(215,166,72,0.25)', borderRadius: '8px', padding: '24px', marginBottom: '28px' }}>
          <h2 className="font-heading" style={{ fontSize: '30px', color: '#FFFFFF', marginBottom: '18px' }}>
            Instagram Sync
          </h2>
          <form action={saveInstagramSettingsAction} className="flex flex-col" style={{ gap: '14px' }}>
            <div className="grid" style={{ gridTemplateColumns: '1.5fr 1fr 120px 110px', gap: '12px' }}>
              <label className="font-body flex flex-col" style={{ gap: '8px', color: '#D7A648', fontSize: '13px' }}>
                Access token
                <input name="accessToken" type="password" placeholder={hasSavedToken ? 'Saved token is active; leave blank to keep it' : 'Paste Instagram access token'} className="font-body" style={inputStyle} />
              </label>
              <label className="font-body flex flex-col" style={{ gap: '8px', color: '#D7A648', fontSize: '13px' }}>
                Instagram user ID
                <input name="userId" defaultValue={data.settings.userId || ''} placeholder="Optional for Graph API" className="font-body" style={inputStyle} />
              </label>
              <label className="font-body flex flex-col" style={{ gap: '8px', color: '#D7A648', fontSize: '13px' }}>
                API version
                <input name="apiVersion" defaultValue={data.settings.apiVersion} className="font-body" style={inputStyle} />
              </label>
              <label className="font-body flex flex-col" style={{ gap: '8px', color: '#D7A648', fontSize: '13px' }}>
                Fetch limit
                <input name="lookupLimit" type="number" min={1} max={100} defaultValue={data.settings.lookupLimit} className="font-body number-input-clean" style={inputStyle} />
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div className="font-body" style={{ color: 'rgba(255,255,255,0.68)', fontSize: '13px' }}>
                {hasSavedToken ? 'Token saved in CRM storage.' : 'No token saved yet.'}
                {data.settings.lastSyncedAt ? ` Last sync: ${new Date(data.settings.lastSyncedAt).toLocaleString()}.` : ''}
              </div>
              <div className="flex items-center" style={{ gap: '14px' }}>
                <label className="font-body flex items-center" style={{ gap: '8px', color: '#FFFFFF', fontSize: '14px' }}>
                  <input type="checkbox" name="clearToken" />
                  Clear saved token
                </label>
                <SubmitButton pendingLabel="Saving..." className="font-body" style={{ background: '#D7A648', color: '#FFFFFF', border: 'none', borderRadius: '55px', padding: '9px 14px', cursor: 'pointer' }}>
                  Save Settings
                </SubmitButton>
              </div>
            </div>
          </form>
          <div className="flex items-center justify-between" style={{ borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: '18px', paddingTop: '18px' }}>
            <p className="font-body" style={{ color: data.settings.lastSyncError ? '#D7A648' : 'rgba(255,255,255,0.62)', fontSize: '13px', maxWidth: '760px' }}>
              {data.settings.lastSyncError || 'Sync imports video/reel posts into the list below. Imported reels can still be reordered, hidden, edited, or deleted from the CRM.'}
            </p>
            <form action={syncInstagramReelsAction}>
              <SubmitButton pendingLabel="Syncing..." className="font-body" style={{ background: 'transparent', color: '#D7A648', border: '1px solid rgba(215,166,72,0.6)', borderRadius: '55px', padding: '9px 14px', cursor: 'pointer' }}>
                Sync From Instagram
              </SubmitButton>
            </form>
          </div>
        </section>

        <section style={{ background: '#000000', border: '1px solid rgba(215,166,72,0.25)', borderRadius: '8px', padding: '24px', marginBottom: '28px' }}>
          <h2 className="font-heading" style={{ fontSize: '30px', color: '#FFFFFF', marginBottom: '18px' }}>
            Profile
          </h2>
          <form action={saveInstagramProfileAction} className="grid items-end" style={{ gridTemplateColumns: '1fr 1.5fr 110px', gap: '12px' }}>
            <label className="font-body flex flex-col" style={{ gap: '8px', color: '#D7A648', fontSize: '13px' }}>
              Username
              <input name="username" defaultValue={data.profile.username || ''} className="font-body" style={inputStyle} />
            </label>
            <label className="font-body flex flex-col" style={{ gap: '8px', color: '#D7A648', fontSize: '13px' }}>
              Profile URL
              <input name="url" defaultValue={data.profile.url || ''} className="font-body" style={inputStyle} />
            </label>
            <SubmitButton pendingLabel="Saving..." className="font-body" style={{ height: '38px', background: '#D7A648', color: '#FFFFFF', border: 'none', borderRadius: '55px', cursor: 'pointer' }}>
              Save
            </SubmitButton>
          </form>
        </section>

        <section style={{ background: '#000000', border: '1px solid rgba(215,166,72,0.25)', borderRadius: '8px', padding: '24px' }}>
          <h2 className="font-heading" style={{ fontSize: '30px', color: '#FFFFFF', marginBottom: '18px' }}>
            Reels ({data.reels.length})
          </h2>
          <p className="font-body" style={{ color: 'rgba(255,255,255,0.62)', fontSize: '13px', marginTop: '-10px', marginBottom: '18px' }}>
            Website order controls the home page order. Newly fetched Instagram reels are placed first by default, then you can adjust the numbers and save.
          </p>
          <div className="flex flex-col" style={{ gap: '18px' }}>
            {data.reels.map((reel, index) => (
              <div key={reel.id} id={`reel-${reel.id}`} style={{ borderTop: index === 0 ? 'none' : '1px solid rgba(255,255,255,0.08)', paddingTop: index === 0 ? 0 : '18px' }}>
                <ReelForm reel={reel} fallbackOrder={(index + 1) * 10} />
              </div>
            ))}
            <div id="new-reel" style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '18px' }}>
              <h3 className="font-heading" style={{ color: '#D7A648', fontSize: '24px', marginBottom: '12px' }}>
                Add New Reel
              </h3>
              <ReelForm isNew fallbackOrder={newReelOrder} />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
