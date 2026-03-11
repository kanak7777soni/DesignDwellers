'use client';
import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

const ConsultationContext = createContext<{
  isOpen: boolean;
  open: () => void;
  close: () => void;
} | null>(null);

export function ConsultationProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  return (
    <ConsultationContext.Provider value={{ isOpen, open, close }}>
      {children}
    </ConsultationContext.Provider>
  );
}

export function useConsultation() {
  const ctx = useContext(ConsultationContext);
  // Return a no-op fallback when used outside of ConsultationProvider
  if (!ctx) return { isOpen: false, open: () => {}, close: () => {} };
  return ctx;
}
