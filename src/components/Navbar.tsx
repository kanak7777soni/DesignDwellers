'use client';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useConsultation } from '@/context/ConsultationContext';

export default function Navbar() {
  const pathname = usePathname();
  const activePage = pathname === '/' ? 'Home'
    : pathname.startsWith('/portfolio') ? 'Portfolio'
    : pathname === '/service' ? 'Service'
    : pathname === '/about' ? 'About'
    : pathname === '/contact' ? 'Contact'
    : '';
  const consultation = useConsultation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const scrolledRef = useRef(false);
  const scrollFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const updateScrolled = () => {
      scrollFrameRef.current = null;
      const nextScrolled = window.scrollY > 50;

      if (scrolledRef.current !== nextScrolled) {
        scrolledRef.current = nextScrolled;
        setScrolled(nextScrolled);
      }
    };

    const handleScroll = () => {
      if (scrollFrameRef.current === null) {
        scrollFrameRef.current = window.requestAnimationFrame(updateScrolled);
      }
    };

    updateScrolled();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);

      if (scrollFrameRef.current !== null) {
        window.cancelAnimationFrame(scrollFrameRef.current);
      }
    };
  }, []);

  return (
    <nav
      className={`site-nav ${scrolled ? 'is-scrolled' : 'is-top'} fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'top-0 bg-[#141300]/95 backdrop-blur-sm' : 'top-[56px] bg-transparent'
      }`}
    >
      <div className="navbar-inner max-w-[1440px] mx-auto flex items-center justify-between" style={{ paddingLeft: '80px', paddingRight: '80px', height: '84px' }}>
        {/* Logo group - image + text */}
        <div className="flex items-center gap-[12px]">
          <Image
            src="/images/dds-logo-white.png"
            alt="DDS Logo"
            width={150}
            height={150}
            className="navbar-logo object-contain"
          />
          <div className="flex flex-col">
            <span
              className="navbar-brand-title font-heading"
              style={{ fontSize: '40px', lineHeight: '1.17em', color: '#FFFFFF', WebkitTextStroke: '1px #FFFFFF' }}
            >
              Design Dwellers
            </span>
            <span
              className="navbar-brand-subtitle font-heading"
              style={{ fontSize: '24px', lineHeight: '1.17em', color: '#D7A648', WebkitTextStroke: '0.3px #D7A648' }}
            >
              Studio
            </span>
          </div>
        </div>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-[52px]">
          {[
            { label: 'Home', href: '/' },
            { label: 'Portfolio', href: '/portfolio' },
            { label: 'Service', href: '/service' },
            { label: 'About', href: '/about' },
            { label: 'Contact', href: '/contact' },
          ].map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="font-heading hover:text-[#D7A648] transition-colors"
              style={{
                fontSize: '16px',
                lineHeight: '1.17em',
                color: activePage === link.label ? '#D7A648' : '#FFFFFF',
                WebkitTextStroke: activePage === link.label ? '0.3px #D7A648' : undefined,
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={consultation.open}
          className="hidden md:flex items-center justify-center font-heading"
          style={{
            width: '180px',
            height: '44px',
            background: '#D7A648',
            borderRadius: '55px',
            fontSize: '16px',
            lineHeight: '1.17em',
            color: '#FFFFFF',
            WebkitTextStroke: '0.5px #FFFFFF',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Get Free Quote
        </button>

        {/* Mobile menu toggle */}
        <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="navbar-mobile-menu md:hidden bg-[#141300]/95 backdrop-blur-sm px-8 pb-6">
          {[
            { label: 'Home', href: '/' },
            { label: 'Portfolio', href: '/portfolio' },
            { label: 'Service', href: '/service' },
            { label: 'About', href: '/about' },
            { label: 'Contact', href: '/contact' },
          ].map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="block font-heading py-3 hover:text-[#D7A648]"
              style={{
                fontSize: '16px',
                color: activePage === link.label ? '#D7A648' : '#FFFFFF',
              }}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={() => {
              setMenuOpen(false);
              consultation.open();
            }}
            className="font-heading flex items-center justify-center mt-3"
            style={{
              width: '100%',
              height: '42px',
              background: '#D7A648',
              borderRadius: '55px',
              fontSize: '16px',
              lineHeight: '1.17em',
              color: '#FFFFFF',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Get Free Quote
          </button>
        </div>
      )}
    </nav>
  );
}
