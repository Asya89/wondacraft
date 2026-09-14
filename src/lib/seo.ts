import type { Metadata } from 'next';
import { defaultLocale, locales, type Locale } from '@/lib/i18n/config';
import { formatMessage, getTranslations, localizedPath } from '@/lib/i18n';
import { siteContact } from '@/lib/site/contact';
import { getSiteUrl } from '@/lib/utils';

export const DEFAULT_SHARE_IMAGE = '/images/hero.webp';
export const DEFAULT_LOGO_IMAGE = '/images/logo.webp';

export const OG_LOCALE: Record<Locale, string> = {
  hy: 'hy_AM',
  en: 'en_US',
  ru: 'ru_RU',
};

export function toAbsoluteUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  const base = getSiteUrl().replace(/\/$/, '');
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalized}`;
}

export function canonicalFor(path: string, locale: Locale): string {
  return toAbsoluteUrl(localizedPath(path, locale));
}

export function languageAlternates(path: string): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of locales) {
    languages[locale] = canonicalFor(path, locale);
  }
  languages['x-default'] = canonicalFor(path, defaultLocale);
  return languages;
}

export function truncateMetaDescription(text: string, max = 160): string {
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (normalized.length <= max) return normalized;
  const sliced = normalized.slice(0, max - 1);
  const lastSpace = sliced.lastIndexOf(' ');
  const cut = lastSpace > 80 ? sliced.slice(0, lastSpace) : sliced;
  return `${cut.trimEnd()}…`;
}

export function meaningfulImageAlt(alt: string | null | undefined, fallback: string): string {
  const value = alt?.trim() ?? '';
  if (!value) return fallback;
  if (/^(image|photo|img\d+|picture)$/i.test(value)) return fallback;
  return value;
}

export function buildProductDescription(input: {
  name: string;
  shortDescription?: string | null;
  description?: string | null;
  makerName?: string | null;
  locale: Locale;
}): string {
  const translations = getTranslations(input.locale).seo;
  const details = (input.shortDescription || input.description || '').replace(/\s+/g, ' ').trim();
  let text = details
    ? details.startsWith(input.name)
      ? details
      : `${input.name}։ ${details}`
    : formatMessage(translations.productFallback, { name: input.name });

  if (input.makerName && !text.includes(input.makerName)) {
    text = `${text} ${formatMessage(translations.productMaker, { maker: input.makerName })}`;
  }

  return truncateMetaDescription(text);
}

export function buildCategoryDescription(
  name: string,
  description: string | null | undefined,
  locale: Locale,
): string {
  const fallback = formatMessage(getTranslations(locale).seo.categoryDescription, { name });
  const existing = description?.replace(/\s+/g, ' ').trim() ?? '';
  if (!existing) return truncateMetaDescription(fallback);
  if (existing.length >= 120) return truncateMetaDescription(existing);
  return truncateMetaDescription(`${existing} ${fallback}`);
}

export function buildMakerDescription(input: {
  name: string;
  craft: string;
  bio: string;
  locale: Locale;
}): string {
  return truncateMetaDescription(
    formatMessage(getTranslations(input.locale).seo.makerDescription, {
      name: input.name,
      craft: input.craft,
      bio: input.bio.replace(/\s+/g, ' ').trim(),
    }),
  );
}

function brandedTitle(title: string, absolute?: boolean): string {
  if (absolute) return title;
  if (/WondaCraft/i.test(title)) return title;
  return `${title} | WondaCraft`;
}

export function buildPageMetadata(options: {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  image?: string | null;
  images?: string[];
  imageAlt?: string;
  type?: 'website' | 'profile' | 'article';
  absoluteTitle?: boolean;
  index?: boolean;
}): Metadata {
  const url = canonicalFor(options.path, options.locale);
  const description = truncateMetaDescription(options.description);
  const fullTitle = brandedTitle(options.title, options.absoluteTitle);
  const imageSources =
    options.images?.filter(Boolean) ??
    (options.image ? [options.image] : [DEFAULT_SHARE_IMAGE]);
  const imageAlt = options.imageAlt ?? getTranslations(options.locale).seo.defaultImageAlt;
  const ogImages = imageSources.map((src) => ({
    url: toAbsoluteUrl(src),
    alt: imageAlt,
  }));

  return {
    title: options.absoluteTitle ? { absolute: options.title } : options.title,
    description,
    alternates: {
      canonical: url,
      languages: languageAlternates(options.path),
    },
    openGraph: {
      type: options.type ?? 'website',
      locale: OG_LOCALE[options.locale],
      alternateLocale: locales.filter((item) => item !== options.locale).map((item) => OG_LOCALE[item]),
      url,
      siteName: 'WondaCraft',
      title: fullTitle,
      description,
      images: ogImages,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: ogImages.map((image) => image.url),
    },
    robots:
      options.index === false
        ? { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false, noimageindex: true } }
        : { index: true, follow: true },
  };
}

export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export function organizationJsonLd(locale: Locale) {
  const translations = getTranslations(locale);
  const siteUrl = getSiteUrl();

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        name: 'WondaCraft',
        url: siteUrl,
        logo: toAbsoluteUrl(DEFAULT_LOGO_IMAGE),
        description: translations.seo.homeDescription,
        email: siteContact.email,
        telephone: siteContact.phone,
        sameAs: [siteContact.instagram],
      },
      {
        '@type': 'WebSite',
        name: 'WondaCraft',
        url: canonicalFor('/', locale),
        inLanguage: locale,
        description: translations.seo.homeDescription,
        publisher: {
          '@type': 'Organization',
          name: 'WondaCraft',
          url: siteUrl,
        },
      },
    ],
  };
}

export function productJsonLd(input: {
  name: string;
  description: string;
  sku?: string | null;
  images: string[];
  price: number;
  inStock: boolean;
  url: string;
  categoryName?: string | null;
  makerName?: string | null;
  makerUrl?: string | null;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: input.name,
    description: input.description,
    image: input.images.map((src) => toAbsoluteUrl(src)),
    ...(input.sku ? { sku: input.sku } : {}),
    brand: {
      '@type': 'Brand',
      name: 'WondaCraft',
    },
    ...(input.categoryName ? { category: input.categoryName } : {}),
    ...(input.makerName
      ? {
          creator: {
            '@type': 'Person',
            name: input.makerName,
            ...(input.makerUrl ? { url: input.makerUrl } : {}),
          },
        }
      : {}),
    offers: {
      '@type': 'Offer',
      url: input.url,
      price: String(input.price),
      priceCurrency: 'AMD',
      availability: input.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  };
}

export function personJsonLd(input: {
  name: string;
  craft: string;
  bio: string;
  url: string;
  image?: string | null;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: input.name,
    jobTitle: input.craft,
    description: input.bio,
    url: input.url,
    ...(input.image ? { image: toAbsoluteUrl(input.image) } : {}),
  };
}

export function collectionPageJsonLd(input: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: input.name,
    description: input.description,
    url: input.url,
    isPartOf: {
      '@type': 'WebSite',
      name: 'WondaCraft',
      url: getSiteUrl(),
    },
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
