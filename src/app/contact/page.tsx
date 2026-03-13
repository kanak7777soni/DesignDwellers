'use client';
import { useState } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import GlowEffects from '@/components/GlowEffects';

const trustBadges = [
  { title: '2-Hour Response', desc: 'We call back fast' },
  { title: 'Free Consultation', desc: 'No obligation, no sales pitch' },
  { title: '2 Studios', desc: 'Bangalore & Hyderabad' },
  { title: '100% Confidential', desc: 'Your details stay with us' },
];

const projectTypes = ['Full Home', 'Living Room', 'BedRoom', 'Kitchen', 'Full Home', 'Luxury', 'Other'];

const faqItems = [
  { q: 'How much does a full home interior cost?', a: 'Our full home interiors start from ₹15L for a 2BHK, all-inclusive. The final cost depends on the size of your home, materials selected, and scope of work. We provide a detailed, transparent quote after our free consultation.' },
  { q: 'What is the 45-day guarantee exactly?', a: 'We guarantee project completion within 45 days of design approval. If we miss the deadline, we compensate you — it\'s written into our contract.' },
  { q: 'Can I see a 3D design before work starts?', a: 'Absolutely. Every client receives full 3D renders of every room before any physical work begins. You approve the design, then we build exactly what you approved.' },
  { q: 'Do you work in both Bangalore and Hyderabad?', a: 'Yes, we have fully operational studios in both cities with dedicated local teams.' },
  { q: 'Do you use subcontractors?', a: 'No. Our entire team — designers, carpenters, painters, and project managers — is in-house. This gives us full control over quality and timelines.' },
  { q: 'What happens after handover?', a: 'You get 1 year of dedicated aftercare support and a 10-year structural warranty. Any issues, we fix them — no questions asked.' },
  { q: 'Can I manage my project remotely?', a: 'Yes. Many of our clients are NRIs or professionals in other cities. We provide video calls, WhatsApp photo updates every 48 hours, and a dedicated project manager as your single point of contact.' },
];

export default function ContactPage() {
  const [selectedType, setSelectedType] = useState('Full Home');
  const [selectedCity, setSelectedCity] = useState('Bengaluru');
  const [openFaq, setOpenFaq] = useState(6);

  return (
    <main className="min-h-screen" style={{ background: '#141300', position: 'relative', overflow: 'hidden', zIndex: 0 }}>
      {/* Background glows */}
      <GlowEffects glows={[
        { top: -212, left: 1062, width: 628, height: 633 },
        { top: 311, left: 124, width: 1197, height: 378 },
      ]} />
      {/* Foreground glows (above content, subtle overlay) */}
      <GlowEffects glows={[
        { top: 420, left: 319, width: 89, height: 89 },
        { top: 1483, left: 353, width: 628, height: 628 },
        { top: 2288, left: 1096, width: 628, height: 628 },
      ]} />
      {/* ============ HERO SECTION ============ */}
      <section className="w-full" style={{ paddingTop: '200px' }}>
        <div className="max-w-[1440px] mx-auto" style={{ paddingLeft: '80px', paddingRight: '80px' }}>
          {/* Tag - centered */}
          <div className="flex items-center justify-center gap-0" style={{ marginBottom: '10px' }}>
            <span className="font-heading" style={{ fontSize: '16px', lineHeight: '1.17em', color: '#D7A648', WebkitTextStroke: '0.5px #D8A648' }}>
              Get In Touch
            </span>
            <div style={{ width: '128px', height: '1px', background: '#D7A648', marginLeft: '11px' }} />
          </div>

          {/* Heading */}
          <h1 className="font-heading text-center" style={{ fontSize: '48px', lineHeight: '1.17em', color: '#FFFFFF', WebkitTextStroke: '0.5px #FFFFFF', marginBottom: '16px' }}>
            Let&apos;s Start Building<br />Your Dream Home.
          </h1>

          {/* Subtitle */}
          <p className="font-body text-center" style={{ fontSize: '16px', lineHeight: '1em', color: '#FFFFFF', marginBottom: '50px', maxWidth: '435px', margin: '0 auto' }}>
            Whether you have a full brief or just an idea — we&apos;re here. One conversation is all it takes to get started.
          </p>

          {/* Trust badges */}
          <div
            className="flex items-center justify-evenly"
            style={{
              background: '#000000',
              borderRadius: '22px',
              padding: '20px 40px',
              marginTop: '40px',
            }}
          >
            {trustBadges.map((badge, i) => (
              <div key={i} className="flex flex-col items-center flex-1" style={{ borderRight: i < 3 ? '1px solid #D7A648' : 'none' }}>
                <span className="font-heading" style={{ fontSize: '24px', lineHeight: '1.17em', color: '#D7A648', WebkitTextStroke: '0.5px #D7A648' }}>
                  {badge.title}
                </span>
                <span className="font-body" style={{ fontSize: '10px', lineHeight: '1em', color: '#FFFFFF', marginTop: '8px' }}>
                  {badge.desc}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FORM + CONTACT INFO SECTION ============ */}
      <section className="w-full" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
        <div className="max-w-[1440px] mx-auto" style={{ paddingLeft: '80px', paddingRight: '80px' }}>
          <div className="flex relative">
            {/* LEFT - Form */}
            <div style={{ width: '677px', flexShrink: 0 }}>
              {/* Tag */}
              <div className="flex items-center gap-0" style={{ marginBottom: '10px' }}>
                <span className="font-heading" style={{ fontSize: '16px', lineHeight: '1.17em', color: '#D7A648', WebkitTextStroke: '0.5px #D8A648' }}>
                  Get In Touch
                </span>
                <div style={{ width: '128px', height: '1px', background: '#D7A648', marginLeft: '11px' }} />
              </div>

              {/* Heading */}
              <h2 className="font-heading" style={{ fontSize: '48px', lineHeight: '1.17em', color: '#FFFFFF', WebkitTextStroke: '0.5px #FFFFFF', marginBottom: '16px' }}>
                Book Your Free<br />Consultation.
              </h2>

              {/* Project type pills (Figma: y:801 — above form card) */}
              <div className="flex flex-wrap gap-[8px]" style={{ marginBottom: '20px' }}>
                {projectTypes.map((type, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedType(type)}
                    className="font-body"
                    style={{
                      background: selectedType === type && i === 0 ? '#D7A648' : 'transparent',
                      border: selectedType === type && i === 0 ? 'none' : '1px solid #D7A648',
                      borderRadius: '55px',
                      padding: '5px 16px',
                      fontSize: '10px',
                      lineHeight: '1em',
                      color: selectedType === type && i === 0 ? '#FFFFFF' : '#D7A648',
                      cursor: 'pointer',
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {/* Subtitle */}
              <p className="font-body" style={{ fontSize: '16px', lineHeight: '1em', color: '#FFFFFF', marginBottom: '20px', maxWidth: '435px' }}>
                Tell us about your project. Our designer will call you within 2 hours to discuss next steps — no pressure, no obligation.
              </p>

              {/* ====== GOLD form card (Figma: x:95, y:923, 677×430, #D7A648) ====== */}
              <div
                style={{
                  background: '#D7A648',
                  borderRadius: '22px',
                  padding: '24px 25px',
                  width: '677px',
                }}
              >
                {/* Form title */}
                <span className="font-heading" style={{ fontSize: '16px', lineHeight: '1.17em', color: '#FFFFFF', WebkitTextStroke: '0.5px #FFFFFF', display: 'block', marginBottom: '12px' }}>
                  Book Your Free Design Consultation
                </span>

                {/* Form inputs */}
                <div className="grid grid-cols-2 gap-[19px]" style={{ marginBottom: '16px' }}>
                  <input
                    type="text"
                    placeholder="First Name"
                    className="font-body"
                    style={{
                      background: '#FFFFFF',
                      borderRadius: '16px',
                      padding: '8px 17px',
                      fontSize: '13px',
                      lineHeight: '1em',
                      color: '#000000',
                      border: 'none',
                      height: '32px',
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    className="font-body"
                    style={{
                      background: '#FFFFFF',
                      borderRadius: '16px',
                      padding: '8px 17px',
                      fontSize: '13px',
                      lineHeight: '1em',
                      color: '#000000',
                      border: 'none',
                      height: '32px',
                    }}
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    className="font-body"
                    style={{
                      background: '#FFFFFF',
                      borderRadius: '16px',
                      padding: '8px 17px',
                      fontSize: '13px',
                      lineHeight: '1em',
                      color: '#000000',
                      border: 'none',
                      height: '32px',
                    }}
                  />
                  <input
                    type="email"
                    placeholder="E-mail"
                    className="font-body"
                    style={{
                      background: '#FFFFFF',
                      borderRadius: '16px',
                      padding: '8px 17px',
                      fontSize: '13px',
                      lineHeight: '1em',
                      color: '#000000',
                      border: 'none',
                      height: '32px',
                    }}
                  />
                  <div className="relative">
                    <select
                      className="font-body w-full appearance-none"
                      style={{
                        background: '#FFFFFF',
                        borderRadius: '16px',
                        padding: '8px 17px',
                        fontSize: '13px',
                        lineHeight: '1em',
                        color: '#000000',
                        border: 'none',
                        height: '32px',
                      }}
                    >
                      <option>Property type</option>
                      <option>Apartment</option>
                      <option>Villa</option>
                      <option>Penthouse</option>
                    </select>
                  </div>
                  <div className="relative">
                    <select
                      className="font-body w-full appearance-none"
                      style={{
                        background: '#FFFFFF',
                        borderRadius: '16px',
                        padding: '8px 17px',
                        fontSize: '13px',
                        lineHeight: '1em',
                        color: '#000000',
                        border: 'none',
                        height: '32px',
                      }}
                    >
                      <option>Budget Range</option>
                      <option>₹5L - ₹10L</option>
                      <option>₹10L - ₹20L</option>
                      <option>₹20L+</option>
                    </select>
                  </div>
                </div>

                {/* Vision textarea */}
                <textarea
                  placeholder="Tell us about your vision"
                  className="font-body w-full"
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '16px',
                    padding: '12px 17px',
                    fontSize: '13px',
                    lineHeight: '1em',
                    color: '#000000',
                    border: 'none',
                    height: '116px',
                    resize: 'none',
                    marginBottom: '12px',
                  }}
                />

                {/* Disclaimer */}
                <p className="font-body text-center" style={{ fontSize: '8px', lineHeight: '1em', color: '#FFFFFF', fontWeight: 700, marginBottom: '12px' }}>
                  100% free · No spam · No obligation whatsoever
                </p>

                {/* Submit buttons */}
                <div className="flex items-center gap-[20px]">
                  <button
                    className="font-heading flex items-center justify-center"
                    style={{
                      background: '#141300',
                      borderRadius: '55px',
                      height: '30px',
                      padding: '0 20px',
                      fontSize: '13px',
                      lineHeight: '1.17em',
                      color: '#FFFFFF',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Claim your free consultation
                  </button>
                  <button
                    className="font-heading flex items-center justify-center"
                    style={{
                      background: '#141300',
                      borderRadius: '55px',
                      height: '30px',
                      padding: '0 20px',
                      fontSize: '13px',
                      lineHeight: '1.17em',
                      color: '#FFFFFF',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Whatsapp Us Directly
                  </button>
                </div>
              </div>
              {/* ====== END gold form card ====== */}
            </div>

            {/* ====== VERTICAL DIVIDER LINE (Figma: x:825, y:640, h:727, gold) ====== */}
            <div style={{ width: '1px', background: '#D7A648', alignSelf: 'stretch', marginLeft: '48px', marginRight: '48px', minHeight: '727px' }} />

            {/* RIGHT - Contact info + Studio */}
            <div className="flex-1 flex flex-col">
              {/* Heading */}
              <h2 className="font-heading" style={{ fontSize: '48px', lineHeight: '1.17em', color: '#FFFFFF', WebkitTextStroke: '0.5px #FFFFFF', marginBottom: '16px' }}>
                We&apos;d Love to Hear<br />From You.
              </h2>

              {/* Subtitle - left aligned (Figma: x:905) */}
              <p className="font-body" style={{ fontSize: '16px', lineHeight: '1em', color: '#FFFFFF', marginBottom: '40px', maxWidth: '435px' }}>
                Reach us however works best for you — form, WhatsApp, or walk into either of our studios. We respond to every inquiry within 2 hours.
              </p>

              {/* City tabs */}
              <div className="flex items-center gap-[11px]" style={{ marginBottom: '20px' }}>
                <button
                  onClick={() => setSelectedCity('Bengaluru')}
                  className="font-heading flex items-center justify-center"
                  style={{
                    width: '150px',
                    height: '30px',
                    background: selectedCity === 'Bengaluru' ? '#D7A648' : 'transparent',
                    border: selectedCity === 'Bengaluru' ? 'none' : '1.5px solid #D7A648',
                    borderRadius: '55px',
                    fontSize: '16px',
                    lineHeight: '1.17em',
                    color: selectedCity === 'Bengaluru' ? '#FFFFFF' : '#D7A648',
                    cursor: 'pointer',
                  }}
                >
                  Bengaluru
                </button>
                <button
                  onClick={() => setSelectedCity('Hyderabad')}
                  className="font-heading flex items-center justify-center"
                  style={{
                    width: '150px',
                    height: '30px',
                    background: selectedCity === 'Hyderabad' ? '#D7A648' : 'transparent',
                    border: selectedCity === 'Hyderabad' ? 'none' : '1.5px solid #D7A648',
                    borderRadius: '55px',
                    fontSize: '16px',
                    lineHeight: '1.17em',
                    color: selectedCity === 'Hyderabad' ? '#FFFFFF' : '#D7A648',
                    cursor: 'pointer',
                  }}
                >
                  Hyderabad
                </button>
              </div>

              {/* Contact details */}
              <div className="flex flex-col gap-[16px]" style={{ marginBottom: '30px' }}>
                {/* Phone */}
                <div className="flex items-center gap-[7px]">
                  <svg width="19" height="19" viewBox="0 0 19 19" fill="#FFFFFF">
                    <path d="M17.1 14.36c-1.14-1.14-2.56-1.14-3.7 0l-.91.91c-.72.72-2.3-.11-3.89-1.7s-2.42-3.17-1.7-3.89l.91-.91c1.14-1.14 1.14-2.56 0-3.7L6.67 3.93C5.53 2.79 4.11 2.79 2.97 3.93l-.91.91c-2.15 2.15-.43 6.51 3.04 9.98s7.83 5.19 9.98 3.04l.91-.91c1.14-1.14 1.14-2.56 0-3.7l-1.14-1.14z" />
                  </svg>
                  <span className="font-body" style={{ fontSize: '16px', lineHeight: '1em', color: '#FFFFFF' }}>
                    {selectedCity === 'Bengaluru' ? '+91 93805 76368' : '+91 93805 76368'}
                  </span>
                </div>
                {/* Email */}
                <div className="flex items-center gap-[7px]">
                  <svg width="17" height="14" viewBox="0 0 17 14" fill="#FFFFFF">
                    <path d="M15.3 0H1.7C.76 0 0 .76 0 1.7v10.6c0 .94.76 1.7 1.7 1.7h13.6c.94 0 1.7-.76 1.7-1.7V1.7C17 .76 16.24 0 15.3 0zM15.3 3.4L8.5 8.5 1.7 3.4V1.7l6.8 5.1 6.8-5.1v1.7z" />
                  </svg>
                  <span className="font-body" style={{ fontSize: '16px', lineHeight: '1em', color: '#FFFFFF' }}>
                    hello@designdwellersstudio.com
                  </span>
                </div>
                {/* Address */}
                <div className="flex items-start gap-[7px]">
                  <svg width="15" height="24" viewBox="0 0 15 24" fill="#FFFFFF" style={{ flexShrink: 0, marginTop: '2px' }}>
                    <path d="M7.5 0C3.36 0 0 3.36 0 7.5c0 5.63 7.5 16.5 7.5 16.5S15 13.13 15 7.5C15 3.36 11.64 0 7.5 0zm0 10.5c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" />
                  </svg>
                  <span className="font-body" style={{ fontSize: '16px', lineHeight: '1em', color: '#FFFFFF' }}>
                    {selectedCity === 'Bengaluru' ? 'Whitefield Studio,\nBangalore' : 'Gachibowli Studio,\nHyderabad'}
                  </span>
                </div>
              </div>

              {/* Map placeholder */}
              <div
                className="flex items-center justify-center"
                style={{
                  background: '#D7A648',
                  borderRadius: '16px',
                  width: '490px',
                  height: '135px',
                  marginBottom: '20px',
                }}
              >
                <span className="font-body" style={{ fontSize: '32px', lineHeight: '1em', color: '#FFFFFF' }}>
                  MAP
                </span>
              </div>

              {/* Studio location info */}
              <div>
                <span className="font-body" style={{ fontSize: '16px', lineHeight: '1em', color: '#D7A648', display: 'block', marginBottom: '8px' }}>
                  {selectedCity === 'Bengaluru' ? 'Whitefield Studio — Bangalore' : 'Gachibowli Studio — Hyderabad'}
                </span>
                <p className="font-body" style={{ fontSize: '10px', lineHeight: '1em', color: '#FFFFFF', marginBottom: '8px' }}>
                  {selectedCity === 'Bengaluru'
                    ? 'Level 2, Prestige Tech Park, Whitefield\nBangalore — 560066, Karnataka'
                    : 'Skyview Towers, Financial District, Gachibowli\nHyderabad — 500032, Telangana'}
                </p>
                <span className="font-body" style={{ fontSize: '16px', lineHeight: '1em', color: '#FFFFFF' }}>
                  Open today · Mon–Sat, 9AM–7PM
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FAQ SECTION ============ */}
      <section className="w-full" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
        <div className="max-w-[1440px] mx-auto px-[80px] flex gap-[60px]">
          {/* Left side */}
          <div className="flex flex-col" style={{ width: '500px', flexShrink: 0 }}>
            {/* Tag */}
            <div className="flex items-center gap-0" style={{ marginBottom: '10px' }}>
              <span className="font-heading" style={{ fontSize: '16px', lineHeight: '1.17em', color: '#D7A648', WebkitTextStroke: '0.5px #D8A648' }}>
                Common Questions
              </span>
              <div style={{ width: '128px', height: '1px', background: '#D7A648', marginLeft: '7px' }} />
            </div>

            {/* Heading */}
            <h2 className="font-heading" style={{ fontSize: '48px', lineHeight: '1.17em', color: '#FFFFFF', marginBottom: '16px' }}>
              Questions?<br />We&apos;ve Got Answers.
            </h2>

            {/* Subtitle */}
            <p className="font-body" style={{ fontSize: '16px', lineHeight: '1.5em', color: '#FFFFFF', opacity: 0.7, marginBottom: '30px' }}>
              The most common things our clients ask before getting started.
            </p>

            {/* CTA */}
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
              }}
            >
              Still have Questions? Talk to us
            </button>
          </div>

          {/* Right - FAQ accordion */}
          <div className="flex-1 flex flex-col gap-[4px]">
            {faqItems.map((item, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={i}
                  onClick={() => setOpenFaq(isOpen ? -1 : i)}
                  className="relative cursor-pointer"
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '22px',
                    padding: isOpen ? '20px 40px 20px 24px' : '0 40px 0 24px',
                    height: isOpen ? 'auto' : '65px',
                    minHeight: '65px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-[12px]">
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#D7A648', flexShrink: 0 }} />
                      <span className="font-heading" style={{ fontSize: '24px', lineHeight: '1.17em', color: '#D7A648' }}>
                        {item.q}
                      </span>
                    </div>
                    <span className="font-heading" style={{ fontSize: '24px', lineHeight: '1em', color: '#D7A648', flexShrink: 0, marginLeft: '12px', userSelect: 'none' }}>
                      {isOpen ? '−' : '+'}
                    </span>
                  </div>
                  {isOpen && (
                    <p className="font-body" style={{ fontSize: '16px', lineHeight: '1.5em', color: '#000000', marginTop: '12px', paddingLeft: '18px' }}>
                      {item.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ CONTACT CTA + FOOTER ============ */}
      <ContactForm />
      <Footer />
    </main>
  );
}
