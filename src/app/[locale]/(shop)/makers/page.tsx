import type { Metadata } from 'next';
import { getMakers } from '@/server/services/maker.service';
import { MakerCard } from '@/components/makers/MakerCard';
import { getTranslations, type Locale } from '@/lib/i18n';
import { isLocale } from '@/lib/i18n/config';

interface MakersPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: MakersPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale: Locale = isLocale(localeParam) ? localeParam : 'hy';
  const translations = getTranslations(locale);
  return {
    title: translations.makers.title,
    description: translations.makers.description,
  };
}

export default async function MakersPage({ params }: MakersPageProps) {
  const { locale: localeParam } = await params;
  const locale: Locale = isLocale(localeParam) ? localeParam : 'hy';
  const translations = getTranslations(locale);
  const makers = await getMakers();

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-serif text-4xl text-warm-brown">{translations.makers.title}</h1>
        <p className="mt-4 leading-relaxed text-muted">{translations.makers.description}</p>
      </div>

      {makers.length === 0 ? (
        <p className="mt-12 text-center text-muted">{translations.makers.empty}</p>
      ) : (
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {makers.map((maker) => (
            <MakerCard key={maker.id} maker={maker} />
          ))}
        </div>
      )}
    </div>
  );
}
