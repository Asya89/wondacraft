import Link from 'next/link';
import { logoutAction } from '@/app/actions/auth';
import { getSession } from '@/lib/auth/session';
import { AdminNav } from '@/components/admin/AdminNav';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  return (
    <div className="min-h-screen bg-gray-50">
      {session && (
        <header className="border-b bg-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
            <Link href="/admin/dashboard" className="font-serif text-lg font-medium text-warm-brown">
              Wondacraft Admin
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">{session.email}</span>
              <form action={logoutAction}>
                <button type="submit" className="text-sm text-red-600 hover:underline">
                  Ելք
                </button>
              </form>
            </div>
          </div>
          <AdminNav />
        </header>
      )}
      <div className="mx-auto max-w-7xl px-4 py-6">{children}</div>
    </div>
  );
}
