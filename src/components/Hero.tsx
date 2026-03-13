'use client';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative w-full" style={{ height: '750px' }}>
      {/* Background image */}
      <Image
        src="/images/hero-bg.png"
        alt="Interior Design"
        fill
        className="object-cover"
        priority
      />

      {/* Top gradient overlay */}
      <div
        className="absolute top-0 left-0 w-full"
        style={{ height: '340px', background: 'linear-gradient(0deg, rgba(20,19,0,0) 0%, rgba(20,19,0,1) 100%)' }}
      />
      {/* Bottom gradient overlay */}
      <div
        className="absolute bottom-0 left-0 w-full"
        style={{ height: '370px', background: 'linear-gradient(180deg, rgba(20,19,0,0) 0%, rgba(20,19,0,1) 100%)' }}
      />

      {/* Decorative gold glow left */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: '-169px',
          top: '402px',
          width: '628px',
          height: '628px',
          background: 'radial-gradient(circle at 50% 50%, rgba(216,166,72,0.15) 0%, rgba(215,166,72,0) 70%)',
        }}
      />
      {/* Decorative gold glow right */}
      <div
        className="absolute pointer-events-none"
        style={{
          right: '-264px',
          top: '-401px',
          width: '628px',
          height: '633px',
          background: 'radial-gradient(circle at 50% 50%, rgba(216,166,72,0.15) 0%, rgba(215,166,72,0) 70%)',
        }}
      />

      {/* Content wrapper */}
      <div className="relative z-10 max-w-[1440px] mx-auto h-full" style={{ padding: '0 80px' }}>
        {/* Award tag */}
        <div className="flex items-center gap-2 absolute" style={{ left: '80px', top: '160px' }}>
          <span
            className="font-heading"
            style={{ fontSize: '16px', lineHeight: '1.17em', color: '#D7A648' }}
          >
            Award-Winning Interior Design
          </span>
          <div className="w-[128px] h-0" style={{ borderTop: '1px solid #D7A648' }} />
        </div>

        {/* Main heading */}
        <h1
          className="font-heading absolute"
          style={{
            left: '79px',
            top: '210px',
            width: '732px',
            fontSize: '70px',
            lineHeight: '1.155em',
            color: '#FFFFFF',
            WebkitTextStroke: '1.5px #FFFFFF',
          }}
        >
          Spaces that feel entirely like you
        </h1>

        {/* Subtitle */}
        <p
          className="font-body absolute"
          style={{
            left: '80px',
            top: '420px',
            width: '550px',
            fontSize: '16px',
            lineHeight: '1.5em',
            color: '#FFFFFF',
          }}
        >
          We design interiors that tell your story — thoughtful, livable, and crafted to last. From concept to handover in as little as 45 days.
        </p>

        {/* Explore button */}
        <div
          className="absolute flex items-center justify-center"
          style={{
            left: '80px',
            top: '500px',
            width: '180px',
            height: '44px',
            background: '#D7A648',
            borderRadius: '55px',
            cursor: 'pointer',
          }}
        >
          <span className="font-heading" style={{ fontSize: '16px', lineHeight: '1.17em', color: '#FFFFFF' }}>
            Explore our work
          </span>
        </div>
      </div>

      {/* Scroll dots */}
      <div className="absolute left-1/2 -translate-x-1/2 flex gap-[19px]" style={{ bottom: '26px' }}>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-full"
            style={{
              width: '6px',
              height: '6px',
              background: i === 0 ? '#D7A648' : 'rgba(255,255,255,0.3)',
            }}
          />
        ))}
      </div>
    </section>
  );
}
