import { notFound } from 'next/navigation';
import { getOrderByIdAdmin } from '@/server/services/order.service';
import { formatPrice, formatDate } from '@/lib/utils';
import { updateOrderStatusFormAction } from '@/app/actions/admin';
import { Button } from '@/components/ui/Button';
import { OrderStatus } from '@prisma/client';
import { ORDER_STATUS_HELP, ORDER_STATUS_LABELS } from '@/lib/admin/order-status';

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <dt className="text-gray-500">{label}</dt>
      <dd className="mt-0.5 whitespace-pre-line break-words">{value?.trim() ? value : '—'}</dd>
    </div>
  );
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;
  const order = await getOrderByIdAdmin(id);
  if (!order) notFound();

  const boundUpdate = updateOrderStatusFormAction.bind(null, id);

  return (
    <div>
      <h1 className="mb-2 text-xl font-semibold break-words sm:text-2xl">Order {order.orderNumber}</h1>
      <p className="mb-6 text-sm text-gray-500">{formatDate(order.createdAt)}</p>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-sm border bg-white p-4 shadow-sm sm:p-6">
          <h2 className="mb-4 font-medium">Customer</h2>
          <dl className="space-y-3 text-sm">
            <Field label="Name" value={order.customerName} />
            <Field label="Phone" value={order.customerPhone} />
            <Field label="City" value={order.customerCity} />
            <Field label="Address" value={order.customerAddress} />
            <Field label="Customer comment" value={order.comment} />
          </dl>
        </div>

        <div className="rounded-sm border bg-white p-4 shadow-sm sm:p-6">
          <h2 className="mb-4 font-medium">Status</h2>
          <dl className="mb-4 space-y-2 text-sm">
            <div>
              <dt className="text-gray-500">Order Status</dt>
              <dd>{ORDER_STATUS_LABELS[order.status]}</dd>
              <p className="mt-1 text-xs leading-relaxed text-gray-500">
                {ORDER_STATUS_HELP[order.status]}
              </p>
            </div>
            <div>
              <dt className="text-gray-500">Payment Status</dt>
              <dd>{order.paymentStatus}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Payment Method</dt>
              <dd>{order.paymentMethod}</dd>
            </div>
          </dl>

          <form action={boundUpdate} className="space-y-3">
            <select name="status" defaultValue={order.status} className="w-full rounded border px-3 py-2 text-sm">
              {Object.values(OrderStatus).map((s) => (
                <option key={s} value={s}>
                  {ORDER_STATUS_LABELS[s]}
                </option>
              ))}
            </select>
            <p className="text-xs leading-relaxed text-gray-500">{ORDER_STATUS_HELP[order.status]}</p>
            <Button type="submit" size="sm">
              Update
            </Button>
          </form>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-sm border bg-white p-4 shadow-sm sm:p-6">
        <h2 className="mb-4 font-medium">Items</h2>
        <table className="w-full min-w-[480px] text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2 text-left">Product</th>
              <th className="py-2 text-left">Qty</th>
              <th className="py-2 text-left">Unit Price</th>
              <th className="py-2 text-left">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id} className="border-b last:border-0">
                <td className="py-2">{item.productName}</td>
                <td className="py-2">{item.quantity}</td>
                <td className="py-2">{formatPrice(item.unitPrice)}</td>
                <td className="py-2">{formatPrice(item.totalPrice)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} className="pt-4 text-right font-medium">
                Total
              </td>
              <td className="pt-4 font-medium text-warm-brown">{formatPrice(order.totalAmount)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
