/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import GlowEffects from '@/components/GlowEffects';
import {
  getActiveAboutStudios,
  getActiveAboutTeamMembers,
  getActiveAboutTimeline,
  getActiveAboutValues,
  getSiteContentData,
} from '@/lib/content-store';

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
    year: '24',
    title: '2024, Established in Bengaluru',
    desc: 'Started with a focused studio team and a single belief: interior design in India needed to be more honest, more accountable, and more personal.',
    side: 'right' as const,
  },
  {
    year: '24',
    title: 'In-house Manufacturing',
    desc: 'Built stronger control over materials, timelines, and finish quality by keeping manufacturing and execution under one accountable team.',
    side: 'left' as const,
  },
  {
    year: '25',
    title: '10-Year Warranty Standard',
    desc: 'Made long-term material and workmanship confidence a core promise for every Design Dwellers Studio project.',
    side: 'right' as const,
  },
  {
    year: '25',
    title: 'Premium Brand Network',
    desc: 'Expanded our preferred material ecosystem with trusted names including Century, Action Tessa, Hettich, Greenply, and Saint-Gobain.',
    side: 'left' as const,
  },
  {
    year: '26',
    title: 'Crossed 850+ Homes',
    desc: 'Crossed 850 completed homes while maintaining a 4.9/5 average rating and the same hands-on accountability behind every decision.',
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
    desc: 'Specialises in contemporary Indian interiors and leads a 12-person design team across our Bengaluru studio.',
    img: '/images/about-team-2-15c07a.png',
  },
  {
    name: 'Ramkishan Das',
    role: 'Head of Design',
    desc: 'Expert in luxury residential interiors, premium materials, and detail-led execution for high-touch residential projects.',
    img: '/images/about-team-3.png',
  },
];

function Lines({ text }: { text: string }) {
  return text.split('\n').map((line, index) => (
    <span key={`${line}-${index}`}>
      {index > 0 ? <br /> : null}
      {line}
    </span>
  ));
}

function TextBlock({ text }: { text: string }) {
  return text.split('\n\n').map((paragraph, index) => (
    <span key={`${paragraph}-${index}`}>
      {index > 0 ? <><br /><br /></> : null}
      {paragraph}
    </span>
  ));
}

function StudioImage({ src, alt }: { src: string; alt: string }) {
  return (
    <img
      src={src}
      alt={alt}
      className="object-cover"
      style={{ width: '100%', height: '100%', display: 'block' }}
    />
  );
}

export const dynamic = 'force-dynamic';

export default async function AboutPage() {
  const content = await getSiteContentData();
  const about = content.about;
  const aboutStudios = getActiveAboutStudios(about);
  const managedTeamMembers = getActiveAboutTeamMembers(about);
  const aboutTeamMembers = managedTeamMembers.length > 0
    ? managedTeamMembers
    : team.map((member, index) => ({
      id: `static-team-${index + 1}`,
      name: member.name,
      role: member.role,
      desc: member.desc,
      imageSrc: member.img,
      alt: member.name,
    }));
  const aboutValues = getActiveAboutValues(about).length > 0 ? getActiveAboutValues(about) : values;
  const aboutTimeline = getActiveAboutTimeline(about).length > 0 ? getActiveAboutTimeline(about) : timeline;
  const aboutStats = about.stats.length > 0 ? about.stats : [
    { value: '850+', label: 'Homes Completed' },
    { value: '10', label: 'Years Warranty' },
    { value: '1', label: 'Studio' },
    { value: '4.9', label: 'Client Rating' },
  ];

  return (
    <main className="about-page min-h-screen" style={{ background: '#141300', position: 'relative', overflow: 'hidden', zIndex: 0 }}>
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
      ]} />
      {/* ============ HERO + STATS: Two-column layout ============ */}
      <section className="w-full" style={{ paddingTop: '200px' }}>
        <div className="max-w-[1440px] mx-auto relative" style={{ paddingLeft: '80px', paddingRight: '80px' }}>
          <div className="flex justify-between">
            {/* Left content */}
            <div style={{ maxWidth: '500px' }}>
              {/* Tag */}
              <div className="flex items-center gap-0" style={{ marginBottom: '10px' }}>
                <span className="font-heading" style={{ fontSize: '16px', lineHeight: '1.17em', color: '#D7A648', WebkitTextStroke: '0.5px #D8A648' }}>
                  {about.hero.label}
                </span>
                <div style={{ width: '128px', height: '1px', background: '#D7A648', marginLeft: '7px' }} />
              </div>

              {/* Heading */}
              <h1 className="font-heading" style={{ fontSize: '48px', lineHeight: '1.17em', color: '#FFFFFF', WebkitTextStroke: '0.5px #FFFFFF', marginBottom: '16px' }}>
                <Lines text={about.hero.heading} />
              </h1>

              {/* Buttons BEFORE subtitle (Figma order: y:532 before y:593) */}
              <div className="flex items-center gap-[11px]" style={{ marginBottom: '30px' }}>
                <Link
                  href={about.hero.primaryCtaHref}
                  className="font-heading flex items-center justify-center"
                  style={{
                    width: '150px',
                    height: '44px',
                    background: '#D7A648',
                    borderRadius: '55px',
                    fontSize: '16px',
                    lineHeight: '1.17em',
                    color: '#FFFFFF',
                    WebkitTextStroke: '0.5px #FFFFFF',
                    textDecoration: 'none',
                  }}
                >
                  {about.hero.primaryCtaLabel}
                </Link>
                <Link
                  href={about.hero.secondaryCtaHref}
                  className="font-heading flex items-center justify-center"
                  style={{
                    width: '150px',
                    height: '44px',
                    border: '1.5px solid #D7A648',
                    borderRadius: '55px',
                    fontSize: '16px',
                    lineHeight: '1.17em',
                    color: '#D7A648',
                    WebkitTextStroke: '0.5px #D7A648',
                    textDecoration: 'none',
                  }}
                >
                  {about.hero.secondaryCtaLabel}
                </Link>
              </div>

              {/* Subtitle (after buttons in Figma) */}
              <p className="font-body" style={{ fontSize: '16px', lineHeight: '1em', color: '#FFFFFF', maxWidth: '435px', marginBottom: '40px' }}>
                <TextBlock text={about.hero.subtitle} />
              </p>

              {/* Stats - 2 staggered rows matching Figma positions exactly */}
              {/* Content starts at x:113, so stats offset = 161-113 = 48px */}
              <div style={{ marginLeft: '48px' }}>
                <div className="flex" style={{ gap: '58px', marginBottom: '27px' }}>
                  <div className="flex flex-col items-center" style={{ width: '127px' }}>
                    <span className="font-heading" style={{ fontSize: '32px', lineHeight: '1.17em', color: '#D7A648', WebkitTextStroke: '0.5px #D7A648' }}>
                      {aboutStats[0]?.value}
                    </span>
                    <span className="font-heading" style={{ fontSize: '16px', lineHeight: '1.17em', color: '#FFFFFF', WebkitTextStroke: '0.5px #FFFFFF' }}>
                      {aboutStats[0]?.label}
                    </span>
                  </div>
                  <div className="flex flex-col items-center" style={{ width: '125px' }}>
                    <span className="font-heading" style={{ fontSize: '32px', lineHeight: '1.17em', color: '#D7A648', WebkitTextStroke: '0.5px #D7A648' }}>
                      {aboutStats[1]?.value}
                    </span>
                    <span className="font-heading" style={{ fontSize: '16px', lineHeight: '1.17em', color: '#FFFFFF', WebkitTextStroke: '0.5px #FFFFFF' }}>
                      {aboutStats[1]?.label}
                    </span>
                  </div>
                </div>
                <div className="flex" style={{ gap: '123px', marginLeft: '35px' }}>
                  <div className="flex flex-col items-center" style={{ width: '47px' }}>
                    <span className="font-heading" style={{ fontSize: '32px', lineHeight: '1.17em', color: '#D7A648', WebkitTextStroke: '0.5px #D7A648' }}>
                      {aboutStats[2]?.value}
                    </span>
                    <span className="font-heading" style={{ fontSize: '16px', lineHeight: '1.17em', color: '#FFFFFF', WebkitTextStroke: '0.5px #FFFFFF' }}>
                      {aboutStats[2]?.label}
                    </span>
                  </div>
                  <div className="flex flex-col items-center" style={{ width: '84px' }}>
                    <div className="flex items-center gap-[4px]">
                      <span className="font-heading" style={{ fontSize: '32px', lineHeight: '1.17em', color: '#D7A648', WebkitTextStroke: '0.5px #D7A648' }}>
                        {aboutStats[3]?.value}
                      </span>
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="#D7A648">
                        <polygon points="9,0 11.47,6.56 18,6.56 12.76,10.62 15.24,17.18 9,13.12 2.76,17.18 5.24,10.62 0,6.56 6.53,6.56" />
                      </svg>
                    </div>
                    <span className="font-heading" style={{ fontSize: '16px', lineHeight: '1.17em', color: '#FFFFFF', WebkitTextStroke: '0.5px #FFFFFF' }}>
                      {aboutStats[3]?.label}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Two stacked images with studio labels overlaid */}
            <div className="flex flex-col gap-[7px]" style={{ width: '761px' }}>
              {/* Image 1 - Bengaluru Studio */}
              <div className="relative overflow-hidden" style={{ width: '761px', height: '401px', borderRadius: '8px' }}>
                <StudioImage src={aboutStudios[0]?.imageSrc || '/images/about-hero-2.png'} alt={aboutStudios[0]?.alt || 'Bengaluru Studio'} />
                <div className="absolute inset-x-0 bottom-0" style={{ height: '92px', background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 77%)' }} />
                <div className="absolute bottom-0 left-0" style={{ padding: '20px 40px' }}>
                  <span className="font-heading" style={{ fontSize: '13px', lineHeight: '1.17em', color: '#D7A648', WebkitTextStroke: '0.5px #D7A648', display: 'block' }}>
                    {aboutStudios[0]?.title || 'Our Bengaluru Studio'}
                  </span>
                  <span className="font-body" style={{ fontSize: '13px', lineHeight: '1em', color: '#FFFFFF', display: 'block', marginTop: '4px' }}>
                    {aboutStudios[0]?.subtitle || 'Whitefield, Bengaluru - Est. 2024'}
                  </span>
                </div>
              </div>

              {/* Image 2 - Hyderabad Studio (Figma: x:607, y:614, 761×401) */}
              <div className="relative overflow-hidden" style={{ width: '761px', height: '401px', borderRadius: '8px' }}>
                <StudioImage src={aboutStudios[1]?.imageSrc || '/images/about-hero-1.png'} alt={aboutStudios[1]?.alt || 'Hyderabad Studio'} />
                <div className="absolute inset-x-0 bottom-0" style={{ height: '80px', background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 77%)' }} />
                <div className="absolute bottom-0 left-0" style={{ padding: '20px 40px' }}>
                  <span className="font-heading" style={{ fontSize: '13px', lineHeight: '1.17em', color: '#D7A648', WebkitTextStroke: '0.5px #D7A648', display: 'block' }}>
                    {aboutStudios[1]?.title || 'Our Hyderabad Studio'}
                  </span>
                  <span className="font-body" style={{ fontSize: '13px', lineHeight: '1em', color: '#FFFFFF', display: 'block', marginTop: '4px' }}>
                    {aboutStudios[1]?.subtitle || 'Gachibowli, Hyderabad - Est. 2019'}
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
                  {about.mission.label}
                </span>
                <div style={{ width: '128px', height: '1px', background: '#D7A648', marginLeft: '7px' }} />
              </div>

              {/* Heading */}
              <h2 className="font-heading" style={{ fontSize: '48px', lineHeight: '1.17em', color: '#FFFFFF', WebkitTextStroke: '0.5px #FFFFFF', marginBottom: '30px' }}>
                <Lines text={about.mission.heading} />
              </h2>

              {/* Body text */}
              <p className="font-body" style={{ fontSize: '16px', lineHeight: '1em', color: '#FFFFFF', maxWidth: '526px', marginBottom: '40px' }}>
                <TextBlock text={about.mission.body} />
              </p>

              {/* CTA buttons */}
              <div className="flex items-center gap-[11px]">
                <Link
                  href={about.mission.primaryCtaHref}
                  className="font-heading flex items-center justify-center"
                  style={{
                    width: '150px',
                    height: '44px',
                    background: '#D7A648',
                    borderRadius: '55px',
                    fontSize: '16px',
                    lineHeight: '1.17em',
                    color: '#FFFFFF',
                    WebkitTextStroke: '0.5px #FFFFFF',
                    textDecoration: 'none',
                  }}
                >
                  {about.mission.primaryCtaLabel}
                </Link>
                <Link
                  href={about.mission.secondaryCtaHref}
                  className="font-heading flex items-center justify-center"
                  style={{
                    width: '150px',
                    height: '44px',
                    border: '1.5px solid #D7A648',
                    borderRadius: '55px',
                    fontSize: '16px',
                    lineHeight: '1.17em',
                    color: '#D7A648',
                    WebkitTextStroke: '0.5px #D7A648',
                    textDecoration: 'none',
                  }}
                >
                  {about.mission.secondaryCtaLabel}
                </Link>
              </div>
            </div>

            {/* Right - Quote card (Figma: x:740, y:1157, 628×191) */}
            <div style={{ width: '628px', flexShrink: 0 }}>
              <div style={{ background: '#000000', borderRadius: '22px', padding: '36px 46px' }}>
                <p className="font-body" style={{ fontSize: '16px', lineHeight: '1em', color: '#FFFFFF', marginBottom: '20px' }}>
                  &ldquo;{about.mission.quote}&rdquo;
                </p>
                <div className="flex items-center gap-0">
                  <span className="font-heading" style={{ fontSize: '16px', lineHeight: '1.17em', color: '#D7A648', WebkitTextStroke: '0.5px #D8A648' }}>
                    {about.mission.quoteAttribution}
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
                  {about.teamIntro.label}
                </span>
                <div style={{ width: '128px', height: '1px', background: '#D7A648', marginLeft: '9px' }} />
              </div>

              {/* Heading */}
              <h2 className="font-heading" style={{ fontSize: '48px', lineHeight: '1.17em', color: '#FFFFFF', WebkitTextStroke: '0.5px #FFFFFF' }}>
                <Lines text={about.teamIntro.heading} />
              </h2>
            </div>

            {/* Subtitle - right side (Figma: x:827, y:1699) */}
            <p className="font-body text-right" style={{ fontSize: '16px', lineHeight: '1em', color: '#FFFFFF', maxWidth: '541px', marginTop: '80px' }}>
              <TextBlock text={about.teamIntro.subtitle} />
            </p>
          </div>

          {/* Team grid - 3 cards at 376px each with 66px gap */}
          <div className="flex" style={{ gap: '66px', marginTop: '40px' }}>
            {aboutTeamMembers.map((member) => (
              <div key={member.id} className="relative overflow-hidden" style={{ width: '376px', height: '470px', borderRadius: '22px' }}>
                <StudioImage src={member.imageSrc} alt={member.alt || member.name} />
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
                  {about.valuesIntro.label}
                </span>
                <div style={{ width: '128px', height: '1px', background: '#D7A648', marginLeft: '12px' }} />
              </div>

              {/* Heading */}
              <h2 className="font-heading" style={{ fontSize: '48px', lineHeight: '1.17em', color: '#FFFFFF', WebkitTextStroke: '0.5px #FFFFFF' }}>
                <Lines text={about.valuesIntro.heading} />
              </h2>
            </div>

            {/* Subtitle - right side (Figma: x:900, y:2462) */}
            <p className="font-body text-right" style={{ fontSize: '16px', lineHeight: '1em', color: '#FFFFFF', maxWidth: '469px', marginTop: '80px' }}>
              <TextBlock text={about.valuesIntro.subtitle} />
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
              {aboutValues.map((value, i) => (
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
              {about.timelineIntro.label}
            </span>
            <div style={{ width: '128px', height: '1px', background: '#D7A648', marginLeft: '7px' }} />
          </div>

          {/* Heading - centered */}
          <h2 className="font-heading text-center" style={{ fontSize: '48px', lineHeight: '1.17em', color: '#FFFFFF', WebkitTextStroke: '0.5px #FFFFFF', marginBottom: '50px' }}>
            <Lines text={about.timelineIntro.heading} />
          </h2>

          {/* Timeline */}
          <div className="relative" style={{ maxWidth: '900px', margin: '0 auto' }}>
            {aboutTimeline.map((item, i) => (
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
                  {i < aboutTimeline.length - 1 && (
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
