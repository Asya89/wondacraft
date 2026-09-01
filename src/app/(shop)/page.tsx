import Image from 'next/image';
import Link from 'next/link';
import { getCategories } from '@/server/services/category.service';
import { getFeaturedProducts, getNewProducts } from '@/server/services/product.service';
import { ProductCard } from '@/components/products/ProductCard';
import { CategoryCard } from '@/components/categories/CategoryCard';
import { Button } from '@/components/ui/Button';
import { t } from '@/lib/i18n';

export default async function HomePage() {
  const translations = t();
  const [categories, featuredProducts, newProducts] = await Promise.all([
    getCategories(),
    getFeaturedProducts(4),
    getNewProducts(4),
  ]);

  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[70vh] items-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/hero.webp"
            alt="WondaCraft"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-foreground/30" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="max-w-xl animate-slide-up">
            <h1 className="font-serif text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">
              {translations.home.heroTitle}
            </h1>
            <p className="mt-4 text-lg text-white/90">{translations.home.heroDescription}</p>
            <Link href="/products" className="mt-8 inline-block">
              <Button size="lg" variant="secondary">
                {translations.home.heroCta}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-center font-serif text-3xl text-warm-brown">
          {translations.home.categoriesTitle}
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      {/* Featured */}
      {featuredProducts.length > 0 && (
        <section className="bg-cream py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="font-serif text-3xl text-warm-brown">{translations.home.featuredTitle}</h2>
              <Link href="/products?featured=true" className="text-sm text-muted hover:text-warm-brown">
                {translations.common.viewAll} →
              </Link>
            </div>
            <div className="grid gap-6 grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* New products */}
      {newProducts.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="font-serif text-3xl text-warm-brown">{translations.home.newTitle}</h2>
            <Link href="/products?new=true" className="text-sm text-muted hover:text-warm-brown">
              {translations.common.viewAll} →
            </Link>
          </div>
          <div className="grid gap-6 grid-cols-2 lg:grid-cols-4">
            {newProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* About */}
      <section className="bg-beige/50 py-16">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
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
            <Link href="/about" className="mt-6 inline-block text-sm text-warm-brown hover:underline">
              {translations.nav.about} →
            </Link>
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="mb-10 text-center font-serif text-3xl text-warm-brown">
          {translations.home.whyTitle}
        </h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {translations.home.whyItems.map((item) => (
            <div key={item} className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-cream">
                <span className="text-warm-brown">✦</span>
              </div>
              <h3 className="font-serif text-lg">{item}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-warm-brown py-16 text-center text-white">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="font-serif text-3xl">{translations.home.ctaTitle}</h2>
          <Link href="/products" className="mt-6 inline-block">
            <Button size="lg" variant="secondary">
              {translations.home.ctaButton}
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
