import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getMakerBySlug } from '@/server/services/maker.service';
import { getProducts } from '@/server/services/product.service';
import { ProductCard } from '@/components/products/ProductCard';
import { JsonLd } from '@/components/seo/JsonLd';
import { formatMessage, getTranslations, type Locale } from '@/lib/i18n';
import { localizedPath } from '@/lib/i18n/path';
import { isLocale } from '@/lib/i18n/config';
import {
  breadcrumbJsonLd,
  buildMakerDescription,
  buildPageMetadata,
  canonicalFor,
  personJsonLd,
} from '@/lib/seo';

interface MakerDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: MakerDetailPageProps): Promise<Metadata> {
  const { slug, locale: localeParam } = await params;
  const locale: Locale = isLocale(localeParam) ? localeParam : 'hy';
  const maker = await getMakerBySlug(slug);
  if (!maker) return { title: getTranslations(locale).makers.notFound, robots: { index: false } };

  const translations = getTranslations(locale);
  return buildPageMetadata({
    locale,
    path: `/makers/${maker.slug}`,
    title: formatMessage(translations.seo.makerTitle, { name: maker.name, craft: maker.craft }),
    description: buildMakerDescription({
      name: maker.name,
      craft: maker.craft,
      bio: maker.bio,
      locale,
    }),
    image: maker.image,
    imageAlt: `${maker.name} — ${maker.craft}`,
    type: 'profile',
  });
}

export default async function MakerDetailPage({ params }: MakerDetailPageProps) {
  const { slug, locale: localeParam } = await params;
  const locale: Locale = isLocale(localeParam) ? localeParam : 'hy';
  const translations = getTranslations(locale);

  const maker = await getMakerBySlug(slug);
  if (!maker) notFound();

  const { products } = await getProducts({ makerId: maker.id, limit: 24 });
  const makerUrl = canonicalFor(`/makers/${maker.slug}`, locale);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <JsonLd
        data={personJsonLd({
          name: maker.name,
          craft: maker.craft,
          bio: maker.bio,
          url: makerUrl,
          image: maker.image,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: translations.seo.breadcrumbHome, url: canonicalFor('/', locale) },
          { name: translations.makers.title, url: canonicalFor('/makers', locale) },
          { name: maker.name, url: makerUrl },
        ])}
      />
      <Link
        href={localizedPath('/makers', locale)}
        className="text-sm text-muted transition-colors hover:text-warm-brown"
      >
        ← {translations.makers.title}
      </Link>

      <div className="mt-8 grid gap-10 lg:grid-cols-[280px_1fr] lg:items-start">
        <div className="relative mx-auto aspect-[4/5] w-full max-w-xs overflow-hidden rounded-sm bg-cream lg:mx-0">
          {maker.image ? (
            <Image
              src={maker.image}
              alt={`${maker.name} — ${maker.craft}`}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 320px, 280px"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center font-serif text-4xl text-muted">
              {maker.name.charAt(0)}
            </div>
          )}
        </div>

        <div>
          <h1 className="font-serif text-3xl break-words text-warm-brown sm:text-4xl">{maker.name}</h1>
          <p className="mt-2 text-sm font-medium tracking-wide text-accent">{maker.craft}</p>
          <p className="mt-6 max-w-2xl leading-relaxed text-muted">{maker.bio}</p>
        </div>
      </div>

      <section className="mt-16">
        <h2 className="mb-8 font-serif text-2xl text-warm-brown">{translations.makers.worksTitle}</h2>
        {products.length === 0 ? (
          <p className="text-muted">{translations.makers.worksEmpty}</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} locale={locale} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
