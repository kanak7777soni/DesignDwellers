'use client';

import type { FormEvent } from 'react';
import { consultationPayloadFromForm, useConsultationSubmission } from '@/hooks/useConsultationSubmission';
import { WHATSAPP_URL } from '@/lib/site-content';

type ContactPageConsultationFormProps = {
  selectedCity: string;
  selectedType: string;
};

const inputStyle = {
  background: '#FFFFFF',
  borderRadius: '16px',
  padding: '8px 17px',
  fontSize: '13px',
  lineHeight: '1em',
  color: '#000000',
  border: 'none',
  height: '32px',
  outline: 'none',
};

const buttonStyle = {
  background: '#141300',
  borderRadius: '55px',
  height: '30px',
  padding: '0 20px',
  fontSize: '13px',
  lineHeight: '1.17em',
  color: '#FFFFFF',
  border: 'none',
  cursor: 'pointer',
};

export default function ContactPageConsultationForm({
  selectedCity,
  selectedType,
}: ContactPageConsultationFormProps) {
  const { isSubmitting, message, status, submit } = useConsultationSubmission();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const ok = await submit(consultationPayloadFromForm(form, {
      city: selectedCity,
      projectScope: selectedType,
      source: 'Contact page consultation form',
    }));

    if (ok) {
      form.reset();
    }
  }

  return (
    <form
      className="contact-page-form"
      onSubmit={handleSubmit}
      style={{
        background: '#D7A648',
        borderRadius: '22px',
        padding: '24px 25px',
        width: '677px',
      }}
    >
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: 'absolute', left: '-10000px', width: '1px', height: '1px', opacity: 0 }}
      />

      <span className="font-heading" style={{ fontSize: '16px', lineHeight: '1.17em', color: '#FFFFFF', WebkitTextStroke: '0.5px #FFFFFF', display: 'block', marginBottom: '12px' }}>
        Book Your Free Design Consultation
      </span>

      <div className="grid grid-cols-2 gap-[19px]" style={{ marginBottom: '16px' }}>
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          required
          maxLength={50}
          autoComplete="given-name"
          disabled={isSubmitting}
          className="font-body"
          style={inputStyle}
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          maxLength={50}
          autoComplete="family-name"
          disabled={isSubmitting}
          className="font-body"
          style={inputStyle}
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          required
          maxLength={24}
          autoComplete="tel"
          disabled={isSubmitting}
          className="font-body"
          style={inputStyle}
        />
        <input
          type="email"
          name="email"
          placeholder="E-mail"
          required
          maxLength={120}
          autoComplete="email"
          disabled={isSubmitting}
          className="font-body"
          style={inputStyle}
        />
        <div className="relative">
          <select
            name="propertyType"
            required
            defaultValue=""
            disabled={isSubmitting}
            className="font-body w-full appearance-none"
            style={inputStyle}
          >
            <option value="" disabled>Property type</option>
            <option value="Apartment">Apartment</option>
            <option value="Villa">Villa</option>
            <option value="Independent House">Independent House</option>
            <option value="Penthouse">Penthouse</option>
          </select>
        </div>
        <div className="relative">
          <select
            name="budgetRange"
            required
            defaultValue=""
            disabled={isSubmitting}
            className="font-body w-full appearance-none"
            style={inputStyle}
          >
            <option value="" disabled>Budget Range</option>
            <option value="Rs. 5L - Rs. 10L">Rs. 5L - Rs. 10L</option>
            <option value="Rs. 10L - Rs. 20L">Rs. 10L - Rs. 20L</option>
            <option value="Rs. 20L+">Rs. 20L+</option>
          </select>
        </div>
      </div>

      <textarea
        name="vision"
        placeholder="Tell us about your vision"
        maxLength={1000}
        disabled={isSubmitting}
        className="font-body w-full"
        style={{
          ...inputStyle,
          height: '116px',
          resize: 'none',
          marginBottom: '12px',
          lineHeight: '1.25em',
        }}
      />

      <p className="font-body text-center" style={{ fontSize: '8px', lineHeight: '1em', color: '#FFFFFF', fontWeight: 700, marginBottom: '12px' }}>
        100% free - No spam - No obligation whatsoever
      </p>

      <div className="flex items-center gap-[20px]">
        <button
          type="submit"
          disabled={isSubmitting}
          className="font-heading flex items-center justify-center"
          style={{ ...buttonStyle, opacity: isSubmitting ? 0.72 : 1, cursor: isSubmitting ? 'wait' : 'pointer' }}
        >
          {isSubmitting ? 'Sending...' : 'Claim your free consultation'}
        </button>
        <button
          type="button"
          className="font-heading flex items-center justify-center"
          style={buttonStyle}
          onClick={() => window.open(WHATSAPP_URL, '_blank', 'noopener,noreferrer')}
        >
          Whatsapp Us Directly
        </button>
      </div>

      {message ? (
        <p
          className="font-body text-center"
          aria-live={status === 'error' ? 'assertive' : 'polite'}
          style={{ fontSize: '12px', lineHeight: '1.25em', color: '#FFFFFF', fontWeight: 700, marginTop: '12px' }}
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
