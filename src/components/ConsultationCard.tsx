'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useConsultation } from '@/context/ConsultationContext';

export default function ConsultationCard() {
  const { isOpen, close } = useConsultation();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    propertyType: '',
    budgetRange: '',
    vision: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (!isOpen) return null;

  return (
    <div
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
      {/* Close X */}
      <button
        onClick={close}
        className="absolute"
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

      {/* Form title */}
      <p
        className="font-heading"
        style={{ fontSize: '16px', lineHeight: '1.17em', color: '#FFFFFF', marginBottom: '20px' }}
      >
        Book Your Free Design Consultation
      </p>

      <form className="flex flex-col gap-[19px]" onSubmit={(e) => e.preventDefault()}>
        {/* Name */}
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
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

        {/* Phone */}
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
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

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="E-mail"
          value={formData.email}
          onChange={handleChange}
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

        {/* Property type + Budget row */}
        <div className="flex gap-[15px]">
          <div className="relative" style={{ width: '145px' }}>
            <select
              name="propertyType"
              value={formData.propertyType}
              onChange={handleChange}
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
                cursor: 'pointer',
              }}
            >
              <option value="">Property type</option>
              <option value="apartment">Apartment</option>
              <option value="villa">Villa</option>
              <option value="house">Independent House</option>
              <option value="penthouse">Penthouse</option>
            </select>
            <Image src="/images/chevron-down.svg" alt="" width={9} height={4} className="absolute pointer-events-none" style={{ right: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          </div>
          <div className="relative" style={{ width: '145px' }}>
            <select
              name="budgetRange"
              value={formData.budgetRange}
              onChange={handleChange}
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
                cursor: 'pointer',
              }}
            >
              <option value="">Budget Range</option>
              <option value="5-10">₹5-10 Lakhs</option>
              <option value="10-20">₹10-20 Lakhs</option>
              <option value="20-50">₹20-50 Lakhs</option>
              <option value="50+">₹50+ Lakhs</option>
            </select>
            <Image src="/images/chevron-down.svg" alt="" width={9} height={4} className="absolute pointer-events-none" style={{ right: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          </div>
        </div>

        {/* Vision textarea */}
        <textarea
          name="vision"
          placeholder="Tell us about your vision"
          value={formData.vision}
          onChange={handleChange}
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

        {/* Submit button */}
        <button
          type="submit"
          className="font-heading w-full flex items-center justify-center cursor-pointer"
          style={{
            height: '32px',
            background: '#FFFFFF',
            borderRadius: '16px',
            border: 'none',
            fontSize: '13px',
            lineHeight: '1.17em',
            color: '#000000',
          }}
        >
          Claim your free consultation
        </button>
      </form>

      {/* Disclaimer */}
      <p
        className="font-body text-center"
        style={{ fontSize: '8px', fontWeight: 700, lineHeight: '1em', color: '#FFFFFF', marginTop: '8px' }}
      >
        100% free · No spam · No obligation whatsoever
      </p>
    </div>
  );
}
