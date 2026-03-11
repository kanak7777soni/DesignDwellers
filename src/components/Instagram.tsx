'use client';
import Image from 'next/image';

export default function InstagramSection() {
  const posts = Array(6).fill({ title: 'Modular Kitchen Reveal' });

  return (
    <section className="w-full" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
      <div className="max-w-[1440px] mx-auto px-[80px]">
        {/* Section header */}
        <div className="relative" style={{ width: '290px', height: '19px', marginBottom: '10px' }}>
          <span
            className="font-heading absolute"
            style={{ left: '0', top: '0', fontSize: '16px', lineHeight: '1.17em', color: '#D7A648', WebkitTextStroke: '0.5px #D8A648' }}
          >
            As Seen On Instagram
          </span>
          <div className="absolute" style={{ left: '162px', top: '16px', width: '128px', height: '1px', background: '#D7A648' }} />
        </div>

        {/* Title + subtitle + handle */}
        <div className="flex justify-between items-start mb-[30px]">
          <h2 className="font-heading" style={{ fontSize: '48px', lineHeight: '1.17em', color: '#FFFFFF', maxWidth: '351px' }}>
            Behind the scenes &amp; before-afters
          </h2>
          <div className="flex flex-col items-end gap-[10px]">
            <p className="font-body text-right" style={{ fontSize: '16px', lineHeight: '1em', color: '#FFFFFF', maxWidth: '398px' }}>
              Real reviews. Unfiltered. From homeowners just like you.
            </p>
            {/* @handle button */}
            <button
              className="font-heading"
              style={{
                background: '#D7A648',
                borderRadius: '55px',
                padding: '6px 20px',
                fontSize: '16px',
                lineHeight: '1.17em',
                color: '#FFFFFF',
                border: 'none',
                height: '30px',
                cursor: 'pointer',
              }}
            >
              DesignDwellersstudio
            </button>
          </div>
        </div>

        {/* Instagram grid - 6 in a single row */}
        <div className="flex gap-[12px]">
          {posts.map((post, i) => (
            <div key={i} className="relative" style={{ width: '204px', height: '363px', flexShrink: 0 }}>
              <Image
                src="/images/instagram-post.png"
                alt={post.title}
                fill
                className="object-cover"
              />
              {/* Play/overlay icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Image src="/images/instagram-overlay.svg" alt="" width={41} height={41} style={{ opacity: 0.7 }} />
              </div>
              {/* Caption */}
              <p
                className="font-body absolute text-right"
                style={{ bottom: '24px', right: '8px', fontSize: '7px', lineHeight: '1em', color: '#FFFFFF' }}
              >
                {post.title}
              </p>
              {/* Gold line at bottom of caption */}
              <div className="absolute" style={{ bottom: '20px', left: '8px', right: '8px', height: '1px', background: '#D7A648' }} />
            </div>
          ))}
        </div>

        {/* Navigation dots */}
        <div className="flex justify-center mt-[30px] mb-[24px]">
          <Image src="/images/testimonial-dots.svg" alt="" width={82} height={9} />
        </div>

        {/* Follow button */}
        <div className="flex justify-center">
          <button
            className="flex items-center gap-[10px] font-heading"
            style={{
              background: '#D7A648',
              borderRadius: '55px',
              padding: '6px 20px',
              fontSize: '16px',
              lineHeight: '1.17em',
              color: '#FFFFFF',
              border: 'none',
              height: '30px',
              cursor: 'pointer',
            }}
          >
            <Image src="/images/instagram-icon.svg" alt="" width={17} height={17} />
            Follow Us for Daily Inspiration
          </button>
        </div>
      </div>
    </section>
  );
}
