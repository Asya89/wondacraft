import Image from 'next/image';
import Link from 'next/link';
import { getCategories } from '@/server/services/category.service';
import { getFeaturedProducts, getNewProducts } from '@/server/services/product.service';
import { ProductCard } from '@/components/products/ProductCard';
import { CategoryCard } from '@/components/categories/CategoryCard';
import { WhyFeatureIcon } from '@/components/home/WhyFeatureIcon';
import { Button } from '@/components/ui/Button';
import { getTranslations, type Locale } from '@/lib/i18n';
import { localizedPath } from '@/lib/i18n/path';
import { isLocale } from '@/lib/i18n/config';

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale: localeParam } = await params;
  const locale: Locale = isLocale(localeParam) ? localeParam : 'hy';
  const translations = getTranslations(locale);

  const [categories, featuredProducts, newProducts] = await Promise.all([
    getCategories(),
    getFeaturedProducts(4),
    getNewProducts(4),
  ]);

  return (
    <>
      <section className="hero-section relative flex min-h-[75vh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/hero.webp"
            alt="WondaCraft"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="hero-section-overlay absolute inset-0" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-4xl px-4 py-24 text-center sm:px-6 lg:px-8">
          <div className="hero-content animate-slide-up">
            <p className="hero-content-eyebrow">{translations.common.siteName}</p>
            <span className="hero-content-badge" aria-hidden>
              ✦
            </span>
            <span className="hero-content-divider" aria-hidden />
            <h1 className="hero-content-title font-serif text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">
              {translations.home.heroTitle}
            </h1>
            <p className="hero-content-description mx-auto mt-4 max-w-2xl text-lg text-white/90">
              <span className="hero-content-quote" aria-hidden>
                “
              </span>
              {translations.home.heroDescription}
              <span className="hero-content-quote" aria-hidden>
                ”
              </span>
            </p>
            <Link href={localizedPath('/products', locale)} className="mt-8 inline-block">
              <Button size="lg" variant="secondary">
                {translations.home.heroCta}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section id="categories" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="section-title-decorated mb-10 font-serif text-3xl text-warm-brown">
          {translations.home.categoriesTitle}
        </h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} locale={locale} />
          ))}
        </div>
      </section>

      {featuredProducts.length > 0 && (
        <section className="bg-cream py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center">
              <h2 className="section-title-decorated font-serif text-3xl text-warm-brown">
                {translations.home.featuredTitle}
              </h2>
              <Link
                href={`${localizedPath('/products', locale)}?featured=true`}
                className="section-view-all"
              >
                {translations.common.viewAll} →
              </Link>
            </div>
            <div className="grid gap-8 grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} locale={locale} />
              ))}
            </div>
          </div>
        </section>
      )}

      {newProducts.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="font-serif text-3xl text-warm-brown">{translations.home.newTitle}</h2>
            <Link
              href={`${localizedPath('/products', locale)}?new=true`}
              className="text-sm text-muted hover:text-warm-brown"
            >
              {translations.common.viewAll} →
            </Link>
          </div>
          <div className="grid gap-6 grid-cols-2 lg:grid-cols-4">
            {newProducts.map((product) => (
              <ProductCard key={product.id} product={product} locale={locale} />
            ))}
          </div>
        </section>
      )}

      <section className="bg-beige/50 py-16">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:px-8 lg:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
            <Image
              src="/images/about.webp"
              alt={translations.home.aboutTitle}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div>
            <h2 className="font-serif text-3xl text-warm-brown">{translations.home.aboutTitle}</h2>
            <p className="mt-4 leading-relaxed text-muted">{translations.home.aboutText}</p>
            <Link
              href={localizedPath('/about', locale)}
              className="mt-6 inline-block text-sm text-warm-brown hover:underline"
            >
              {translations.nav.about} →
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="mb-10 text-center font-serif text-3xl text-warm-brown">
          {translations.home.whyTitle}
        </h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {translations.home.whyItems.map((item) => (
            <div key={item.icon} className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-cream text-warm-brown">
                <WhyFeatureIcon type={item.icon} />
              </div>
              <h3 className="font-serif text-lg">{item.title}</h3>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-warm-brown py-16 text-center text-white">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="font-serif text-3xl">{translations.home.ctaTitle}</h2>
          <Link href={localizedPath('/products', locale)} className="mt-6 inline-block">
            <Button size="lg" variant="secondary">
              {translations.home.ctaButton}
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
