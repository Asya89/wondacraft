import Image from 'next/image';
import Link from 'next/link';
import type { CategoryWithRelations } from '@/server/services/category.service';

interface CategoryCardProps {
  category: CategoryWithRelations;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group block overflow-hidden rounded-sm bg-card shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-cream">
        {category.image ? (
          <Image
            src={category.image}
            alt={category.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-beige text-muted">
            {category.name}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 p-4">
          <h3 className="font-serif text-lg text-white">{category.name}</h3>
          {category._count.products > 0 && (
            <p className="text-xs text-white/80">{category._count.products} ապրանք</p>
          )}
        </div>
      </div>
    </Link>
  );
}
