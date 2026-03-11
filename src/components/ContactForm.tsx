import Image from 'next/image';

export default function ContactForm() {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        background: '#FFFFFF',
        height: '424px',
        boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
      }}
    >
      {/* Decorative gold glow - right side */}
      <div
        className="absolute"
        style={{
          width: '628px',
          height: '628px',
          right: '-200px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'radial-gradient(circle, rgba(215,166,72,0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }}
      />

      <div className="max-w-[1440px] mx-auto h-full flex flex-col items-center justify-center px-[80px]">
        {/* Tag */}
        <div className="flex items-center gap-[8px] mb-[10px]">
          <div style={{ width: '128px', height: '1px', background: '#D7A648' }} />
          <span className="font-heading" style={{ fontSize: '16px', lineHeight: '1.17em', color: '#D7A648' }}>
            Ready to Begin?
          </span>
          <div style={{ width: '128px', height: '1px', background: '#D7A648' }} />
        </div>

        {/* Heading */}
        <h2
          className="font-heading text-center"
          style={{
            fontSize: '48px',
            lineHeight: '1.17em',
            color: '#000000',
            marginBottom: '10px',
          }}
        >
          Your Dream Home Is 45 Days Away.
        </h2>

        {/* Subtitle */}
        <p
          className="font-body text-center"
          style={{
            fontSize: '16px',
            lineHeight: '1.5em',
            color: '#000000',
            opacity: 0.6,
            marginBottom: '30px',
            maxWidth: '600px',
          }}
        >
          Join 500+ happy homeowners who transformed their space with Design Dwellers.
        </p>

        {/* CTA Button */}
        <button
          className="font-heading flex items-center justify-center"
          style={{
            background: '#D7A648',
            borderRadius: '55px',
            width: '239px',
            height: '30px',
            fontSize: '16px',
            lineHeight: '1.17em',
            color: '#FFFFFF',
            border: 'none',
            cursor: 'pointer',
            marginBottom: '16px',
          }}
        >
          Book My Free Consultation
        </button>

        {/* Capacity note */}
        <p className="font-body text-center" style={{ fontSize: '12px', lineHeight: '1em', color: '#000000', opacity: 0.4 }}>
          Limited Slots Available — Only 10 Projects Taken Per Month
        </p>

        {/* WhatsApp note */}
        <p className="font-body text-center" style={{ fontSize: '14px', lineHeight: '1em', color: '#000000', opacity: 0.5, marginTop: '8px' }}>
          Or WhatsApp us directly at{' '}
          <span style={{ color: '#D7A648', fontWeight: 600 }}>+91-XXXXX XXXXX</span>
        </p>
      </div>
    </section>
  );
}
