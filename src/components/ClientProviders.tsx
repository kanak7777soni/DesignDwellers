'use client';
import { usePathname } from 'next/navigation';
import { ConsultationProvider } from '@/context/ConsultationContext';
import ConsultationCard from '@/components/ConsultationCard';
import TopBanner from '@/components/TopBanner';
import Navbar from '@/components/Navbar';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname.startsWith('/admin')) {
    return <>{children}</>;
  }

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
