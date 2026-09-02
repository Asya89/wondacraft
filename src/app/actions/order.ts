'use server';

import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { createOrder } from '@/server/services/order.service';
import { singleProductOrderSchema } from '@/lib/validations';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import { defaultLocale, isLocale } from '@/lib/i18n/config';
import { localizedPath } from '@/lib/i18n/path';

export async function submitOrderAction(
  _prevState: { error?: string } | null,
  formData: FormData,
) {
  const headersList = await headers();
  const ip = getClientIp(headersList);
  const rateLimit = checkRateLimit(`order:${ip}`, 5, 60_000);

  if (!rateLimit.allowed) {
    return { error: 'Չափից շատ պատվերներ։ Խնդրում ենք սպասել։' };
  }

  const raw = {
    productId: formData.get('productId') as string,
    customerName: formData.get('customerName') as string,
    customerPhone: formData.get('customerPhone') as string,
    quantity: formData.get('quantity'),
    customerAddress: (formData.get('customerAddress') as string) || null,
    comment: (formData.get('comment') as string) || null,
  };

  const parsed = singleProductOrderSchema.safeParse(raw);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? 'Validation error';
    return { error: firstError };
  }

  try {
    const order = await createOrder({
      customerName: parsed.data.customerName,
      customerPhone: parsed.data.customerPhone,
      customerAddress: parsed.data.customerAddress,
      comment: parsed.data.comment,
      items: [{ productId: parsed.data.productId, quantity: parsed.data.quantity }],
    });

    const localeRaw = formData.get('locale');
    const locale = typeof localeRaw === 'string' && isLocale(localeRaw) ? localeRaw : defaultLocale;

    redirect(`${localizedPath('/order/success', locale)}?order=${order.orderNumber}`);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.startsWith('INSUFFICIENT_STOCK')) {
        return { error: 'Ապրանքը բավական առկա չէ' };
      }
      if (error.message === 'PRODUCT_NOT_FOUND') {
        return { error: 'Ապրանքը չի գտնվել' };
      }
    }
    return { error: 'Պատվերը չհաջողվեց ստեղծել' };
  }
}
