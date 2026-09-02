import { ContactIcon } from '@/components/icons/ContactIcon';
import { siteContact } from '@/lib/site/contact';
import type { Locale } from '@/lib/i18n';

interface ContactLinksProps {
  locale: Locale;
  variant?: 'footer' | 'page';
}

export function ContactLinks({ locale: _locale, variant = 'footer' }: ContactLinksProps) {
  const isPage = variant === 'page';

  const linkClass = isPage
    ? 'group flex w-full flex-row items-center justify-start gap-3'
    : 'group flex w-full flex-row items-center justify-start gap-3';
  const iconWrapClass = isPage
    ? 'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-beige/80 text-warm-brown transition-colors group-hover:bg-beige'
    : 'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-beige/80 text-warm-brown transition-colors group-hover:bg-beige';
  const labelClass = isPage ? 'text-lg' : 'text-sm';

  const items = [
    {
      icon: 'phone' as const,
      href: `tel:${siteContact.phone}`,
      label: siteContact.phoneDisplay,
      external: false,
    },
    {
      icon: 'email' as const,
      href: `mailto:${siteContact.email}`,
      label: siteContact.email,
      external: false,
    },
    {
      icon: 'instagram' as const,
      href: siteContact.instagram,
      label: siteContact.instagramHandle,
      external: true,
    },
    {
      icon: 'wildberries' as const,
      href: siteContact.wildberries,
      label: 'Wildberries',
      external: true,
    },
    {
      icon: 'ozon' as const,
      href: siteContact.ozon,
      label: 'Ozon',
      external: true,
    },
  ];

  return (
    <div className={isPage ? 'space-y-5' : 'flex flex-col gap-3'}>
      {items.map((item) => (
        <a
          key={item.icon}
          href={item.href}
          className={linkClass}
          {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          <span className={iconWrapClass}>
            <ContactIcon type={item.icon} />
          </span>
          <span className={`text-muted group-hover:text-foreground ${labelClass}`}>{item.label}</span>
        </a>
      ))}
    </div>
  );
}
