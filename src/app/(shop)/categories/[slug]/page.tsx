import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getCategoryProducts } from '@/server/services/category.service';
import { ProductCard } from '@/components/products/ProductCard';
import { t } from '@/lib/i18n';
import type { ProductSortOption } from '@/server/services/product.service';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sort?: string; page?: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getCategoryProducts(slug, { limit: 1 });
  if (!result) return { title: 'Not found' };
  return {
    title: result.category.name,
    description: result.category.description ?? undefined,
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const sp = await searchParams;
  const page = parseInt(sp.page ?? '1', 10);
  const sort = (sp.sort as ProductSortOption) ?? 'newest';

  const result = await getCategoryProducts(slug, { page, sort });
  if (!result) notFound();

  const { category, products, totalPages } = result;
  const translations = t();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
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
          <div className="absolute bottom-0 left-0 p-6">
            <h1 className="font-serif text-3xl text-white sm:text-4xl">{category.name}</h1>
          </div>
        </div>
      )}

      {!category.image && (
        <h1 className="mb-4 font-serif text-3xl text-warm-brown">{category.name}</h1>
      )}

      {category.description && (
        <p className="mb-8 max-w-2xl text-muted">{category.description}</p>
      )}

      <div className="mb-6 flex gap-4">
        {(['newest', 'price_asc', 'price_desc', 'name'] as const).map((s) => (
          <a
            key={s}
            href={`/categories/${slug}?sort=${s}`}
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
          <div className="grid gap-6 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-10 flex justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <a
                  key={p}
                  href={`/categories/${slug}?page=${p}&sort=${sort}`}
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
