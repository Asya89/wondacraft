import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations, type Locale } from '@/lib/i18n';
import { isLocale } from '@/lib/i18n/config';

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale: Locale = isLocale(localeParam) ? localeParam : 'hy';
  const translations = getTranslations(locale);
  return { title: translations.about.title };
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale: localeParam } = await params;
  const locale: Locale = isLocale(localeParam) ? localeParam : 'hy';
  const translations = getTranslations(locale);

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-sm">
        <Image
          src="/images/about.webp"
          alt={translations.about.title}
          fill
          className="object-cover"
          sizes="(max-width: 896px) 100vw, 896px"
        />
      </div>
      <h1 className="font-serif text-4xl text-warm-brown">{translations.about.title}</h1>
      <div className="mt-6 space-y-4 leading-relaxed text-muted">
        <p>{translations.home.aboutText}</p>
        <p>{translations.about.description}</p>
      </div>
    </div>
  );
}
