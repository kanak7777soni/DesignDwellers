'use client';
import Image from 'next/image';
import Link from 'next/link';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import GlowEffects from '@/components/GlowEffects';

const values = [
  {
    num: '01.',
    title: 'Radical Transparency',
    desc: 'We tell you what things cost before we start. We tell you when there\'s a problem before you notice it. No surprises.',
  },
  {
    num: '02.',
    title: 'Execution Over Everything',
    desc: 'Beautiful renders mean nothing if the execution is poor. We obsess over the doing, not just the designing.',
  },
  {
    num: '03.',
    title: 'Accountability',
    desc: 'When something goes wrong — and occasionally things do — we own it, fix it, and don\'t charge you for fixing our mistakes.',
  },
  {
    num: '04.',
    title: 'Long-Term Thinking',
    desc: 'We don\'t cut corners to save money on a job. We build things that last, because our reputation depends on every single home we touch.',
  },
  {
    num: '05.',
    title: 'Design Integrity',
    desc: 'We won\'t design something we wouldn\'t be proud to show. Every project reflects our studio\'s name, not just the client\'s brief.',
  },
  {
    num: '06.',
    title: 'People First',
    desc: 'Our clients aren\'t projects — they\'re families. We design around how you live, not how a trend board says you should.',
  },
];

const timeline = [
  {
    year: '16',
    title: '2016, Founded in Bangalore',
    desc: 'Started with 4 people, 1 studio, and a single belief: interior design in India needed to be more honest, more accountable, and more personal.',
    side: 'right' as const,
  },
  {
    year: '18',
    title: '2018, Crossed 500 Projects',
    desc: 'Grew to a 30-person team. Introduced our 45-day delivery guarantee — the first written commitment of its kind in Bangalore\'s interior design market.',
    side: 'left' as const,
  },
  {
    year: '19',
    title: '2019, Expanded to Hyderabad',
    desc: 'Opened our Gachibowli studio. Within 18 months, completed 400 homes in Hyderabad and built a full local team of designers and craftspeople.',
    side: 'right' as const,
  },
  {
    year: '21',
    title: '2021, 2000 Homes Milestone',
    desc: 'Navigated COVID-19 without a single project abandonment. Introduced remote project management capabilities — now standard for all clients.',
    side: 'left' as const,
  },
  {
    year: '25',
    title: '2025, Crossed 5000+ Homes',
    desc: 'Crossed 5,000 completed homes. Maintained a 4.9/5 average rating across 500+ Google reviews. Still the same 4-person founding team\'s values guiding every decision.',
    side: 'right' as const,
  },
];

const team = [
  {
    name: 'Ramkishan Das',
    role: 'Founder & CEO',
    desc: '12 years in residential design. Trained in Milan. Believes every home should feel like it was built specifically for the people living in it.',
    img: '/images/about-team-1.png',
  },
  {
    name: 'Ramkishan Das',
    role: 'Head of Project Delivery',
    desc: '8 years specialising in contemporary Indian interiors. Leads a 12-person design team across our Bangalore studio.',
    img: '/images/about-team-2-15c07a.png',
  },
  {
    name: 'Ramkishan Das',
    role: 'Head of Design',
    desc: 'Expert in luxury residential interiors. Manages DDS Hyderabad and has delivered 800+ projects in the city.',
    img: '/images/about-team-3.png',
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen" style={{ background: '#141300', position: 'relative', overflow: 'hidden', zIndex: 0 }}>
      {/* Background glows (behind masking sections) */}
      <GlowEffects glows={[
        { top: 625, left: -312, width: 628, height: 628 },
        { top: 1272, left: -39, width: 1519, height: 480 },
        { top: 2093, left: -40, width: 1519, height: 480 },
      ]} />
      {/* Foreground glows (above masking sections, subtle overlay) */}
      <GlowEffects glows={[
        { top: -212, left: 1062, width: 628, height: 633 },
        { top: 1164, left: 1255, width: 89, height: 89 },
        { top: 2457, left: -40, width: 1519, height: 480 },
        { top: 3075, left: 1070, width: 628, height: 628 },
        { top: 4150, left: 1096, width: 628, height: 628 },
      ]} zIndex={2} />
      {/* ============ HERO + STATS: Two-column layout ============ */}
      <section className="w-full" style={{ paddingTop: '200px' }}>
        <div className="max-w-[1440px] mx-auto relative" style={{ paddingLeft: '80px', paddingRight: '80px' }}>
          <div className="flex justify-between">
            {/* Left content */}
            <div style={{ maxWidth: '500px' }}>
              {/* Tag */}
              <div className="flex items-center gap-0" style={{ marginBottom: '10px' }}>
                <span className="font-heading" style={{ fontSize: '16px', lineHeight: '1.17em', color: '#D7A648', WebkitTextStroke: '0.5px #D8A648' }}>
                  Our Story
                </span>
                <div style={{ width: '128px', height: '1px', background: '#D7A648', marginLeft: '7px' }} />
              </div>

              {/* Heading */}
              <h1 className="font-heading" style={{ fontSize: '48px', lineHeight: '1.17em', color: '#FFFFFF', WebkitTextStroke: '0.5px #FFFFFF', marginBottom: '16px' }}>
                We Build Homes<br />That Feel Like
              </h1>

              {/* Buttons BEFORE subtitle (Figma order: y:532 before y:593) */}
              <div className="flex items-center gap-[11px]" style={{ marginBottom: '30px' }}>
                <Link
                  href="#"
                  className="font-heading flex items-center justify-center"
                  style={{
                    width: '150px',
                    height: '30px',
                    background: '#D7A648',
                    borderRadius: '55px',
                    fontSize: '16px',
                    lineHeight: '1.17em',
                    color: '#FFFFFF',
                    WebkitTextStroke: '0.5px #FFFFFF',
                    textDecoration: 'none',
                  }}
                >
                  Get Free Quote
                </Link>
                <Link
                  href="/portfolio"
                  className="font-heading flex items-center justify-center"
                  style={{
                    width: '150px',
                    height: '30px',
                    border: '1.5px solid #D7A648',
                    borderRadius: '55px',
                    fontSize: '16px',
                    lineHeight: '1.17em',
                    color: '#D7A648',
                    WebkitTextStroke: '0.5px #D7A648',
                    textDecoration: 'none',
                  }}
                >
                  View Our Work
                </Link>
              </div>

              {/* Subtitle (after buttons in Figma) */}
              <p className="font-body" style={{ fontSize: '16px', lineHeight: '1em', color: '#FFFFFF', maxWidth: '435px', marginBottom: '40px' }}>
                Founded in 2016, Design Dwellers Studio was built on one belief: every family deserves a home that genuinely reflects who they are — not a catalogue page, not a contractor&apos;s shortcut.
              </p>

              {/* Stats - 2 staggered rows matching Figma positions exactly */}
              {/* Figma: Row1 at y:693 (8+ x:161, 5000+ x:346), Row2 at y:786 (2 x:196, 4.9 x:366) */}
              {/* Content starts at x:113, so stats offset = 161-113 = 48px */}
              <div style={{ marginLeft: '48px' }}>
                {/* Row 1: 8+ (w:127) — 58px gap — 5000+ (w:125) */}
                <div className="flex" style={{ gap: '58px', marginBottom: '27px' }}>
                  <div className="flex flex-col items-center" style={{ width: '127px' }}>
                    <span className="font-heading" style={{ fontSize: '32px', lineHeight: '1.17em', color: '#D7A648', WebkitTextStroke: '0.5px #D7A648' }}>
                      8+
                    </span>
                    <span className="font-heading" style={{ fontSize: '16px', lineHeight: '1.17em', color: '#FFFFFF', WebkitTextStroke: '0.5px #FFFFFF' }}>
                      Years of Excellence
                    </span>
                  </div>
                  <div className="flex flex-col items-center" style={{ width: '125px' }}>
                    <span className="font-heading" style={{ fontSize: '32px', lineHeight: '1.17em', color: '#D7A648', WebkitTextStroke: '0.5px #D7A648' }}>
                      5000+
                    </span>
                    <span className="font-heading" style={{ fontSize: '16px', lineHeight: '1.17em', color: '#FFFFFF', WebkitTextStroke: '0.5px #FFFFFF' }}>
                      Homes Completed
                    </span>
                  </div>
                </div>
                {/* Row 2: offset 35px right from row 1. 2 (w:47) — 123px gap — 4.9★ (w:84) */}
                <div className="flex" style={{ gap: '123px', marginLeft: '35px' }}>
                  <div className="flex flex-col items-center" style={{ width: '47px' }}>
                    <span className="font-heading" style={{ fontSize: '32px', lineHeight: '1.17em', color: '#D7A648', WebkitTextStroke: '0.5px #D7A648' }}>
                      2
                    </span>
                    <span className="font-heading" style={{ fontSize: '16px', lineHeight: '1.17em', color: '#FFFFFF', WebkitTextStroke: '0.5px #FFFFFF' }}>
                      Studios
                    </span>
                  </div>
                  <div className="flex flex-col items-center" style={{ width: '84px' }}>
                    <div className="flex items-center gap-[4px]">
                      <span className="font-heading" style={{ fontSize: '32px', lineHeight: '1.17em', color: '#D7A648', WebkitTextStroke: '0.5px #D7A648' }}>
                        4.9
                      </span>
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="#D7A648">
                        <polygon points="9,0 11.47,6.56 18,6.56 12.76,10.62 15.24,17.18 9,13.12 2.76,17.18 5.24,10.62 0,6.56 6.53,6.56" />
                      </svg>
                    </div>
                    <span className="font-heading" style={{ fontSize: '16px', lineHeight: '1.17em', color: '#FFFFFF', WebkitTextStroke: '0.5px #FFFFFF' }}>
                      Client Rating
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Two stacked images with studio labels overlaid */}
            <div className="flex flex-col gap-[7px]" style={{ width: '761px' }}>
              {/* Image 1 - Bangalore Studio (Figma: x:607, y:206, 761×401) */}
              <div className="relative overflow-hidden" style={{ width: '761px', height: '401px', borderRadius: '8px' }}>
                <Image src="/images/about-hero-2.png" alt="Bangalore Studio" fill className="object-cover" />
                <div className="absolute inset-x-0 bottom-0" style={{ height: '92px', background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 77%)' }} />
                <div className="absolute bottom-0 left-0" style={{ padding: '20px 40px' }}>
                  <span className="font-heading" style={{ fontSize: '13px', lineHeight: '1.17em', color: '#D7A648', WebkitTextStroke: '0.5px #D7A648', display: 'block' }}>
                    Our Bangalore Studio
                  </span>
                  <span className="font-body" style={{ fontSize: '13px', lineHeight: '1em', color: '#FFFFFF', display: 'block', marginTop: '4px' }}>
                    Whitefield, Bangalore — Est. 2016
                  </span>
                </div>
              </div>

              {/* Image 2 - Hyderabad Studio (Figma: x:607, y:614, 761×401) */}
              <div className="relative overflow-hidden" style={{ width: '761px', height: '401px', borderRadius: '8px' }}>
                <Image src="/images/about-hero-1.png" alt="Hyderabad Studio" fill className="object-cover" />
                <div className="absolute inset-x-0 bottom-0" style={{ height: '80px', background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 77%)' }} />
                <div className="absolute bottom-0 left-0" style={{ padding: '20px 40px' }}>
                  <span className="font-heading" style={{ fontSize: '13px', lineHeight: '1.17em', color: '#D7A648', WebkitTextStroke: '0.5px #D7A648', display: 'block' }}>
                    Our Hyderabad Studio
                  </span>
                  <span className="font-body" style={{ fontSize: '13px', lineHeight: '1em', color: '#FFFFFF', display: 'block', marginTop: '4px' }}>
                    Gachibowli, Hyderabad — Est. 2019
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ MISSION SECTION (side-by-side: text left, quote right) ============ */}
      <section className="w-full" style={{ paddingTop: '60px', paddingBottom: '80px', background: '#141300', position: 'relative', zIndex: 1 }}>
        <div className="max-w-[1440px] mx-auto" style={{ paddingLeft: '80px', paddingRight: '80px' }}>
          <div className="flex justify-between">
            {/* Left - Mission text */}
            <div style={{ maxWidth: '526px' }}>
              {/* Tag */}
              <div className="flex items-center gap-0" style={{ marginBottom: '10px' }}>
                <span className="font-heading" style={{ fontSize: '16px', lineHeight: '1.17em', color: '#D7A648', WebkitTextStroke: '0.5px #D8A648' }}>
                  Our Mission
                </span>
                <div style={{ width: '128px', height: '1px', background: '#D7A648', marginLeft: '7px' }} />
              </div>

              {/* Heading */}
              <h2 className="font-heading" style={{ fontSize: '48px', lineHeight: '1.17em', color: '#FFFFFF', WebkitTextStroke: '0.5px #FFFFFF', marginBottom: '30px' }}>
                Design With Purpose.<br />Build With Integrity.
              </h2>

              {/* Body text */}
              <p className="font-body" style={{ fontSize: '16px', lineHeight: '1em', color: '#FFFFFF', maxWidth: '526px', marginBottom: '40px' }}>
                We started Design Dwellers because we were frustrated by the status quo — contractors who disappeared mid-project, designers who submitted pretty renders but couldn&apos;t execute, and families left with homes that didn&apos;t match their dreams or their budgets.
                <br /><br />
                So we built something different: a fully integrated studio where design, procurement, and execution happen under one roof, with one team, accountable to one standard.
              </p>

              {/* CTA buttons */}
              <div className="flex items-center gap-[11px]">
                <Link
                  href="#"
                  className="font-heading flex items-center justify-center"
                  style={{
                    width: '150px',
                    height: '30px',
                    background: '#D7A648',
                    borderRadius: '55px',
                    fontSize: '16px',
                    lineHeight: '1.17em',
                    color: '#FFFFFF',
                    WebkitTextStroke: '0.5px #FFFFFF',
                    textDecoration: 'none',
                  }}
                >
                  Work With Us
                </Link>
                <Link
                  href="/portfolio"
                  className="font-heading flex items-center justify-center"
                  style={{
                    width: '150px',
                    height: '30px',
                    border: '1.5px solid #D7A648',
                    borderRadius: '55px',
                    fontSize: '16px',
                    lineHeight: '1.17em',
                    color: '#D7A648',
                    WebkitTextStroke: '0.5px #D7A648',
                    textDecoration: 'none',
                  }}
                >
                  View Our Work
                </Link>
              </div>
            </div>

            {/* Right - Quote card (Figma: x:740, y:1157, 628×191) */}
            <div style={{ width: '628px', flexShrink: 0 }}>
              <div style={{ background: '#000000', borderRadius: '22px', padding: '36px 46px' }}>
                <p className="font-body" style={{ fontSize: '16px', lineHeight: '1em', color: '#FFFFFF', marginBottom: '20px' }}>
                  &ldquo;A home isn&apos;t just where you live. It&apos;s how you live. Every material we choose, every joint we detail, every light we position — it&apos;s all in service of how your family will actually feel inside these walls.&rdquo;
                </p>
                <div className="flex items-center gap-0">
                  <span className="font-heading" style={{ fontSize: '16px', lineHeight: '1.17em', color: '#D7A648', WebkitTextStroke: '0.5px #D8A648' }}>
                    RamKishan, Founder, Design Dwellers Studio
                  </span>
                  <div style={{ width: '128px', height: '1px', background: '#D7A648', marginLeft: '7px' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ TEAM SECTION ============ */}
      <section className="w-full" style={{ paddingTop: '40px', paddingBottom: '80px', background: '#141300', position: 'relative', zIndex: 1 }}>
        <div className="max-w-[1440px] mx-auto" style={{ paddingLeft: '80px', paddingRight: '80px' }}>
          {/* Header row: heading left, subtitle right */}
          <div className="flex justify-between items-start">
            <div>
              {/* Tag */}
              <div className="flex items-center gap-0" style={{ marginBottom: '10px' }}>
                <span className="font-heading" style={{ fontSize: '16px', lineHeight: '1.17em', color: '#D7A648', WebkitTextStroke: '0.5px #D8A648' }}>
                  The People
                </span>
                <div style={{ width: '128px', height: '1px', background: '#D7A648', marginLeft: '9px' }} />
              </div>

              {/* Heading */}
              <h2 className="font-heading" style={{ fontSize: '48px', lineHeight: '1.17em', color: '#FFFFFF', WebkitTextStroke: '0.5px #FFFFFF' }}>
                Meet the Team Behind<br />Your Dream Home
              </h2>
            </div>

            {/* Subtitle - right side (Figma: x:827, y:1699) */}
            <p className="font-body text-right" style={{ fontSize: '16px', lineHeight: '1em', color: '#FFFFFF', maxWidth: '541px', marginTop: '80px' }}>
              Every designer, project manager, and craftsperson on our team was hand-picked for one quality: they care about your home as much as you do.
            </p>
          </div>

          {/* Team grid - 3 cards at 376px each with 66px gap */}
          <div className="flex" style={{ gap: '66px', marginTop: '40px' }}>
            {team.map((member, i) => (
              <div key={i} className="relative overflow-hidden" style={{ width: '376px', height: '470px', borderRadius: '22px' }}>
                <Image src={member.img} alt={member.name} fill className="object-cover" />
                {/* Gradient overlay */}
                <div className="absolute inset-x-0 bottom-0" style={{ height: '164px', background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 77%)', borderRadius: '0 0 22px 22px' }} />
                {/* Info */}
                <div className="absolute bottom-0 left-0 p-[30px]">
                  <p className="font-heading" style={{ fontSize: '13px', lineHeight: '1.17em', color: '#D7A648', WebkitTextStroke: '0.5px #D7A648' }}>
                    {member.name}
                  </p>
                  <p className="font-body" style={{ fontSize: '13px', lineHeight: '1em', color: '#FFFFFF', marginTop: '4px' }}>
                    {member.role}
                  </p>
                  <p className="font-body" style={{ fontSize: '8px', lineHeight: '1em', color: '#FFFFFF', marginTop: '6px', maxWidth: '316px' }}>
                    {member.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ VALUES SECTION ============ */}
      <section className="w-full" style={{ paddingTop: '20px', paddingBottom: '80px' }}>
        <div className="max-w-[1440px] mx-auto" style={{ paddingLeft: '80px', paddingRight: '80px' }}>
          {/* Header row: heading left, subtitle right */}
          <div className="flex justify-between items-start" style={{ marginBottom: '50px' }}>
            <div>
              {/* Tag */}
              <div className="flex items-center gap-0" style={{ marginBottom: '10px' }}>
                <span className="font-heading" style={{ fontSize: '16px', lineHeight: '1.17em', color: '#D7A648', WebkitTextStroke: '0.5px #D8A648' }}>
                  What Drives Us
                </span>
                <div style={{ width: '128px', height: '1px', background: '#D7A648', marginLeft: '12px' }} />
              </div>

              {/* Heading */}
              <h2 className="font-heading" style={{ fontSize: '48px', lineHeight: '1.17em', color: '#FFFFFF', WebkitTextStroke: '0.5px #FFFFFF' }}>
                Our Values Are<br />Non-Negotiable
              </h2>
            </div>

            {/* Subtitle - right side (Figma: x:900, y:2462) */}
            <p className="font-body text-right" style={{ fontSize: '16px', lineHeight: '1em', color: '#FFFFFF', maxWidth: '469px', marginTop: '80px' }}>
              Full-service interior design — from one room to the entire home. One team. Zero coordination headaches.
            </p>
          </div>

          {/* Values grid - 3 columns, 2 rows */}
          <div
            className="relative"
            style={{
              background: '#141300',
              borderRadius: '22px',
            }}
          >
            <div className="grid grid-cols-3" style={{ position: 'relative' }}>
              {values.map((value, i) => (
                <div
                  key={i}
                  className="flex flex-col"
                  style={{
                    padding: '20px 28px',
                    borderRight: (i % 3 !== 2) ? '1px solid #D7A648' : 'none',
                    borderBottom: i < 3 ? '1px solid #D7A648' : 'none',
                  }}
                >
                  <span className="font-heading" style={{ fontSize: '40px', lineHeight: '1.17em', color: '#FFFFFF', WebkitTextStroke: '0.5px #FFFFFF' }}>
                    {value.num}
                  </span>
                  <span className="font-heading" style={{ fontSize: '16px', lineHeight: '1.17em', color: '#D7A648', WebkitTextStroke: '0.5px #D7A648', marginTop: '8px' }}>
                    {value.title}
                  </span>
                  <span className="font-body" style={{ fontSize: '10px', lineHeight: '1em', color: '#FFFFFF', marginTop: '4px' }}>
                    {value.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ JOURNEY TIMELINE ============ */}
      <section className="w-full" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
        <div className="max-w-[1440px] mx-auto" style={{ paddingLeft: '80px', paddingRight: '80px' }}>
          {/* Tag - centered */}
          <div className="flex items-center justify-center gap-0" style={{ marginBottom: '10px' }}>
            <span className="font-heading" style={{ fontSize: '16px', lineHeight: '1.17em', color: '#D7A648', WebkitTextStroke: '0.5px #D8A648' }}>
              Our Journey
            </span>
            <div style={{ width: '128px', height: '1px', background: '#D7A648', marginLeft: '7px' }} />
          </div>

          {/* Heading - centered */}
          <h2 className="font-heading text-center" style={{ fontSize: '48px', lineHeight: '1.17em', color: '#FFFFFF', WebkitTextStroke: '0.5px #FFFFFF', marginBottom: '50px' }}>
            How We Got Here
          </h2>

          {/* Timeline */}
          <div className="relative" style={{ maxWidth: '900px', margin: '0 auto' }}>
            {timeline.map((item, i) => (
              <div key={i} className="relative flex items-start">
                {/* Left side */}
                <div className="flex-1 flex justify-end" style={{ paddingRight: '60px' }}>
                  {item.side === 'left' && (
                    <div className="text-right" style={{ maxWidth: '337px' }}>
                      <h3 className="font-heading" style={{ fontSize: '24px', lineHeight: '1.17em', color: '#D7A648', WebkitTextStroke: '0.5px #D7A648' }}>
                        {item.title}
                      </h3>
                      <p className="font-body" style={{ fontSize: '12px', lineHeight: '1em', color: '#FFFFFF', marginTop: '8px' }}>
                        {item.desc}
                      </p>
                    </div>
                  )}
                </div>

                {/* Center - circle + line */}
                <div className="flex flex-col items-center" style={{ width: '70px', flexShrink: 0 }}>
                  <div
                    className="flex items-center justify-center"
                    style={{
                      width: '70px',
                      height: '70px',
                      borderRadius: '50%',
                      border: '4px solid #D7A648',
                    }}
                  >
                    <span className="font-heading" style={{ fontSize: '24px', lineHeight: '1.17em', color: '#D7A648' }}>
                      {item.year}
                    </span>
                  </div>
                  {i < timeline.length - 1 && (
                    <div style={{
                      width: '3px',
                      height: '105px',
                      background: 'linear-gradient(90deg, rgba(20, 19, 0, 0) 0%, rgba(215, 166, 72, 1) 50%, rgba(20, 19, 0, 0) 100%)',
                    }} />
                  )}
                </div>

                {/* Right side */}
                <div className="flex-1" style={{ paddingLeft: '60px' }}>
                  {item.side === 'right' && (
                    <div style={{ maxWidth: '337px' }}>
                      <h3 className="font-heading" style={{ fontSize: '24px', lineHeight: '1.17em', color: '#D7A648', WebkitTextStroke: '0.5px #D7A648' }}>
                        {item.title}
                      </h3>
                      <p className="font-body" style={{ fontSize: '12px', lineHeight: '1em', color: '#FFFFFF', marginTop: '8px' }}>
                        {item.desc}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CONTACT CTA + FOOTER ============ */}
      <ContactForm />
      <Footer />
    </main>
  );
}
