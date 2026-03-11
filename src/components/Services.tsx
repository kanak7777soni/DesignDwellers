'use client';

export default function Services() {
  const services = [
    {
      num: '01.',
      title: 'Full Home Interiors',
      desc: 'End-to-end design and execution for your entire home. From concept to handover, one team handles everything.',
    },
    {
      num: '02.',
      title: 'Modular Kitchen',
      desc: 'Precision-crafted kitchens with premium hardware, soft-close mechanisms, and smart storage solutions.',
    },
    {
      num: '03.',
      title: 'Bedroom Design',
      desc: 'Wardrobes, lighting, upholstery — every detail designed for rest, privacy, and personal expression.',
    },
    {
      num: '04.',
      title: 'Bathroom Design',
      desc: 'Luxury bathroom concepts with premium tiles, fixtures, and waterproofing that lasts decades.',
    },
    {
      num: '05.',
      title: 'Living & Dining',
      desc: 'Spaces designed for living and entertaining — statement furniture, bespoke joinery, elegant lighting.',
    },
    {
      num: '06.',
      title: 'Turnkey Projects',
      desc: 'We handle everything: design, procurement, execution, finishing. You just walk in and live.',
    },
  ];

  return (
    <section className="w-full" style={{ paddingTop: '71px', paddingBottom: '0' }}>
      <div className="max-w-[1440px] mx-auto px-[80px]">
        {/* Section header */}
        <div className="relative" style={{ width: '221px', height: '19px', marginBottom: '10px' }}>
          <span
            className="font-heading absolute"
            style={{ left: '0', top: '0', fontSize: '16px', lineHeight: '1.17em', color: '#D7A648', WebkitTextStroke: '0.5px #D8A648' }}
          >
            What we do
          </span>
          <div className="absolute" style={{ left: '93px', top: '16px', width: '128px', height: '1px', background: '#D7A648' }} />
        </div>

        {/* Title + subtitle row */}
        <div className="flex justify-between items-end" style={{ marginBottom: '54px' }}>
          <h2
            className="font-heading"
            style={{
              fontSize: '48px',
              lineHeight: '1.17em',
              color: '#FFFFFF',
              WebkitTextStroke: '0.5px #FFFFFF',
              width: '410px',
            }}
          >
            Everything Your<br />Dream Home Needs
          </h2>
          <p
            className="font-body text-right"
            style={{ fontSize: '16px', lineHeight: '1em', color: '#FFFFFF', width: '469px' }}
          >
            Full-service interior design – from one room to the entire home.<br />
            One team. Zero coordination headaches.
          </p>
        </div>

        {/* Services 3x2 grid with separators */}
        <div className="relative" style={{ width: '1288px', height: '286px', marginLeft: '-6px' }}>
          {/* Horizontal separator */}
          <div className="absolute" style={{ left: '47px', top: '143px', width: '1194px', height: '1px', background: '#D7A648' }} />
          {/* Vertical separator 1 */}
          <div className="absolute" style={{ left: '424px', top: '21px', width: '1px', height: '244px', background: '#D7A648' }} />
          {/* Vertical separator 2 */}
          <div className="absolute" style={{ left: '863px', top: '21px', width: '1px', height: '244px', background: '#D7A648' }} />

          {/* Decorative ellipse */}
          <div
            className="absolute pointer-events-none"
            style={{
              left: '321px',
              top: '4px',
              width: '89px',
              height: '89px',
              background: 'radial-gradient(circle at 50% 50%, rgba(216,166,72,0.3) 0%, rgba(215,166,72,0) 70%)',
            }}
          />

          {/* Grid items */}
          {services.map((s, i) => {
            const col = i % 3;
            const row = Math.floor(i / 3);
            const xPositions = [69, 483, 897];
            const topY = row === 0 ? 21 : 161;
            return (
              <div
                key={i}
                className="absolute"
                style={{ left: `${xPositions[col]}px`, top: `${topY}px`, width: '323px' }}
              >
                <span
                  className="font-heading"
                  style={{
                    display: 'block',
                    fontSize: '40px',
                    lineHeight: '1.17em',
                    color: '#FFFFFF',
                    WebkitTextStroke: '0.5px #FFFFFF',
                  }}
                >
                  {s.num}
                </span>
                <span
                  className="font-heading"
                  style={{
                    display: 'block',
                    fontSize: '16px',
                    lineHeight: '1.17em',
                    color: '#D7A648',
                    WebkitTextStroke: '0.5px #D7A648',
                    marginTop: '10px',
                  }}
                >
                  {s.title}
                </span>
                <p
                  className="font-body"
                  style={{
                    fontSize: '10px',
                    lineHeight: '1em',
                    color: '#FFFFFF',
                    marginTop: '8px',
                  }}
                >
                  {s.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
