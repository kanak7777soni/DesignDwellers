'use client';

export default function Stats() {
  const stats = [
    { value: '8+', label: 'Years of Excellence' },
    { value: '5000+', label: 'Homes Completed' },
    { value: '100%', label: 'On-Time Delivery' },
    { value: '4.9★', label: 'Client Rating' },
    { value: '10', label: 'Yrs Warranty' },
    { value: '45', label: 'Days Delivery' },
  ];

  return (
    <section className="w-full relative" style={{ paddingTop: '33px', paddingBottom: '0' }}>
      {/* Golden gradient glow at top */}
      <div
        className="absolute top-0 left-0 w-full pointer-events-none"
        style={{
          height: '300px',
          background: 'radial-gradient(ellipse 80% 100% at 50% 0%, rgba(215,166,72,0.12) 0%, rgba(20,19,0,0) 70%)',
        }}
      />

      <div className="relative z-10 max-w-[1440px] mx-auto px-[80px]">
        {/* Section header centered */}
        <h2
          className="font-heading text-center"
          style={{
            fontSize: '32px',
            lineHeight: '1.17em',
            color: '#FFFFFF',
            WebkitTextStroke: '0.5px #FFFFFF',
            marginBottom: '57px',
          }}
        >
          Why Design Dwellers?
        </h2>

        {/* Stats row */}
        <div className="flex items-start justify-between" style={{ padding: '0 53px' }}>
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <span
                className="font-heading"
                style={{
                  fontSize: '32px',
                  lineHeight: '1.17em',
                  color: '#D7A648',
                  WebkitTextStroke: '0.5px #D7A648',
                }}
              >
                {stat.value}
              </span>
              <span
                className="font-heading"
                style={{
                  fontSize: '16px',
                  lineHeight: '1.17em',
                  color: '#FFFFFF',
                  WebkitTextStroke: '0.5px #FFFFFF',
                  marginTop: '10px',
                }}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* Gold separator */}
        <div style={{ width: '644px', height: '1px', background: '#D7A648', marginTop: '67px', marginLeft: 'auto', marginRight: 'auto' }} />
      </div>
    </section>
  );
}
