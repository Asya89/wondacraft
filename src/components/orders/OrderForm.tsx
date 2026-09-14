'use client';

import { useActionState, useState } from 'react';
import { submitOrderAction } from '@/app/actions/order';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { formatPrice } from '@/lib/utils';
import { useLocale, useTranslations } from '@/contexts/LocaleContext';

interface OrderFormProps {
  productId: string;
  productName: string;
  price: number;
}

export function OrderForm({ productId, productName, price }: OrderFormProps) {
  const translations = useTranslations();
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(submitOrderAction, null);

  if (!open) {
    return (
      <Button size="lg" onClick={() => setOpen(true)} className="w-full sm:w-auto">
        {translations.product.order}
      </Button>
    );
  }

  return (
    <div className="rounded-sm border border-border bg-card p-4 shadow-sm sm:p-6">
      <h3 className="mb-4 font-serif text-xl break-words text-warm-brown">
        {translations.order.title}: {productName}
      </h3>
      <p className="mb-4 text-sm text-muted">{formatPrice(price)}</p>

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="productId" value={productId} />
        <input type="hidden" name="locale" value={locale} />

        <Input
          name="customerName"
          label={`${translations.order.name} *`}
          required
          autoComplete="name"
        />
        <Input
          name="customerPhone"
          label={`${translations.order.phone} *`}
          type="tel"
          placeholder="+37499123456"
          required
          autoComplete="tel"
        />
        <Input
          name="quantity"
          label={translations.order.quantity}
          type="number"
          min={1}
          max={10}
          defaultValue={1}
          required
        />
        <Input name="customerCity" label={translations.order.city} autoComplete="address-level2" />
        <Input name="customerAddress" label={translations.order.address} autoComplete="street-address" />
        <Textarea name="comment" label={translations.order.comment} rows={3} />

        <label className="flex items-start gap-3 text-sm leading-relaxed text-muted">
          <input
            type="checkbox"
            name="consent"
            required
            className="mt-0.5 h-5 w-5 shrink-0 rounded-sm border-border accent-warm-brown"
          />
          <span>{translations.order.consent}</span>
        </label>

        {state?.error && (
          <p className="rounded-sm bg-red-50 p-3 text-sm text-red-600 break-words">{state.error}</p>
        )}

        <div className="flex flex-col-reverse gap-3 sm:flex-row">
          <Button type="submit" loading={pending} className="w-full sm:w-auto">
            {translations.order.submit}
          </Button>
          <Button type="button" variant="outline" onClick={() => setOpen(false)} className="w-full sm:w-auto">
            {translations.common.cancel}
          </Button>
        </div>
      </form>
    </div>
  );
}
