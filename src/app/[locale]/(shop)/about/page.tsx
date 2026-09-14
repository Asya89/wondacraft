import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations, type Locale } from '@/lib/i18n';
import { isLocale } from '@/lib/i18n/config';
import { buildPageMetadata } from '@/lib/seo';

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale: Locale = isLocale(localeParam) ? localeParam : 'hy';
  const translations = getTranslations(locale);
  return buildPageMetadata({
    locale,
    path: '/about',
    title: translations.seo.aboutTitle,
    description: translations.seo.aboutDescription,
    image: '/images/about.jpeg',
    imageAlt: translations.seo.aboutImageAlt,
  });
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale: localeParam } = await params;
  const locale: Locale = isLocale(localeParam) ? localeParam : 'hy';
  const translations = getTranslations(locale);
  const about = translations.about;

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-sm">
        <Image
          src="/images/about.jpeg"
          alt={translations.seo.aboutImageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 768px"
        />
      </div>

      <h1 className="font-serif text-3xl text-warm-brown sm:text-4xl">{about.title}</h1>

      <div className="mt-8 space-y-5 leading-relaxed text-muted">
        <p className="font-serif text-2xl leading-snug text-warm-brown">{about.lead}</p>

        <p>{about.intro}</p>
        <p>{about.story}</p>
        <p>{about.problem}</p>
        <p>{about.problemDetail}</p>

        <p className="font-medium text-warm-brown">{about.highlight}</p>
        <p>{about.mission}</p>

        <p className="font-medium text-warm-brown">{about.goalsIntro}</p>
        <ul className="space-y-3 pl-1">
          {about.goals.map((goal) => (
            <li key={goal} className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-warm-brown/60" aria-hidden />
              <span>{goal}</span>
            </li>
          ))}
        </ul>

        <div className="space-y-5 border-t border-border pt-8">
          <h2 className="font-serif text-xl text-warm-brown">{about.localBeliefTitle}</h2>
          <p>{about.localSupport}</p>
          <p>{about.localGrowth}</p>
          <p>{about.localIdentity}</p>
        </div>

        <div className="space-y-5 border-t border-border pt-8">
          <h2 className="font-serif text-xl text-warm-brown">{about.handmadeBelief}</h2>
          <p>{about.handmadeStory}</p>
          <p className="font-medium text-warm-brown">{about.notJustShop}</p>
          <p>{about.placeVision}</p>
          <p>{about.curation}</p>
        </div>

        <div className="space-y-5 border-t border-border pt-8">
          <h2 className="font-serif text-2xl text-warm-brown">{about.visionTitle}</h2>
          <p>{about.vision}</p>
          <p>{about.visionCreator}</p>
          <p>{about.visionClose}</p>
        </div>
      </div>
    </div>
  );
}
