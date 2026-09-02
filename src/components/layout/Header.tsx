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

function NavLink({
  href,
  children,
  onClick,
  mobile = false,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
  mobile?: boolean;
}) {
  if (mobile) {
    return (
      <Link
        href={href}
        onClick={onClick}
        className="group relative block overflow-hidden rounded-sm py-2.5 pl-4 pr-3 text-sm text-foreground/80 transition-colors duration-300 hover:text-warm-brown"
      >
        <span
          aria-hidden
          className="absolute inset-0 bg-cream opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
        <span
          aria-hidden
          className="absolute bottom-2 left-0 top-2 w-1 origin-left scale-x-0 rounded-r-full bg-gradient-to-b from-warm-brown to-accent transition-transform duration-300 group-hover:scale-x-100"
        />
        <span className="relative z-10 pl-1 transition-transform duration-300 group-hover:translate-x-1">
          {children}
        </span>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      onClick={onClick}
      className="group relative inline-flex items-center px-3.5 py-2 text-sm text-foreground/80 transition-colors duration-300 hover:text-warm-brown"
    >
      <span
        aria-hidden
        className="absolute inset-0 rounded-full bg-gradient-to-br from-cream to-beige opacity-0 shadow-sm transition-all duration-300 ease-out group-hover:scale-100 group-hover:opacity-100 scale-90"
      />
      <span className="relative z-10 font-medium transition-transform duration-300 group-hover:-translate-y-px">
        {children}
      </span>
      <span
        aria-hidden
        className="absolute bottom-0.5 left-1/2 h-[2.5px] w-0 -translate-x-1/2 rounded-full bg-gradient-to-r from-warm-brown via-warm-brown to-accent transition-all duration-300 ease-out group-hover:w-[85%]"
      />
    </Link>
  );
}

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Logo height={64} priority />

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <NavLink key={link.href} href={link.href}>
              {link.label}
            </NavLink>
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
        <nav className="border-t border-border/60 bg-background px-4 py-3 md:hidden">
          <div className="flex flex-col gap-0.5">
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                mobile
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
