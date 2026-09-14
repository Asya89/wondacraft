'use client';

import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { meaningfulImageAlt } from '@/lib/seo';

interface ProductGalleryProps {
  images: Array<{ id: string; imageUrl: string; alt: string | null; isMain: boolean }>;
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const sorted = [...images].sort((a, b) => (a.isMain ? -1 : b.isMain ? 1 : 0));
  const [activeIndex, setActiveIndex] = useState(0);
  const active = sorted[activeIndex] ?? sorted[0];

  if (!active) {
    return (
      <div className="aspect-square rounded-sm bg-cream flex items-center justify-center text-muted">
        No image
      </div>
    );
  }

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-sm bg-cream">
        <Image
          src={active.imageUrl}
          alt={meaningfulImageAlt(active.alt, productName)}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
      {sorted.length > 1 && (
        <div className="mt-4 flex gap-2 overflow-x-auto">
          {sorted.map((img, index) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={cn(
                'relative h-16 w-16 shrink-0 overflow-hidden rounded-sm border-2 transition-colors',
                index === activeIndex ? 'border-warm-brown' : 'border-transparent',
              )}
            >
              <Image
                src={img.imageUrl}
                alt={meaningfulImageAlt(img.alt, productName)}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
