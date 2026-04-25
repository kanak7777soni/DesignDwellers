import Link from 'next/link';
import { Fragment } from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Footer from '@/components/Footer';
import GlowEffects from '@/components/GlowEffects';
import PortfolioMedia from '@/components/PortfolioMedia';
import type { ProjectStat } from '@/lib/portfolio';
import {
  getCategoryLabelFromData,
  getPortfolioData,
  getProjectBySlugFromStore,
  getPublishedProjectsFromData,
} from '@/lib/portfolio-store';

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  const data = await getPortfolioData();

  return getPublishedProjectsFromData(data).map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { project } = await getProjectBySlugFromStore(slug);

  if (!project) {
    return {};
  }

  const title = project.seo?.title || `${project.name} | Design Dwellers`;
  const description = project.seo?.description || project.detail.description || project.details;
  const image = project.seo?.image || project.featuredMedia?.src || project.cardMedia.src;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: image ? [{ url: image }] : [],
    },
  };
}

function StatItem({ stat }: { stat: ProjectStat }) {
  return (
    <div className="flex-1 flex flex-col items-center">
      <span
        className="font-heading"
        style={{
          fontSize: '40px',
          lineHeight: '1.17em',
          color: '#D7A648',
          WebkitTextStroke: '0.5px #D7A648',
          textAlign: 'center',
        }}
      >
        {stat.value}
      </span>
      <span
        className="font-body"
        style={{ fontSize: '10px', lineHeight: '1em', color: '#FFFFFF', textAlign: 'center' }}
      >
        {stat.label}
      </span>
    </div>
  );
}

function StatDivider() {
  return <div style={{ width: '1px', height: '111px', background: '#D7A648' }} />;
}

export default async function IndividualPortfolioPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data, project } = await getProjectBySlugFromStore(slug);

  if (!project) {
    notFound();
  }

  const categoryLabel = getCategoryLabelFromData(data, project.primaryCategorySlug);
  const heroMedia = project.detail.heroMedia.slice(0, 2);
  const stats = project.detail.stats.slice(0, 3);

  return (
    <main className="min-h-screen" style={{ background: '#141300', position: 'relative', overflow: 'hidden', zIndex: 0 }}>
      <GlowEffects glows={[
        { top: -244, left: 1076, width: 628, height: 633 },
        { top: 807, left: 122, width: 1197, height: 378 },
      ]} />
      <div className="max-w-[1440px] mx-auto" style={{ paddingTop: '186px' }}>
        {/* Hero Images */}
        <div className="flex" style={{ paddingLeft: '73px', paddingRight: '73px', gap: '37px', marginBottom: '42px' }}>
          {heroMedia.map((media, index) => (
            <div key={media.id} style={{ width: '628px', height: '557px', position: 'relative', borderRadius: '0px', overflow: 'hidden', flexShrink: 0 }}>
              <PortfolioMedia
                media={media}
                sizes="628px"
                className="object-cover"
                priority={index === 0}
                showVideoControls={media.type === 'video'}
              />
            </div>
          ))}
        </div>

        {/* Category Badge */}
        <div style={{ paddingLeft: '73px' }}>
          <div
            className="font-body inline-flex items-center justify-center"
            style={{
              height: '21px',
              paddingLeft: '9px',
              paddingRight: '9px',
              borderRadius: '55px',
              background: '#D7A648',
              fontSize: '10px',
              lineHeight: '1em',
              color: '#FFFFFF',
              marginBottom: '10px',
            }}
          >
            {categoryLabel}
          </div>

          {/* Title */}
          <h1
            className="font-heading"
            style={{
              fontSize: '36px',
              lineHeight: '1.17em',
              color: '#D7A648',
              WebkitTextStroke: '0.5px #D8A648',
              marginBottom: '10px',
            }}
          >
            {project.name}
          </h1>

          {/* Subtitle */}
          <p
            className="font-body"
            style={{
              fontSize: '13px',
              lineHeight: '1em',
              color: '#FFFFFF',
              marginBottom: '37px',
            }}
          >
            {project.details}
          </p>
        </div>

        {/* Stats Bar */}
        <div
          style={{
            marginLeft: '73px',
            marginRight: '79px',
            width: '1288px',
            height: '161px',
            borderRadius: '22px',
            background: '#000000',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            marginBottom: '62px',
          }}
        >
          {/* Decorative gold ellipse */}
          <div
            style={{
              position: 'absolute',
              left: '244px',
              top: '1px',
              width: '89px',
              height: '89px',
              borderRadius: '50%',
              background: 'radial-gradient(circle at 50% 50%, rgba(216, 166, 72, 1) 0%, rgba(215, 166, 72, 0) 100%)',
            }}
          />

          {/* Stats content */}
          <div className="flex items-center w-full" style={{ paddingTop: '25px', paddingBottom: '25px' }}>
            {stats.map((stat) => (
              <Fragment key={stat.label}>
                <StatItem stat={stat} />
                <StatDivider />
              </Fragment>
            ))}

            {/* Rating */}
            <div className="flex-1 flex flex-col items-center">
              <div className="flex items-center gap-[4px]">
                <span
                  className="font-heading"
                  style={{
                    fontSize: '40px',
                    lineHeight: '1.17em',
                    color: '#D7A648',
                    WebkitTextStroke: '0.5px #D7A648',
                  }}
                >
                  5
                </span>
                <svg width="20" height="19" viewBox="0 0 20 19" fill="none">
                  <path d="M10 0L12.2451 6.90983H19.5106L13.6327 11.1803L15.8779 18.0902L10 13.8197L4.12215 18.0902L6.36729 11.1803L0.489435 6.90983H7.75486L10 0Z" fill="#D8A648" />
                </svg>
              </div>
              <span
                className="font-body"
                style={{ fontSize: '10px', lineHeight: '1em', color: '#FFFFFF', textAlign: 'center' }}
              >
                Rating
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div style={{ paddingLeft: '73px', paddingRight: '79px', marginBottom: '80px' }}>
          <p
            className="font-body"
            style={{
              fontSize: '20px',
              lineHeight: '1em',
              color: '#FFFFFF',
              maxWidth: '1288px',
            }}
          >
            {project.detail.description}
          </p>
        </div>

        {/* Gallery Grid: 3 columns x 5 rows */}
        <div
          style={{
            paddingLeft: '77px',
            paddingRight: '77px',
            display: 'grid',
            gridTemplateColumns: '401px 401px 401px',
            gap: '42px',
            justifyContent: 'center',
            marginBottom: '43px',
          }}
        >
          {project.detail.galleryMedia.map((media) => (
            <div
              key={media.id}
              style={{
                width: '401px',
                height: '401px',
                position: 'relative',
                borderRadius: '0px',
                overflow: 'hidden',
              }}
            >
              <PortfolioMedia
                media={media}
                sizes="401px"
                className="object-cover"
                showVideoControls={media.type === 'video'}
              />
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center" style={{ gap: '11px', marginBottom: '48px' }}>
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
            }}
          >
            Book My Free Consultation
          </Link>
          <Link
            href="/portfolio"
            className="font-heading flex items-center justify-center"
            style={{
              background: 'transparent',
              borderRadius: '55px',
              width: '239px',
              height: '30px',
              fontSize: '16px',
              lineHeight: '1.17em',
              color: '#D7A648',
              WebkitTextStroke: '0.5px #D7A648',
              textDecoration: 'none',
              border: '1.5px solid #D7A648',
            }}
          >
            Back to Portfolio
          </Link>
        </div>

        {/* CTA Section */}
        <div
          className="w-full flex flex-col items-center"
          style={{
            background: '#FFFFFF',
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
