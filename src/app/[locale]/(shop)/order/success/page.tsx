import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getOrderByNumber } from '@/server/services/order.service';
import { formatPrice } from '@/lib/utils';
import { getTranslations, type Locale } from '@/lib/i18n';
import { localizedPath } from '@/lib/i18n/path';
import { isLocale } from '@/lib/i18n/config';
import { Button } from '@/components/ui/Button';

interface OrderSuccessPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ order?: string }>;
}

export async function generateMetadata({ params }: OrderSuccessPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale: Locale = isLocale(localeParam) ? localeParam : 'hy';
  return {
    title: getTranslations(locale).order.successTitle,
    robots: { index: false },
  };
}

export default async function OrderSuccessPage({ params, searchParams }: OrderSuccessPageProps) {
  const { locale: localeParam } = await params;
  const locale: Locale = isLocale(localeParam) ? localeParam : 'hy';
  const { order: orderNumber } = await searchParams;
  if (!orderNumber) notFound();

  const order = await getOrderByNumber(orderNumber);
  if (!order) notFound();

  const translations = getTranslations(locale);

  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center sm:px-6">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-cream">
        <span className="text-2xl text-warm-brown">✓</span>
      </div>
      <h1 className="font-serif text-3xl text-warm-brown">{translations.order.successTitle}</h1>
      <p className="mt-3 text-muted">{translations.order.successMessage}</p>

      <div className="mt-8 rounded-sm border border-border bg-card p-6 text-left">
        <p className="text-sm text-muted">{translations.order.orderNumber}</p>
        <p className="mt-1 font-mono text-lg font-medium">{order.orderNumber}</p>

        <div className="mt-4 border-t border-border pt-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm py-1">
              <span>
                {item.productName} × {item.quantity}
              </span>
              <span>{formatPrice(item.totalPrice)}</span>
            </div>
          ))}
          <div className="mt-2 flex justify-between border-t border-border pt-2 font-medium">
            <span>{translations.order.total}</span>
            <span className="text-warm-brown">{formatPrice(order.totalAmount)}</span>
          </div>
        </div>
      </div>

      <Link href={localizedPath('/products', locale)} className="mt-8 inline-block">
        <Button variant="outline">{translations.home.heroCta}</Button>
      </Link>
    </div>
  );
}
