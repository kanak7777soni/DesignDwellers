import { NextResponse } from 'next/server';
import {
  getPortfolioData,
  getPublishedProjectsFromData,
  getVisibleCategoriesFromData,
} from '@/lib/portfolio-store';

export const dynamic = 'force-dynamic';

export async function GET() {
  const data = await getPortfolioData();

  return NextResponse.json({
    ...data,
    categories: getVisibleCategoriesFromData(data),
    projects: getPublishedProjectsFromData(data),
  }, {
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}
