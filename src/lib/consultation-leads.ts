import { isIP } from 'net';
import type { NextRequest } from 'next/server';

export type ConsultationLeadInput = {
  name?: unknown;
  firstName?: unknown;
  lastName?: unknown;
  phone?: unknown;
  email?: unknown;
  propertyType?: unknown;
  budgetRange?: unknown;
  vision?: unknown;
  projectScope?: unknown;
  city?: unknown;
  source?: unknown;
  company?: unknown;
  formStartedAt?: unknown;
};

type ConsultationLead = {
  name: string;
  phone: string;
  email: string;
  propertyType: string;
  budgetRange: string;
  vision: string;
  projectScope: string | null;
  city: string | null;
  source: string;
  submittedAt: string;
};

type ValidationResult =
  | { ok: true; lead: ConsultationLead }
  | { ok: false; errors: Record<string, string> };

type RateLimitRecord = {
  count: number;
  resetAt: number;
  lastAttemptAt: number;
};

type RateLimitResult =
  | { allowed: true }
  | { allowed: false; retryAfterSeconds: number; message: string };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX_ATTEMPTS = 3;
const RATE_LIMIT_MIN_INTERVAL_MS = 20 * 1000;
const MIN_FORM_TIME_MS = 2500;
const MAX_FORM_TIME_MS = 2 * 60 * 60 * 1000;

const globalRateLimit = globalThis as typeof globalThis & {
  __designDwellersConsultationRateLimit?: Map<string, RateLimitRecord>;
};

const consultationRateLimit = globalRateLimit.__designDwellersConsultationRateLimit
  || new Map<string, RateLimitRecord>();

globalRateLimit.__designDwellersConsultationRateLimit = consultationRateLimit;

export class BrevoConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BrevoConfigurationError';
  }
}

function stringValue(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeText(value: unknown, maxLength: number) {
  return stringValue(value).replace(/\s+/g, ' ').slice(0, maxLength).trim();
}

function normalizeMultiline(value: unknown, maxLength: number) {
  return stringValue(value)
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{4,}/g, '\n\n\n')
    .slice(0, maxLength)
    .trim();
}

function isPlaceholder(value: string) {
  return ['', 'property type', 'budget range'].includes(value.toLowerCase());
}

function normalizePhone(value: unknown) {
  return normalizeText(value, 24);
}

function phoneDigitCount(value: string) {
  return value.replace(/\D/g, '').length;
}

function isValidPhone(value: string) {
  return /^\+?[0-9\s().-]{7,24}$/.test(value)
    && phoneDigitCount(value) >= 10
    && phoneDigitCount(value) <= 15;
}

function htmlEscape(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getRequiredEmailEnv(key: string) {
  const value = process.env[key]?.trim() || '';

  if (!EMAIL_PATTERN.test(value)) {
    throw new BrevoConfigurationError(`${key} must be set to a valid email address.`);
  }

  return value;
}

function getBrevoConfig() {
  const apiKey = process.env.BREVO_API_KEY?.trim();

  if (!apiKey) {
    throw new BrevoConfigurationError('BREVO_API_KEY is not configured.');
  }

  return {
    apiKey,
    adminEmail: getRequiredEmailEnv('CONSULTATION_ADMIN_EMAIL'),
    adminName: process.env.CONSULTATION_ADMIN_NAME?.trim() || 'Design Dwellers Admin',
    senderEmail: getRequiredEmailEnv('BREVO_SENDER_EMAIL'),
    senderName: process.env.BREVO_SENDER_NAME?.trim() || 'Design Dwellers Studio',
  };
}

function getEmailHtml(lead: ConsultationLead, ip: string) {
  const rows = [
    ['Name', lead.name],
    ['Phone', lead.phone],
    ['Email', lead.email],
    ['Property type', lead.propertyType],
    ['Budget range', lead.budgetRange],
    ['Project scope', lead.projectScope || 'Not specified'],
    ['Preferred city', lead.city || 'Not specified'],
    ['Source', lead.source],
    ['Submitted at', lead.submittedAt],
    ['IP address', ip],
  ];

  return `
    <div style="font-family:Arial,sans-serif;color:#1f1f1f;line-height:1.45">
      <h2 style="margin:0 0 16px;color:#141300">New design consultation lead</h2>
      <table style="border-collapse:collapse;width:100%;max-width:680px">
        <tbody>
          ${rows.map(([label, value]) => `
            <tr>
              <td style="border:1px solid #e7dfcd;padding:9px 11px;background:#fbf7ef;font-weight:700;width:170px">${htmlEscape(label)}</td>
              <td style="border:1px solid #e7dfcd;padding:9px 11px">${htmlEscape(value)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <h3 style="margin:20px 0 8px;color:#141300">Vision</h3>
      <p style="white-space:pre-wrap;border:1px solid #e7dfcd;background:#fbf7ef;padding:12px;max-width:656px">${htmlEscape(lead.vision || 'Not provided')}</p>
    </div>
  `;
}

function getEmailText(lead: ConsultationLead, ip: string) {
  return [
    'New design consultation lead',
    '',
    `Name: ${lead.name}`,
    `Phone: ${lead.phone}`,
    `Email: ${lead.email}`,
    `Property type: ${lead.propertyType}`,
    `Budget range: ${lead.budgetRange}`,
    `Project scope: ${lead.projectScope || 'Not specified'}`,
    `Preferred city: ${lead.city || 'Not specified'}`,
    `Source: ${lead.source}`,
    `Submitted at: ${lead.submittedAt}`,
    `IP address: ${ip}`,
    '',
    'Vision:',
    lead.vision || 'Not provided',
  ].join('\n');
}

function parseForwardedHeader(value: string | null) {
  if (!value) {
    return null;
  }

  const match = /(?:^|;|,)\s*for="?([^";,]+)"?/i.exec(value);
  return match?.[1] || null;
}

function normalizeIpCandidate(value: string | null | undefined) {
  const rawValue = value?.split(',')[0]?.trim();

  if (!rawValue) {
    return null;
  }

  const withoutBrackets = rawValue.startsWith('[') && rawValue.includes(']')
    ? rawValue.slice(1, rawValue.indexOf(']'))
    : rawValue;
  const candidate = /^\d{1,3}(?:\.\d{1,3}){3}:\d+$/.test(withoutBrackets)
    ? withoutBrackets.slice(0, withoutBrackets.lastIndexOf(':'))
    : withoutBrackets;

  return isIP(candidate) ? candidate : null;
}

export function getClientIp(request: NextRequest) {
  const headers = request.headers;
  const candidates = [
    headers.get('cf-connecting-ip'),
    headers.get('x-real-ip'),
    headers.get('x-forwarded-for'),
    parseForwardedHeader(headers.get('forwarded')),
  ];

  for (const candidate of candidates) {
    const ip = normalizeIpCandidate(candidate);

    if (ip) {
      return ip;
    }
  }

  return 'unknown';
}

export function validateConsultationLead(input: ConsultationLeadInput): ValidationResult {
  const errors: Record<string, string> = {};
  const firstName = normalizeText(input.firstName, 50);
  const lastName = normalizeText(input.lastName, 50);
  const name = normalizeText(input.name, 100) || [firstName, lastName].filter(Boolean).join(' ');
  const phone = normalizePhone(input.phone);
  const email = normalizeText(input.email, 120).toLowerCase();
  const propertyType = normalizeText(input.propertyType, 60);
  const budgetRange = normalizeText(input.budgetRange, 60);
  const vision = normalizeMultiline(input.vision, 1000);
  const projectScope = normalizeText(input.projectScope, 80);
  const city = normalizeText(input.city, 80);
  const source = normalizeText(input.source, 120) || 'Website consultation form';
  const honeypot = normalizeText(input.company, 120);
  const formStartedAt = Number(input.formStartedAt);
  const now = Date.now();

  if (honeypot) {
    errors.form = 'Submission could not be accepted.';
  }

  if (!Number.isFinite(formStartedAt) || formStartedAt <= 0) {
    errors.form = 'Please reload the form and try again.';
  } else if (now - formStartedAt < MIN_FORM_TIME_MS) {
    errors.form = 'Please wait a moment before submitting.';
  } else if (now - formStartedAt > MAX_FORM_TIME_MS || formStartedAt > now + 60_000) {
    errors.form = 'This form session expired. Please refresh and try again.';
  }

  if (name.length < 2) {
    errors.name = 'Name is required.';
  }

  if (!isValidPhone(phone)) {
    errors.phone = 'Enter a valid phone number.';
  }

  if (!EMAIL_PATTERN.test(email)) {
    errors.email = 'Enter a valid email address.';
  }

  if (isPlaceholder(propertyType)) {
    errors.propertyType = 'Select a property type.';
  }

  if (isPlaceholder(budgetRange)) {
    errors.budgetRange = 'Select a budget range.';
  }

  if (vision.length > 1000) {
    errors.vision = 'Vision must be under 1000 characters.';
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    lead: {
      name,
      phone,
      email,
      propertyType,
      budgetRange,
      vision,
      projectScope: projectScope || null,
      city: city || null,
      source,
      submittedAt: new Date().toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
        timeZone: 'Asia/Kolkata',
      }),
    },
  };
}

export function checkConsultationRateLimit(ip: string): RateLimitResult {
  const now = Date.now();
  const key = ip || 'unknown';
  const existing = consultationRateLimit.get(key);

  if (!existing || now >= existing.resetAt) {
    consultationRateLimit.set(key, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
      lastAttemptAt: now,
    });
    return { allowed: true };
  }

  const secondsSinceLastAttempt = Math.floor((now - existing.lastAttemptAt) / 1000);
  const minIntervalSeconds = Math.ceil(RATE_LIMIT_MIN_INTERVAL_MS / 1000);

  if (secondsSinceLastAttempt < minIntervalSeconds) {
    return {
      allowed: false,
      retryAfterSeconds: minIntervalSeconds - secondsSinceLastAttempt,
      message: 'Please wait a few seconds before submitting again.',
    };
  }

  if (existing.count >= RATE_LIMIT_MAX_ATTEMPTS) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((existing.resetAt - now) / 1000),
      message: 'Too many consultation requests from this network. Please try again later or contact us on WhatsApp.',
    };
  }

  existing.count += 1;
  existing.lastAttemptAt = now;
  consultationRateLimit.set(key, existing);
  return { allowed: true };
}

export async function sendConsultationLeadEmail(lead: ConsultationLead, ip: string) {
  const config = getBrevoConfig();
  const payload = {
    sender: {
      name: config.senderName,
      email: config.senderEmail,
    },
    to: [
      {
        name: config.adminName,
        email: config.adminEmail,
      },
    ],
    replyTo: {
      name: lead.name,
      email: lead.email,
    },
    subject: `New consultation request from ${lead.name}`,
    htmlContent: getEmailHtml(lead, ip),
    textContent: getEmailText(lead, ip),
    tags: ['consultation-lead'],
  };

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'api-key': config.apiKey,
      'content-type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({})) as { message?: string; code?: string };
    throw new Error(errorBody.message || `Brevo email send failed with status ${response.status}.`);
  }
}
