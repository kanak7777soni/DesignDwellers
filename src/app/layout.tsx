import type { Metadata } from "next";
import { Poiret_One, Josefin_Sans, Acme } from "next/font/google";
import "./globals.css";
import ClientProviders from "@/components/ClientProviders";

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

export const metadata: Metadata = {
  title: "Design Dwellers Studio | Premium Interior Design",
  description:
    "Transform your space with Design Dwellers Studio. Premium interior design services with 8+ years of experience, 5000+ homes delivered, and 100% on-time completion.",
};

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
      </body>
    </html>
  );
}
