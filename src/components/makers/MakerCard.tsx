import Image from 'next/image';
import Link from 'next/link';
import type { MakerRecord } from '@/server/services/maker.service';
import { getTranslations, type Locale } from '@/lib/i18n';
import { localizedPath } from '@/lib/i18n/path';

interface MakerCardProps {
  maker: MakerRecord;
  locale: Locale;
}

export function MakerCard({ maker, locale }: MakerCardProps) {
  const translations = getTranslations(locale);
  const href = localizedPath(`/makers/${maker.slug}`, locale);
  const imageAlt = `${maker.name} — ${maker.craft}`;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-sm border border-border bg-card shadow-sm">
      <Link href={href} className="relative aspect-[4/5] overflow-hidden bg-cream">
        {maker.image ? (
          <Image
            src={maker.image}
            alt={imageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-serif text-2xl text-muted">
            {maker.name.charAt(0)}
          </div>
        )}
      </Link>
      <div className="flex min-w-0 flex-1 flex-col p-4 text-center sm:p-5">
        <h3 className="font-serif text-xl break-words text-warm-brown">
          <Link href={href} className="transition-colors hover:text-accent">
            {maker.name}
          </Link>
        </h3>
        <p className="mt-1 text-sm font-medium tracking-wide text-accent">{maker.craft}</p>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted line-clamp-6 lg:line-clamp-none">{maker.bio}</p>
        <Link
          href={href}
          className="mt-5 inline-flex items-center justify-center text-sm font-medium text-warm-brown transition-colors hover:text-accent"
        >
          {translations.makers.viewWorks} →
        </Link>
      </div>
    </article>
  );
}
