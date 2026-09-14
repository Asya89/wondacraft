import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { defaultLocale, locales } from '@/lib/i18n/config';
import { localizedPath } from '@/lib/i18n/path';
import { getSiteUrl } from '@/lib/utils';

function languageAlternates(baseUrl: string, path: string): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of locales) {
    languages[locale] = `${baseUrl}${localizedPath(path, locale)}`;
  }
  languages['x-default'] = `${baseUrl}${localizedPath(path, defaultLocale)}`;
  return languages;
}

function localeEntries(
  baseUrl: string,
  path: string,
  options: {
    lastModified?: Date;
    changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
    priority: number;
  },
): MetadataRoute.Sitemap {
  const languages = languageAlternates(baseUrl, path);
  return locales.map((locale) => ({
    url: `${baseUrl}${localizedPath(path, locale)}`,
    lastModified: options.lastModified,
    changeFrequency: options.changeFrequency,
    priority: options.priority,
    alternates: { languages },
  }));
}

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

  const staticPages = [
    ...localeEntries(baseUrl, '/', { changeFrequency: 'weekly', priority: 1 }),
    ...localeEntries(baseUrl, '/products', { changeFrequency: 'daily', priority: 0.9 }),
    ...localeEntries(baseUrl, '/makers', { changeFrequency: 'weekly', priority: 0.6 }),
    ...localeEntries(baseUrl, '/about', { changeFrequency: 'monthly', priority: 0.5 }),
    ...localeEntries(baseUrl, '/contact', { changeFrequency: 'monthly', priority: 0.5 }),
  ];

  const productPages = products.flatMap((product) =>
    localeEntries(baseUrl, `/products/${product.slug}`, {
      lastModified: product.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.8,
    }),
  );

  const categoryPages = categories.flatMap((category) =>
    localeEntries(baseUrl, `/categories/${category.slug}`, {
      lastModified: category.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.7,
    }),
  );

  const makerPages = makers.flatMap((maker) =>
    localeEntries(baseUrl, `/makers/${maker.slug}`, {
      lastModified: maker.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.7,
    }),
  );

  return [...staticPages, ...productPages, ...categoryPages, ...makerPages];
}
