import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getProducts } from '@/server/services/product.service';
import { getAllCategoriesFlat } from '@/server/services/category.service';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductFilters } from '@/components/products/ProductFilters';
import { t } from '@/lib/i18n';
import type { ProductSortOption } from '@/server/services/product.service';

export const metadata: Metadata = {
  title: 'Ապրանքներ',
  description: 'Browse our handmade product collection',
};

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    sort?: string;
    page?: string;
    featured?: string;
    new?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page ?? '1', 10);
  const sort = (params.sort as ProductSortOption) ?? 'newest';

  const [{ products, total, totalPages }, categories] = await Promise.all([
    getProducts({
      categorySlug: params.category,
      search: params.search,
      isFeatured: params.featured === 'true' ? true : undefined,
      isNew: params.new === 'true' ? true : undefined,
      page,
      sort,
    }),
    getAllCategoriesFlat(),
  ]);

  const translations = t();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-8 font-serif text-3xl text-warm-brown">{translations.products.title}</h1>

      <Suspense fallback={null}>
        <ProductFilters categories={categories} />
      </Suspense>

      {products.length === 0 ? (
        <div className="py-20 text-center text-muted">{translations.products.empty}</div>
      ) : (
        <>
          <div className="mt-8 grid gap-6 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-10 flex justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <a
                  key={p}
                  href={`/products?page=${p}${params.category ? `&category=${params.category}` : ''}${params.sort ? `&sort=${params.sort}` : ''}`}
                  className={`rounded-sm px-3 py-1 text-sm ${p === page ? 'bg-warm-brown text-white' : 'bg-cream text-muted hover:text-foreground'}`}
                >
                  {p}
                </a>
              ))}
            </div>
          )}

          <p className="mt-4 text-center text-xs text-muted">
            {total} ապրանք
          </p>
        </>
      )}
    </div>
  );
}
