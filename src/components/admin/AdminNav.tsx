'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const links = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/products', label: 'Ապրանքներ' },
  { href: '/admin/categories', label: 'Կatегoriанեր' },
  { href: '/admin/orders', label: 'Patverner' },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="border-t bg-white">
      <div className="mx-auto flex max-w-7xl gap-1 px-4">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'px-4 py-3 text-sm transition-colors',
              pathname.startsWith(link.href)
                ? 'border-b-2 border-warm-brown text-warm-brown font-medium'
                : 'text-gray-600 hover:text-gray-900',
            )}
          >
            {link.label}
          </Link>
        ))}
        <Link
          href="/hy"
          className="ml-auto px-4 py-3 text-sm text-gray-500 hover:text-gray-900"
          target="_blank"
        >
          View site →
        </Link>
      </div>
    </nav>
  );
}
