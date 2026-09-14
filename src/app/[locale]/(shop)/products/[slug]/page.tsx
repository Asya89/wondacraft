import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductBySlug, getRelatedProducts } from '@/server/services/product.service';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductGallery } from '@/components/products/ProductGallery';
import { OrderForm } from '@/components/orders/OrderForm';
import { JsonLd } from '@/components/seo/JsonLd';
import { formatPrice } from '@/lib/utils';
import { getTranslations, type Locale } from '@/lib/i18n';
import { localizedPath } from '@/lib/i18n/path';
import { isLocale } from '@/lib/i18n/config';
import {
  breadcrumbJsonLd,
  buildPageMetadata,
  buildProductDescription,
  canonicalFor,
  meaningfulImageAlt,
  productJsonLd,
} from '@/lib/seo';

interface ProductPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug, locale: localeParam } = await params;
  const locale: Locale = isLocale(localeParam) ? localeParam : 'hy';
  const product = await getProductBySlug(slug);
  if (!product) return { title: getTranslations(locale).product.notFound, robots: { index: false } };

  const mainImage = product.images.find((image) => image.isMain) ?? product.images[0];
  const description = buildProductDescription({
    name: product.name,
    shortDescription: product.shortDescription,
    description: product.description,
    makerName: product.maker?.name,
    locale,
  });

  return buildPageMetadata({
    locale,
    path: `/products/${product.slug}`,
    title: product.name,
    description,
    image: mainImage?.imageUrl,
    images: product.images.map((image) => image.imageUrl),
    imageAlt: meaningfulImageAlt(mainImage?.alt, product.name),
  });
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug, locale: localeParam } = await params;
  const locale: Locale = isLocale(localeParam) ? localeParam : 'hy';
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const relatedProducts = await getRelatedProducts(product.categoryId, product.id);
  const translations = getTranslations(locale);
  const inStock = product.stock > 0;
  const productUrl = canonicalFor(`/products/${product.slug}`, locale);
  const schemaDescription = buildProductDescription({
    name: product.name,
    shortDescription: product.shortDescription,
    description: product.description,
    makerName: product.maker?.name,
    locale,
  });
  const makerUrl = product.maker ? canonicalFor(`/makers/${product.maker.slug}`, locale) : null;

  return (
    <>
      <JsonLd
        data={productJsonLd({
          name: product.name,
          description: schemaDescription,
          sku: product.sku,
          images: product.images.map((image) => image.imageUrl),
          price: product.price,
          inStock,
          url: productUrl,
          categoryName: product.category.name,
          makerName: product.maker?.name,
          makerUrl,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: translations.seo.breadcrumbHome, url: canonicalFor('/', locale) },
          { name: product.category.name, url: canonicalFor(`/categories/${product.category.slug}`, locale) },
          { name: product.name, url: productUrl },
        ])}
      />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2">
          <ProductGallery images={product.images} productName={product.name} />

          <div>
            <p className="text-sm text-muted">
              <Link
                href={localizedPath(`/categories/${product.category.slug}`, locale)}
                className="hover:text-warm-brown"
              >
                {product.category.name}
              </Link>
            </p>
            <h1 className="mt-1 font-serif text-2xl break-words text-warm-brown sm:text-3xl">{product.name}</h1>

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
                <Link
                  href={localizedPath(`/makers/${product.maker.slug}`, locale)}
                  className="relative h-28 w-28 shrink-0 overflow-hidden rounded-sm bg-cream"
                >
                  <Image
                    src={product.maker.image}
                    alt={`${product.maker.name} — ${product.maker.craft}`}
                    fill
                    className="object-cover"
                    sizes="112px"
                  />
                </Link>
              )}
              <div>
                <h3 className="font-serif text-xl break-words text-warm-brown">
                  <Link
                    href={localizedPath(`/makers/${product.maker.slug}`, locale)}
                    className="transition-colors hover:text-accent"
                  >
                    {product.maker.name}
                  </Link>
                </h3>
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
            <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
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
