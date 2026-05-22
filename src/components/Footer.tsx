import Image from 'next/image';
import Link from 'next/link';
import { BENGALURU_ADDRESS_LINES, INSTAGRAM_URL, PRIMARY_PHONE, WHATSAPP_URL } from '@/lib/site-content';

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Services', href: '/service' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact Us', href: '/contact' },
  { label: 'Terms & Policy', href: '/terms-and-conditions' },
];

export default function Footer() {
  return (
    <footer className="w-full">
      <div className="footer-shell max-w-[1440px] mx-auto px-[80px]" style={{ paddingTop: '60px', paddingBottom: '40px' }}>
        {/* Main footer content - 4 columns */}
        <div
          className="footer-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '300px 180px 390px 320px',
            columnGap: '30px',
            alignItems: 'start',
          }}
        >
          {/* Col 1 - Brand */}
          <div className="flex flex-col" style={{ maxWidth: '380px' }}>
            {/* Logo */}
            <div className="flex flex-col mb-[16px]">
              <span
                className="footer-brand-title font-heading"
                style={{ fontSize: '40px', lineHeight: '1.17em', color: '#FFFFFF', WebkitTextStroke: '1px #FFFFFF' }}
              >
                Design Dwellers
              </span>
              <span
                className="footer-brand-subtitle font-heading"
                style={{ fontSize: '24px', lineHeight: '1.17em', color: '#D7A648', WebkitTextStroke: '0.3px #D7A648' }}
              >
                Studio
              </span>
            </div>

            <p className="font-body" style={{ fontSize: '16px', lineHeight: '1em', color: '#FFFFFF', opacity: 0.6, marginBottom: '20px' }}>
              Crafting Homes With Soul Since 2024
            </p>

            {/* Google rating */}
            <div className="flex items-center gap-[8px] mb-[8px]">
              <Image src="/images/footer-brand-mark.svg" alt="Google" width={24} height={24} />
              <div className="flex gap-[4px]">
                {[1, 2, 3, 4, 5].map((n) => (
                  <svg key={n} width="18" height="18" viewBox="0 0 18 18" fill="#D7A648">
                    <polygon points="9,0 11.47,6.56 18,6.56 12.76,10.62 15.24,17.18 9,13.12 2.76,17.18 5.24,10.62 0,6.56 6.53,6.56" />
                  </svg>
                ))}
              </div>
            </div>
            <p className="font-heading" style={{ fontSize: '24px', lineHeight: '1.17em', color: '#D7A648' }}>
              Rated 4.9/5 on Google
            </p>
          </div>

          {/* Col 2 - Quick Links */}
          <div className="flex flex-col">
            <h3 className="font-heading" style={{ fontSize: '24px', lineHeight: '1.17em', color: '#D7A648', marginBottom: '20px' }}>
              Quick Links
            </h3>
            <div className="flex flex-col gap-[12px]">
              {quickLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="font-body"
                  style={{ fontSize: '16px', lineHeight: '1em', color: '#FFFFFF', opacity: 0.7, textDecoration: 'none' }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Col 3 - Contact */}
          <div className="flex flex-col">
            <h3 className="font-heading" style={{ fontSize: '24px', lineHeight: '1.17em', color: '#D7A648', marginBottom: '20px' }}>
              Contact Us
            </h3>
            <div className="flex flex-col gap-[14px]">
              <div className="flex items-center gap-[10px]">
                <Image src="/images/social-icon-1.svg" alt="" width={20} height={20} />
                <span className="font-body" style={{ fontSize: '16px', color: '#FFFFFF', opacity: 0.7 }}>
                  {PRIMARY_PHONE}
                </span>
              </div>
              <div className="flex items-center gap-[10px]">
                <Image src="/images/social-icon-2.svg" alt="" width={20} height={20} />
                <span className="font-body" style={{ fontSize: '16px', color: '#FFFFFF', opacity: 0.7 }}>
                  hello@designdwellersstudio.com
                </span>
              </div>
              <div className="flex items-start gap-[10px]">
                <Image src="/images/social-icon-3.svg" alt="" width={20} height={20} style={{ marginTop: '2px' }} />
                <span className="font-body" style={{ fontSize: '15px', lineHeight: '1.35em', color: '#FFFFFF', opacity: 0.7 }}>
                  {BENGALURU_ADDRESS_LINES.map((line) => (
                    <span key={line} style={{ display: 'block' }}>
                      {line}
                    </span>
                  ))}
                </span>
              </div>
              <div className="flex items-center gap-[10px]">
                <Image src="/images/social-icon-4.svg" alt="" width={20} height={20} style={{ marginTop: '2px' }} />
                <span className="font-body" style={{ fontSize: '16px', lineHeight: '1.5em', color: '#FFFFFF', opacity: 0.7 }}>
                  Whitefield Studio, Bengaluru
                </span>
              </div>
            </div>
          </div>

          {/* Col 4 - Social + CTA */}
          <div className="footer-social-col flex flex-col items-end">
            {/* Social icons */}
            <div className="flex gap-[12px] mb-[24px]">
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center" style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)' }}>
                <Image src="/images/social-icon-5.svg" alt="WhatsApp" width={18} height={18} />
              </a>
              {[6, 7].map((n) => (
                <span key={n} className="flex items-center justify-center" style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)' }}>
                  <Image src={`/images/social-icon-${n}.svg`} alt="" width={18} height={18} />
                </span>
              ))}
            </div>

            {/* Instagram */}
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-[8px] mb-[16px]" style={{ textDecoration: 'none' }}>
              <Image src="/images/instagram-icon.svg" alt="Instagram" width={20} height={20} />
              <span className="font-body" style={{ fontSize: '16px', color: '#FFFFFF', opacity: 0.7 }}>
                @design_dwellers_studio
              </span>
            </a>

            {/* Subtitle */}
            <p className="font-body text-right" style={{ fontSize: '16px', lineHeight: '1em', color: '#FFFFFF', opacity: 0.6, marginBottom: '16px', maxWidth: '260px' }}>
              We design interiors that tell your story — thoughtful, livable, and crafted to last.
            </p>

            {/* CTA Button */}
            <Link
              href="/contact"
              className="font-heading flex items-center justify-center"
              style={{
                background: '#D7A648',
                borderRadius: '55px',
                width: '260px',
                height: '44px',
                fontSize: '16px',
                lineHeight: '1.17em',
                color: '#FFFFFF',
                border: 'none',
                cursor: 'pointer',
                textDecoration: 'none',
              }}
            >
              Book My Free Consultation
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.1)', marginTop: '40px', marginBottom: '20px' }} />

        {/* Copyright */}
        <div className="footer-bottom flex justify-between items-center">
          <p className="font-body" style={{ fontSize: '16px', color: '#FFFFFF', opacity: 0.4 }}>
            © 2025 Design Dwellers Studio. All Rights Reserved.
          </p>
          <p className="font-body" style={{ fontSize: '16px', color: '#FFFFFF', opacity: 0.4 }}>
            Designed &amp; Marketed by{' '}
            <span style={{ color: '#D7A648' }}>Digital Corvids</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
