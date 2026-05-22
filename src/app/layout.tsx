import type { Metadata } from "next";
import { Poiret_One, Josefin_Sans, Acme } from "next/font/google";
import "./globals.css";
import ClientProviders from "@/components/ClientProviders";
import { Analytics } from "@vercel/analytics/next";
import { getSiteContentData } from "@/lib/content-store";

const poiretOne = Poiret_One({
  variable: "--font-poiret",
  subsets: ["latin"],
  weight: ["400"],
});

const josefinSans = Josefin_Sans({
  variable: "--font-josefin",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
});

const acme = Acme({
  variable: "--font-acme",
  subsets: ["latin"],
  weight: ["400"],
});

function getMetadataBase() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
    || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '')
    || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '')
    || 'http://localhost:3000';

  return new URL(siteUrl);
}

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContentData();

  return {
    metadataBase: getMetadataBase(),
    title: content.seo.title,
    description: content.seo.description,
    openGraph: {
      title: content.seo.title,
      description: content.seo.description,
      images: content.seo.openGraphImage
        ? [{ url: content.seo.openGraphImage, alt: content.seo.openGraphImageAlt }]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: content.seo.title,
      description: content.seo.description,
      images: content.seo.openGraphImage ? [content.seo.openGraphImage] : undefined,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poiretOne.variable} ${josefinSans.variable} ${acme.variable} antialiased`}
        style={{ fontFamily: "var(--font-josefin), system-ui, sans-serif" }}
      >
        <ClientProviders>{children}</ClientProviders>
        <Analytics />
      </body>
    </html>
  );
}
