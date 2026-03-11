'use client';
import { ConsultationProvider } from '@/context/ConsultationContext';
import ConsultationCard from '@/components/ConsultationCard';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ConsultationProvider>
      {children}
      <ConsultationCard />
    </ConsultationProvider>
  );
}
