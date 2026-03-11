'use client';
import Image from 'next/image';

export default function TopBrands() {
  const logos = [
    { src: '/images/brand-logo-1.png', w: 146, h: 149 },
    { src: '/images/brand-logo-2.png', w: 146, h: 93 },
    { src: '/images/brand-logo-3.png', w: 146, h: 146 },
    { src: '/images/brand-logo-4.png', w: 145, h: 81 },
    { src: '/images/brand-logo-5.png', w: 146, h: 146 },
    { src: '/images/brand-logo-6.png', w: 146, h: 146 },
  ];

  return (
    <section className="w-full" style={{ height: '262px', background: '#FFFFFF' }}>
      <div className="max-w-[1440px] mx-auto px-[128px] flex flex-col items-center justify-center h-full">
        {/* Title */}
        <h3
          className="font-heading"
          style={{ fontSize: '32px', lineHeight: '1.17em', color: '#D7A648', marginBottom: '30px' }}
        >
          Top Brands Only
        </h3>
        {/* Logos row */}
        <div className="flex items-center justify-between w-full" style={{ maxWidth: '1181px' }}>
          {logos.map((logo, i) => (
            <Image
              key={i}
              src={logo.src}
              alt={`Brand ${i + 1}`}
              width={logo.w}
              height={logo.h}
              className="object-contain"
              style={{ maxHeight: '149px' }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
