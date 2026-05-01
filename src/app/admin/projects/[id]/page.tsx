import Link from 'next/link';
import { notFound } from 'next/navigation';
import AdminHeader from '@/components/admin/AdminHeader';
import ConfirmSubmitButton from '@/components/admin/ConfirmSubmitButton';
import ProjectForm from '@/components/admin/ProjectForm';
import { requireAdmin } from '@/lib/admin-auth';
import { getPortfolioData } from '@/lib/portfolio-store';
import { deleteProjectAction, saveProjectAction } from '../../actions';

export const dynamic = 'force-dynamic';

function getStatusMessage(status?: string) {
  if (status === 'saved') {
    return 'Project saved.';
  }

  return null;
}

function getErrorMessage(error?: string) {
  if (error === 'name') return 'Project name is required.';
  if (error === 'card-media') return 'Add a card media upload or paste a card media URL before saving.';
  if (error === 'upload') return 'Upload JPG, PNG, WebP, GIF, MP4, WebM, or MOV files only.';
  if (error === 'storage') return 'CRM storage could not save this project. Add the private Blob token as CRM_BLOB_READ_WRITE_TOKEN, or use BLOB_READ_WRITE_TOKEN only if it points to a private Blob store.';
  return null;
}

export default async function EditProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ status?: string; error?: string }>;
}) {
  await requireAdmin();
  const [{ id }, { status, error }] = await Promise.all([params, searchParams]);
  const data = await getPortfolioData();
  const project = data.projects.find((item) => item.id === id);

  if (!project) {
    notFound();
  }

  const message = getStatusMessage(status);
  const errorMessage = getErrorMessage(error);

  return (
    <main className="min-h-screen" style={{ background: '#141300', color: '#FFFFFF', padding: '34px' }}>
      <div className="mx-auto" style={{ maxWidth: '1180px' }}>
        <AdminHeader />
        <div className="flex items-center justify-between" style={{ marginBottom: '22px' }}>
          <div>
            <Link href="/admin" className="font-body" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px' }}>
              Back to dashboard
            </Link>
            <h1 className="font-heading" style={{ color: '#FFFFFF', fontSize: '44px', marginTop: '18px' }}>
              Edit Project
            </h1>
          </div>
          <form action={deleteProjectAction}>
            <input type="hidden" name="id" value={project.id} />
            <div className="flex" style={{ gap: '10px' }}>
              <Link href={`/admin/preview/${project.id}`} className="font-body" style={{ color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.32)', borderRadius: '55px', padding: '10px 16px', textDecoration: 'none', fontSize: '14px' }}>
                Preview
              </Link>
              {project.published ? (
                <Link href={`/portfolio/${project.slug}`} className="font-body" style={{ color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.32)', borderRadius: '55px', padding: '10px 16px', textDecoration: 'none', fontSize: '14px' }}>
                  Live Page
                </Link>
              ) : null}
              <ConfirmSubmitButton message={`Delete ${project.name}?`} className="font-body" style={{ background: 'transparent', color: '#D7A648', border: '1px solid rgba(215,166,72,0.5)', borderRadius: '55px', padding: '10px 16px', cursor: 'pointer' }}>
                Delete Project
              </ConfirmSubmitButton>
            </div>
          </form>
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

        <ProjectForm project={project} categories={data.categories} action={saveProjectAction} />
      </div>
    </main>
  );
}
