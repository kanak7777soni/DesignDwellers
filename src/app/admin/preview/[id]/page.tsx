import Link from 'next/link';
import { Fragment } from 'react';
import { notFound } from 'next/navigation';
import AdminHeader from '@/components/admin/AdminHeader';
import PortfolioMedia from '@/components/PortfolioMedia';
import { requireAdmin } from '@/lib/admin-auth';
import type { ProjectStat } from '@/lib/portfolio';
import { getCategoryLabelFromData, getPortfolioData } from '@/lib/portfolio-store';

export const dynamic = 'force-dynamic';

function StatItem({ stat }: { stat: ProjectStat }) {
  return (
    <div className="flex-1 flex flex-col items-center">
      <span className="font-heading" style={{ fontSize: '40px', lineHeight: '1.17em', color: '#D7A648', WebkitTextStroke: '0.5px #D7A648', textAlign: 'center' }}>
        {stat.value}
      </span>
      <span className="font-body" style={{ fontSize: '10px', lineHeight: '1em', color: '#FFFFFF', textAlign: 'center' }}>
        {stat.label}
      </span>
    </div>
  );
}

function StatDivider() {
  return <div style={{ width: '1px', height: '111px', background: '#D7A648' }} />;
}

export default async function AdminProjectPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const [{ id }, data] = await Promise.all([params, getPortfolioData()]);
  const project = data.projects.find((item) => item.id === id);

  if (!project) {
    notFound();
  }

  const categoryLabel = getCategoryLabelFromData(data, project.primaryCategorySlug);
  const heroMedia = project.detail.heroMedia.length > 0 ? project.detail.heroMedia : [project.cardMedia];
  const heroColumnCount = Math.min(Math.max(heroMedia.length, 1), 3);
  const heroSizes = heroColumnCount === 1 ? '1320px' : heroColumnCount === 2 ? '628px' : '416px';
  const stats = project.detail.stats.slice(0, 3);
  const galleryMedia = project.detail.galleryMedia.length > 0 ? project.detail.galleryMedia : [project.cardMedia];

  return (
    <main className="min-h-screen" style={{ background: '#141300', color: '#FFFFFF', padding: '34px' }}>
      <div className="mx-auto" style={{ maxWidth: '1320px' }}>
        <AdminHeader />
        <div className="flex items-center justify-between" style={{ marginBottom: '28px' }}>
          <div>
            <Link href={`/admin/projects/${project.id}`} className="font-body" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px' }}>
              Back to edit
            </Link>
            <h1 className="font-heading" style={{ color: '#FFFFFF', fontSize: '40px', marginTop: '12px' }}>
              Preview: {project.name}
            </h1>
          </div>
          <span className="font-body" style={{ color: project.published ? '#D7A648' : 'rgba(255,255,255,0.72)', fontSize: '13px' }}>
            {project.published ? 'Published' : 'Draft'}
          </span>
        </div>

        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${heroColumnCount}, minmax(0, 1fr))`,
            gap: '37px',
            marginBottom: '42px',
          }}
        >
          {heroMedia.map((media, index) => (
            <div key={media.id} style={{ width: '100%', height: '557px', position: 'relative', overflow: 'hidden' }}>
              <PortfolioMedia
                media={media}
                sizes={heroSizes}
                className="object-cover"
                priority={index === 0}
                showVideoControls={media.type === 'video'}
              />
            </div>
          ))}
        </div>

        <div>
          <div className="font-body inline-flex items-center justify-center" style={{ height: '21px', paddingLeft: '9px', paddingRight: '9px', borderRadius: '55px', background: '#D7A648', fontSize: '10px', lineHeight: '1em', color: '#FFFFFF', marginBottom: '10px' }}>
            {categoryLabel}
          </div>
          <h2 className="font-heading" style={{ fontSize: '36px', lineHeight: '1.17em', color: '#D7A648', WebkitTextStroke: '0.5px #D8A648', marginBottom: '10px' }}>
            {project.name}
          </h2>
          <p className="font-body" style={{ fontSize: '13px', lineHeight: '1em', color: '#FFFFFF', marginBottom: '37px' }}>
            {project.details}
          </p>
        </div>

        <div style={{ width: '100%', height: '161px', borderRadius: '22px', background: '#000000', position: 'relative', display: 'flex', alignItems: 'center', marginBottom: '62px' }}>
          <div className="flex items-center w-full" style={{ paddingTop: '25px', paddingBottom: '25px' }}>
            {stats.map((stat) => (
              <Fragment key={stat.label}>
                <StatItem stat={stat} />
                <StatDivider />
              </Fragment>
            ))}
            <div className="flex-1 flex flex-col items-center">
              <div className="flex items-center gap-[4px]">
                <span className="font-heading" style={{ fontSize: '40px', lineHeight: '1.17em', color: '#D7A648', WebkitTextStroke: '0.5px #D7A648' }}>
                  5
                </span>
                <svg width="20" height="19" viewBox="0 0 20 19" fill="none">
                  <path d="M10 0L12.2451 6.90983H19.5106L13.6327 11.1803L15.8779 18.0902L10 13.8197L4.12215 18.0902L6.36729 11.1803L0.489435 6.90983H7.75486L10 0Z" fill="#D8A648" />
                </svg>
              </div>
              <span className="font-body" style={{ fontSize: '10px', lineHeight: '1em', color: '#FFFFFF', textAlign: 'center' }}>
                Rating
              </span>
            </div>
          </div>
        </div>

        <p className="font-body" style={{ fontSize: '20px', lineHeight: '1em', color: '#FFFFFF', marginBottom: '80px' }}>
          {project.detail.description}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '401px 401px 401px', gap: '42px', justifyContent: 'center', marginBottom: '43px' }}>
          {galleryMedia.map((media) => (
            <div key={media.id} style={{ width: '401px', height: '401px', position: 'relative', overflow: 'hidden' }}>
              <PortfolioMedia
                media={media}
                sizes="401px"
                className="object-cover"
                showVideoControls={media.type === 'video'}
              />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
