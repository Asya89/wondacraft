import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { getTranslations, type Locale } from '@/lib/i18n';
import { localizedPath } from '@/lib/i18n/path';
import type { ProductWithRelations } from '@/server/services/product.service';

interface ProductCardProps {
  product: ProductWithRelations;
  locale: Locale;
}

export function ProductCard({ product, locale }: ProductCardProps) {
  const mainImage = product.images.find((img) => img.isMain) ?? product.images[0];
  const translations = getTranslations(locale);

  return (
    <Link href={localizedPath(`/products/${product.slug}`, locale)} className="group block animate-fade-in">
      <article className="overflow-hidden rounded-sm bg-card shadow-sm transition-shadow duration-300 hover:shadow-md">
        <div className="relative aspect-square overflow-hidden bg-cream">
          {mainImage ? (
            <Image
              src={mainImage.imageUrl}
              alt={mainImage.alt ?? product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted">No image</div>
          )}
          <div className="absolute left-3 top-3 flex gap-2">
            {product.isNew && (
              <span className="rounded-sm bg-accent/90 px-2 py-0.5 text-xs text-white">
                {translations.common.new}
              </span>
            )}
            {product.isFeatured && (
              <span className="rounded-sm bg-warm-brown/90 px-2 py-0.5 text-xs text-white">
                {translations.common.featured}
              </span>
            )}
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-serif text-base text-foreground group-hover:text-warm-brown">
            {product.name}
          </h3>
          {product.size && <p className="mt-1 text-xs text-muted">{product.size}</p>}
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-sm font-medium text-warm-brown">{formatPrice(product.price)}</span>
            {product.oldPrice && (
              <span className="text-xs text-muted line-through">{formatPrice(product.oldPrice)}</span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
