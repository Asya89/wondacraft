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
    { href: localizedPath('/makers', locale), label: translations.nav.makers },
    { href: localizedPath('/about', locale), label: translations.nav.about },
    { href: localizedPath('/contact', locale), label: translations.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-3 sm:gap-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-4 md:flex-none">
          <Logo
            className="h-10 max-w-[5.5rem] sm:h-12 sm:max-w-none lg:h-16"
            href={localizedPath('/', locale)}
            priority
          />
          <span className="hidden h-10 w-px shrink-0 bg-border/80 sm:block" aria-hidden />
          <p className="brand-tagline min-w-0 max-w-[7.25rem] font-serif text-[0.625rem] leading-snug text-warm-brown sm:max-w-[12rem] sm:text-[0.8125rem] lg:max-w-[15rem] lg:text-sm">
            {translations.common.tagline.map((line, index) => (
              <span key={line} className="block">
                {index === 0 && (
                  <span className="brand-tagline-flag" aria-hidden>
                    🇦🇲{' '}
                  </span>
                )}
                {line}
              </span>
            ))}
          </p>
        </div>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="nav-item">
              <span className="nav-item-bg" aria-hidden />
              <span className="nav-item-label">{link.label}</span>
              <span className="nav-item-underline" aria-hidden />
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <LocaleSwitcher className="hidden sm:flex" />
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-sm md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
            aria-expanded={mobileOpen}
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
