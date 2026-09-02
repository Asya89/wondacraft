# Translations (i18n)

Supported locales: **hy** (default), **en**, **ru**

## Folder structure

```
src/lib/i18n/
  config.ts          # locale codes, default locale
  index.ts           # getTranslations(), formatMessage()
  path.ts            # localizedPath() helpers
  types.ts           # TranslationKey type
  locales/
    hy/index.ts      # Armenian UI strings — edit here
    en/index.ts      # English
    ru/index.ts      # Russian
```

## URLs

| Language | Example |
|----------|---------|
| Armenian | `/hy`, `/hy/products` |
| English | `/en`, `/en/products` |
| Russian | `/ru`, `/ru/products` |

`/products` redirects to `/hy/products`.

## Edit texts

Open the locale file and change strings:

- `src/lib/i18n/locales/hy/index.ts`
- `src/lib/i18n/locales/en/index.ts`
- `src/lib/i18n/locales/ru/index.ts`

All three files must keep the **same keys** (structure).

Placeholder example: `{count}` in `productCount` → use `formatMessage()` in code.

## Language switcher

Header shows **HY | EN | RU** buttons (desktop + mobile menu).
