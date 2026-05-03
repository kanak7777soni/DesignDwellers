import { NextRequest, NextResponse } from 'next/server';
import {
  BrevoConfigurationError,
  checkConsultationRateLimit,
  getClientIp,
  sendConsultationLeadEmail,
  validateConsultationLead,
  type ConsultationLeadInput,
} from '@/lib/consultation-leads';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function getFirstError(errors: Record<string, string>) {
  return Object.values(errors)[0] || 'Please check the form and try again.';
}

export async function POST(request: NextRequest) {
  let payload: ConsultationLeadInput;

  try {
    payload = await request.json() as ConsultationLeadInput;
  } catch {
    return NextResponse.json(
      { ok: false, message: 'Invalid request payload.' },
      { status: 400 },
    );
  }

  const validation = validateConsultationLead(payload);

  if (!validation.ok) {
    return NextResponse.json(
      {
        ok: false,
        message: getFirstError(validation.errors),
        fieldErrors: validation.errors,
      },
      { status: 400 },
    );
  }

  const ip = getClientIp(request);
  const rateLimit = checkConsultationRateLimit(ip);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { ok: false, message: rateLimit.message },
      {
        status: 429,
        headers: {
          'Retry-After': String(rateLimit.retryAfterSeconds),
        },
      },
    );
  }

  try {
    await sendConsultationLeadEmail(validation.lead, ip);

    return NextResponse.json({
      ok: true,
      message: 'Thank you. Our designer will contact you shortly.',
    });
  } catch (error) {
    console.error('[consultation] lead email failed', {
      message: error instanceof Error ? error.message : String(error),
    });

    return NextResponse.json(
      {
        ok: false,
        message: error instanceof BrevoConfigurationError
          ? 'Consultation email is not configured yet. Please contact us on WhatsApp.'
          : 'We could not send your request right now. Please try again or contact us on WhatsApp.',
      },
      { status: error instanceof BrevoConfigurationError ? 503 : 502 },
    );
  }
}
