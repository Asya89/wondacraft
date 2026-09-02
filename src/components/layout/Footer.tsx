import Link from 'next/link';
import { getTranslations, type Locale } from '@/lib/i18n';
import { localizedPath } from '@/lib/i18n/path';
import { Logo } from '@/components/layout/Logo';

export function Footer({ locale }: { locale: Locale }) {
  const translations = getTranslations(locale);

  return (
    <footer className="border-t border-border bg-cream">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <Logo height={44} href={localizedPath('/', locale)} />
            <p className="mt-3 text-sm text-muted">{translations.home.aboutText.substring(0, 100)}...</p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-warm-brown">
              {translations.nav.products}
            </h3>
            <nav className="flex flex-col gap-2">
              <Link href={localizedPath('/products', locale)} className="text-sm text-muted hover:text-foreground">
                {translations.nav.products}
              </Link>
              <Link href={localizedPath('/about', locale)} className="text-sm text-muted hover:text-foreground">
                {translations.nav.about}
              </Link>
              <Link href={localizedPath('/contact', locale)} className="text-sm text-muted hover:text-foreground">
                {translations.nav.contact}
              </Link>
            </nav>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-warm-brown">
              {translations.contact.title}
            </h3>
            <div className="flex flex-col gap-2 text-sm text-muted">
              <a href="tel:+37499123456">+374 99 123 456</a>
              <a href="mailto:info@wondacraft.am">info@wondacraft.am</a>
              <a
                href="https://instagram.com/wondacraft"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted">
          © {new Date().getFullYear()} WondaCraft. {translations.footer.rights}
        </div>
      </div>
    </footer>
  );
}
