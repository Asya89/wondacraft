import type { Metadata } from 'next';
import { ContactLinks } from '@/components/layout/ContactLinks';
import { getTranslations, type Locale } from '@/lib/i18n';
import { isLocale } from '@/lib/i18n/config';
import { buildPageMetadata } from '@/lib/seo';

interface ContactPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale: Locale = isLocale(localeParam) ? localeParam : 'hy';
  const translations = getTranslations(locale);
  return buildPageMetadata({
    locale,
    path: '/contact',
    title: translations.seo.contactTitle,
    description: translations.seo.contactDescription,
  });
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale: localeParam } = await params;
  const locale: Locale = isLocale(localeParam) ? localeParam : 'hy';
  const translations = getTranslations(locale);

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl text-warm-brown sm:text-4xl">{translations.contact.title}</h1>
      <p className="mt-4 text-muted">{translations.contact.description}</p>

      <div className="mt-10">
        <ContactLinks locale={locale} variant="page" />
      </div>
    </div>
  );
}
