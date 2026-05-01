import Link from 'next/link';
import AdminHeader from '@/components/admin/AdminHeader';
import ProjectForm from '@/components/admin/ProjectForm';
import { requireAdmin } from '@/lib/admin-auth';
import { getPortfolioData } from '@/lib/portfolio-store';
import { saveProjectAction } from '../../actions';

export const dynamic = 'force-dynamic';

function getErrorMessage(error?: string) {
  if (error === 'name') return 'Project name is required.';
  if (error === 'card-media') return 'Add a card media upload or paste a card media URL before saving.';
  if (error === 'upload') return 'Upload JPG, PNG, WebP, GIF, MP4, WebM, or MOV files only.';
  if (error === 'storage') return 'CRM storage could not save this project. Add the private Blob token as CRM_BLOB_READ_WRITE_TOKEN, or use BLOB_READ_WRITE_TOKEN only if it points to a private Blob store.';
  return null;
}

export default async function NewProjectPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requireAdmin();
  const [data, { error }] = await Promise.all([getPortfolioData(), searchParams]);
  const errorMessage = getErrorMessage(error);

  return (
    <main className="min-h-screen" style={{ background: '#141300', color: '#FFFFFF', padding: '34px' }}>
      <div className="mx-auto" style={{ maxWidth: '1180px' }}>
        <AdminHeader />
        <Link href="/admin" className="font-body" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px' }}>
          Back to dashboard
        </Link>
        <h1 className="font-heading" style={{ color: '#FFFFFF', fontSize: '44px', marginTop: '18px', marginBottom: '22px' }}>
          New Project
        </h1>
        {errorMessage ? (
          <p className="font-body" style={{ border: '1px solid rgba(215,166,72,0.55)', background: 'rgba(215,166,72,0.16)', borderRadius: '6px', padding: '12px', marginBottom: '22px' }}>
            {errorMessage}
          </p>
        ) : null}
        <ProjectForm categories={data.categories} action={saveProjectAction} />
      </div>
    </main>
  );
}
