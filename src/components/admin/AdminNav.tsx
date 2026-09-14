'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const links = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/products', label: 'Ապրանքներ' },
  { href: '/admin/categories', label: 'Կատեգորիաներ' },
  { href: '/admin/makers', label: 'Հեղինակներ' },
  { href: '/admin/orders', label: 'Պատվերներ' },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="border-t bg-white">
      <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'shrink-0 whitespace-nowrap px-3 py-3 text-sm transition-colors sm:px-4',
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
          className="ml-auto shrink-0 whitespace-nowrap px-3 py-3 text-sm text-gray-500 hover:text-gray-900 sm:px-4"
          target="_blank"
        >
          View site →
        </Link>
      </div>
    </nav>
  );
}
