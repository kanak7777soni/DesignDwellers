import Link from 'next/link';
import { logoutAction } from '@/app/admin/login/actions';

export default function AdminHeader() {
  return (
    <header className="flex items-center justify-between" style={{ borderBottom: '1px solid rgba(215,166,72,0.25)', paddingBottom: '22px', marginBottom: '28px' }}>
      <div>
        <Link href="/admin" className="font-heading" style={{ color: '#D7A648', fontSize: '28px', textDecoration: 'none' }}>
          Design Dwellers CRM
        </Link>
        <p className="font-body" style={{ color: 'rgba(255,255,255,0.62)', fontSize: '14px', marginTop: '6px' }}>
          Portfolio, categories, and media
        </p>
      </div>
      <nav className="flex items-center" style={{ gap: '12px' }}>
        <Link href="/portfolio" className="font-body" style={{ color: '#FFFFFF', opacity: 0.75, textDecoration: 'none', fontSize: '14px' }}>
          View Site
        </Link>
        <Link href="/admin/instagram" className="font-body" style={{ color: '#FFFFFF', opacity: 0.75, textDecoration: 'none', fontSize: '14px' }}>
          Instagram
        </Link>
        <Link href="/admin/backups" className="font-body" style={{ color: '#FFFFFF', opacity: 0.75, textDecoration: 'none', fontSize: '14px' }}>
          Backups
        </Link>
        <Link href="/admin/projects/new" className="font-heading" style={{ background: '#D7A648', color: '#FFFFFF', borderRadius: '55px', padding: '11px 18px 9px', textDecoration: 'none', fontSize: '15px' }}>
          New Project
        </Link>
        <form action={logoutAction}>
          <button type="submit" className="font-body" style={{ background: 'transparent', color: '#D7A648', border: '1px solid rgba(215,166,72,0.6)', borderRadius: '55px', padding: '10px 16px', cursor: 'pointer' }}>
            Logout
          </button>
        </form>
      </nav>
    </header>
  );
}
