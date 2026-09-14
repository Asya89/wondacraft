import type { Metadata } from 'next';
import { logoutAction } from '@/app/actions/auth';
import { getSession } from '@/lib/auth/session';
import { AdminNav } from '@/components/admin/AdminNav';
import { Logo } from '@/components/layout/Logo';

export const metadata: Metadata = {
  title: {
    absolute: 'Admin | WondaCraft',
  },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  return (
    <div className="min-h-screen bg-gray-50">
      {session && (
        <header className="border-b bg-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
            <div className="flex min-w-0 items-center gap-2">
              <Logo href="/admin/dashboard" className="h-10" />
              <span className="text-sm text-gray-400">Admin</span>
            </div>
            <div className="flex min-w-0 items-center gap-3">
              <span className="hidden truncate text-sm text-gray-500 sm:inline">{session.email}</span>
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
