'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Footer from '@/components/Footer';
import GlowEffects from '@/components/GlowEffects';

const categories = ['All Projects', 'Living Room', 'BedRoom', 'Kitchen', 'Full Home', 'Luxury', 'Other'];

const projects = [
  {
    name: 'The Mehta Residence',
    details: 'Full Home · Whitefield, Bangalore · 2500 sq ft · 42 days',
    image: '/images/portfolio-grid-5.png',
    category: 'Full Home',
    size: 'large',
  },
  {
    name: 'Corvids Office',
    details: 'Office · Koramangala, Bangalore',
    image: '/images/portfolio-grid-7.png',
    category: 'Other',
    size: 'small',
  },
  {
    name: 'Reddy Homes',
    details: 'Living & Dining · Koramangala, Bangalore',
    image: '/images/portfolio-grid-9.png',
    category: 'Living Room',
    size: 'small',
  },
  {
    name: 'Sharma Living',
    details: 'Living Room · Koramangala, Bangalore',
    image: '/images/portfolio-grid-3.png',
    category: 'Living Room',
    size: 'small',
  },
  {
    name: 'Kumar Residence',
    details: 'Bedroom · HITEC City, Hyderabad',
    image: '/images/portfolio-grid-4.png',
    category: 'BedRoom',
    size: 'small',
  },
  {
    name: 'Reddy Homes',
    details: 'Kitchen & Dining · Koramangala, Bangalore',
    image: '/images/portfolio-grid-11.png',
    category: 'Kitchen',
    size: 'small',
  },
  {
    name: 'The Mehta Residence',
    details: 'Full Home · Whitefield, Bangalore · 2500 sq ft · 42 days',
    image: '/images/portfolio-feature.png',
    category: 'Full Home',
    size: 'feature',
  },
  {
    name: 'Reddy Homes',
    details: 'Living & Dining · Koramangala, Bangalore',
    image: '/images/portfolio-grid-1.png',
    category: 'Living Room',
    size: 'small',
  },
  {
    name: 'Reddy Homes',
    details: 'Kitchen & Dining · Koramangala, Bangalore',
    image: '/images/portfolio-grid-10.png',
    category: 'Kitchen',
    size: 'small',
  },
  {
    name: 'Corvids Office',
    details: 'Office · Koramangala, Bangalore',
    image: '/images/portfolio-grid-12.png',
    category: 'Other',
    size: 'small',
  },
  {
    name: 'The Mehta Residence',
    details: 'Full Home · Whitefield, Bangalore · 2500 sq ft · 42 days',
    image: '/images/portfolio-grid-6.png',
    category: 'Full Home',
    size: 'large',
  },
  {
    name: 'Corvids Office',
    details: 'Office · Koramangala, Bangalore',
    image: '/images/portfolio-grid-8.png',
    category: 'Other',
    size: 'small',
  },
  {
    name: 'Sharma Living',
    details: 'Living Room · Koramangala, Bangalore',
    image: '/images/portfolio-grid-2.png',
    category: 'Living Room',
    size: 'small',
  },
  {
    name: 'Kumar Residence',
    details: 'Bedroom · HITEC City, Hyderabad',
    image: '/images/portfolio-grid-3.png',
    category: 'BedRoom',
    size: 'small',
  },
  {
    name: 'Reddy Homes',
    details: 'Living & Dining · Koramangala, Bangalore',
    image: '/images/portfolio-grid-4.png',
    category: 'Living Room',
    size: 'small',
  },
  {
    name: 'Reddy Homes',
    details: 'Kitchen & Dining · Koramangala, Bangalore',
    image: '/images/portfolio-grid-9.png',
    category: 'Kitchen',
    size: 'small',
  },
];

function ProjectCard({ project, isLarge }: { project: typeof projects[0]; isLarge: boolean }) {
  const overlayHeight = isLarge ? 241 : 129;
  const overlayRadius = '22px';

  return (
    <Link href="/portfolio/project" className="block relative group" style={{ width: '100%', height: '100%', borderRadius: overlayRadius, overflow: 'hidden' }}>
      <Image
        src={project.image}
        alt={project.name}
        fill
        className="object-cover"
        sizes={isLarge ? '845px' : '401px'}
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

export default function PortfolioPage() {
  const [active, setActive] = useState('All Projects');

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
          <div className="flex" style={{ gap: '8px', marginBottom: '58px' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className="font-body"
                style={{
                  height: '21px',
                  paddingLeft: '6px',
                  paddingRight: '6px',
                  borderRadius: '55px',
                  border: active === cat ? 'none' : '1px solid #D7A648',
                  background: active === cat ? '#D7A648' : 'transparent',
                  color: active === cat ? '#FFFFFF' : '#D7A648',
                  fontSize: '10px',
                  lineHeight: '1em',
                  textAlign: 'right',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Portfolio grid */}
        <div style={{ paddingLeft: '75px', paddingRight: '75px' }}>
          {/* Row 1: Large left (845×845) + column of small right */}
          <div className="flex" style={{ gap: '42px', marginBottom: '42px' }}>
            {/* Large image */}
            <div style={{ width: '845px', height: '845px', borderRadius: '22px', overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
              <ProjectCard project={projects[0]} isLarge />
            </div>
            {/* Right column: 2 small stacked */}
            <div className="flex flex-col" style={{ gap: '42px', flex: 1 }}>
              <div style={{ width: '401px', height: '401px', borderRadius: '22px', overflow: 'hidden', position: 'relative' }}>
                <ProjectCard project={projects[1]} isLarge={false} />
              </div>
              <div style={{ width: '401px', height: '401px', borderRadius: '22px', overflow: 'hidden', position: 'relative' }}>
                <ProjectCard project={projects[2]} isLarge={false} />
              </div>
            </div>
          </div>

          {/* Row 2: 3 small cards in a row */}
          <div className="flex" style={{ gap: '42px', marginBottom: '42px' }}>
            <div style={{ width: '401px', height: '401px', borderRadius: '22px', overflow: 'hidden', position: 'relative' }}>
              <ProjectCard project={projects[3]} isLarge={false} />
            </div>
            <div style={{ width: '401px', height: '401px', borderRadius: '22px', overflow: 'hidden', position: 'relative' }}>
              <ProjectCard project={projects[4]} isLarge={false} />
            </div>
            <div style={{ width: '401px', height: '401px', borderRadius: '22px', overflow: 'hidden', position: 'relative' }}>
              <ProjectCard project={projects[5]} isLarge={false} />
            </div>
          </div>

          {/* Row 3: Small left column + Large right (feature) */}
          <div className="flex" style={{ gap: '42px', marginBottom: '42px' }}>
            {/* Left column: 2 small stacked */}
            <div className="flex flex-col" style={{ gap: '42px' }}>
              <div style={{ width: '401px', height: '401px', borderRadius: '22px', overflow: 'hidden', position: 'relative' }}>
                <ProjectCard project={projects[7]} isLarge={false} />
              </div>
              <div style={{ width: '401px', height: '401px', borderRadius: '22px', overflow: 'hidden', position: 'relative' }}>
                <ProjectCard project={projects[8]} isLarge={false} />
              </div>
            </div>
            {/* Large feature image */}
            <div style={{ width: '845px', height: '845px', borderRadius: '22px', overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
              <ProjectCard project={projects[6]} isLarge />
            </div>
          </div>

          {/* Row 4: 3 small cards in a row */}
          <div className="flex" style={{ gap: '42px', marginBottom: '42px' }}>
            <div style={{ width: '401px', height: '401px', borderRadius: '22px', overflow: 'hidden', position: 'relative' }}>
              <ProjectCard project={projects[9]} isLarge={false} />
            </div>
            <div style={{ width: '401px', height: '401px', borderRadius: '22px', overflow: 'hidden', position: 'relative' }}>
              <ProjectCard project={projects[13]} isLarge={false} />
            </div>
            <div style={{ width: '401px', height: '401px', borderRadius: '22px', overflow: 'hidden', position: 'relative' }}>
              <ProjectCard project={projects[14]} isLarge={false} />
            </div>
          </div>

          {/* Row 5 (repeat): Large left + column right */}
          <div className="flex" style={{ gap: '42px', marginBottom: '42px' }}>
            <div style={{ width: '845px', height: '845px', borderRadius: '22px', overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
              <ProjectCard project={projects[10]} isLarge />
            </div>
            <div className="flex flex-col" style={{ gap: '42px', flex: 1 }}>
              <div style={{ width: '401px', height: '401px', borderRadius: '22px', overflow: 'hidden', position: 'relative' }}>
                <ProjectCard project={projects[11]} isLarge={false} />
              </div>
              <div style={{ width: '401px', height: '401px', borderRadius: '22px', overflow: 'hidden', position: 'relative' }}>
                <ProjectCard project={projects[15]} isLarge={false} />
              </div>
            </div>
          </div>

          {/* Row 6: 3 small cards */}
          <div className="flex" style={{ gap: '42px', marginBottom: '0' }}>
            <div style={{ width: '401px', height: '401px', borderRadius: '22px', overflow: 'hidden', position: 'relative' }}>
              <ProjectCard project={projects[12]} isLarge={false} />
            </div>
            <div style={{ width: '401px', height: '401px', borderRadius: '22px', overflow: 'hidden', position: 'relative' }}>
              <ProjectCard project={projects[4]} isLarge={false} />
            </div>
            <div style={{ width: '401px', height: '401px', borderRadius: '22px', overflow: 'hidden', position: 'relative' }}>
              <ProjectCard project={projects[5]} isLarge={false} />
            </div>
          </div>
        </div>

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
            We only take on 3–4 new projects per month to maintain our quality standards.
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
