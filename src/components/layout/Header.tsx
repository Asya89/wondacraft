'use client';

import Link from 'next/link';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { t } from '@/lib/i18n';
import { Logo } from '@/components/layout/Logo';

const navLinks = [
  { href: '/products', label: t().nav.products },
  { href: '/#categories', label: t().nav.categories },
  { href: '/about', label: t().nav.about },
  { href: '/contact', label: t().nav.contact },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Logo height={64} priority />

        <nav className="hidden items-center gap-2 md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="nav-link">
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-sm md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          <span className="relative h-4 w-5">
            <span
              className={cn(
                'absolute left-0 h-0.5 w-5 bg-foreground transition-all',
                mobileOpen ? 'top-2 rotate-45' : 'top-0',
              )}
            />
            <span
              className={cn(
                'absolute left-0 top-2 h-0.5 w-5 bg-foreground transition-opacity',
                mobileOpen && 'opacity-0',
              )}
            />
            <span
              className={cn(
                'absolute left-0 h-0.5 w-5 bg-foreground transition-all',
                mobileOpen ? 'top-2 -rotate-45' : 'top-4',
              )}
            />
          </span>
        </button>
      </div>

      {mobileOpen && (
        <nav className="border-t border-border/60 bg-background px-4 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="nav-link-mobile text-sm"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
