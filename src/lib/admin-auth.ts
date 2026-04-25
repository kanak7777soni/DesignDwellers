import crypto from 'crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const ADMIN_COOKIE = 'dds_admin_session';
const SESSION_DAYS = 7;
const SESSION_MAX_AGE_SECONDS = SESSION_DAYS * 24 * 60 * 60;

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || '';
}

function getSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || '';
}

function signSessionPayload(payload: string) {
  const secret = getSessionSecret();
  return crypto.createHmac('sha256', secret).update(payload).digest('base64url');
}

function createSessionValue() {
  const payload = Buffer.from(JSON.stringify({
    version: 1,
    expiresAt: Date.now() + SESSION_MAX_AGE_SECONDS * 1000,
  })).toString('base64url');

  return `${payload}.${signSessionPayload(payload)}`;
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);

  if (left.length !== right.length) {
    return false;
  }

  return crypto.timingSafeEqual(left, right);
}

export function isAdminPasswordConfigured() {
  return Boolean(getAdminPassword());
}

export function isAdminSessionSecretConfigured() {
  return Boolean(getSessionSecret());
}

export function verifyAdminPassword(password: string) {
  const configuredPassword = getAdminPassword();

  if (!configuredPassword) {
    return false;
  }

  return safeEqual(password, configuredPassword);
}

function verifySessionValue(value: string) {
  const [payload, signature] = value.split('.');

  if (!payload || !signature || !safeEqual(signature, signSessionPayload(payload))) {
    return false;
  }

  try {
    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as {
      expiresAt?: number;
      version?: number;
    };

    return parsed.version === 1 && typeof parsed.expiresAt === 'number' && parsed.expiresAt > Date.now();
  } catch {
    return false;
  }
}

export async function isAdminAuthenticated() {
  if (!getSessionSecret()) {
    return false;
  }

  const cookieStore = await cookies();
  const value = cookieStore.get(ADMIN_COOKIE)?.value;

  return Boolean(value && verifySessionValue(value));
}

export async function requireAdmin() {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    redirect('/admin/login');
  }
}

export async function setAdminSession() {
  const cookieStore = await cookies();

  cookieStore.set(ADMIN_COOKIE, createSessionValue(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
}
