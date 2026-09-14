import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductBySlug, getRelatedProducts } from '@/server/services/product.service';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductGallery } from '@/components/products/ProductGallery';
import { OrderForm } from '@/components/orders/OrderForm';
import { formatPrice, getSiteUrl } from '@/lib/utils';
import { getTranslations, type Locale } from '@/lib/i18n';
import { localizedPath } from '@/lib/i18n/path';
import { isLocale } from '@/lib/i18n/config';

interface ProductPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug, locale: localeParam } = await params;
  const locale: Locale = isLocale(localeParam) ? localeParam : 'hy';
  const product = await getProductBySlug(slug);
  if (!product) return { title: getTranslations(locale).product.notFound };

  return {
    title: product.name,
    description: product.shortDescription ?? product.description ?? undefined,
    openGraph: {
      title: product.name,
      description: product.shortDescription ?? undefined,
      images: product.images.filter((i) => i.isMain).map((i) => i.imageUrl),
      url: `${getSiteUrl()}${localizedPath(`/products/${product.slug}`, locale)}`,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug, locale: localeParam } = await params;
  const locale: Locale = isLocale(localeParam) ? localeParam : 'hy';
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const relatedProducts = await getRelatedProducts(product.categoryId, product.id);
  const translations = getTranslations(locale);
  const inStock = product.stock > 0;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.shortDescription ?? product.description,
    sku: product.sku,
    image: product.images.map((i) => `${getSiteUrl()}${i.imageUrl}`),
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'AMD',
      availability: inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2">
          <ProductGallery images={product.images} productName={product.name} />

          <div>
            <p className="text-sm text-muted">{product.category.name}</p>
            <h1 className="mt-1 font-serif text-3xl text-warm-brown">{product.name}</h1>

            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-2xl font-medium text-warm-brown">
                {formatPrice(product.price)}
              </span>
              {product.oldPrice && (
                <span className="text-lg text-muted line-through">
                  {formatPrice(product.oldPrice)}
                </span>
              )}
            </div>

            <div className="mt-6 space-y-2 text-sm">
              {product.size && (
                <p>
                  <span className="text-muted">{translations.product.size}:</span> {product.size}
                </p>
              )}
              {product.material && (
                <p>
                  <span className="text-muted">{translations.product.material}:</span>{' '}
                  {product.material}
                </p>
              )}
              {product.sku && (
                <p>
                  <span className="text-muted">{translations.product.sku}:</span> {product.sku}
                </p>
              )}
              <p>
                <span className={inStock ? 'text-green-700' : 'text-red-600'}>
                  {inStock ? translations.common.inStock : translations.common.outOfStock}
                </span>
                {inStock && <span className="ml-1 text-muted">({product.stock})</span>}
              </p>
            </div>

            {product.shortDescription && (
              <p className="mt-6 leading-relaxed text-muted">{product.shortDescription}</p>
            )}

            {inStock && (
              <div className="mt-8">
                <OrderForm productId={product.id} productName={product.name} price={product.price} />
              </div>
            )}
          </div>
        </div>

        {product.description && (
          <section className="mt-16 border-t border-border pt-10">
            <h2 className="mb-4 font-serif text-2xl text-warm-brown">
              {translations.product.description}
            </h2>
            <div className="prose max-w-none leading-relaxed text-muted whitespace-pre-line">
              {product.description}
            </div>
          </section>
        )}

        {product.maker && (
          <section className="mt-16 border-t border-border pt-10">
            <h2 className="mb-6 font-serif text-2xl text-warm-brown">
              {translations.product.makerTitle}
            </h2>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
              {product.maker.image && (
                <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-sm bg-cream">
                  <Image
                    src={product.maker.image}
                    alt={product.maker.name}
                    fill
                    className="object-cover"
                    sizes="112px"
                  />
                </div>
              )}
              <div>
                <p className="font-serif text-xl text-warm-brown">{product.maker.name}</p>
                <p className="mt-1 text-sm font-medium tracking-wide text-accent">
                  {product.maker.craft}
                </p>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
                  {product.maker.bio.length > 220
                    ? `${product.maker.bio.slice(0, 220).trimEnd()}…`
                    : product.maker.bio}
                </p>
                <Link
                  href={localizedPath(`/makers/${product.maker.slug}`, locale)}
                  className="mt-4 inline-flex text-sm font-medium text-warm-brown transition-colors hover:text-accent"
                >
                  {translations.product.viewMakerWorks} →
                </Link>
              </div>
            </div>
          </section>
        )}

        {relatedProducts.length > 0 && (
          <section className="mt-16 border-t border-border pt-10">
            <h2 className="mb-8 font-serif text-2xl text-warm-brown">
              {translations.product.relatedProducts}
            </h2>
            <div className="grid gap-6 grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} locale={locale} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
