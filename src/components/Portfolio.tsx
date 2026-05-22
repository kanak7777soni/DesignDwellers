'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import PortfolioMedia from '@/components/PortfolioMedia';
import { scheduleIdleTask } from '@/lib/client-scheduling';
import {
  getFeaturedProjectsFromData,
  getProjectsByCategoryFromData,
  getSeedPortfolioData,
  getVisibleCategoriesFromData,
  type PortfolioData,
  type PortfolioProject,
} from '@/lib/portfolio';

function HomeProjectCard({
  project,
  isLarge = false,
  children,
}: {
  project: PortfolioProject;
  isLarge?: boolean;
  children: ReactNode;
}) {
  const media = project.featuredMedia || project.cardMedia;

  return (
    <Link
      href={`/portfolio/${project.slug}`}
      className={`home-project-card relative overflow-hidden group ${isLarge ? 'home-project-card-large row-span-2' : ''}`}
      style={{
        width: isLarge ? '845px' : undefined,
        height: isLarge ? '845px' : '401px',
        borderRadius: '22px',
        display: 'block',
      }}
    >
      <PortfolioMedia
        media={media}
        sizes={isLarge ? '845px' : '401px'}
        className="object-cover zoom-image"
        priority={isLarge}
      />
      {children}
    </Link>
  );
}

function HomeProjectOverlay({ project, isLarge = false }: { project: PortfolioProject; isLarge?: boolean }) {
  return (
    <>
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: isLarge ? '241px' : '129px',
          background: isLarge
            ? 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 78%)'
            : 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 77%)',
          borderRadius: '0 0 22px 22px',
        }}
      />
      <div className="home-project-overlay absolute" style={{ bottom: isLarge ? '24px' : '16px', left: isLarge ? '40px' : '24px' }}>
        <h3 className="font-heading" style={{ fontSize: '16px', lineHeight: '1.17em', color: '#D7A648' }}>{project.name}</h3>
        <p className="font-body mt-[4px]" style={{ fontSize: '13px', lineHeight: '1em', color: '#FFFFFF' }}>{project.details}</p>
      </div>
    </>
  );
}

export default function Portfolio() {
  const [active, setActive] = useState('all-projects');
  const [portfolioData, setPortfolioData] = useState<PortfolioData>(() => getSeedPortfolioData());
  const filters = [
    { slug: 'all-projects', label: 'All Projects' },
    ...getVisibleCategoriesFromData(portfolioData).map((category) => ({ slug: category.slug, label: category.label })),
  ];
  const projects = active === 'all-projects'
    ? getFeaturedProjectsFromData(portfolioData, 6)
    : getProjectsByCategoryFromData(portfolioData, active).slice(0, 6);

  useEffect(() => {
    let isMounted = true;
    const abortController = new AbortController();

    async function loadPortfolioData() {
      try {
        const response = await fetch('/api/portfolio', {
          cache: 'no-store',
          signal: abortController.signal,
        });
        const data = (await response.json()) as PortfolioData;

        if (isMounted) {
          setPortfolioData(data);
        }
      } catch {
        if (abortController.signal.aborted) {
          return;
        }

        // Keep the seeded content if editable data is unavailable.
      }
    }

    const cancelScheduledLoad = scheduleIdleTask(() => {
      void loadPortfolioData();
    });

    return () => {
      isMounted = false;
      cancelScheduledLoad();
      abortController.abort();
    };
  }, []);

  return (
    <section id="portfolio" className="w-full" style={{ paddingTop: '70px', paddingBottom: '60px' }}>
      <div className="responsive-container max-w-[1440px] mx-auto px-[80px]">
        {/* Section header */}
        <div className="relative" style={{ width: '204px', height: '19px', marginBottom: '10px' }}>
          <span
            className="font-heading absolute"
            style={{ left: '0', top: '0', fontSize: '16px', lineHeight: '1.17em', color: '#D7A648', WebkitTextStroke: '0.5px #D8A648' }}
          >
            Our Work
          </span>
          <div className="absolute" style={{ left: '76px', top: '16px', width: '128px', height: '1px', background: '#D7A648' }} />
        </div>

        {/* Title row */}
        <div className="section-heading-row flex justify-between items-end mb-[10px]">
          <h2 className="font-heading" style={{ fontSize: '48px', lineHeight: '1.17em', color: '#FFFFFF', maxWidth: '312px' }}>
            Our Work Speaks for Itself
          </h2>
          <p className="font-body text-right" style={{ fontSize: '16px', lineHeight: '1em', color: '#FFFFFF', maxWidth: '312px' }}>
            Real homes. Real clients. Zero stock photos.
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-[8px] mb-[40px]">
          {filters.map((filter) => (
            <button
              key={filter.slug}
              onClick={() => setActive(filter.slug)}
              className="font-body"
              style={{
                fontSize: '10px',
                lineHeight: '1em',
                textAlign: 'right',
                padding: '6px 12px',
                borderRadius: '55px',
                border: active === filter.slug ? 'none' : '1px solid #D7A648',
                background: active === filter.slug ? '#D7A648' : 'transparent',
                color: active === filter.slug ? '#FFFFFF' : '#D7A648',
                cursor: 'pointer',
              }}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Portfolio grid */}
        <div className="home-portfolio-grid relative" style={{ display: 'grid', gridTemplateColumns: '845px 401px', gridTemplateRows: '401px 401px 401px', gap: '42px' }}>
          {/* Large featured image - spans 2 rows */}
          {projects[0] ? (
            <HomeProjectCard project={projects[0]} isLarge>
              <HomeProjectOverlay project={projects[0]} isLarge />
            </HomeProjectCard>
          ) : null}

          {/* Top right */}
          {projects[1] ? (
            <HomeProjectCard project={projects[1]}>
              <HomeProjectOverlay project={projects[1]} />
            </HomeProjectCard>
          ) : null}

          {/* Bottom right */}
          {projects[2] ? (
            <HomeProjectCard project={projects[2]}>
              <HomeProjectOverlay project={projects[2]} />
            </HomeProjectCard>
          ) : null}

          {/* Bottom row - 3 images spanning full width */}
          <div className="home-project-row col-span-2 grid grid-cols-3" style={{ height: '401px', gap: '42px' }}>
            {projects.slice(3).map((project) => (
              <HomeProjectCard key={project.id} project={project}>
                <HomeProjectOverlay project={project} />
              </HomeProjectCard>
            ))}
          </div>
        </div>

        {/* View Full Portfolio button */}
        <div className="flex justify-center" style={{ marginTop: '48px' }}>
          <Link
            href="/portfolio"
            className="flex items-center gap-[12px] font-heading"
            style={{
              background: '#D7A648',
              borderRadius: '55px',
              padding: '6px 20px',
              fontSize: '16px',
              lineHeight: '1.17em',
              color: '#FFFFFF',
              border: 'none',
              cursor: 'pointer',
              height: '44px',
              textDecoration: 'none',
            }}
          >
            View Full Portfolio
            <Image src="/images/arrow-right.svg" alt="" width={13} height={8} />
          </Link>
        </div>
      </div>
    </section>
  );
}
