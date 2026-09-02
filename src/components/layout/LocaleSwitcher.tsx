'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { localeLabels, locales, type Locale } from '@/lib/i18n/config';
import { replaceLocaleInPath } from '@/lib/i18n/path';
import { useLocale, useTranslations } from '@/contexts/LocaleContext';

export function LocaleSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const pathname = usePathname();
  const translations = useTranslations();

  return (
    <div className={cn('flex items-center gap-1', className)} aria-label={translations.language.label}>
      {locales.map((code) => {
        const active = code === locale;
        return (
          <Link
            key={code}
            href={replaceLocaleInPath(pathname, code as Locale)}
            className={cn(
              'rounded-full px-2.5 py-1 text-xs font-medium transition-colors',
              active
                ? 'bg-warm-brown text-white'
                : 'text-muted hover:bg-cream hover:text-warm-brown',
            )}
            aria-current={active ? 'true' : undefined}
          >
            {localeLabels[code as Locale]}
          </Link>
        );
      })}
    </div>
  );
}
