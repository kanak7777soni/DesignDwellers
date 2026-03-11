'use client';
import Image from 'next/image';

export default function TrustBadges() {
  const badges = [
    { icon: '/images/warranty-icon.png', text: '5-Year Material Warranty' },
    { icon: '/images/quality-icon.png', text: '45-Day Delivery Guarantee' },
    { icon: '/images/colleagues-icon.png', text: 'In-House Design Team', iconSize: 31 },
    { icon: '/images/location-icon.png', text: 'Studios in Bangalore · Hydrabad' },
  ];

  return (
    <section className="w-full" style={{ height: '80px', background: '#FFFFFF' }}>
      <div className="max-w-[1440px] mx-auto h-full flex items-center justify-center gap-[60px]">
        {badges.map((badge, i) => (
          <div key={i} className="flex items-center gap-[8px]">
            <Image
              src={badge.icon}
              alt=""
              width={badge.iconSize || 25}
              height={badge.iconSize || 25}
            />
            <span
              className="font-heading"
              style={{
                fontSize: '16px',
                lineHeight: '1.17em',
                color: '#000000',
                letterSpacing: '0.04em',
              }}
            >
              {badge.text}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
