'use server';

import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import {
  clearAdminSession,
  isAdminPasswordConfigured,
  isAdminSessionSecretConfigured,
  setAdminSession,
  verifyAdminPassword,
} from '@/lib/admin-auth';

type LoginAttempt = {
  count: number;
  resetAt: number;
};

const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const loginAttempts = new Map<string, LoginAttempt>();

async function getLoginKey() {
  const headerStore = await headers();
  return headerStore.get('x-forwarded-for')?.split(',')[0]?.trim()
    || headerStore.get('x-real-ip')
    || 'local';
}

function isRateLimited(key: string) {
  const attempt = loginAttempts.get(key);

  if (!attempt) {
    return false;
  }

  if (Date.now() > attempt.resetAt) {
    loginAttempts.delete(key);
    return false;
  }

  return attempt.count >= MAX_LOGIN_ATTEMPTS;
}

function recordFailedAttempt(key: string) {
  const existing = loginAttempts.get(key);

  if (!existing || Date.now() > existing.resetAt) {
    loginAttempts.set(key, { count: 1, resetAt: Date.now() + LOGIN_WINDOW_MS });
    return;
  }

  loginAttempts.set(key, { ...existing, count: existing.count + 1 });
}

export async function loginAction(formData: FormData) {
  const password = String(formData.get('password') || '');
  const loginKey = await getLoginKey();

  if (!isAdminPasswordConfigured()) {
    redirect('/admin/login?error=missing-password');
  }

  if (!isAdminSessionSecretConfigured()) {
    redirect('/admin/login?error=missing-secret');
  }

  if (isRateLimited(loginKey)) {
    redirect('/admin/login?error=rate-limit');
  }

  if (!verifyAdminPassword(password)) {
    recordFailedAttempt(loginKey);
    redirect('/admin/login?error=invalid');
  }

  loginAttempts.delete(loginKey);
  await setAdminSession();
  redirect('/admin');
}

export async function logoutAction() {
  await clearAdminSession();
  redirect('/admin/login');
}
