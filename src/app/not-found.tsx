import Link from 'next/link';
import { t } from '@/lib/i18n';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  const translations = t();

  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <h1 className="font-serif text-6xl text-warm-brown">404</h1>
      <p className="mt-4 text-muted">{translations.errors.notFound}</p>
      <Link href="/" className="mt-8 inline-block">
        <Button>Գլխավոր</Button>
      </Link>
    </div>
  );
}
