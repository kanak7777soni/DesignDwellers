import { promises as fs } from 'fs';
import path from 'path';
import { readCrmBlobText, shouldUseBlobCrmStorage, writeCrmBlobText } from '@/lib/crm-blob-storage';
import { getUploadValidationErrorForFile } from '@/lib/media-upload';
import { normalizeMediaStorage, type MediaStorageMetadata } from '@/lib/media-storage';
import { COMPANY_NAME, GST_NUMBER } from '@/lib/site-content';

export type BrandPartner = {
  id: string;
  type: 'logo' | 'text';
  label: string;
  logoSrc: string;
  alt: string;
  width: number;
  height: number;
  sortOrder: number;
  active: boolean;
  logoStorage?: MediaStorageMetadata | null;
};

export type AboutStat = {
  value: string;
  label: string;
};

export type AboutStudioCard = {
  id: string;
  title: string;
  subtitle: string;
  imageSrc: string;
  alt: string;
  sortOrder: number;
  active: boolean;
  imageStorage?: MediaStorageMetadata | null;
};

export type AboutTimelineItem = {
  id: string;
  year: string;
  title: string;
  desc: string;
  side: 'left' | 'right';
  sortOrder: number;
  active: boolean;
};

export type AboutValue = {
  id: string;
  num: string;
  title: string;
  desc: string;
  sortOrder: number;
  active: boolean;
};

export type AboutTeamMember = {
  id: string;
  name: string;
  role: string;
  desc: string;
  imageSrc: string;
  alt: string;
  sortOrder: number;
  active: boolean;
  imageStorage?: MediaStorageMetadata | null;
};

export type AboutPageContent = {
  hero: {
    label: string;
    heading: string;
    subtitle: string;
    primaryCtaLabel: string;
    primaryCtaHref: string;
    secondaryCtaLabel: string;
    secondaryCtaHref: string;
  };
  stats: AboutStat[];
  studios: AboutStudioCard[];
  mission: {
    label: string;
    heading: string;
    body: string;
    primaryCtaLabel: string;
    primaryCtaHref: string;
    secondaryCtaLabel: string;
    secondaryCtaHref: string;
    quote: string;
    quoteAttribution: string;
  };
  teamIntro: {
    label: string;
    heading: string;
    subtitle: string;
  };
  teamMembers: AboutTeamMember[];
  valuesIntro: {
    label: string;
    heading: string;
    subtitle: string;
  };
  values: AboutValue[];
  timelineIntro: {
    label: string;
    heading: string;
  };
  timeline: AboutTimelineItem[];
};

export type GlobalSeoContent = {
  title: string;
  description: string;
  openGraphImage: string;
  openGraphImageAlt: string;
  openGraphImageStorage?: MediaStorageMetadata | null;
};

export type LegalSection = {
  id: string;
  title: string;
  body: string[];
  sortOrder: number;
  active: boolean;
};

export type LegalContent = {
  label: string;
  heading: string;
  companyName: string;
  gstNumber: string;
  sections: LegalSection[];
};

export type SiteContentData = {
  seo: GlobalSeoContent;
  brands: {
    title: string;
    items: BrandPartner[];
  };
  about: AboutPageContent;
  legal: LegalContent;
  updatedAt: string;
};

const DATA_DIR = path.join(process.cwd(), 'data');
const CONTENT_FILE = path.join(DATA_DIR, 'site-content.json');
const CONTENT_UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'content');
const PUBLIC_CONTENT_UPLOAD_PATH = '/uploads/content';
const BLOB_CONTENT_FILE = 'crm/data/site-content.json';

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function ensureContentUploadDir() {
  await fs.mkdir(CONTENT_UPLOAD_DIR, { recursive: true });
}

function text(value: unknown, fallback = '') {
  const nextValue = typeof value === 'string' ? value.trim() : '';
  return nextValue || fallback;
}

function blockText(value: unknown, fallback = '') {
  const nextValue = typeof value === 'string' ? value.trim() : '';
  return nextValue || fallback;
}

function numberValue(value: unknown, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function cleanSrc(value: unknown, fallback = '') {
  const nextValue = typeof value === 'string' ? value.trim() : '';

  if (!nextValue) {
    return fallback;
  }

  if (nextValue.startsWith('/')) {
    return nextValue;
  }

  try {
    const parsed = new URL(nextValue);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:' ? parsed.toString() : fallback;
  } catch {
    return fallback;
  }
}

function normalizeBrand(item: Partial<BrandPartner>, index: number): BrandPartner | null {
  const type = item.type === 'text' ? 'text' : 'logo';
  const label = text(item.label, type === 'text' ? `Brand ${index + 1}` : '');
  const logoSrc = cleanSrc(item.logoSrc);

  if (type === 'text' && !label) {
    return null;
  }

  if (type === 'logo' && !logoSrc) {
    return null;
  }

  return {
    id: text(item.id, `brand-${index + 1}`),
    type,
    label,
    logoSrc,
    alt: text(item.alt, label || `Brand ${index + 1}`),
    width: numberValue(item.width, type === 'logo' ? 146 : 146),
    height: numberValue(item.height, type === 'logo' ? 146 : 72),
    sortOrder: numberValue(item.sortOrder, (index + 1) * 10),
    active: item.active ?? true,
    logoStorage: normalizeMediaStorage(item.logoStorage) || null,
  };
}

function normalizeStats(stats?: Partial<AboutStat>[]) {
  return (stats || [])
    .map((stat) => ({
      value: text(stat.value),
      label: text(stat.label),
    }))
    .filter((stat) => stat.value && stat.label);
}

function normalizeStudio(studio: Partial<AboutStudioCard>, index: number): AboutStudioCard | null {
  const imageSrc = cleanSrc(studio.imageSrc);
  const title = text(studio.title);
  const subtitle = text(studio.subtitle);

  if (!title && !subtitle && !imageSrc) {
    return null;
  }

  return {
    id: text(studio.id, `studio-${index + 1}`),
    title,
    subtitle,
    imageSrc,
    alt: text(studio.alt, title || `Studio ${index + 1}`),
    sortOrder: numberValue(studio.sortOrder, (index + 1) * 10),
    active: studio.active ?? true,
    imageStorage: normalizeMediaStorage(studio.imageStorage) || null,
  };
}

function normalizeTimeline(item: Partial<AboutTimelineItem>, index: number): AboutTimelineItem | null {
  const title = text(item.title);
  const desc = blockText(item.desc);

  if (!title && !desc) {
    return null;
  }

  return {
    id: text(item.id, `timeline-${index + 1}`),
    year: text(item.year, '24'),
    title,
    desc,
    side: item.side === 'left' ? 'left' : 'right',
    sortOrder: numberValue(item.sortOrder, (index + 1) * 10),
    active: item.active ?? true,
  };
}

function normalizeValue(item: Partial<AboutValue>, index: number): AboutValue | null {
  const title = text(item.title);
  const desc = blockText(item.desc);

  if (!title && !desc) {
    return null;
  }

  return {
    id: text(item.id, `value-${index + 1}`),
    num: text(item.num, `${String(index + 1).padStart(2, '0')}.`),
    title,
    desc,
    sortOrder: numberValue(item.sortOrder, (index + 1) * 10),
    active: item.active ?? true,
  };
}

function normalizeTeamMember(item: Partial<AboutTeamMember>, index: number): AboutTeamMember | null {
  const name = text(item.name);
  const role = text(item.role);
  const desc = blockText(item.desc);
  const imageSrc = cleanSrc(item.imageSrc);

  if (!name && !role && !desc && !imageSrc) {
    return null;
  }

  return {
    id: text(item.id, `team-${index + 1}`),
    name,
    role,
    desc,
    imageSrc,
    alt: text(item.alt, name || `Team member ${index + 1}`),
    sortOrder: numberValue(item.sortOrder, (index + 1) * 10),
    active: item.active ?? true,
    imageStorage: normalizeMediaStorage(item.imageStorage) || null,
  };
}

function normalizeLegalSection(item: Partial<LegalSection>, index: number): LegalSection | null {
  const title = text(item.title);
  const body = (item.body || [])
    .map((line) => text(line))
    .filter(Boolean);

  if (!title && body.length === 0) {
    return null;
  }

  return {
    id: text(item.id, `legal-${index + 1}`),
    title,
    body,
    sortOrder: numberValue(item.sortOrder, (index + 1) * 10),
    active: item.active ?? true,
  };
}

export function getSeedSiteContentData(): SiteContentData {
  return {
    seo: {
      title: 'Design Dwellers Studio | Premium Interior Design',
      description: 'Transform your space with Design Dwellers Studio. Premium interior design services with 850+ homes delivered, 10 years warranty, and 100% on-time completion.',
      openGraphImage: '/images/hero-bg.png',
      openGraphImageAlt: 'Design Dwellers Studio interior design',
      openGraphImageStorage: null,
    },
    brands: {
      title: 'Top Brands Only',
      items: [
        { id: 'greenply', type: 'logo', label: 'Greenply', logoSrc: '/images/brand-logo-2.png', alt: 'Greenply', width: 146, height: 93, sortOrder: 20, active: true, logoStorage: null },
        { id: 'hettich', type: 'logo', label: 'Hettich', logoSrc: '/images/brand-logo-3.png', alt: 'Hettich', width: 146, height: 146, sortOrder: 30, active: true, logoStorage: null },
        { id: 'merino', type: 'logo', label: 'Merino', logoSrc: '/images/brand-logo-4.png', alt: 'Merino', width: 145, height: 81, sortOrder: 40, active: true, logoStorage: null },
        { id: 'royale-touche', type: 'logo', label: 'Royale Touche', logoSrc: '/images/brand-logo-5.png', alt: 'Royale Touche', width: 146, height: 146, sortOrder: 50, active: true, logoStorage: null },
        { id: 'saint-gobain', type: 'logo', label: 'Saint-Gobain', logoSrc: '/images/brand-logo-6.png', alt: 'Saint-Gobain', width: 146, height: 146, sortOrder: 60, active: true, logoStorage: null },
        { id: 'century', type: 'text', label: 'Century', logoSrc: '', alt: 'Century', width: 146, height: 72, sortOrder: 70, active: true, logoStorage: null },
        { id: 'action-tessa', type: 'text', label: 'Action Tessa', logoSrc: '', alt: 'Action Tessa', width: 146, height: 72, sortOrder: 80, active: true, logoStorage: null },
      ],
    },
    about: {
      hero: {
        label: 'Our Story',
        heading: 'We Build Homes\nThat Feel Like',
        subtitle: 'Established in 2024, Design Dwellers Studio was built on one belief: every family deserves a home that genuinely reflects who they are - not a catalogue page, not a contractor\'s shortcut.',
        primaryCtaLabel: 'Get Free Quote',
        primaryCtaHref: '/contact',
        secondaryCtaLabel: 'View Our Work',
        secondaryCtaHref: '/portfolio',
      },
      stats: [
        { value: '850+', label: 'Homes Completed' },
        { value: '10', label: 'Years Warranty' },
        { value: '1', label: 'Studio' },
        { value: '4.9', label: 'Client Rating' },
      ],
      studios: [
        {
          id: 'bengaluru',
          title: 'Our Bengaluru Studio',
          subtitle: 'Whitefield, Bengaluru - Est. 2024',
          imageSrc: '/images/about-hero-2.png',
          alt: 'Bengaluru Studio',
          sortOrder: 10,
          active: true,
          imageStorage: null,
        },
        {
          id: 'hyderabad',
          title: 'Our Hyderabad Studio',
          subtitle: 'Gachibowli, Hyderabad - Est. 2019',
          imageSrc: '/images/about-hero-1.png',
          alt: 'Hyderabad Studio',
          sortOrder: 20,
          active: true,
          imageStorage: null,
        },
      ],
      mission: {
        label: 'Our Mission',
        heading: 'Design With Purpose.\nBuild With Integrity.',
        body: 'We started Design Dwellers because we were frustrated by the status quo - contractors who disappeared mid-project, designers who submitted pretty renders but couldn\'t execute, and families left with homes that didn\'t match their dreams or their budgets.\n\nSo we built something different: a fully integrated studio where design, procurement, and execution happen under one roof, with one team, accountable to one standard.',
        primaryCtaLabel: 'Work With Us',
        primaryCtaHref: '/contact',
        secondaryCtaLabel: 'View Our Work',
        secondaryCtaHref: '/portfolio',
        quote: 'A home isn\'t just where you live. It\'s how you live. Every material we choose, every joint we detail, every light we position - it\'s all in service of how your family will actually feel inside these walls.',
        quoteAttribution: 'RamKishan, Founder, Design Dwellers Studio',
      },
      teamIntro: {
        label: 'The People',
        heading: 'Meet the Team Behind\nYour Dream Home',
        subtitle: 'Every designer, project manager, and craftsperson on our team was hand-picked for one quality: they care about your home as much as you do.',
      },
      teamMembers: [
        { id: 'ramkishan-founder', name: 'Ramkishan Das', role: 'Founder & CEO', desc: '12 years in residential design. Trained in Milan. Believes every home should feel like it was built specifically for the people living in it.', imageSrc: '/images/about-team-1.png', alt: 'Ramkishan Das', sortOrder: 10, active: true, imageStorage: null },
        { id: 'delivery-head', name: 'Ramkishan Das', role: 'Head of Project Delivery', desc: 'Specialises in contemporary Indian interiors and leads a 12-person design team across our Bengaluru studio.', imageSrc: '/images/about-team-2-15c07a.png', alt: 'Head of Project Delivery', sortOrder: 20, active: true, imageStorage: null },
        { id: 'design-head', name: 'Ramkishan Das', role: 'Head of Design', desc: 'Expert in luxury residential interiors, premium materials, and detail-led execution for high-touch residential projects.', imageSrc: '/images/about-team-3.png', alt: 'Head of Design', sortOrder: 30, active: true, imageStorage: null },
      ],
      valuesIntro: {
        label: 'What Drives Us',
        heading: 'Our Values Are\nNon-Negotiable',
        subtitle: 'Full-service interior design - from one room to the entire home. One team. Zero coordination headaches.',
      },
      values: [
        { id: 'transparency', num: '01.', title: 'Radical Transparency', desc: 'We tell you what things cost before we start. We tell you when there\'s a problem before you notice it. No surprises.', sortOrder: 10, active: true },
        { id: 'execution', num: '02.', title: 'Execution Over Everything', desc: 'Beautiful renders mean nothing if the execution is poor. We obsess over the doing, not just the designing.', sortOrder: 20, active: true },
        { id: 'accountability', num: '03.', title: 'Accountability', desc: 'When something goes wrong - and occasionally things do - we own it, fix it, and don\'t charge you for fixing our mistakes.', sortOrder: 30, active: true },
        { id: 'long-term-thinking', num: '04.', title: 'Long-Term Thinking', desc: 'We don\'t cut corners to save money on a job. We build things that last, because our reputation depends on every single home we touch.', sortOrder: 40, active: true },
        { id: 'design-integrity', num: '05.', title: 'Design Integrity', desc: 'We won\'t design something we wouldn\'t be proud to show. Every project reflects our studio\'s name, not just the client\'s brief.', sortOrder: 50, active: true },
        { id: 'people-first', num: '06.', title: 'People First', desc: 'Our clients aren\'t projects - they\'re families. We design around how you live, not how a trend board says you should.', sortOrder: 60, active: true },
      ],
      timelineIntro: {
        label: 'Our Journey',
        heading: 'How We Got Here',
      },
      timeline: [
        { id: 'established', year: '24', title: '2024, Established in Bengaluru', desc: 'Started with a focused studio team and a single belief: interior design in India needed to be more honest, more accountable, and more personal.', side: 'right', sortOrder: 10, active: true },
        { id: 'manufacturing', year: '24', title: 'In-house Manufacturing', desc: 'Built stronger control over materials, timelines, and finish quality by keeping manufacturing and execution under one accountable team.', side: 'left', sortOrder: 20, active: true },
        { id: 'warranty', year: '25', title: '10-Year Warranty Standard', desc: 'Made long-term material and workmanship confidence a core promise for every Design Dwellers Studio project.', side: 'right', sortOrder: 30, active: true },
        { id: 'brand-network', year: '25', title: 'Premium Brand Network', desc: 'Expanded our preferred material ecosystem with trusted names including Century, Action Tessa, Hettich, Greenply, and Saint-Gobain.', side: 'left', sortOrder: 40, active: true },
        { id: 'homes', year: '26', title: 'Crossed 850+ Homes', desc: 'Crossed 850 completed homes while maintaining a 4.9/5 average rating and the same hands-on accountability behind every decision.', side: 'right', sortOrder: 50, active: true },
      ],
    },
    legal: {
      label: 'Legal',
      heading: 'Terms & Conditions\nand Policy',
      companyName: COMPANY_NAME,
      gstNumber: GST_NUMBER,
      sections: [
        { id: 'general', title: '1. General', body: ['Design Dwellers Studio provides premium interior design, modular furniture, and related services.', 'All quotations, timelines, and commitments are subject to the specific project agreement shared with each client.', 'We reserve the right to update or modify these Terms at any time without prior notice.'], sortOrder: 10, active: true },
        { id: 'quotations', title: '2. Quotations & Pricing', body: ['All prices shared are initial estimates and valid for 90 days from the date of issuance.', 'Final pricing may vary based on site conditions, material selection, and design revisions.', 'Costs for electricals, wall decor, appliances, and other additional items will be provided as per actuals.'], sortOrder: 20, active: true },
        { id: 'payment', title: '3. Payment Terms', body: ['10% at the time of booking confirmation and designing.', '50% at the time of material procurement and hardware.', '35% at the time of material delivery to site.', '5% upon completion of work.', 'A non-refundable deposit of 10% is required before moving forward with design measurement and final quote.'], sortOrder: 30, active: true },
        { id: 'cancellation', title: '4. Cancellation & Refund Policy', body: ['Full refund is applicable only if cancelled before site measurements are taken.', 'Once measurements or design work has begun, no refund will be provided.', 'Project value cannot be reduced by more than 20% of the designed value at the design stage.', 'In the unlikely event we are unable to fulfill requirements due to market factors such as material unavailability, we will issue a full refund of the paid amount.'], sortOrder: 40, active: true },
        { id: 'warranty', title: '5. Warranty', body: ['All woodwork comes with a 10-year warranty against manufacturing or installation defects.', 'Accessories, hardware, and appliances are covered as per the respective manufacturer warranty policy.', 'Warranty does not cover damages caused by misuse, improper handling, or normal wear and tear.', 'Warranty will be provided exclusively for materials supplied by Design Dwellers Studio. Any materials procured directly by the client will not be covered under this warranty.'], sortOrder: 50, active: true },
        { id: 'additional-charges', title: '6. Additional Charges', body: ['Deep cleaning services are optional and range from Rs. 10,000 to Rs. 15,000 depending on property size.', 'Unloading charges are Rs. 5,000 where lift is unavailable up to the 4th floor; above the 4th floor, Rs. 1,000 applies per additional floor.', 'Wardrobe internals and handles include standard sets; customization will be chargeable.'], sortOrder: 60, active: true },
        { id: 'ip', title: '7. Intellectual Property', body: ['All designs, layouts, drawings, and content provided by Design Dwellers Studio remain our intellectual property.', 'Clients may not copy, reproduce, or share them with third parties without written consent.'], sortOrder: 70, active: true },
        { id: 'liability', title: '8. Limitation of Liability', body: ['While we ensure premium quality, we shall not be held liable for delays caused by external factors such as raw material shortages, supplier delays, or force majeure events.', 'We are not responsible for damages caused by third-party contractors hired directly by the client.'], sortOrder: 80, active: true },
        { id: 'law', title: '9. Governing Law', body: ['These Terms are governed by the laws of India, and any disputes shall be subject to the exclusive jurisdiction of the courts of Bangalore, Karnataka.'], sortOrder: 90, active: true },
      ],
    },
    updatedAt: new Date().toISOString(),
  };
}

export function normalizeSiteContentData(data: Partial<SiteContentData>): SiteContentData {
  const seed = getSeedSiteContentData();

  return {
    seo: {
      title: text(data.seo?.title, seed.seo.title),
      description: text(data.seo?.description, seed.seo.description),
      openGraphImage: cleanSrc(data.seo?.openGraphImage, seed.seo.openGraphImage),
      openGraphImageAlt: text(data.seo?.openGraphImageAlt, seed.seo.openGraphImageAlt),
      openGraphImageStorage: normalizeMediaStorage(data.seo?.openGraphImageStorage) || null,
    },
    brands: {
      title: text(data.brands?.title, seed.brands.title),
      items: (data.brands?.items || seed.brands.items)
        .map(normalizeBrand)
        .filter((item): item is BrandPartner => Boolean(item))
        .sort((a, b) => a.sortOrder - b.sortOrder),
    },
    about: {
      hero: {
        label: text(data.about?.hero?.label, seed.about.hero.label),
        heading: blockText(data.about?.hero?.heading, seed.about.hero.heading),
        subtitle: blockText(data.about?.hero?.subtitle, seed.about.hero.subtitle),
        primaryCtaLabel: text(data.about?.hero?.primaryCtaLabel, seed.about.hero.primaryCtaLabel),
        primaryCtaHref: cleanSrc(data.about?.hero?.primaryCtaHref, seed.about.hero.primaryCtaHref),
        secondaryCtaLabel: text(data.about?.hero?.secondaryCtaLabel, seed.about.hero.secondaryCtaLabel),
        secondaryCtaHref: cleanSrc(data.about?.hero?.secondaryCtaHref, seed.about.hero.secondaryCtaHref),
      },
      stats: normalizeStats(data.about?.stats?.length ? data.about.stats : seed.about.stats),
      studios: (data.about?.studios?.length ? data.about.studios : seed.about.studios)
        .map(normalizeStudio)
        .filter((item): item is AboutStudioCard => Boolean(item))
        .sort((a, b) => a.sortOrder - b.sortOrder),
      mission: {
        label: text(data.about?.mission?.label, seed.about.mission.label),
        heading: blockText(data.about?.mission?.heading, seed.about.mission.heading),
        body: blockText(data.about?.mission?.body, seed.about.mission.body),
        primaryCtaLabel: text(data.about?.mission?.primaryCtaLabel, seed.about.mission.primaryCtaLabel),
        primaryCtaHref: cleanSrc(data.about?.mission?.primaryCtaHref, seed.about.mission.primaryCtaHref),
        secondaryCtaLabel: text(data.about?.mission?.secondaryCtaLabel, seed.about.mission.secondaryCtaLabel),
        secondaryCtaHref: cleanSrc(data.about?.mission?.secondaryCtaHref, seed.about.mission.secondaryCtaHref),
        quote: blockText(data.about?.mission?.quote, seed.about.mission.quote),
        quoteAttribution: text(data.about?.mission?.quoteAttribution, seed.about.mission.quoteAttribution),
      },
      teamIntro: {
        label: text(data.about?.teamIntro?.label, seed.about.teamIntro.label),
        heading: blockText(data.about?.teamIntro?.heading, seed.about.teamIntro.heading),
        subtitle: blockText(data.about?.teamIntro?.subtitle, seed.about.teamIntro.subtitle),
      },
      teamMembers: (data.about?.teamMembers?.length ? data.about.teamMembers : seed.about.teamMembers)
        .map(normalizeTeamMember)
        .filter((item): item is AboutTeamMember => Boolean(item))
        .sort((a, b) => a.sortOrder - b.sortOrder),
      valuesIntro: {
        label: text(data.about?.valuesIntro?.label, seed.about.valuesIntro.label),
        heading: blockText(data.about?.valuesIntro?.heading, seed.about.valuesIntro.heading),
        subtitle: blockText(data.about?.valuesIntro?.subtitle, seed.about.valuesIntro.subtitle),
      },
      values: (data.about?.values?.length ? data.about.values : seed.about.values)
        .map(normalizeValue)
        .filter((item): item is AboutValue => Boolean(item))
        .sort((a, b) => a.sortOrder - b.sortOrder),
      timelineIntro: {
        label: text(data.about?.timelineIntro?.label, seed.about.timelineIntro.label),
        heading: blockText(data.about?.timelineIntro?.heading, seed.about.timelineIntro.heading),
      },
      timeline: (data.about?.timeline?.length ? data.about.timeline : seed.about.timeline)
        .map(normalizeTimeline)
        .filter((item): item is AboutTimelineItem => Boolean(item))
        .sort((a, b) => a.sortOrder - b.sortOrder),
    },
    legal: {
      label: text(data.legal?.label, seed.legal.label),
      heading: blockText(data.legal?.heading, seed.legal.heading),
      companyName: text(data.legal?.companyName, seed.legal.companyName),
      gstNumber: text(data.legal?.gstNumber, seed.legal.gstNumber),
      sections: (data.legal?.sections?.length ? data.legal.sections : seed.legal.sections)
        .map(normalizeLegalSection)
        .filter((item): item is LegalSection => Boolean(item))
        .sort((a, b) => a.sortOrder - b.sortOrder),
    },
    updatedAt: data.updatedAt || new Date().toISOString(),
  };
}

export async function getSiteContentData(): Promise<SiteContentData> {
  try {
    if (shouldUseBlobCrmStorage()) {
      const content = await readCrmBlobText(BLOB_CONTENT_FILE);
      return content ? normalizeSiteContentData(JSON.parse(content) as SiteContentData) : normalizeSiteContentData(getSeedSiteContentData());
    }

    const content = await fs.readFile(CONTENT_FILE, 'utf8');
    return normalizeSiteContentData(JSON.parse(content) as SiteContentData);
  } catch {
    return normalizeSiteContentData(getSeedSiteContentData());
  }
}

export async function saveSiteContentData(data: SiteContentData) {
  const nextData = normalizeSiteContentData({
    ...data,
    updatedAt: new Date().toISOString(),
  });
  const content = `${JSON.stringify(nextData, null, 2)}\n`;

  if (shouldUseBlobCrmStorage()) {
    await writeCrmBlobText(BLOB_CONTENT_FILE, content);
    return nextData;
  }

  await ensureDataDir();
  await fs.writeFile(CONTENT_FILE, content, 'utf8');
  return nextData;
}

export function getActiveBrandPartners(data: SiteContentData) {
  return data.brands.items.filter((item) => item.active).sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getActiveAboutStudios(about: AboutPageContent) {
  return about.studios.filter((item) => item.active).sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getActiveAboutValues(about: AboutPageContent) {
  return about.values.filter((item) => item.active).sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getActiveAboutTeamMembers(about: AboutPageContent) {
  return about.teamMembers.filter((item) => item.active).sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getActiveAboutTimeline(about: AboutPageContent) {
  return about.timeline.filter((item) => item.active).sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getActiveLegalSections(legal: LegalContent) {
  return legal.sections.filter((item) => item.active).sort((a, b) => a.sortOrder - b.sortOrder);
}

function safePathPart(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90) || 'content';
}

function uploadExtension(file: File) {
  if (file.type === 'image/png') return 'png';
  if (file.type === 'image/webp') return 'webp';
  if (file.type === 'image/gif') return 'gif';

  return 'jpg';
}

export function getContentImageUploadError(file: File | null | undefined) {
  const validationError = getUploadValidationErrorForFile(file);

  if (validationError) {
    return validationError;
  }

  if (file && !file.type.startsWith('image/')) {
    return 'Upload must be an image file.';
  }

  return null;
}

export async function saveUploadedContentImage(file: File | null | undefined, namespace: string) {
  if (!file || file.size === 0) {
    return null;
  }

  const uploadError = getContentImageUploadError(file);

  if (uploadError) {
    throw new Error(uploadError);
  }

  await ensureContentUploadDir();
  const extension = uploadExtension(file);
  const base = safePathPart(file.name.replace(/\.[^.]+$/, ''));
  const filename = `${Date.now()}-${safePathPart(namespace)}-${base}.${extension}`;
  const filePath = path.join(CONTENT_UPLOAD_DIR, filename);
  const buffer = Buffer.from(await file.arrayBuffer());

  await fs.writeFile(filePath, buffer);
  return `${PUBLIC_CONTENT_UPLOAD_PATH}/${filename}`;
}
