'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useConsultation } from '@/context/ConsultationContext';

export default function Navbar({ activePage = 'Home' }: { activePage?: string }) {
  const consultation = useConsultation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'top-0 bg-[#141300]/95 backdrop-blur-sm' : 'top-[56px] bg-transparent'
      }`}
    >
      <div className="max-w-[1440px] mx-auto flex items-center justify-between" style={{ paddingLeft: '80px', paddingRight: '80px', height: '84px' }}>
        {/* Logo group - image + text */}
        <div className="flex items-center gap-[12px]">
          <Image
            src="/images/dds-logo-white.png"
            alt="DDS Logo"
            width={150}
            height={150}
            className="object-contain"
          />
          <div className="flex flex-col">
            <span
              className="font-heading"
              style={{ fontSize: '40px', lineHeight: '1.17em', color: '#FFFFFF', WebkitTextStroke: '1px #FFFFFF' }}
            >
              Design Dwellers
            </span>
            <span
              className="font-heading"
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
            width: '150px',
            height: '30px',
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
        <div className="md:hidden bg-[#141300]/95 backdrop-blur-sm px-8 pb-6">
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
        </div>
      )}
    </nav>
  );
}
