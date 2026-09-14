import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getProducts } from '@/server/services/product.service';
import { getAllCategoriesFlat } from '@/server/services/category.service';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductFilters } from '@/components/products/ProductFilters';
import { formatMessage, getTranslations, type Locale } from '@/lib/i18n';
import { localizedPath } from '@/lib/i18n/path';
import { isLocale } from '@/lib/i18n/config';
import type { ProductSortOption } from '@/server/services/product.service';

interface ProductsPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    category?: string;
    search?: string;
    sort?: string;
    page?: string;
    featured?: string;
    new?: string;
  }>;
}

export async function generateMetadata({ params }: ProductsPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale: Locale = isLocale(localeParam) ? localeParam : 'hy';
  const translations = getTranslations(locale);
  return {
    title: translations.products.title,
    description: translations.products.description,
  };
}

export default async function ProductsPage({ params, searchParams }: ProductsPageProps) {
  const { locale: localeParam } = await params;
  const locale: Locale = isLocale(localeParam) ? localeParam : 'hy';
  const query = await searchParams;
  const page = parseInt(query.page ?? '1', 10);
  const sort = (query.sort as ProductSortOption) ?? 'newest';

  const [{ products, total, totalPages }, categories] = await Promise.all([
    getProducts({
      categorySlug: query.category,
      search: query.search,
      isFeatured: query.featured === 'true' ? true : undefined,
      isNew: query.new === 'true' ? true : undefined,
      page,
      sort,
    }),
    getAllCategoriesFlat(),
  ]);

  const translations = getTranslations(locale);
  const productsBase = localizedPath('/products', locale);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-8 font-serif text-2xl text-warm-brown sm:text-3xl">{translations.products.title}</h1>

      <Suspense fallback={null}>
        <ProductFilters categories={categories} />
      </Suspense>

      {products.length === 0 ? (
        <div className="py-20 text-center text-muted">{translations.products.empty}</div>
      ) : (
        <>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} locale={locale} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-10 flex justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <a
                  key={p}
                  href={`${productsBase}?page=${p}${query.category ? `&category=${query.category}` : ''}${query.sort ? `&sort=${query.sort}` : ''}`}
                  className={`rounded-sm px-3 py-1 text-sm ${p === page ? 'bg-warm-brown text-white' : 'bg-cream text-muted hover:text-foreground'}`}
                >
                  {p}
                </a>
              ))}
            </div>
          )}

          <p className="mt-4 text-center text-xs text-muted">
            {formatMessage(translations.common.productCount, { count: total })}
          </p>
        </>
      )}
    </div>
  );
}
