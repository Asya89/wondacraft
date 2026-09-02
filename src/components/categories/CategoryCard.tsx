import Image from 'next/image';
import Link from 'next/link';
import { formatMessage, getTranslations, type Locale } from '@/lib/i18n';
import { localizedPath } from '@/lib/i18n/path';
import type { CategoryWithRelations } from '@/server/services/category.service';

interface CategoryCardProps {
  category: CategoryWithRelations;
  locale: Locale;
}

export function CategoryCard({ category, locale }: CategoryCardProps) {
  const translations = getTranslations(locale);

  return (
    <Link
      href={localizedPath(`/categories/${category.slug}`, locale)}
      className="category-card group block"
    >
      <article className="category-card-inner">
        <div className="category-card-media">
          {category.image ? (
            <Image
              src={category.image}
              alt={category.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="category-card-image object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-beige px-4 text-center font-serif text-lg text-muted">
              {category.name}
            </div>
          )}
          <span className="category-card-shimmer" aria-hidden />
        </div>

        <div className="category-card-body">
          <span className="category-card-accent" aria-hidden>
            ✦
          </span>
          <h3 className="category-card-title font-serif text-xl text-warm-brown">{category.name}</h3>
          {category.description && (
            <p className="category-card-description">{category.description}</p>
          )}
          <div className="category-card-footer">
            {category._count.products > 0 ? (
              <p className="category-card-count">
                {formatMessage(translations.common.productCount, { count: category._count.products })}
              </p>
            ) : (
              <span className="category-card-count">&nbsp;</span>
            )}
            <span className="category-card-arrow" aria-hidden>
              →
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
