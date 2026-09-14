import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { getTranslations, type Locale } from '@/lib/i18n';
import { localizedPath } from '@/lib/i18n/path';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    oldPrice: number | null;
    isNew: boolean;
    isFeatured: boolean;
    shortDescription?: string | null;
    size?: string | null;
    images: Array<{ imageUrl: string; alt: string | null; isMain: boolean }>;
  };
  locale: Locale;
}

export function ProductCard({ product, locale }: ProductCardProps) {
  const mainImage = product.images.find((img) => img.isMain) ?? product.images[0];
  const translations = getTranslations(locale);

  return (
    <Link href={localizedPath(`/products/${product.slug}`, locale)} className="product-card group block">
      <article className="product-card-inner">
        <div className="product-card-media">
          {mainImage ? (
            <Image
              src={mainImage.imageUrl}
              alt={mainImage.alt ?? product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="product-card-image object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-beige text-muted">No image</div>
          )}
          {(product.isNew || product.isFeatured) && (
            <div className="product-card-badges">
              {product.isNew && (
                <span className="product-card-badge product-card-badge--new">{translations.common.new}</span>
              )}
              {product.isFeatured && (
                <span className="product-card-badge product-card-badge--featured">
                  {translations.common.featured}
                </span>
              )}
            </div>
          )}
          <span className="product-card-shimmer" aria-hidden />
        </div>

        <div className="product-card-body">
          <span className="product-card-accent" aria-hidden>
            ✦
          </span>
          <h3 className="product-card-title font-serif text-lg text-warm-brown">{product.name}</h3>
          {(product.shortDescription || product.size) && (
            <p className="product-card-description">{product.shortDescription ?? product.size}</p>
          )}
          <div className="product-card-footer">
            <div className="product-card-price-wrap">
              <span className="product-card-price">{formatPrice(product.price)}</span>
              {product.oldPrice && (
                <span className="product-card-old-price">{formatPrice(product.oldPrice)}</span>
              )}
            </div>
            <span className="product-card-arrow" aria-hidden>
              →
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
