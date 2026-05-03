'use client';

import { useCallback, useState } from 'react';

export type ConsultationFormPayload = {
  name?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  propertyType?: string;
  budgetRange?: string;
  vision?: string;
  projectScope?: string;
  city?: string;
  source?: string;
  company?: string;
  formStartedAt?: string;
};

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function formValue(formData: FormData, key: string) {
  return String(formData.get(key) || '').trim();
}

function clientValidationMessage(payload: ConsultationFormPayload) {
  const name = payload.name?.trim() || [payload.firstName, payload.lastName].filter(Boolean).join(' ').trim();
  const phone = payload.phone?.trim() || '';
  const email = payload.email?.trim() || '';
  const propertyType = payload.propertyType?.trim() || '';
  const budgetRange = payload.budgetRange?.trim() || '';

  if (name.length < 2) {
    return 'Please enter your name.';
  }

  if (phone.replace(/\D/g, '').length < 10) {
    return 'Please enter a valid phone number.';
  }

  if (!EMAIL_PATTERN.test(email)) {
    return 'Please enter a valid email address.';
  }

  if (!propertyType || propertyType.toLowerCase() === 'property type') {
    return 'Please select a property type.';
  }

  if (!budgetRange || budgetRange.toLowerCase() === 'budget range') {
    return 'Please select a budget range.';
  }

  return null;
}

export function consultationPayloadFromForm(
  form: HTMLFormElement,
  extras: Partial<ConsultationFormPayload> = {},
): ConsultationFormPayload {
  const formData = new FormData(form);

  return {
    name: formValue(formData, 'name'),
    firstName: formValue(formData, 'firstName'),
    lastName: formValue(formData, 'lastName'),
    phone: formValue(formData, 'phone'),
    email: formValue(formData, 'email'),
    propertyType: formValue(formData, 'propertyType'),
    budgetRange: formValue(formData, 'budgetRange'),
    vision: formValue(formData, 'vision'),
    company: formValue(formData, 'company'),
    ...extras,
  };
}

export function useConsultationSubmission() {
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [message, setMessage] = useState<string | null>(null);
  const [formStartedAt] = useState(() => Date.now());

  const submit = useCallback(async (payload: ConsultationFormPayload) => {
    const nextPayload = {
      ...payload,
      formStartedAt: payload.formStartedAt || String(formStartedAt),
    };
    const validationMessage = clientValidationMessage(nextPayload);

    if (validationMessage) {
      setStatus('error');
      setMessage(validationMessage);
      return false;
    }

    setStatus('submitting');
    setMessage(null);

    try {
      const response = await fetch('/api/consultation', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify(nextPayload),
      });
      const result = await response.json().catch(() => ({})) as { message?: string };

      if (!response.ok) {
        throw new Error(result.message || 'We could not send your request. Please try again.');
      }

      setStatus('success');
      setMessage(result.message || 'Thank you. Our designer will contact you shortly.');
      return true;
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'We could not send your request. Please try again.');
      return false;
    }
  }, [formStartedAt]);

  return {
    formStartedAt,
    isSubmitting: status === 'submitting',
    message,
    status,
    submit,
  };
}
