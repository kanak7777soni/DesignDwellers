import Image from 'next/image';
import Link from 'next/link';
import TopBanner from '@/components/TopBanner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import GlowEffects from '@/components/GlowEffects';

const stats = [
  { value: '2500', label: 'Sq Ft' },
  { value: '42', label: 'Days' },
  { value: 'Rs. 22L', label: 'Budget' },
];

const galleryImages = [
  '/images/individual-gallery-6.png',
  '/images/individual-gallery-1.png',
  '/images/individual-gallery-11.png',
  '/images/individual-gallery-7.png',
  '/images/individual-gallery-2.png',
  '/images/individual-gallery-12.png',
  '/images/individual-gallery-8.png',
  '/images/individual-gallery-3.png',
  '/images/individual-gallery-13.png',
  '/images/individual-gallery-9.png',
  '/images/individual-gallery-4.png',
  '/images/individual-gallery-14.png',
  '/images/individual-gallery-10.png',
  '/images/individual-gallery-5.png',
  '/images/individual-gallery-15.png',
];

export default function IndividualPortfolioPage() {
  return (
    <main className="min-h-screen" style={{ background: '#141300', position: 'relative', overflow: 'hidden', zIndex: 0 }}>
      <GlowEffects glows={[
        { top: -244, left: 1076, width: 628, height: 633 },
        { top: 807, left: 122, width: 1197, height: 378 },
      ]} />
      <TopBanner />
      <Navbar activePage="Portfolio" />

      <div className="max-w-[1440px] mx-auto" style={{ paddingTop: '186px' }}>
        {/* Hero Images */}
        <div className="flex" style={{ paddingLeft: '73px', paddingRight: '73px', gap: '37px', marginBottom: '42px' }}>
          <div style={{ width: '628px', height: '557px', position: 'relative', borderRadius: '0px', overflow: 'hidden', flexShrink: 0 }}>
            <Image
              src="/images/individual-hero-left.png"
              alt="The Mehta Residence - View 1"
              fill
              className="object-cover"
              sizes="628px"
            />
          </div>
          <div style={{ width: '628px', height: '557px', position: 'relative', borderRadius: '0px', overflow: 'hidden', flexShrink: 0 }}>
            <Image
              src="/images/individual-hero-right.png"
              alt="The Mehta Residence - View 2"
              fill
              className="object-cover"
              sizes="628px"
            />
          </div>
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
            Full Home
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
            The Mehta Residence
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
            Full Home · Whitefield, Bangalore · 2500 sq ft · 42 days
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
            {/* Stat 1: 2500 Sq Ft */}
            <div className="flex-1 flex flex-col items-center">
              <span
                className="font-heading"
                style={{
                  fontSize: '40px',
                  lineHeight: '1.17em',
                  color: '#D7A648',
                  WebkitTextStroke: '0.5px #D7A648',
                }}
              >
                2500
              </span>
              <span
                className="font-body"
                style={{ fontSize: '10px', lineHeight: '1em', color: '#FFFFFF' }}
              >
                Sq Ft
              </span>
            </div>

            {/* Divider */}
            <div style={{ width: '1px', height: '111px', background: '#D7A648' }} />

            {/* Stat 2: 42 Days */}
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
                42
              </span>
              <span
                className="font-body"
                style={{ fontSize: '10px', lineHeight: '1em', color: '#FFFFFF' }}
              >
                Days
              </span>
            </div>

            {/* Divider */}
            <div style={{ width: '1px', height: '111px', background: '#D7A648' }} />

            {/* Stat 3: Rs. 22L Budget */}
            <div className="flex-1 flex flex-col items-center">
              <span
                className="font-heading"
                style={{
                  fontSize: '40px',
                  lineHeight: '1.17em',
                  color: '#D7A648',
                  WebkitTextStroke: '0.5px #D7A648',
                }}
              >
                Rs. 22L
              </span>
              <span
                className="font-body"
                style={{ fontSize: '10px', lineHeight: '1em', color: '#FFFFFF', textAlign: 'center' }}
              >
                Budget
              </span>
            </div>

            {/* Divider */}
            <div style={{ width: '1px', height: '111px', background: '#D7A648' }} />

            {/* Stat 4: 5 ★ Rating */}
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
            A complete home transformation for the Mehta family in Whitefield. The brief was clear: a contemporary home with warmth — something that felt luxurious without feeling cold. We used a palette of warm oak, brushed brass, and textured plaster across all 4 rooms, creating visual continuity throughout the home. The modular kitchen was a highlight — a full 14-foot run in matte white with gold hardware and a quartz waterfall island.
          </p>
        </div>

        {/* Gallery Grid: 3 columns × 5 rows */}
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
          {galleryImages.map((src, i) => (
            <div
              key={i}
              style={{
                width: '401px',
                height: '401px',
                position: 'relative',
                borderRadius: '0px',
                overflow: 'hidden',
              }}
            >
              <Image
                src={src}
                alt={`Gallery image ${i + 1}`}
                fill
                className="object-cover"
                sizes="401px"
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
