import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getCategoryBySlug, getCategoryProducts } from '@/server/services/category.service';
import { ProductCard } from '@/components/products/ProductCard';
import { JsonLd } from '@/components/seo/JsonLd';
import { getTranslations, type Locale } from '@/lib/i18n';
import { localizedPath } from '@/lib/i18n/path';
import { isLocale } from '@/lib/i18n/config';
import {
  breadcrumbJsonLd,
  buildCategoryDescription,
  buildPageMetadata,
  canonicalFor,
  collectionPageJsonLd,
} from '@/lib/seo';
import type { ProductSortOption } from '@/server/services/product.service';

interface CategoryPageProps {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<{ sort?: string; page?: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug, locale: localeParam } = await params;
  const locale: Locale = isLocale(localeParam) ? localeParam : 'hy';
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: getTranslations(locale).category.notFound, robots: { index: false } };

  const description = buildCategoryDescription(category.name, category.description, locale);
  return buildPageMetadata({
    locale,
    path: `/categories/${category.slug}`,
    title: category.name,
    description,
    image: category.image,
    imageAlt: category.name,
  });
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug, locale: localeParam } = await params;
  const locale: Locale = isLocale(localeParam) ? localeParam : 'hy';
  const sp = await searchParams;
  const page = parseInt(sp.page ?? '1', 10);
  const sort = (sp.sort as ProductSortOption) ?? 'newest';

  const result = await getCategoryProducts(slug, { page, sort });
  if (!result) notFound();

  const { category, products, totalPages } = result;
  const translations = getTranslations(locale);
  const categoryBase = localizedPath(`/categories/${slug}`, locale);
  const categoryUrl = canonicalFor(`/categories/${slug}`, locale);
  const categoryDescription = buildCategoryDescription(category.name, category.description, locale);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <JsonLd
        data={collectionPageJsonLd({
          name: category.name,
          description: categoryDescription,
          url: categoryUrl,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: translations.seo.breadcrumbHome, url: canonicalFor('/', locale) },
          { name: category.name, url: categoryUrl },
        ])}
      />
      {category.image && (
        <div className="relative mb-8 h-48 overflow-hidden rounded-sm sm:h-64">
          <Image
            src={category.image}
            alt={category.name}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-foreground/20" />
          <div className="absolute bottom-0 left-0 p-4 sm:p-6">
            <h1 className="font-serif text-2xl text-white sm:text-4xl">{category.name}</h1>
          </div>
        </div>
      )}

      {!category.image && (
        <h1 className="mb-4 font-serif text-3xl text-warm-brown">{category.name}</h1>
      )}

      {category.description && (
        <p className="mb-8 max-w-2xl text-muted">{category.description}</p>
      )}

      <div className="mb-6 flex flex-wrap gap-x-4 gap-y-2">
        {(['newest', 'price_asc', 'price_desc', 'name'] as const).map((s) => (
          <a
            key={s}
            href={`${categoryBase}?sort=${s}`}
            className={`text-sm ${sort === s ? 'text-warm-brown font-medium' : 'text-muted hover:text-foreground'}`}
          >
            {s === 'newest' && translations.products.sortNewest}
            {s === 'price_asc' && translations.products.sortPriceAsc}
            {s === 'price_desc' && translations.products.sortPriceDesc}
            {s === 'name' && translations.products.sortName}
          </a>
        ))}
      </div>

      {products.length === 0 ? (
        <div className="py-20 text-center text-muted">{translations.category.empty}</div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} locale={locale} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-10 flex justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <a
                  key={p}
                  href={`${categoryBase}?page=${p}&sort=${sort}`}
                  className={`rounded-sm px-3 py-1 text-sm ${p === page ? 'bg-warm-brown text-white' : 'bg-cream text-muted'}`}
                >
                  {p}
                </a>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
