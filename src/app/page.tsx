'use client';
import { useEffect } from 'react';
import Hero from "@/components/Hero";
import GlowEffects from "@/components/GlowEffects";
import TrustBadges from "@/components/TrustBadges";
import Stats from "@/components/Stats";
import Services from "@/components/Services";
import TopBrands from "@/components/TopBrands";
import Portfolio from "@/components/Portfolio";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import InstagramSection from "@/components/Instagram";
import FAQ from "@/components/FAQ";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import { useConsultation } from "@/context/ConsultationContext";

export default function Home() {
  const { open } = useConsultation();

  useEffect(() => {
    open();
  }, [open]);

  return (
    <main className="min-h-screen" style={{ background: '#141300', position: 'relative', overflow: 'hidden', zIndex: 0 }}>
      {/* Background glows */}
      <GlowEffects glows={[
        { top: 3318, left: -5, width: 1440, height: 985 },
      ]} />
      {/* Foreground glows (above content, subtle overlay) */}
      <GlowEffects glows={[
        { top: -254, left: 1076, width: 628, height: 633 },
        { top: 549, left: -169, width: 628, height: 628 },
        { top: 1256, left: -41, width: 1519, height: 480 },
        { top: 4550, left: 981, width: 628, height: 628 },
        { top: 5633, left: 356, width: 628, height: 628 },
        { top: 6421, left: 1096, width: 628, height: 628 },
      ]} zIndex={2} />
      <Hero />
      <TrustBadges />
      <Stats />
      <Services />
      <TopBrands />
      <Portfolio />
      <HowItWorks />
      <Testimonials />
      <InstagramSection />
      <FAQ />
      <ContactForm />
      <Footer />
    </main>
  );
}
