import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getCategories } from '@/server/services/category.service';
import { getProducts, getNewProducts } from '@/server/services/product.service';
import { getFeaturedMakers } from '@/server/services/maker.service';
import { ProductCard } from '@/components/products/ProductCard';
import { CategoryCard } from '@/components/categories/CategoryCard';
import { MakerCard } from '@/components/makers/MakerCard';
import { WhyFeatureIcon } from '@/components/home/WhyFeatureIcon';
import { Button } from '@/components/ui/Button';
import { JsonLd } from '@/components/seo/JsonLd';
import { getTranslations, type Locale } from '@/lib/i18n';
import { localizedPath } from '@/lib/i18n/path';
import { isLocale } from '@/lib/i18n/config';
import { buildPageMetadata, organizationJsonLd } from '@/lib/seo';

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale: Locale = isLocale(localeParam) ? localeParam : 'hy';
  const seo = getTranslations(locale).seo;

  return buildPageMetadata({
    locale,
    path: '/',
    title: seo.homeTitle,
    description: seo.homeDescription,
    imageAlt: seo.heroImageAlt,
    absoluteTitle: true,
  });
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale: localeParam } = await params;
  const locale: Locale = isLocale(localeParam) ? localeParam : 'hy';
  const translations = getTranslations(locale);

  const [categories, { products: allProductsPreview }, newProducts, makers] = await Promise.all([
    getCategories(),
    getProducts({ limit: 4, sort: 'newest' }),
    getNewProducts(4),
    getFeaturedMakers(3),
  ]);

  return (
    <>
      <JsonLd data={organizationJsonLd(locale)} />
      <section className="hero-section relative flex min-h-[75vh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/hero.webp"
            alt={translations.seo.heroImageAlt}
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="hero-section-overlay absolute inset-0" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-24 lg:px-8">
          <div className="hero-content animate-slide-up">
            <p className="hero-content-eyebrow">{translations.common.siteName}</p>
            <span className="hero-content-badge" aria-hidden>
              ✦
            </span>
            <span className="hero-content-divider" aria-hidden />
            <h1 className="hero-content-title font-serif text-[1.75rem] leading-tight text-white sm:text-5xl lg:text-6xl">
              {translations.home.heroTitle}
            </h1>
            <p className="hero-content-description mx-auto mt-4 max-w-2xl text-base text-white/90 sm:text-lg">
              <span className="hero-content-quote" aria-hidden>
                “
              </span>
              {translations.home.heroDescription}
              <span className="hero-content-quote" aria-hidden>
                ”
              </span>
            </p>
            <Link href={localizedPath('/products', locale)} className="mt-8 inline-flex w-full max-w-full justify-center sm:w-auto">
              <Button size="lg" variant="secondary" className="w-full whitespace-normal sm:w-auto">
                {translations.home.heroCta}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section id="categories" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <h2 className="section-title-decorated mb-8 font-serif text-2xl text-warm-brown sm:mb-10 sm:text-3xl">
          {translations.home.categoriesTitle}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} locale={locale} />
          ))}
        </div>
      </section>

      {allProductsPreview.length > 0 && (
        <section className="bg-cream py-10 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 text-center sm:mb-10">
              <h2 className="section-title-decorated font-serif text-2xl text-warm-brown sm:text-3xl">
                {translations.home.allProductsTitle}
              </h2>
              <Link href={localizedPath('/products', locale)} className="section-view-all">
                {translations.common.viewAll} →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-8 lg:grid-cols-4">
              {allProductsPreview.map((product) => (
                <ProductCard key={product.id} product={product} locale={locale} />
              ))}
            </div>
          </div>
        </section>
      )}

      {newProducts.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
          <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-serif text-2xl text-warm-brown sm:text-3xl">{translations.home.newTitle}</h2>
            <Link
              href={`${localizedPath('/products', locale)}?new=true`}
              className="text-sm text-muted hover:text-warm-brown"
            >
              {translations.common.viewAll} →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
            {newProducts.map((product) => (
              <ProductCard key={product.id} product={product} locale={locale} />
            ))}
          </div>
        </section>
      )}

      <section className="bg-beige/50 py-10 sm:py-16">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 sm:gap-12 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
            <Image
              src="/images/about.webp"
              alt={translations.seo.aboutImageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div className="min-w-0">
            <h2 className="font-serif text-2xl text-warm-brown sm:text-3xl">{translations.home.aboutTitle}</h2>
            {translations.home.aboutPreview.map((paragraph) => (
              <p key={paragraph} className="mt-4 leading-relaxed text-muted">
                {paragraph}
              </p>
            ))}
            <Link
              href={localizedPath('/about', locale)}
              className="mt-6 inline-block text-sm text-warm-brown hover:underline"
            >
              {translations.nav.about} →
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <div className="mb-8 text-center sm:mb-10">
          <h2 className="section-title-decorated font-serif text-2xl text-warm-brown sm:text-3xl">
            {translations.home.makersTitle}
          </h2>
          <Link href={localizedPath('/makers', locale)} className="section-view-all">
            {translations.common.viewAll} →
          </Link>
        </div>
        {makers.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
            {makers.map((maker) => (
              <MakerCard key={maker.id} maker={maker} locale={locale} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted">{translations.makers.empty}</p>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <h2 className="mb-8 text-center font-serif text-2xl text-warm-brown sm:mb-10 sm:text-3xl">
          {translations.home.whyTitle}
        </h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {translations.home.whyItems.map((item) => (
            <div key={item.icon} className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-cream text-warm-brown">
                <WhyFeatureIcon type={item.icon} />
              </div>
              <h3 className="font-serif text-lg text-warm-brown">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-warm-brown py-12 text-center text-white sm:py-16">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="font-serif text-2xl sm:text-3xl">{translations.home.ctaTitle}</h2>
          <Link href={localizedPath('/products', locale)} className="mt-6 inline-flex w-full justify-center sm:w-auto">
            <Button size="lg" variant="secondary" className="w-full sm:w-auto">
              {translations.home.ctaButton}
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
