'use client';
import { ConsultationProvider } from '@/context/ConsultationContext';
import ConsultationCard from '@/components/ConsultationCard';
import TopBanner from '@/components/TopBanner';
import Navbar from '@/components/Navbar';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ConsultationProvider>
      <TopBanner />
      <Navbar />
      <div style={{ position: 'relative' }}>
        {children}
        <ConsultationCard />
      </div>
    </ConsultationProvider>
  );
}
