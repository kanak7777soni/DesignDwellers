'use client';

export default function HowItWorks() {
  const steps = [
    { num: '01', title: 'Free Consultation', desc: 'We understand your vision, lifestyle, and budget. No pressure. No sales pitch.', top: true, cx: 122 },
    { num: '02', title: '3D Design', desc: 'Full 3D render of every room. You see it before we build it.', top: false, cx: 364 },
    { num: '03', title: 'Execution', desc: 'In-house team executes with precision. Weekly updates. Zero surprises.', top: true, cx: 606 },
    { num: '04', title: 'Quality Check', desc: '50-point quality audit before handover. If it\'s not perfect, we fix it.', top: false, cx: 848 },
    { num: '05', title: 'Handover', desc: 'Your dream home on time, on budget. Dedicated aftercare for 1 year.', top: true, cx: 1090 },
  ];

  // Connecting lines between circles (at circle center y)
  const lines = [203, 446, 688, 930];

  return (
    <section className="w-full" style={{ paddingTop: '80px', paddingBottom: '80px', background: 'linear-gradient(180deg, #1a1a0f 0%, #141300 50%, #1a1a0f 100%)' }}>
      <div className="max-w-[1440px] mx-auto px-[80px]">
        {/* Section header centered */}
        <div className="relative" style={{ width: '223px', height: '19px', marginLeft: 'auto', marginRight: 'auto', marginBottom: '10px' }}>
          <span
            className="font-heading absolute"
            style={{ left: '0', top: '0', fontSize: '16px', lineHeight: '1.17em', color: '#D7A648', WebkitTextStroke: '0.5px #D8A648' }}
          >
            How It Works
          </span>
          <div className="absolute" style={{ left: '95px', top: '16px', width: '128px', height: '1px', background: '#D7A648' }} />
        </div>

        <h2
          className="font-heading text-center"
          style={{ fontSize: '48px', lineHeight: '1.17em', color: '#FFFFFF', marginBottom: '10px' }}
        >
          From First Call to Final Handover
        </h2>

        <p
          className="font-body text-center"
          style={{ fontSize: '16px', lineHeight: '1em', color: '#FFFFFF', marginBottom: '40px' }}
        >
          A transparent, stress-free process — you always know what&apos;s happening.
        </p>

        {/* Gold separator */}
        <div className="mx-auto" style={{ width: '644px', height: '1px', background: '#D7A648', marginBottom: '80px' }} />

        {/* Timeline - relative container */}
        <div className="relative" style={{ height: '260px' }}>
          {/* Step circles + labels */}
          {steps.map((step, i) => (
            <div key={i} className="absolute" style={{ left: `${step.cx}px`, top: '78px', width: '70px' }}>
              {/* Text above circle */}
              {step.top && (
                <div className="absolute text-center" style={{ bottom: '84px', left: '50%', transform: 'translateX(-50%)', width: '160px' }}>
                  <h4 className="font-heading" style={{ fontSize: '16px', lineHeight: '1.17em', color: '#FFFFFF', marginBottom: '8px' }}>
                    {step.title}
                  </h4>
                  <p className="font-body" style={{ fontSize: '12px', lineHeight: '1em', color: '#FFFFFF', textAlign: 'center' }}>
                    {step.desc}
                  </p>
                </div>
              )}

              {/* Circle */}
              <div
                className="flex items-center justify-center"
                style={{
                  width: '70px',
                  height: '70px',
                  borderRadius: '50%',
                  border: '4px solid #D7A648',
                  background: 'transparent',
                }}
              >
                <span className="font-heading" style={{ fontSize: '24px', lineHeight: '1.17em', color: '#D7A648' }}>
                  {step.num}
                </span>
              </div>

              {/* Text below circle */}
              {!step.top && (
                <div className="absolute text-center" style={{ top: '84px', left: '50%', transform: 'translateX(-50%)', width: '160px' }}>
                  <h4 className="font-heading" style={{ fontSize: '16px', lineHeight: '1.17em', color: '#FFFFFF', marginBottom: '8px' }}>
                    {step.title}
                  </h4>
                  <p className="font-body" style={{ fontSize: '12px', lineHeight: '1em', color: '#FFFFFF', textAlign: 'center' }}>
                    {step.desc}
                  </p>
                </div>
              )}
            </div>
          ))}

          {/* Connecting gradient lines */}
          {lines.map((x, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                width: '149px',
                height: '3px',
                left: `${x}px`,
                top: '113px',
                background: 'linear-gradient(90deg, rgba(20,19,0,0) 0%, rgba(215,166,72,1) 50%, rgba(20,19,0,0) 100%)',
              }}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
