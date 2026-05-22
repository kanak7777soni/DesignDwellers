/* eslint-disable @next/next/no-img-element */
import { getActiveBrandPartners, getSiteContentData } from '@/lib/content-store';

export default async function TopBrands() {
  const content = await getSiteContentData();
  const logos = getActiveBrandPartners(content);

  return (
    <section className="top-brands w-full" style={{ height: '262px', background: '#FFFFFF' }}>
      <div className="top-brands-inner max-w-[1440px] mx-auto px-[64px] flex flex-col items-center justify-center h-full">
        {/* Title */}
        <h3
          className="font-heading"
          style={{ fontSize: '32px', lineHeight: '1.17em', color: '#D7A648', marginBottom: '30px' }}
        >
          {content.brands.title}
        </h3>
        {/* Logos row */}
        <div className="top-brands-row flex items-center justify-center w-full" style={{ maxWidth: '1312px', gap: '20px' }}>
          {logos.map((logo) => (
            logo.type === 'logo' ? (
              <img
                key={logo.id}
                src={logo.logoSrc}
                alt={logo.alt}
                width={logo.width}
                height={logo.height}
                className="object-contain"
                style={{ maxHeight: '149px' }}
              />
            ) : (
              <div
                key={logo.id}
                className="font-heading flex items-center justify-center text-center"
                style={{
                  width: '146px',
                  height: '72px',
                  border: '1px solid rgba(215,166,72,0.45)',
                  borderRadius: '8px',
                  color: '#D7A648',
                  fontSize: '22px',
                  lineHeight: '1.1em',
                }}
              >
                {logo.label}
              </div>
            )
          ))}
        </div>
      </div>
    </section>
  );
}
