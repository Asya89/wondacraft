'use client';

import Link from 'next/link';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { localizedPath } from '@/lib/i18n/path';
import { useLocale, useTranslations } from '@/contexts/LocaleContext';
import { Logo } from '@/components/layout/Logo';
import { LocaleSwitcher } from '@/components/layout/LocaleSwitcher';

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const locale = useLocale();
  const translations = useTranslations();

  const navLinks = [
    { href: localizedPath('/products', locale), label: translations.nav.products },
    { href: localizedPath('/#categories', locale), label: translations.nav.categories },
    { href: localizedPath('/about', locale), label: translations.nav.about },
    { href: localizedPath('/contact', locale), label: translations.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Logo height={64} href={localizedPath('/', locale)} priority />

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="nav-item">
              <span className="nav-item-bg" aria-hidden />
              <span className="nav-item-label">{link.label}</span>
              <span className="nav-item-underline" aria-hidden />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LocaleSwitcher className="hidden sm:flex" />
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
      </div>

      {mobileOpen && (
        <nav className="border-t border-border/60 bg-background px-4 py-3 md:hidden">
          <LocaleSwitcher className="mb-3 sm:hidden" />
          <div className="flex flex-col gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="nav-item-mobile text-sm"
                onClick={() => setMobileOpen(false)}
              >
                <span className="nav-item-mobile-bg" aria-hidden />
                <span className="nav-item-mobile-accent" aria-hidden />
                <span className="nav-item-mobile-label">{link.label}</span>
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
