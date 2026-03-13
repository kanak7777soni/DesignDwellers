import Image from 'next/image';
import Link from 'next/link';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import GlowEffects from '@/components/GlowEffects';

const stats = [
  { value: '8+', label: 'Years of Excellence' },
  { value: '5000+', label: 'Homes Completed' },
  { value: '100%', label: 'On-Time Delivery' },
  { value: '10', label: 'Yrs Warranty' },
  { value: '45', label: 'Days Delivery' },
  { value: '4.9', label: 'Client Rating', hasStar: true },
];

const heroImages = [
  { src: '/images/service-hero-4.png', label: 'Office', pos: 'left-top' },
  { src: '/images/service-hero-3.png', label: 'Office', pos: 'right-top' },
  { src: '/images/service-hero-2.png', label: 'Kitchen & Dining', pos: 'left-bottom' },
  { src: '/images/service-hero-1.png', label: 'Kitchen & Dining', pos: 'right-bottom' },
];

const services = [
  {
    num: '01.',
    title: 'Full Home Interiors',
    description: 'Our flagship service. End-to-end design and execution for your entire home — from initial space planning to the final cushion placement. One team, one point of contact, one fixed price.',
    price: '₹15L',
    priceDetail: 'for 2BHK · all-inclusive',
    tags: ['Space Planning', '3D Renders', 'Material Selection', 'Furniture Sourcing', 'Lighting Design', 'Decor Styling', 'Project Management'],
  },
  {
    num: '02.',
    title: 'Modular Kitchen',
    description: 'Precision-engineered kitchens with premium hardware from Hettich, Hafele, and Franke. Soft-close mechanisms, smart pull-outs, and ergonomic design that makes cooking a pleasure, not a chore.',
    price: '₹3.5L',
    priceDetail: 'depends on size & finish',
    tags: ['Custom Layouts', 'Soft-Close', 'Premium Hardware', 'Smart Storage', 'Countertop Selection', 'Backsplash Design'],
  },
  {
    num: '03.',
    title: 'Bedroom Design',
    description: 'More than furniture placement. We design the entire bedroom experience — built-in wardrobes with custom interiors, mood lighting, headboard design, upholstery, and every detail that makes a room feel like sanctuary.',
    price: '₹2L',
    priceDetail: 'per bedroom',
    tags: ['Built-in Wardrobes', 'Bed Design', 'Mood Lighting', 'Study Nook', 'Upholstery', 'False Ceiling'],
  },
  {
    num: '04.',
    title: 'Bathroom Design',
    description: 'Luxury bathroom design with premium tiles from RAK, Kajaria, and Johnson, and fixtures from Jaquar and Kohler. Waterproofing backed by our 10-year structural warranty.',
    price: '₹1.5L',
    priceDetail: 'per bathroom',
    tags: ['Premium Tiles', 'Fixture Selection', 'Waterproofing', 'Vanity Design', 'Lighting'],
  },
  {
    num: '05.',
    title: 'Living & Dining',
    description: 'Your living room is the first thing guests see and where your family spends most of their time. We design spaces that are beautiful to look at and genuinely comfortable to live in — bespoke joinery, statement lighting, and art curation included.',
    price: '₹3L',
    priceDetail: 'living + dining combined',
    tags: ['TV Unit Design', 'Seating Plan', 'Dining Setup', 'Art & Decor', 'Ceiling Design'],
  },
  {
    num: '06.',
    title: 'Turnkey Projects',
    description: 'The complete solution. We handle design, civil work, electrical, plumbing, carpentry, painting, furnishing, and final styling. You hand us the keys and we hand you a finished home — with a written timeline and fixed price.',
    price: '₹20L',
    priceDetail: 'complete home · 2BHK',
    tags: ['Full Civil Work', 'All Carpentry', 'Painting', 'Furnishing', 'Final Styling', '45-Day Guarantee', 'Electrical & Plumbing'],
  },
];

const timeline = [
  { num: '01', title: 'Free Consultation', desc: 'We understand your vision, lifestyle, and budget. No pressure. No sales pitch.' },
  { num: '02', title: '3D Design', desc: 'Full 3D render of every room. You see it before we build it.' },
  { num: '03', title: 'Execution', desc: 'In-house team executes with precision. Weekly updates. Zero surprises.' },
  { num: '04', title: 'Quality Check', desc: '50-point quality audit before handover. If it\'s not perfect, we fix it.' },
  { num: '05', title: 'Handover', desc: 'Your dream home on time, on budget. Dedicated aftercare for 1 year.' },
];

const pricingPlans = [
  {
    tier: 'Signature',
    level: 'LUXURY',
    priceNote: 'for a full 2BHK',
    features: [
      'Everything in Luxury',
      'Principal designer-led',
      'International material sourcing',
      'Custom joinery & millwork',
      'Dedicated project manager',
      '3-year aftercare support',
      'White-glove concierge service',
    ],
    popular: true,
  },
  {
    tier: 'Bespoke',
    level: 'ULTRA',
    priceNote: 'for a full 2BHK',
    features: [
      'Everything in Luxury',
      'Principal designer-led',
      'International material sourcing',
      'Custom joinery & millwork',
      'Dedicated project manager',
      '3-year aftercare support',
      'White-glove concierge service',
    ],
    popular: false,
  },
];

export default function ServicePage() {
  return (
    <main className="min-h-screen" style={{ background: '#141300', position: 'relative', overflow: 'hidden', zIndex: 0 }}>
      <GlowEffects glows={[
        { top: -214, left: 1108, width: 628, height: 633 },
        { top: 598, left: -198, width: 628, height: 633 },
        { top: 1505, left: -40, width: 1519, height: 480 },
        { top: 1753, left: -40, width: 1519, height: 480 },
        { top: 2001, left: -40, width: 1519, height: 480 },
        { top: 2249, left: -40, width: 1519, height: 480 },
        { top: 2497, left: -40, width: 1519, height: 480 },
        { top: 2792, left: 898, width: 628, height: 633 },
        { top: 3185, left: -3, width: 1440, height: 985 },
      ]} />
      <div className="max-w-[1440px] mx-auto relative" style={{ paddingTop: '159px' }}>

        {/* ─── Section 1: Hero / What We Offer ─── */}
        <div className="relative" style={{ minHeight: '862px' }}>
          {/* Left content */}
          <div style={{ position: 'absolute', left: '66px', top: '260px' }}>
            {/* Label */}
            <div className="relative" style={{ width: '236px', height: '19px', marginBottom: '10px' }}>
              <span
                className="font-heading absolute"
                style={{
                  left: 0,
                  top: 0,
                  fontSize: '16px',
                  lineHeight: '1.17em',
                  color: '#D7A648',
                  WebkitTextStroke: '0.5px #D8A648',
                }}
              >
                What We Offer
              </span>
              <div
                className="absolute"
                style={{ left: '108px', top: '16px', width: '128px', height: '1px', background: '#D7A648' }}
              />
            </div>

            {/* Title */}
            <h1
              className="font-heading"
              style={{
                fontSize: '48px',
                lineHeight: '1.17em',
                color: '#FFFFFF',
                WebkitTextStroke: '0.5px #FFFFFF',
                marginBottom: '16px',
                whiteSpace: 'pre-line',
              }}
            >
              {'Interior Design\nDone\u00A0Right.'}
            </h1>

            {/* Buttons */}
            <div className="flex" style={{ gap: '11px', marginBottom: '46px' }}>
              <Link
                href="#"
                className="font-heading flex items-center justify-center"
                style={{
                  background: '#D7A648',
                  borderRadius: '55px',
                  width: '150px',
                  height: '30px',
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
                  background: 'transparent',
                  borderRadius: '55px',
                  width: '150px',
                  height: '30px',
                  fontSize: '16px',
                  lineHeight: '1.17em',
                  color: '#D7A648',
                  WebkitTextStroke: '0.5px #D7A648',
                  textDecoration: 'none',
                  border: '1.5px solid #D7A648',
                }}
              >
                View Our Work
              </Link>
            </div>

            {/* Description */}
            <p
              className="font-body"
              style={{
                fontSize: '16px',
                lineHeight: '1em',
                color: '#FFFFFF',
                maxWidth: '435px',
              }}
            >
              From a single modular kitchen to a complete villa overhaul — we bring the same obsessive attention to detail to every project, at every budget.
            </p>
          </div>

          {/* Image grid (2×2) on right side */}
          <div
            style={{
              position: 'absolute',
              right: '72px',
              top: '0',
              display: 'grid',
              gridTemplateColumns: '401px 401px',
              gap: '6px',
            }}
          >
            {/* Images with gradient overlays */}
            {[
              { src: '/images/service-hero-4.png', label: 'Office' },
              { src: '/images/service-hero-3.png', label: 'Office' },
              { src: '/images/service-hero-2.png', label: 'Kitchen & Dining' },
              { src: '/images/service-hero-1.png', label: 'Kitchen & Dining' },
            ].map((img, i) => (
              <div key={i} style={{ width: '401px', height: '401px', position: 'relative', borderRadius: '22px', overflow: 'hidden' }}>
                <Image src={img.src} alt={img.label} fill className="object-cover" sizes="401px" />
                {/* Gradient overlay at bottom */}
                <div
                  className="absolute bottom-0 left-0 w-full"
                  style={{
                    height: '129px',
                    background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 77%)',
                    borderRadius: '22px',
                  }}
                />
                <span
                  className="font-body absolute"
                  style={{
                    bottom: '14px',
                    left: '40px',
                    fontSize: '13px',
                    lineHeight: '1em',
                    color: '#FFFFFF',
                  }}
                >
                  {img.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats bar */}
        <div
          className="flex items-center justify-between"
          style={{
            marginLeft: '132px',
            marginRight: '133px',
            width: '1175px',
            height: '133px',
            marginBottom: '77px',
          }}
        >
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="flex items-center gap-[4px]">
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
                {stat.hasStar && (
                  <svg width="16" height="15" viewBox="0 0 20 19" fill="none">
                    <path d="M10 0L12.2451 6.90983H19.5106L13.6327 11.1803L15.8779 18.0902L10 13.8197L4.12215 18.0902L6.36729 11.1803L0.489435 6.90983H7.75486L10 0Z" fill="#D7A648" />
                  </svg>
                )}
              </div>
              <span
                className="font-heading"
                style={{
                  fontSize: '16px',
                  lineHeight: '1.17em',
                  color: '#FFFFFF',
                  WebkitTextStroke: '0.5px #FFFFFF',
                }}
              >
                {stat.label}
              </span>
            </div>
          ))}
          {/* Gold line below stats */}
          <div className="absolute" style={{ left: '132px', right: '133px', bottom: '0', height: '1px', background: '#D7A648' }} />
        </div>

        {/* ─── Section 2: All Services ─── */}
        <div style={{ paddingLeft: '66px', paddingRight: '66px', marginBottom: '80px' }}>
          {/* Label */}
          <div className="relative" style={{ width: '236px', height: '19px', marginBottom: '10px' }}>
            <span
              className="font-heading absolute"
              style={{
                left: 0,
                top: 0,
                fontSize: '16px',
                lineHeight: '1.17em',
                color: '#D7A648',
                WebkitTextStroke: '0.5px #D8A648',
              }}
            >
              All Services
            </span>
            <div
              className="absolute"
              style={{ left: '90px', top: '16px', width: '128px', height: '1px', background: '#D7A648' }}
            />
          </div>

          {/* Title + Description row */}
          <div className="flex justify-between items-start" style={{ marginBottom: '40px' }}>
            <h2
              className="font-heading"
              style={{
                fontSize: '48px',
                lineHeight: '1.17em',
                color: '#FFFFFF',
                WebkitTextStroke: '0.5px #FFFFFF',
                whiteSpace: 'pre-line',
              }}
            >
              {'Everything We Do,\nExplained.'}
            </h2>
            <p
              className="font-body"
              style={{
                fontSize: '16px',
                lineHeight: '1em',
                color: '#FFFFFF',
                textAlign: 'right',
                maxWidth: '435px',
                marginTop: '58px',
              }}
            >
              From a single modular kitchen to a complete villa overhaul — we bring the same obsessive attention to detail to every project, at every budget.
            </p>
          </div>

          {/* Service rows */}
          <div className="flex flex-col" style={{ gap: '17px', paddingLeft: '10px', paddingRight: '10px' }}>
            {services.map((svc, i) => (
              <div
                key={i}
                style={{
                  width: '1288px',
                  borderRadius: '22px',
                  background: '#000000',
                  padding: '21px 30px 20px 69px',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Vertical divider before price */}
                <div
                  style={{
                    position: 'absolute',
                    right: '156px',
                    top: '26px',
                    width: '1px',
                    height: 'calc(100% - 52px)',
                    background: '#D7A648',
                  }}
                />

                {/* Number */}
                <span
                  className="font-heading"
                  style={{
                    fontSize: '40px',
                    lineHeight: '1.17em',
                    color: '#FFFFFF',
                    WebkitTextStroke: '0.5px #FFFFFF',
                    display: 'block',
                    marginBottom: '0px',
                  }}
                >
                  {svc.num}
                </span>

                {/* Title */}
                <h3
                  className="font-heading"
                  style={{
                    fontSize: '36px',
                    lineHeight: '1.17em',
                    color: '#D7A648',
                    WebkitTextStroke: '0.5px #D7A648',
                    marginBottom: '10px',
                  }}
                >
                  {svc.title}
                </h3>

                {/* Description */}
                <p
                  className="font-body"
                  style={{
                    fontSize: '16px',
                    lineHeight: '1em',
                    color: '#FFFFFF',
                    maxWidth: '956px',
                    marginBottom: '14px',
                  }}
                >
                  {svc.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap" style={{ gap: '6px', maxWidth: '956px' }}>
                  {svc.tags.map((tag, j) => (
                    <span
                      key={j}
                      className="font-body"
                      style={{
                        fontSize: '10px',
                        lineHeight: '1em',
                        color: '#D7A648',
                        border: '1px solid #D7A648',
                        borderRadius: '55px',
                        padding: '5px 8px 6px 7px',
                        background: 'transparent',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Price section (right side) */}
                <div
                  style={{
                    position: 'absolute',
                    right: '30px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    textAlign: 'left',
                    width: '110px',
                  }}
                >
                  <span
                    className="font-body"
                    style={{ fontSize: '10px', lineHeight: '1em', color: '#FFFFFF', display: 'block', marginBottom: '4px' }}
                  >
                    Starting from
                  </span>
                  <span
                    className="font-heading"
                    style={{
                      fontSize: '16px',
                      lineHeight: '1.17em',
                      color: '#D7A648',
                      WebkitTextStroke: '0.5px #D7A648',
                      display: 'block',
                      marginBottom: '4px',
                    }}
                  >
                    {svc.price}
                  </span>
                  <span
                    className="font-body"
                    style={{ fontSize: '10px', lineHeight: '1em', color: '#FFFFFF' }}
                  >
                    {svc.priceDetail}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Section 3: Investment / Pricing ─── */}
        <div style={{ marginBottom: '80px' }}>
          {/* Section label (centered) */}
          <div className="flex flex-col items-center" style={{ marginBottom: '24px' }}>
            <div className="relative" style={{ width: '236px', height: '19px', marginBottom: '10px' }}>
              <span
                className="font-heading absolute"
                style={{
                  left: 0,
                  top: 0,
                  fontSize: '16px',
                  lineHeight: '1.17em',
                  color: '#D7A648',
                  WebkitTextStroke: '0.5px #D8A648',
                }}
              >
                Investment
              </span>
              <div
                className="absolute"
                style={{ left: '78px', top: '16px', width: '128px', height: '1px', background: '#D7A648' }}
              />
            </div>

            <h2
              className="font-heading text-center"
              style={{
                fontSize: '48px',
                lineHeight: '1.17em',
                color: '#FFFFFF',
                WebkitTextStroke: '0.5px #FFFFFF',
                whiteSpace: 'pre-line',
                marginBottom: '16px',
              }}
            >
              {'Honest Pricing.\nNo Surprises.'}
            </h2>

            <p
              className="font-body text-center"
              style={{
                fontSize: '16px',
                lineHeight: '1em',
                color: '#FFFFFF',
                maxWidth: '435px',
              }}
            >
              Every project is unique, but here&apos;s a transparent guide to what you can expect.
            </p>
          </div>

          {/* Pricing cards */}
          <div className="flex justify-center" style={{ gap: '15px', paddingLeft: '84px', paddingRight: '84px' }}>
            {pricingPlans.map((plan, i) => (
              <div
                key={i}
                style={{
                  width: '628px',
                  height: '191px',
                  borderRadius: '22px',
                  background: '#000000',
                  position: 'relative',
                  padding: '36px 30px 30px 26px',
                  display: 'flex',
                }}
              >
                {/* Most Popular badge */}
                {plan.popular && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '0',
                      right: '30px',
                      background: '#D7A648',
                      borderRadius: '0 0 7px 7px',
                      padding: '4px 12px',
                    }}
                  >
                    <span
                      className="font-body"
                      style={{ fontSize: '10px', lineHeight: '1em', color: '#FFFFFF', textAlign: 'center' }}
                    >
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Left side: tier info */}
                <div style={{ minWidth: '120px', marginRight: '20px' }}>
                  <span
                    className="font-body"
                    style={{ fontSize: '16px', lineHeight: '1em', color: '#FFFFFF', display: 'block', marginBottom: '4px', textAlign: 'center' }}
                  >
                    {plan.tier}
                  </span>
                  <span
                    className="font-heading"
                    style={{
                      fontSize: plan.level === 'LUXURY' ? '36px' : '36px',
                      lineHeight: '1.17em',
                      color: '#D7A648',
                      WebkitTextStroke: '0.5px #D7A648',
                      display: 'block',
                      textAlign: 'center',
                      marginBottom: '4px',
                    }}
                  >
                    {plan.level}
                  </span>
                  <span
                    className="font-body"
                    style={{ fontSize: '10px', lineHeight: '1em', color: '#FFFFFF', display: 'block', textAlign: 'center' }}
                  >
                    {plan.priceNote}
                  </span>
                </div>

                {/* Right side: features */}
                <div className="flex flex-col" style={{ gap: '2px', flex: 1 }}>
                  {plan.features.map((f, j) => (
                    <span
                      key={j}
                      className="font-body"
                      style={{ fontSize: '16px', lineHeight: '1em', color: '#FFFFFF' }}
                    >
                      {f}
                    </span>
                  ))}
                </div>

                {/* Get Free Quote button */}
                <div style={{ position: 'absolute', bottom: '20px', right: '30px' }}>
                  <Link
                    href="#"
                    className="font-heading flex items-center justify-center"
                    style={{
                      background: '#D7A648',
                      borderRadius: '55px',
                      width: '180px',
                      height: '36px',
                      fontSize: '20px',
                      lineHeight: '1.17em',
                      color: '#FFFFFF',
                      WebkitTextStroke: '0.5px #FFFFFF',
                      textDecoration: 'none',
                    }}
                  >
                    Get Free Quote
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Section 4: How It Works ─── */}
        <div
          style={{
            background: '#141300',
            paddingTop: '36px',
            paddingBottom: '80px',
            position: 'relative',
          }}
        >
          {/* Dark overlay rect */}
          <div
            className="absolute inset-x-0"
            style={{
              top: '0',
              width: '1440px',
              height: '612px',
              background: '#141300',
            }}
          />

          <div className="relative flex flex-col items-center">
            {/* Label */}
            <div className="relative" style={{ width: '223px', height: '19px', marginBottom: '10px' }}>
              <span
                className="font-heading absolute"
                style={{
                  left: 0,
                  top: 0,
                  fontSize: '16px',
                  lineHeight: '1.17em',
                  color: '#D7A648',
                  WebkitTextStroke: '0.5px #D8A648',
                }}
              >
                How It Works
              </span>
              <div
                className="absolute"
                style={{ left: '95px', top: '16px', width: '128px', height: '1px', background: '#D7A648' }}
              />
            </div>

            {/* Title */}
            <h2
              className="font-heading text-center"
              style={{
                fontSize: '48px',
                lineHeight: '1.17em',
                color: '#FFFFFF',
                WebkitTextStroke: '0.5px #FFFFFF',
                marginBottom: '16px',
              }}
            >
              From First Call to Final Handover
            </h2>

            {/* Subtitle */}
            <p
              className="font-body text-center"
              style={{
                fontSize: '16px',
                lineHeight: '1em',
                color: '#FFFFFF',
                marginBottom: '48px',
                maxWidth: '513px',
              }}
            >
              A transparent, stress-free process — you always know what&apos;s happening.
            </p>

            {/* Horizontal gold line */}
            <div style={{ width: '644px', height: '1px', background: '#D7A648', marginBottom: '48px' }} />

            {/* Timeline */}
            <div className="flex justify-between" style={{ width: '1100px' }}>
              {timeline.map((step, i) => (
                <div key={i} className="flex flex-col items-center" style={{ width: '151px' }}>
                  {/* Title */}
                  <span
                    className="font-heading text-center"
                    style={{
                      fontSize: '16px',
                      lineHeight: '1.17em',
                      color: '#FFFFFF',
                      WebkitTextStroke: '0.5px #FFFFFF',
                      marginBottom: '12px',
                      display: 'block',
                    }}
                  >
                    {step.title}
                  </span>

                  {/* Description */}
                  <p
                    className="font-body text-center"
                    style={{
                      fontSize: '12px',
                      lineHeight: '1em',
                      color: '#FFFFFF',
                      marginBottom: '20px',
                    }}
                  >
                    {step.desc}
                  </p>

                  {/* Circle dot */}
                  <div
                    style={{
                      width: '70px',
                      height: '70px',
                      borderRadius: '50%',
                      border: '4px solid #D7A648',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '8px',
                    }}
                  >
                    <span
                      className="font-heading"
                      style={{
                        fontSize: '24px',
                        lineHeight: '1.17em',
                        color: '#D7A648',
                        WebkitTextStroke: '1px #D7A648',
                      }}
                    >
                      {step.num}
                    </span>
                  </div>

                  {/* Connecting line (except last) */}
                  {i < timeline.length - 1 && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 'calc(100% - 43px)',
                        left: `calc(${(i + 0.5) * 20}% + 35px)`,
                        width: '149px',
                        height: '3px',
                        background: 'linear-gradient(90deg, rgba(20,19,0,0) 0%, rgba(215,166,72,1) 50%, rgba(20,19,0,0) 100%)',
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── Section 5: CTA ─── */}
        <ContactForm />
      </div>

      <Footer />
    </main>
  );
}
