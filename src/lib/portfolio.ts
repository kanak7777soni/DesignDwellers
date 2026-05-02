import type { MediaStorageMetadata } from '@/lib/media-storage';

export type PortfolioCategory = {
  slug: string;
  label: string;
  sortOrder: number;
  visibleInFilters: boolean;
};

export type ProjectMedia = {
  id: string;
  type: 'image' | 'video';
  src: string;
  alt: string;
  poster?: string;
  storage?: MediaStorageMetadata;
  posterStorage?: MediaStorageMetadata;
};

export type ProjectStat = {
  value: string;
  label: string;
};

export type ProjectMeta = {
  projectType?: string;
  location?: string;
  city?: string;
  area?: string;
  duration?: string;
  budget?: string;
  year?: string;
  style?: string;
  services?: string[];
  materials?: string[];
  clientBrief?: string;
};

export type ProjectSeo = {
  title?: string;
  description?: string;
  image?: string;
  imageStorage?: MediaStorageMetadata;
};

export type PortfolioProject = {
  id: string;
  slug: string;
  name: string;
  details: string;
  primaryCategorySlug: string;
  categorySlugs: string[];
  cardMedia: ProjectMedia;
  featuredMedia?: ProjectMedia;
  portfolioOrder: number;
  featuredOrder?: number;
  published: boolean;
  meta?: ProjectMeta;
  seo?: ProjectSeo;
  detail: {
    heroMedia: ProjectMedia[];
    stats: ProjectStat[];
    description: string;
    galleryMedia: ProjectMedia[];
  };
};

export type PortfolioData = {
  categories: PortfolioCategory[];
  projects: PortfolioProject[];
  updatedAt: string;
};

export const portfolioCategories: PortfolioCategory[] = [
  { slug: 'living-room', label: 'Living Room', sortOrder: 10, visibleInFilters: true },
  { slug: 'bedroom', label: 'BedRoom', sortOrder: 20, visibleInFilters: true },
  { slug: 'kitchen', label: 'Kitchen', sortOrder: 30, visibleInFilters: true },
  { slug: 'full-home', label: 'Full Home', sortOrder: 40, visibleInFilters: true },
  { slug: 'luxury', label: 'Luxury', sortOrder: 50, visibleInFilters: true },
  { slug: 'other', label: 'Other', sortOrder: 60, visibleInFilters: true },
];

const mehtaGallery: ProjectMedia[] = [
  '/images/individual-gallery-6.png',
  '/images/individual-gallery-1.png',
  '/images/individual-gallery-11.png',
  '/images/individual-gallery-7.png',
  '/images/individual-gallery-2.png',
  '/images/individual-gallery-12.png',
  '/images/individual-gallery-8.png',
  '/images/individual-gallery-3.png',
  '/images/individual-gallery-13.png',
  '/images/individual-gallery-9.png',
  '/images/individual-gallery-4.png',
  '/images/individual-gallery-14.png',
  '/images/individual-gallery-10.png',
  '/images/individual-gallery-5.png',
  '/images/individual-gallery-15.png',
].map((src, index) => ({
  id: `mehta-gallery-${index + 1}`,
  type: 'image' as const,
  src,
  alt: `The Mehta Residence gallery image ${index + 1}`,
}));

const defaultStats: ProjectStat[] = [
  { value: '2500', label: 'Sq Ft' },
  { value: '42', label: 'Days' },
  { value: 'Rs. 22L', label: 'Budget' },
];

const defaultDescription =
  'A complete home transformation for the Mehta family in Whitefield. The brief was clear: a contemporary home with warmth - something that felt luxurious without feeling cold. We used a palette of warm oak, brushed brass, and textured plaster across all 4 rooms, creating visual continuity throughout the home. The modular kitchen was a highlight - a full 14-foot run in matte white with gold hardware and a quartz waterfall island.';

function imageMedia(id: string, src: string, alt: string): ProjectMedia {
  return {
    id,
    type: 'image',
    src,
    alt,
  };
}

function projectDetail(overrides?: Partial<PortfolioProject['detail']>): PortfolioProject['detail'] {
  return {
    heroMedia: [
      imageMedia('hero-left', '/images/individual-hero-left.png', 'The Mehta Residence - View 1'),
      imageMedia('hero-right', '/images/individual-hero-right.png', 'The Mehta Residence - View 2'),
    ],
    stats: defaultStats,
    description: defaultDescription,
    galleryMedia: mehtaGallery,
    ...overrides,
  };
}

export const portfolioProjects: PortfolioProject[] = [
  {
    id: 'the-mehta-residence-featured',
    slug: 'the-mehta-residence',
    name: 'The Mehta Residence',
    details: 'Full Home · Whitefield, Bangalore · 2500 sq ft · 42 days',
    primaryCategorySlug: 'full-home',
    categorySlugs: ['full-home', 'luxury'],
    cardMedia: imageMedia('mehta-card-featured', '/images/portfolio-grid-5.png', 'The Mehta Residence'),
    featuredMedia: imageMedia('mehta-home-card', '/images/portfolio-3.png', 'The Mehta Residence'),
    portfolioOrder: 10,
    featuredOrder: 10,
    published: true,
    detail: projectDetail(),
  },
  {
    id: 'corvids-office',
    slug: 'corvids-office',
    name: 'Corvids Office',
    details: 'Office · Koramangala, Bangalore',
    primaryCategorySlug: 'other',
    categorySlugs: ['other'],
    cardMedia: imageMedia('corvids-card', '/images/portfolio-grid-7.png', 'Corvids Office'),
    featuredMedia: imageMedia('corvids-home-card', '/images/portfolio-5.png', 'Corvids Office'),
    portfolioOrder: 20,
    featuredOrder: 20,
    published: true,
    detail: projectDetail({
      heroMedia: [
        imageMedia('corvids-hero-left', '/images/portfolio-grid-7.png', 'Corvids Office - View 1'),
        imageMedia('corvids-hero-right', '/images/portfolio-grid-12.png', 'Corvids Office - View 2'),
      ],
    }),
  },
  {
    id: 'reddy-homes-living',
    slug: 'reddy-homes-living',
    name: 'Reddy Homes',
    details: 'Living & Dining · Koramangala, Bangalore',
    primaryCategorySlug: 'living-room',
    categorySlugs: ['living-room'],
    cardMedia: imageMedia('reddy-living-card', '/images/portfolio-grid-9.png', 'Reddy Homes living and dining'),
    featuredMedia: imageMedia('reddy-living-home-card', '/images/portfolio-6.png', 'Reddy Homes living and dining'),
    portfolioOrder: 30,
    featuredOrder: 60,
    published: true,
    detail: projectDetail(),
  },
  {
    id: 'sharma-living',
    slug: 'sharma-living',
    name: 'Sharma Living',
    details: 'Living Room · Koramangala, Bangalore',
    primaryCategorySlug: 'living-room',
    categorySlugs: ['living-room'],
    cardMedia: imageMedia('sharma-living-card', '/images/portfolio-grid-3.png', 'Sharma Living'),
    featuredMedia: imageMedia('sharma-home-card', '/images/portfolio-1.png', 'Sharma Living'),
    portfolioOrder: 40,
    featuredOrder: 40,
    published: true,
    detail: projectDetail(),
  },
  {
    id: 'kumar-residence',
    slug: 'kumar-residence',
    name: 'Kumar Residence',
    details: 'Bedroom · HITEC City, Hyderabad',
    primaryCategorySlug: 'bedroom',
    categorySlugs: ['bedroom', 'luxury'],
    cardMedia: imageMedia('kumar-card', '/images/portfolio-grid-4.png', 'Kumar Residence bedroom'),
    featuredMedia: imageMedia('kumar-home-card', '/images/portfolio-2.png', 'Kumar Residence bedroom'),
    portfolioOrder: 50,
    featuredOrder: 50,
    published: true,
    detail: projectDetail(),
  },
  {
    id: 'reddy-homes-kitchen',
    slug: 'reddy-homes-kitchen',
    name: 'Reddy Homes',
    details: 'Kitchen & Dining · Koramangala, Bangalore',
    primaryCategorySlug: 'kitchen',
    categorySlugs: ['kitchen'],
    cardMedia: imageMedia('reddy-kitchen-card', '/images/portfolio-grid-11.png', 'Reddy Homes kitchen and dining'),
    featuredMedia: imageMedia('reddy-kitchen-home-card', '/images/portfolio-4.png', 'Reddy Homes kitchen and dining'),
    portfolioOrder: 60,
    featuredOrder: 30,
    published: true,
    detail: projectDetail(),
  },
  {
    id: 'the-mehta-residence-feature',
    slug: 'the-mehta-residence-feature',
    name: 'The Mehta Residence',
    details: 'Full Home · Whitefield, Bangalore · 2500 sq ft · 42 days',
    primaryCategorySlug: 'full-home',
    categorySlugs: ['full-home', 'luxury'],
    cardMedia: imageMedia('mehta-feature-card', '/images/portfolio-feature.png', 'The Mehta Residence feature'),
    portfolioOrder: 70,
    published: true,
    detail: projectDetail(),
  },
  {
    id: 'reddy-homes-dining',
    slug: 'reddy-homes-dining',
    name: 'Reddy Homes',
    details: 'Living & Dining · Koramangala, Bangalore',
    primaryCategorySlug: 'living-room',
    categorySlugs: ['living-room'],
    cardMedia: imageMedia('reddy-dining-card', '/images/portfolio-grid-1.png', 'Reddy Homes dining'),
    featuredMedia: imageMedia('reddy-dining-home-card', '/images/portfolio-6.png', 'Reddy Homes dining'),
    portfolioOrder: 80,
    published: true,
    detail: projectDetail(),
  },
  {
    id: 'reddy-homes-kitchen-2',
    slug: 'reddy-homes-kitchen-2',
    name: 'Reddy Homes',
    details: 'Kitchen & Dining · Koramangala, Bangalore',
    primaryCategorySlug: 'kitchen',
    categorySlugs: ['kitchen'],
    cardMedia: imageMedia('reddy-kitchen-2-card', '/images/portfolio-grid-10.png', 'Reddy Homes kitchen'),
    portfolioOrder: 90,
    published: true,
    detail: projectDetail(),
  },
  {
    id: 'corvids-office-2',
    slug: 'corvids-office-2',
    name: 'Corvids Office',
    details: 'Office · Koramangala, Bangalore',
    primaryCategorySlug: 'other',
    categorySlugs: ['other'],
    cardMedia: imageMedia('corvids-2-card', '/images/portfolio-grid-12.png', 'Corvids Office workspace'),
    portfolioOrder: 100,
    published: true,
    detail: projectDetail(),
  },
  {
    id: 'the-mehta-residence-2',
    slug: 'the-mehta-residence-2',
    name: 'The Mehta Residence',
    details: 'Full Home · Whitefield, Bangalore · 2500 sq ft · 42 days',
    primaryCategorySlug: 'full-home',
    categorySlugs: ['full-home', 'luxury'],
    cardMedia: imageMedia('mehta-2-card', '/images/portfolio-grid-6.png', 'The Mehta Residence interior'),
    portfolioOrder: 110,
    published: true,
    detail: projectDetail(),
  },
  {
    id: 'corvids-office-3',
    slug: 'corvids-office-3',
    name: 'Corvids Office',
    details: 'Office · Koramangala, Bangalore',
    primaryCategorySlug: 'other',
    categorySlugs: ['other'],
    cardMedia: imageMedia('corvids-3-card', '/images/portfolio-grid-8.png', 'Corvids Office meeting area'),
    portfolioOrder: 120,
    published: true,
    detail: projectDetail(),
  },
  {
    id: 'sharma-living-2',
    slug: 'sharma-living-2',
    name: 'Sharma Living',
    details: 'Living Room · Koramangala, Bangalore',
    primaryCategorySlug: 'living-room',
    categorySlugs: ['living-room'],
    cardMedia: imageMedia('sharma-living-2-card', '/images/portfolio-grid-2.png', 'Sharma Living interior'),
    portfolioOrder: 130,
    published: true,
    detail: projectDetail(),
  },
  {
    id: 'kumar-residence-2',
    slug: 'kumar-residence-2',
    name: 'Kumar Residence',
    details: 'Bedroom · HITEC City, Hyderabad',
    primaryCategorySlug: 'bedroom',
    categorySlugs: ['bedroom', 'luxury'],
    cardMedia: imageMedia('kumar-2-card', '/images/portfolio-grid-3.png', 'Kumar Residence bedroom detail'),
    portfolioOrder: 140,
    published: true,
    detail: projectDetail(),
  },
  {
    id: 'reddy-homes-living-2',
    slug: 'reddy-homes-living-2',
    name: 'Reddy Homes',
    details: 'Living & Dining · Koramangala, Bangalore',
    primaryCategorySlug: 'living-room',
    categorySlugs: ['living-room'],
    cardMedia: imageMedia('reddy-living-2-card', '/images/portfolio-grid-4.png', 'Reddy Homes living area'),
    portfolioOrder: 150,
    published: true,
    detail: projectDetail(),
  },
  {
    id: 'reddy-homes-kitchen-3',
    slug: 'reddy-homes-kitchen-3',
    name: 'Reddy Homes',
    details: 'Kitchen & Dining · Koramangala, Bangalore',
    primaryCategorySlug: 'kitchen',
    categorySlugs: ['kitchen'],
    cardMedia: imageMedia('reddy-kitchen-3-card', '/images/portfolio-grid-9.png', 'Reddy Homes kitchen detail'),
    portfolioOrder: 160,
    published: true,
    detail: projectDetail(),
  },
];

export function getVisibleCategories() {
  return getVisibleCategoriesFromData(getSeedPortfolioData());
}

export function getCategoryLabel(slug: string) {
  return getCategoryLabelFromData(getSeedPortfolioData(), slug);
}

export function getPublishedProjects() {
  return getPublishedProjectsFromData(getSeedPortfolioData());
}

export function getFeaturedProjects(limit = 6) {
  return getFeaturedProjectsFromData(getSeedPortfolioData(), limit);
}

export function getProjectsByCategory(categorySlug: string) {
  return getProjectsByCategoryFromData(getSeedPortfolioData(), categorySlug);
}

export function getProjectBySlug(slug: string) {
  return getPublishedProjectsFromData(getSeedPortfolioData()).find((project) => project.slug === slug) || null;
}

export function getSeedPortfolioData(): PortfolioData {
  return {
    categories: portfolioCategories,
    projects: portfolioProjects,
    updatedAt: new Date().toISOString(),
  };
}

export function getVisibleCategoriesFromData(data: PortfolioData) {
  return data.categories
    .filter((category) => category.visibleInFilters)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getCategoryLabelFromData(data: PortfolioData, slug: string) {
  return data.categories.find((category) => category.slug === slug)?.label || slug;
}

export function getPublishedProjectsFromData(data: PortfolioData) {
  return data.projects
    .filter((project) => project.published)
    .sort((a, b) => a.portfolioOrder - b.portfolioOrder);
}

export function getFeaturedProjectsFromData(data: PortfolioData, limit = 6) {
  return getPublishedProjectsFromData(data)
    .filter((project) => typeof project.featuredOrder === 'number')
    .sort((a, b) => (a.featuredOrder ?? 0) - (b.featuredOrder ?? 0))
    .slice(0, limit);
}

export function getProjectsByCategoryFromData(data: PortfolioData, categorySlug: string) {
  if (categorySlug === 'all-projects') {
    return getPublishedProjectsFromData(data);
  }

  return getPublishedProjectsFromData(data).filter((project) => project.categorySlugs.includes(categorySlug));
}
