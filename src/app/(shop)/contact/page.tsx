import type { Metadata } from 'next';
import { t } from '@/lib/i18n';

export const metadata: Metadata = {
  title: 'Կապ',
};

export default function ContactPage() {
  const translations = t();

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-serif text-4xl text-warm-brown">{translations.contact.title}</h1>
      <p className="mt-4 text-muted">{translations.contact.description}</p>

      <div className="mt-10 space-y-6">
        <div>
          <h2 className="text-sm font-medium uppercase tracking-wider text-warm-brown">
            {translations.contact.phone}
          </h2>
          <a href="tel:+37499123456" className="mt-1 block text-lg hover:text-warm-brown">
            +374 99 123 456
          </a>
        </div>
        <div>
          <h2 className="text-sm font-medium uppercase tracking-wider text-warm-brown">
            {translations.contact.email}
          </h2>
          <a href="mailto:info@wondacraft.am" className="mt-1 block text-lg hover:text-warm-brown">
            info@wondacraft.am
          </a>
        </div>
        <div>
          <h2 className="text-sm font-medium uppercase tracking-wider text-warm-brown">
            {translations.contact.instagram}
          </h2>
          <a
            href="https://instagram.com/wondacraft"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 block text-lg hover:text-warm-brown"
          >
            @wondacraft
          </a>
        </div>
      </div>
    </div>
  );
}
