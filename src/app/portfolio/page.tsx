'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import GlowEffects from '@/components/GlowEffects';
import PortfolioMedia from '@/components/PortfolioMedia';
import {
  getProjectsByCategoryFromData,
  getPublishedProjectsFromData,
  getSeedPortfolioData,
  getVisibleCategoriesFromData,
  type PortfolioData,
  type PortfolioProject,
} from '@/lib/portfolio';

function ProjectCard({ project, isLarge }: { project: PortfolioProject; isLarge: boolean }) {
  const overlayHeight = isLarge ? 241 : 129;
  const overlayRadius = '22px';

  return (
    <Link href={`/portfolio/${project.slug}`} className="block relative group" style={{ width: '100%', height: '100%', borderRadius: overlayRadius, overflow: 'hidden' }}>
      <PortfolioMedia
        media={project.cardMedia}
        sizes={isLarge ? '845px' : '401px'}
        className="object-cover"
        priority={isLarge}
      />
      {/* Gradient overlay at bottom */}
      <div
        className="absolute bottom-0 left-0 w-full"
        style={{
          height: `${overlayHeight}px`,
          background: isLarge
            ? 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 78%)'
            : 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 77%)',
          borderRadius: overlayRadius,
        }}
      />
      {/* Text overlay */}
      <div className="absolute bottom-0 left-0 w-full" style={{ padding: isLarge ? '0 40px 34px' : '0 40px 20px' }}>
        <div className="flex items-center gap-[8px]" style={{ marginBottom: '4px' }}>
          <h3
            className="font-heading"
            style={{
              fontSize: '16px',
              lineHeight: '1.17em',
              color: '#D7A648',
              WebkitTextStroke: '0.5px #D8A648',
            }}
          >
            {project.name}
          </h3>
          <div style={{ width: '128px', height: '1px', background: '#D7A648' }} />
        </div>
        <p
          className="font-body"
          style={{
            fontSize: '13px',
            lineHeight: '1em',
            color: '#FFFFFF',
          }}
        >
          {project.details}
        </p>
      </div>
    </Link>
  );
}

function SmallProjectBox({ project }: { project: PortfolioProject }) {
  return (
    <div style={{ width: '401px', height: '401px', borderRadius: '22px', overflow: 'hidden', position: 'relative' }}>
      <ProjectCard project={project} isLarge={false} />
    </div>
  );
}

function LargeProjectBox({ project }: { project: PortfolioProject }) {
  return (
    <div style={{ width: '845px', height: '845px', borderRadius: '22px', overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
      <ProjectCard project={project} isLarge />
    </div>
  );
}

type GridBlock = {
  type: 'large-left' | 'small-row' | 'large-right';
  projects: PortfolioProject[];
};

function buildGridBlocks(projects: PortfolioProject[]) {
  const pattern: GridBlock['type'][] = ['large-left', 'small-row', 'large-right', 'small-row'];
  const blocks: GridBlock[] = [];
  let projectIndex = 0;
  let patternIndex = 0;

  while (projectIndex < projects.length) {
    const type = pattern[patternIndex % pattern.length];
    const count = 3;
    blocks.push({
      type,
      projects: projects.slice(projectIndex, projectIndex + count),
    });
    projectIndex += count;
    patternIndex += 1;
  }

  return blocks;
}

function PortfolioGrid({ projects }: { projects: PortfolioProject[] }) {
  const blocks = buildGridBlocks(projects);

  return (
    <div style={{ paddingLeft: '75px', paddingRight: '75px' }}>
      {blocks.map((block, index) => {
        const marginBottom = index === blocks.length - 1 ? '0' : '42px';

        if (block.type === 'small-row') {
          return (
            <div key={`${block.type}-${index}`} className="flex" style={{ gap: '42px', marginBottom }}>
              {block.projects.map((project) => (
                <SmallProjectBox key={project.id} project={project} />
              ))}
            </div>
          );
        }

        if (block.type === 'large-right') {
          const [firstSmall, secondSmall, largeProject] = block.projects;

          return (
            <div key={`${block.type}-${index}`} className="flex" style={{ gap: '42px', marginBottom }}>
              <div className="flex flex-col" style={{ gap: '42px' }}>
                {firstSmall ? <SmallProjectBox project={firstSmall} /> : null}
                {secondSmall ? <SmallProjectBox project={secondSmall} /> : null}
              </div>
              {largeProject ? <LargeProjectBox project={largeProject} /> : null}
            </div>
          );
        }

        const [largeProject, firstSmall, secondSmall] = block.projects;

        return (
          <div key={`${block.type}-${index}`} className="flex" style={{ gap: '42px', marginBottom }}>
            {largeProject ? <LargeProjectBox project={largeProject} /> : null}
            <div className="flex flex-col" style={{ gap: '42px', flex: 1 }}>
              {firstSmall ? <SmallProjectBox project={firstSmall} /> : null}
              {secondSmall ? <SmallProjectBox project={secondSmall} /> : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function PortfolioPage() {
  const [active, setActive] = useState('all-projects');
  const [portfolioData, setPortfolioData] = useState<PortfolioData>(() => getSeedPortfolioData());
  const categories = [
    { slug: 'all-projects', label: 'All Projects' },
    ...getVisibleCategoriesFromData(portfolioData).map((category) => ({ slug: category.slug, label: category.label })),
  ];
  const projects = active === 'all-projects'
    ? getPublishedProjectsFromData(portfolioData)
    : getProjectsByCategoryFromData(portfolioData, active);

  useEffect(() => {
    let isMounted = true;

    async function loadPortfolioData() {
      try {
        const response = await fetch('/api/portfolio', { cache: 'no-store' });
        const data = (await response.json()) as PortfolioData;

        if (isMounted) {
          setPortfolioData(data);
        }
      } catch {
        // Keep the seeded content if editable data is unavailable.
      }
    }

    loadPortfolioData();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="min-h-screen" style={{ background: '#141300', position: 'relative', overflow: 'hidden', zIndex: 0 }}>
      <GlowEffects glows={[
        { top: -244, left: 1076, width: 628, height: 633 },
        { top: 971, left: 627, width: 628, height: 628 },
        { top: 2316, left: 183, width: 628, height: 628 },
        { top: 3639, left: 631, width: 628, height: 628 },
        { top: 4539, left: 1096, width: 628, height: 628 },
      ]} />
      {/* Content area - starts after banner (56px) + nav (84px) = 140px */}
      <div className="max-w-[1440px] mx-auto" style={{ paddingTop: '140px' }}>
        {/* Hero section */}
        <div style={{ paddingLeft: '55px', paddingRight: '55px' }}>
          {/* Section label */}
          <div className="relative" style={{ width: '204px', height: '19px', marginBottom: '10px' }}>
            <span
              className="font-heading absolute"
              style={{
                left: '0',
                top: '0',
                fontSize: '16px',
                lineHeight: '1.17em',
                color: '#D7A648',
                WebkitTextStroke: '0.5px #D8A648',
              }}
            >
              Our Work
            </span>
            <div
              className="absolute"
              style={{ left: '76px', top: '16px', width: '128px', height: '1px', background: '#D7A648' }}
            />
          </div>

          {/* Title + subtitle row */}
          <div className="flex justify-between items-start" style={{ marginBottom: '10px' }}>
            <h1
              className="font-heading"
              style={{
                fontSize: '48px',
                lineHeight: '1.17em',
                color: '#FFFFFF',
                WebkitTextStroke: '0.5px #FFFFFF',
                maxWidth: '371px',
              }}
            >
              Every Room Has a{'\n'}Story to Tell.
            </h1>
            <p
              className="font-body"
              style={{
                fontSize: '16px',
                lineHeight: '1em',
                color: '#FFFFFF',
                textAlign: 'right',
                maxWidth: '312px',
                marginTop: '86px',
              }}
            >
              Real homes. Real clients. Zero stock photos.
            </p>
          </div>

          {/* Filter tabs */}
          <div className="flex flex-wrap" style={{ gap: '8px', marginBottom: '58px' }}>
            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setActive(cat.slug)}
                className="font-body"
                style={{
                  height: '21px',
                  paddingLeft: '6px',
                  paddingRight: '6px',
                  borderRadius: '55px',
                  border: active === cat.slug ? 'none' : '1px solid #D7A648',
                  background: active === cat.slug ? '#D7A648' : 'transparent',
                  color: active === cat.slug ? '#FFFFFF' : '#D7A648',
                  fontSize: '10px',
                  lineHeight: '1em',
                  textAlign: 'right',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Portfolio grid */}
        <PortfolioGrid projects={projects} />

        {/* CTA Section */}
        <div
          className="w-full flex flex-col items-center"
          style={{
            background: '#FFFFFF',
            marginTop: '80px',
            paddingTop: '67px',
            paddingBottom: '67px',
            boxShadow: '0px 4px 4px 0px rgba(0,0,0,0.25)',
          }}
        >
          {/* Label */}
          <div className="relative" style={{ width: '240px', height: '19px', marginBottom: '16px' }}>
            <span
              className="font-heading absolute"
              style={{
                left: '0',
                top: '0',
                fontSize: '16px',
                lineHeight: '1.17em',
                color: '#D7A648',
                WebkitTextStroke: '0.5px #D8A648',
              }}
            >
              Ready to Begin?
            </span>
            <div
              className="absolute"
              style={{ left: '112px', top: '16px', width: '128px', height: '1px', background: '#D7A648' }}
            />
          </div>

          <h2
            className="font-heading text-center"
            style={{
              fontSize: '48px',
              lineHeight: '1.17em',
              color: '#000000',
              WebkitTextStroke: '0.5px #000000',
              marginBottom: '16px',
              maxWidth: '424px',
            }}
          >
            Like What You See?
          </h2>

          <p
            className="font-body text-center"
            style={{ fontSize: '16px', lineHeight: '1em', color: '#000000', marginBottom: '8px' }}
          >
            Your home could be our next featured project.
          </p>

          <Link
            href="#"
            className="font-heading flex items-center justify-center"
            style={{
              background: '#D7A648',
              borderRadius: '55px',
              width: '239px',
              height: '30px',
              fontSize: '16px',
              lineHeight: '1.17em',
              color: '#FFFFFF',
              WebkitTextStroke: '0.5px #FFFFFF',
              textDecoration: 'none',
              marginBottom: '24px',
            }}
          >
            Book My Free Consultation
          </Link>

          <p
            className="font-body text-center"
            style={{ fontSize: '16px', lineHeight: '1em', color: '#000000', marginBottom: '6px' }}
          >
            We only take on 3-4 new projects per month to maintain our quality standards.
          </p>

          <p
            className="font-body text-center"
            style={{ fontSize: '16px', lineHeight: '1em', color: '#000000' }}
          >
            Or WhatsApp us directly:&nbsp;+91 93805 76368
          </p>
        </div>
      </div>

      <Footer />
    </main>
  );
}
