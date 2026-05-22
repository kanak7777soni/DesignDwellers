import Link from 'next/link';
import AdminHeader from '@/components/admin/AdminHeader';
import ConfirmSubmitButton from '@/components/admin/ConfirmSubmitButton';
import { requireAdmin } from '@/lib/admin-auth';
import { listPortfolioBackups } from '@/lib/portfolio-store';
import { deleteBackupAction, restoreBackupAction } from '../actions';

export const dynamic = 'force-dynamic';

function statusText(status?: string) {
  if (status === 'restored') return 'Backup restored. A safety backup was created before restoring.';
  if (status === 'backup-deleted') return 'Backup deleted.';
  return null;
}

function errorText(error?: string) {
  if (error === 'storage') return 'CRM storage could not update backups. Add the private Blob token as CRM_BLOB_READ_WRITE_TOKEN, or use BLOB_READ_WRITE_TOKEN only if it points to a private Blob store.';
  return null;
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export default async function AdminBackupsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; error?: string }>;
}) {
  await requireAdmin();
  const [{ status, error }, backups] = await Promise.all([searchParams, listPortfolioBackups()]);
  const message = statusText(status);
  const errorMessage = errorText(error);

  return (
    <main className="admin-page min-h-screen" style={{ background: '#141300', color: '#FFFFFF', padding: '34px' }}>
      <div className="mx-auto" style={{ maxWidth: '1180px' }}>
        <AdminHeader />

        <div className="flex items-start justify-between" style={{ marginBottom: '24px' }}>
          <div>
            <Link href="/admin" className="font-body" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px' }}>
              Back to dashboard
            </Link>
            <h1 className="font-heading" style={{ color: '#FFFFFF', fontSize: '44px', marginTop: '18px' }}>
              Portfolio Backups
            </h1>
            <p className="font-body" style={{ color: 'rgba(255,255,255,0.62)', fontSize: '14px', marginTop: '8px', maxWidth: '620px' }}>
              The CRM keeps the latest 30 snapshots before content changes. Restore only when you want to roll the portfolio data back.
            </p>
          </div>
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

        <section style={{ background: '#000000', border: '1px solid rgba(215,166,72,0.25)', borderRadius: '8px', padding: '24px' }}>
          {backups.length === 0 ? (
            <p className="font-body" style={{ color: 'rgba(255,255,255,0.62)' }}>
              No backups yet. A backup will be created automatically before the next project or category save.
            </p>
          ) : (
            <div className="flex flex-col" style={{ gap: '14px' }}>
              {backups.map((backup) => (
                <div key={backup.id} className="grid items-center" style={{ gridTemplateColumns: '1fr 130px 130px 180px', gap: '14px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '14px' }}>
                  <div>
                    <p className="font-heading" style={{ color: '#D7A648', fontSize: '22px' }}>
                      {formatDate(backup.createdAt)}
                    </p>
                    <p className="font-body" style={{ color: 'rgba(255,255,255,0.62)', fontSize: '13px', marginTop: '4px' }}>
                      {backup.reason}
                    </p>
                  </div>
                  <span className="font-body" style={{ fontSize: '13px', color: '#FFFFFF' }}>
                    {backup.projectCount} projects
                  </span>
                  <span className="font-body" style={{ fontSize: '13px', color: '#FFFFFF' }}>
                    {backup.categoryCount} categories
                  </span>
                  <div className="flex" style={{ gap: '10px' }}>
                    <form action={restoreBackupAction}>
                      <input type="hidden" name="id" value={backup.id} />
                      <ConfirmSubmitButton message={`Restore backup from ${formatDate(backup.createdAt)}? Current data will be backed up first.`} pendingLabel="Restoring..." className="font-body" style={{ background: '#D7A648', color: '#FFFFFF', border: 'none', borderRadius: '55px', padding: '9px 13px', cursor: 'pointer' }}>
                        Restore
                      </ConfirmSubmitButton>
                    </form>
                    <form action={deleteBackupAction}>
                      <input type="hidden" name="id" value={backup.id} />
                      <ConfirmSubmitButton message={`Delete backup from ${formatDate(backup.createdAt)}?`} pendingLabel="Deleting..." className="font-body" style={{ background: 'transparent', color: '#FFFFFF', opacity: 0.65, border: 'none', padding: '9px 0', cursor: 'pointer' }}>
                        Delete
                      </ConfirmSubmitButton>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
