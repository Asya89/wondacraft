import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { locales } from '@/lib/i18n/config';
import { localizedPath } from '@/lib/i18n/path';
import { getSiteUrl } from '@/lib/utils';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();

  const [products, categories, makers] = await Promise.all([
    prisma.product.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    }),
    prisma.category.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    }),
    prisma.maker.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    }),
  ]);

  const staticPaths = ['/', '/products', '/makers', '/about', '/contact'] as const;

  const staticPages: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    staticPaths.map((path) => ({
      url: `${baseUrl}${localizedPath(path, locale)}`,
      lastModified: new Date(),
      changeFrequency: path === '/' ? 'weekly' : path === '/products' ? 'daily' : 'monthly',
      priority: path === '/' ? 1 : path === '/products' ? 0.9 : 0.5,
    })),
  );

  const productPages: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    products.map((p) => ({
      url: `${baseUrl}${localizedPath(`/products/${p.slug}`, locale)}`,
      lastModified: p.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  );

  const categoryPages: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    categories.map((c) => ({
      url: `${baseUrl}${localizedPath(`/categories/${c.slug}`, locale)}`,
      lastModified: c.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  );

  const makerPages: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    makers.map((m) => ({
      url: `${baseUrl}${localizedPath(`/makers/${m.slug}`, locale)}`,
      lastModified: m.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  );

  return [...staticPages, ...productPages, ...categoryPages, ...makerPages];
}
