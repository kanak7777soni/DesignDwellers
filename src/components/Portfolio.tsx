'use client';
import { useState } from 'react';
import Image from 'next/image';

const filters = ['All Projects', 'Living Room', 'BedRoom', 'Kitchen', 'Full Home', 'Luxury', 'Other'];

const projects = [
  {
    img: '/images/portfolio-3.png',
    title: 'The Mehta Residence',
    desc: 'Full Home · Whitefield, Bangalore · 2500 sq ft · 42 days',
  },
  {
    img: '/images/portfolio-5.png',
    title: 'Corvids Office',
    desc: 'Office · Koramangala, Bangalore',
  },
  {
    img: '/images/portfolio-4.png',
    title: 'Reddy Homes',
    desc: 'Kitchen & Dining · Koramangala, Bangalore',
  },
  {
    img: '/images/portfolio-1.png',
    title: 'Sharma Living',
    desc: 'Living Room · Koramangala, Bangalore',
  },
  {
    img: '/images/portfolio-2.png',
    title: 'Kumar Residence',
    desc: 'Bedroom · HITEC City, Hyderabad',
  },
  {
    img: '/images/portfolio-6.png',
    title: 'Reddy Homes',
    desc: 'Living & Dining · Koramangala, Bangalore',
  },
];

export default function Portfolio() {
  const [active, setActive] = useState('All Projects');

  return (
    <section id="portfolio" className="w-full" style={{ paddingTop: '70px', paddingBottom: '60px' }}>
      <div className="max-w-[1440px] mx-auto px-[80px]">
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
        <div className="flex justify-between items-end mb-[10px]">
          <h2 className="font-heading" style={{ fontSize: '48px', lineHeight: '1.17em', color: '#FFFFFF', maxWidth: '312px' }}>
            Our Work Speaks for Itself
          </h2>
          <p className="font-body text-right" style={{ fontSize: '16px', lineHeight: '1em', color: '#FFFFFF', maxWidth: '312px' }}>
            Real homes. Real clients. Zero stock photos.
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-[8px] mb-[40px]">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className="font-body"
              style={{
                fontSize: '10px',
                lineHeight: '1em',
                textAlign: 'right',
                padding: '6px 12px',
                borderRadius: '55px',
                border: active === f ? 'none' : '1px solid #D7A648',
                background: active === f ? '#D7A648' : 'transparent',
                color: active === f ? '#FFFFFF' : '#D7A648',
                cursor: 'pointer',
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Portfolio grid */}
        <div className="relative" style={{ display: 'grid', gridTemplateColumns: '845px 401px', gridTemplateRows: '401px 401px 401px', gap: '42px' }}>
          {/* Large featured image - spans 2 rows */}
          <div className="relative overflow-hidden row-span-2" style={{ width: '845px', height: '845px', borderRadius: '22px' }}>
            <Image src={projects[0].img} alt={projects[0].title} fill className="object-cover" />
            <div className="absolute bottom-0 left-0 right-0" style={{ height: '241px', background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 78%)', borderRadius: '0 0 22px 22px' }} />
            <div className="absolute" style={{ bottom: '24px', left: '40px' }}>
              <h3 className="font-heading" style={{ fontSize: '16px', lineHeight: '1.17em', color: '#D7A648' }}>{projects[0].title}</h3>
              <p className="font-body mt-[4px]" style={{ fontSize: '13px', lineHeight: '1em', color: '#FFFFFF' }}>{projects[0].desc}</p>
            </div>
          </div>

          {/* Top right */}
          <div className="relative overflow-hidden" style={{ height: '401px', borderRadius: '22px' }}>
            <Image src={projects[1].img} alt={projects[1].title} fill className="object-cover" />
            <div className="absolute bottom-0 left-0 right-0" style={{ height: '129px', background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 77%)', borderRadius: '0 0 22px 22px' }} />
            <div className="absolute" style={{ bottom: '16px', left: '24px' }}>
              <h3 className="font-heading" style={{ fontSize: '16px', lineHeight: '1.17em', color: '#D7A648' }}>{projects[1].title}</h3>
              <p className="font-body mt-[4px]" style={{ fontSize: '13px', lineHeight: '1em', color: '#FFFFFF' }}>{projects[1].desc}</p>
            </div>
          </div>

          {/* Bottom right */}
          <div className="relative overflow-hidden" style={{ height: '401px', borderRadius: '22px' }}>
            <Image src={projects[2].img} alt={projects[2].title} fill className="object-cover" />
            <div className="absolute bottom-0 left-0 right-0" style={{ height: '129px', background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 77%)', borderRadius: '0 0 22px 22px' }} />
            <div className="absolute" style={{ bottom: '16px', left: '24px' }}>
              <h3 className="font-heading" style={{ fontSize: '16px', lineHeight: '1.17em', color: '#D7A648' }}>{projects[2].title}</h3>
              <p className="font-body mt-[4px]" style={{ fontSize: '13px', lineHeight: '1em', color: '#FFFFFF' }}>{projects[2].desc}</p>
            </div>
          </div>

          {/* Bottom row - 3 images spanning full width */}
          <div className="col-span-2 grid grid-cols-3" style={{ height: '401px', gap: '42px' }}>
            {projects.slice(3).map((p, i) => (
              <div key={i} className="relative overflow-hidden" style={{ height: '401px', borderRadius: '22px' }}>
                <Image src={p.img} alt={p.title} fill className="object-cover" />
                <div className="absolute bottom-0 left-0 right-0" style={{ height: '129px', background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 77%)', borderRadius: '0 0 22px 22px' }} />
                <div className="absolute" style={{ bottom: '16px', left: '24px' }}>
                  <h3 className="font-heading" style={{ fontSize: '16px', lineHeight: '1.17em', color: '#D7A648' }}>{p.title}</h3>
                  <p className="font-body mt-[4px]" style={{ fontSize: '13px', lineHeight: '1em', color: '#FFFFFF' }}>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* View Full Portfolio button */}
        <div className="flex justify-center" style={{ marginTop: '48px' }}>
          <button
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
              height: '30px',
            }}
          >
            View Full Portfolio
            <Image src="/images/arrow-right.svg" alt="" width={13} height={8} />
          </button>
        </div>
      </div>
    </section>
  );
}
