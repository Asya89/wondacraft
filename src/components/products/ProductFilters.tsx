'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { useLocale, useTranslations } from '@/contexts/LocaleContext';
import { localizedPath } from '@/lib/i18n/path';

interface ProductFiltersProps {
  categories: Array<{
    id: string;
    name: string;
    slug: string;
    parent: { name: string } | null;
  }>;
}

export function ProductFilters({ categories }: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const translations = useTranslations();

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete('page');
      router.push(`${localizedPath('/products', locale)}?${params.toString()}`);
    },
    [router, searchParams, locale],
  );

  return (
    <div className="flex flex-col gap-3 rounded-sm bg-cream p-4 sm:flex-row sm:flex-wrap">
      <div className="min-w-0 flex-1 sm:min-w-[200px]">
        <input
          type="search"
          placeholder={translations.products.searchPlaceholder}
          defaultValue={searchParams.get('search') ?? ''}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              updateParams('search', (e.target as HTMLInputElement).value);
            }
          }}
          className="w-full rounded-sm border border-border bg-card px-4 py-2.5 text-base focus:border-warm-brown focus:outline-none md:text-sm"
        />
      </div>

      <select
        value={searchParams.get('category') ?? ''}
        onChange={(e) => updateParams('category', e.target.value)}
        className="w-full rounded-sm border border-border bg-card px-4 py-2.5 text-base sm:w-auto md:text-sm"
      >
        <option value="">{translations.products.allCategories}</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.slug}>
            {cat.parent ? `${cat.parent.name} → ` : ''}
            {cat.name}
          </option>
        ))}
      </select>

      <select
        value={searchParams.get('sort') ?? 'newest'}
        onChange={(e) => updateParams('sort', e.target.value)}
        className="w-full max-w-full rounded-sm border border-border bg-card px-4 py-2.5 text-base sm:w-auto md:text-sm"
      >
        <option value="newest">{translations.products.sortNewest}</option>
        <option value="price_asc">{translations.products.sortPriceAsc}</option>
        <option value="price_desc">{translations.products.sortPriceDesc}</option>
        <option value="name">{translations.products.sortName}</option>
      </select>
    </div>
  );
}
