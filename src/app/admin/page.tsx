import Link from 'next/link';
import ConfirmSubmitButton from '@/components/admin/ConfirmSubmitButton';
import AdminHeader from '@/components/admin/AdminHeader';
import SubmitButton from '@/components/admin/SubmitButton';
import { requireAdmin } from '@/lib/admin-auth';
import { getPortfolioData } from '@/lib/portfolio-store';
import { deleteCategoryAction, deleteProjectAction, saveCategoryAction } from './actions';

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

function statusText(status?: string) {
  if (status === 'project-deleted') return 'Project deleted.';
  if (status === 'category-saved') return 'Category saved.';
  if (status === 'category-deleted') return 'Category deleted.';
  return null;
}

function errorText(error?: string) {
  if (error === 'category-label') return 'Category name is required.';
  if (error === 'last-category') return 'Keep at least one category before deleting this one.';
  if (error === 'storage') return 'CRM storage could not save. Add the private Blob token as CRM_BLOB_READ_WRITE_TOKEN, or use BLOB_READ_WRITE_TOKEN only if it points to a private Blob store.';
  return null;
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; error?: string; q?: string; projectStatus?: string; category?: string }>;
}) {
  await requireAdmin();
  const data = await getPortfolioData();
  const { status, error, q = '', projectStatus = 'all', category = 'all' } = await searchParams;
  const message = statusText(status);
  const errorMessage = errorText(error);
  const publishedCount = data.projects.filter((project) => project.published).length;
  const featuredCount = data.projects.filter((project) => typeof project.featuredOrder === 'number').length;
  const searchQuery = q.trim().toLowerCase();
  const filteredProjects = data.projects.filter((project) => {
    const matchesSearch = !searchQuery
      || project.name.toLowerCase().includes(searchQuery)
      || project.details.toLowerCase().includes(searchQuery)
      || project.slug.toLowerCase().includes(searchQuery)
      || project.meta?.location?.toLowerCase().includes(searchQuery)
      || project.meta?.city?.toLowerCase().includes(searchQuery);
    const matchesStatus = projectStatus === 'all'
      || (projectStatus === 'published' && project.published)
      || (projectStatus === 'draft' && !project.published)
      || (projectStatus === 'featured' && typeof project.featuredOrder === 'number');
    const matchesCategory = category === 'all' || project.categorySlugs.includes(category);

    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <main className="min-h-screen" style={{ background: '#141300', color: '#FFFFFF', padding: '34px' }}>
      <div className="mx-auto" style={{ maxWidth: '1180px' }}>
        <AdminHeader />

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

        <section className="grid grid-cols-3" style={{ gap: '16px', marginBottom: '28px' }}>
          {[
            { label: 'Projects', value: data.projects.length },
            { label: 'Published', value: publishedCount },
            { label: 'Home Featured', value: featuredCount },
          ].map((item) => (
            <div key={item.label} style={{ background: '#000000', border: '1px solid rgba(215,166,72,0.25)', borderRadius: '8px', padding: '22px' }}>
              <p className="font-body" style={{ color: 'rgba(255,255,255,0.65)', fontSize: '13px', marginBottom: '8px' }}>{item.label}</p>
              <p className="font-heading" style={{ color: '#D7A648', fontSize: '42px', lineHeight: '1em' }}>{item.value}</p>
            </div>
          ))}
        </section>

        <section style={{ background: '#000000', border: '1px solid rgba(215,166,72,0.25)', borderRadius: '8px', padding: '24px', marginBottom: '28px' }}>
          <div className="flex items-center justify-between" style={{ marginBottom: '18px' }}>
            <h1 className="font-heading" style={{ fontSize: '34px', color: '#FFFFFF' }}>
              Projects
            </h1>
            <Link href="/admin/projects/new" className="font-heading" style={{ background: '#D7A648', color: '#FFFFFF', borderRadius: '55px', padding: '11px 18px 9px', textDecoration: 'none' }}>
              Add Project
            </Link>
          </div>

          <form className="grid items-end" style={{ gridTemplateColumns: '1fr 170px 180px 90px', gap: '10px', marginBottom: '18px' }}>
            <label className="font-body flex flex-col" style={{ gap: '8px', color: '#D7A648', fontSize: '13px' }}>
              Search projects
              <input name="q" defaultValue={q} className="font-body" style={inputStyle} />
            </label>
            <label className="font-body flex flex-col" style={{ gap: '8px', color: '#D7A648', fontSize: '13px' }}>
              Status
              <select name="projectStatus" defaultValue={projectStatus} className="font-body" style={inputStyle}>
                <option value="all">All</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="featured">Featured</option>
              </select>
            </label>
            <label className="font-body flex flex-col" style={{ gap: '8px', color: '#D7A648', fontSize: '13px' }}>
              Category
              <select name="category" defaultValue={category} className="font-body" style={inputStyle}>
                <option value="all">All categories</option>
                {data.categories.map((item) => (
                  <option key={item.slug} value={item.slug}>{item.label}</option>
                ))}
              </select>
            </label>
            <SubmitButton pendingLabel="Filtering..." className="font-body" style={{ height: '38px', background: '#D7A648', color: '#FFFFFF', border: 'none', borderRadius: '55px', cursor: 'pointer' }}>
              Filter
            </SubmitButton>
          </form>

          <div className="flex flex-col" style={{ gap: '10px' }}>
            {filteredProjects.map((project) => (
              <div key={project.id} className="grid items-center" style={{ gridTemplateColumns: '1fr 120px 82px 92px 170px', gap: '12px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '12px' }}>
                <div>
                  <p className="font-heading" style={{ fontSize: '22px', color: '#D7A648' }}>{project.name}</p>
                  <p className="font-body" style={{ color: 'rgba(255,255,255,0.62)', fontSize: '13px', marginTop: '4px' }}>{project.details}</p>
                </div>
                <span className="font-body" style={{ fontSize: '13px', color: project.published ? '#FFFFFF' : 'rgba(255,255,255,0.45)' }}>
                  {project.published ? 'Published' : 'Draft'}
                </span>
                {project.published ? (
                  <Link href={`/portfolio/${project.slug}`} className="font-body" style={{ color: '#FFFFFF', opacity: 0.72, textDecoration: 'none', fontSize: '13px' }}>
                    Live
                  </Link>
                ) : (
                  <span className="font-body" style={{ color: 'rgba(255,255,255,0.42)', fontSize: '13px' }}>
                    No live URL
                  </span>
                )}
                <Link href={`/admin/preview/${project.id}`} className="font-body" style={{ color: '#FFFFFF', opacity: 0.72, textDecoration: 'none', fontSize: '13px' }}>
                  Preview
                </Link>
                <div className="flex items-center" style={{ gap: '8px' }}>
                  <Link href={`/admin/projects/${project.id}`} className="font-body" style={{ color: '#D7A648', textDecoration: 'none', fontSize: '13px' }}>
                    Edit
                  </Link>
                  <form action={deleteProjectAction}>
                    <input type="hidden" name="id" value={project.id} />
                    <ConfirmSubmitButton message={`Delete ${project.name}?`} pendingLabel="Deleting..." className="font-body" style={{ background: 'transparent', color: '#FFFFFF', opacity: 0.6, border: 'none', cursor: 'pointer', fontSize: '13px' }}>
                      Delete
                    </ConfirmSubmitButton>
                  </form>
                </div>
              </div>
            ))}
            {filteredProjects.length === 0 ? (
              <p className="font-body" style={{ color: 'rgba(255,255,255,0.62)', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px' }}>
                No projects match these filters.
              </p>
            ) : null}
          </div>
        </section>

        <section style={{ background: '#000000', border: '1px solid rgba(215,166,72,0.25)', borderRadius: '8px', padding: '24px' }}>
          <h2 className="font-heading" style={{ fontSize: '34px', color: '#FFFFFF', marginBottom: '18px' }}>
            Categories
          </h2>
          <div className="flex flex-col" style={{ gap: '12px' }}>
            {data.categories.map((category) => (
              <div key={category.slug} className="grid items-center" style={{ gridTemplateColumns: '1fr 1fr 110px 100px 64px 70px', gap: '10px' }}>
                <form action={saveCategoryAction} style={{ display: 'contents' }}>
                  <input type="hidden" name="originalSlug" value={category.slug} />
                  <input name="label" defaultValue={category.label} className="font-body" style={inputStyle} />
                  <input name="slug" defaultValue={category.slug} className="font-body" style={inputStyle} />
                  <input name="sortOrder" type="number" defaultValue={category.sortOrder} className="font-body number-input-clean" style={inputStyle} />
                  <label className="font-body flex items-center" style={{ gap: '7px', fontSize: '13px' }}>
                    <input type="checkbox" name="visibleInFilters" defaultChecked={category.visibleInFilters} />
                    Visible
                  </label>
                  <SubmitButton pendingLabel="Saving..." className="font-body" style={{ background: '#D7A648', color: '#FFFFFF', border: 'none', borderRadius: '55px', padding: '8px 12px', cursor: 'pointer' }}>
                    Save
                  </SubmitButton>
                </form>
                <form action={deleteCategoryAction}>
                  <input type="hidden" name="slug" value={category.slug} />
                  <ConfirmSubmitButton message={`Delete category ${category.label}? Projects in this category will move to another category.`} pendingLabel="Deleting..." className="font-body" style={{ background: 'transparent', color: '#FFFFFF', opacity: 0.6, border: 'none', padding: '8px 0', cursor: 'pointer' }}>
                    Delete
                  </ConfirmSubmitButton>
                </form>
              </div>
            ))}
          </div>

          <form action={saveCategoryAction} className="grid items-center" style={{ gridTemplateColumns: '1fr 1fr 110px 100px 110px', gap: '10px', marginTop: '22px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '18px' }}>
            <input name="label" placeholder="New category" className="font-body" style={inputStyle} />
            <input name="slug" placeholder="auto-slug" className="font-body" style={inputStyle} />
            <input name="sortOrder" type="number" placeholder="70" className="font-body number-input-clean" style={inputStyle} />
            <label className="font-body flex items-center" style={{ gap: '7px', fontSize: '13px' }}>
              <input type="checkbox" name="visibleInFilters" defaultChecked />
              Visible
            </label>
            <SubmitButton pendingLabel="Adding..." className="font-body" style={{ background: '#D7A648', color: '#FFFFFF', border: 'none', borderRadius: '55px', padding: '8px 12px', cursor: 'pointer' }}>
              Add
            </SubmitButton>
          </form>
        </section>
      </div>
    </main>
  );
}
