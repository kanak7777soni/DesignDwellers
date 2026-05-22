'use client';

import { useEffect } from 'react';
import { useConsultation } from '@/context/ConsultationContext';

export default function HomeConsultationAutoOpen() {
  const { open } = useConsultation();

  useEffect(() => {
    if (window.matchMedia('(max-width: 767px)').matches) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      open();
    });

    return () => window.cancelAnimationFrame(frame);
  }, [open]);

  return null;
}
