import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { loginAction } from './actions';

export const dynamic = 'force-dynamic';

function getErrorMessage(error?: string) {
  if (error === 'missing-password') {
    return 'Set ADMIN_PASSWORD in .env.local before logging in.';
  }

  if (error === 'missing-secret') {
    return 'Set ADMIN_SESSION_SECRET in .env.local before logging in.';
  }

  if (error === 'invalid') {
    return 'Wrong password. Please try again.';
  }

  if (error === 'rate-limit') {
    return 'Too many failed login attempts. Try again in 15 minutes.';
  }

  return null;
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await isAdminAuthenticated()) {
    redirect('/admin');
  }

  const { error } = await searchParams;
  const errorMessage = getErrorMessage(error);

  return (
    <main className="min-h-screen flex items-center justify-center" style={{ background: '#141300', color: '#FFFFFF', padding: '40px' }}>
      <section style={{ width: '100%', maxWidth: '420px', border: '1px solid rgba(215,166,72,0.35)', background: '#000000', padding: '32px', borderRadius: '8px' }}>
        <p className="font-heading" style={{ fontSize: '16px', lineHeight: '1.17em', color: '#D7A648', marginBottom: '10px' }}>
          Design Dwellers CRM
        </p>
        <h1 className="font-heading" style={{ fontSize: '42px', lineHeight: '1.17em', color: '#FFFFFF', marginBottom: '14px' }}>
          Admin Login
        </h1>
        <p className="font-body" style={{ fontSize: '15px', lineHeight: '1.45em', color: 'rgba(255,255,255,0.72)', marginBottom: '24px' }}>
          Manage portfolio categories, projects, images, and videos from here.
        </p>

        {errorMessage ? (
          <p className="font-body" style={{ background: 'rgba(215,166,72,0.14)', border: '1px solid rgba(215,166,72,0.4)', color: '#FFFFFF', padding: '12px', borderRadius: '6px', marginBottom: '18px', fontSize: '14px' }}>
            {errorMessage}
          </p>
        ) : null}

        <form action={loginAction} className="flex flex-col" style={{ gap: '14px' }}>
          <label className="font-body" style={{ fontSize: '13px', color: '#D7A648' }} htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="font-body"
            style={{ height: '44px', borderRadius: '6px', border: '1px solid rgba(215,166,72,0.45)', background: '#141300', color: '#FFFFFF', padding: '0 14px', outline: 'none' }}
          />
          <button
            type="submit"
            className="font-heading"
            style={{ height: '44px', borderRadius: '55px', border: 'none', background: '#D7A648', color: '#FFFFFF', fontSize: '16px', cursor: 'pointer', marginTop: '8px' }}
          >
            Login
          </button>
        </form>
      </section>
    </main>
  );
}
