'use client';

import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useConsultation } from '@/context/ConsultationContext';
import { consultationPayloadFromForm, useConsultationSubmission } from '@/hooks/useConsultationSubmission';

const emptyFormData = {
  name: '',
  phone: '',
  email: '',
  propertyType: '',
  budgetRange: '',
  vision: '',
};

export default function ConsultationCard() {
  const { isOpen, close } = useConsultation();
  const pathname = usePathname();
  const { isSubmitting, message, status, submit } = useConsultationSubmission();
  const [formData, setFormData] = useState(emptyFormData);

  useEffect(() => {
    if (pathname !== '/') {
      close();
    }
  }, [pathname, close]);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const ok = await submit(consultationPayloadFromForm(event.currentTarget, {
      source: 'Home page popup',
    }));

    if (ok) {
      setFormData(emptyFormData);
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: -30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: -30 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          style={{
            position: 'absolute',
            right: '72px',
            top: '178px',
            width: '354px',
            background: '#D7A648',
            borderRadius: '16px',
            padding: '36px 25px 20px',
            zIndex: 40,
          }}
        >
          <button
            onClick={close}
            className="absolute"
            aria-label="Close consultation form"
            style={{
              top: '16px',
              right: '20px',
              background: 'none',
              border: 'none',
              color: '#FFFFFF',
              fontSize: '18px',
              cursor: 'pointer',
              fontFamily: 'var(--font-acme), sans-serif',
            }}
          >
            X
          </button>

          <p
            className="font-heading"
            style={{ fontSize: '16px', lineHeight: '1.17em', color: '#FFFFFF', marginBottom: '20px' }}
          >
            Book Your Free Design Consultation
          </p>

          <form className="flex flex-col gap-[19px]" onSubmit={handleSubmit}>
            <input
              type="text"
              name="company"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              style={{ position: 'absolute', left: '-10000px', width: '1px', height: '1px', opacity: 0 }}
            />

            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
              maxLength={100}
              autoComplete="name"
              disabled={isSubmitting}
              className="font-body"
              style={{
                width: '100%',
                height: '32px',
                background: '#FFFFFF',
                borderRadius: '16px',
                border: 'none',
                padding: '0 17px',
                fontSize: '13px',
                color: '#000000',
                outline: 'none',
              }}
            />

            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
              maxLength={24}
              autoComplete="tel"
              disabled={isSubmitting}
              className="font-body"
              style={{
                width: '100%',
                height: '32px',
                background: '#FFFFFF',
                borderRadius: '16px',
                border: 'none',
                padding: '0 17px',
                fontSize: '13px',
                color: '#000000',
                outline: 'none',
              }}
            />

            <input
              type="email"
              name="email"
              placeholder="E-mail"
              value={formData.email}
              onChange={handleChange}
              required
              maxLength={120}
              autoComplete="email"
              disabled={isSubmitting}
              className="font-body"
              style={{
                width: '100%',
                height: '32px',
                background: '#FFFFFF',
                borderRadius: '16px',
                border: 'none',
                padding: '0 18px',
                fontSize: '13px',
                color: '#000000',
                outline: 'none',
              }}
            />

            <div className="flex gap-[15px]">
              <div className="relative" style={{ width: '145px' }}>
                <select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  className="font-body"
                  style={{
                    width: '100%',
                    height: '32px',
                    background: '#FFFFFF',
                    borderRadius: '16px',
                    border: 'none',
                    padding: '0 18px',
                    fontSize: '13px',
                    color: '#000000',
                    outline: 'none',
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    cursor: isSubmitting ? 'wait' : 'pointer',
                  }}
                >
                  <option value="">Property type</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Villa">Villa</option>
                  <option value="Independent House">Independent House</option>
                  <option value="Penthouse">Penthouse</option>
                </select>
                <Image src="/images/chevron-down.svg" alt="" width={9} height={4} className="absolute pointer-events-none" style={{ right: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
              <div className="relative" style={{ width: '145px' }}>
                <select
                  name="budgetRange"
                  value={formData.budgetRange}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  className="font-body"
                  style={{
                    width: '100%',
                    height: '32px',
                    background: '#FFFFFF',
                    borderRadius: '16px',
                    border: 'none',
                    padding: '0 16px',
                    fontSize: '13px',
                    color: '#000000',
                    outline: 'none',
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    cursor: isSubmitting ? 'wait' : 'pointer',
                  }}
                >
                  <option value="">Budget Range</option>
                  <option value="Rs. 5-10 Lakhs">Rs. 5-10 Lakhs</option>
                  <option value="Rs. 10-20 Lakhs">Rs. 10-20 Lakhs</option>
                  <option value="Rs. 20-50 Lakhs">Rs. 20-50 Lakhs</option>
                  <option value="Rs. 50+ Lakhs">Rs. 50+ Lakhs</option>
                </select>
                <Image src="/images/chevron-down.svg" alt="" width={9} height={4} className="absolute pointer-events-none" style={{ right: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <textarea
              name="vision"
              placeholder="Tell us about your vision"
              value={formData.vision}
              onChange={handleChange}
              maxLength={1000}
              disabled={isSubmitting}
              className="font-body"
              style={{
                width: '100%',
                height: '116px',
                background: '#FFFFFF',
                borderRadius: '16px',
                border: 'none',
                padding: '13px 18px',
                fontSize: '13px',
                color: '#000000',
                outline: 'none',
                resize: 'none',
              }}
            />

            <button
              type="submit"
              className="font-heading w-full flex items-center justify-center cursor-pointer"
              disabled={isSubmitting}
              style={{
                height: '32px',
                background: '#FFFFFF',
                borderRadius: '16px',
                border: 'none',
                fontSize: '13px',
                lineHeight: '1.17em',
                color: '#000000',
                opacity: isSubmitting ? 0.72 : 1,
              }}
            >
              {isSubmitting ? 'Sending...' : 'Claim your free consultation'}
            </button>

            {message ? (
              <p
                className="font-body text-center"
                aria-live={status === 'error' ? 'assertive' : 'polite'}
                style={{ fontSize: '10px', fontWeight: 700, lineHeight: '1.25em', color: '#FFFFFF', marginTop: '-8px' }}
              >
                {message}
              </p>
            ) : null}
          </form>

          <p
            className="font-body text-center"
            style={{ fontSize: '8px', fontWeight: 700, lineHeight: '1em', color: '#FFFFFF', marginTop: '8px' }}
          >
            100% free - No spam - No obligation whatsoever
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
