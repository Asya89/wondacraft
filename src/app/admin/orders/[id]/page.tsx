import { notFound } from 'next/navigation';
import { getOrderByIdAdmin } from '@/server/services/order.service';
import { formatPrice, formatDate } from '@/lib/utils';
import { updateOrderStatusFormAction } from '@/app/actions/admin';
import { Button } from '@/components/ui/Button';
import { OrderStatus } from '@prisma/client';

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;
  const order = await getOrderByIdAdmin(id);
  if (!order) notFound();

  const boundUpdate = updateOrderStatusFormAction.bind(null, id);

  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold">Order {order.orderNumber}</h1>
      <p className="mb-6 text-sm text-gray-500">{formatDate(order.createdAt)}</p>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-sm border bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-medium">Customer</h2>
          <dl className="space-y-2 text-sm">
            <div><dt className="text-gray-500">Name</dt><dd>{order.customerName}</dd></div>
            <div><dt className="text-gray-500">Phone</dt><dd>{order.customerPhone}</dd></div>
            {order.customerAddress && (
              <div><dt className="text-gray-500">Address</dt><dd>{order.customerAddress}</dd></div>
            )}
            {order.comment && (
              <div><dt className="text-gray-500">Comment</dt><dd>{order.comment}</dd></div>
            )}
          </dl>
        </div>

        <div className="rounded-sm border bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-medium">Status</h2>
          <dl className="mb-4 space-y-2 text-sm">
            <div><dt className="text-gray-500">Order Status</dt><dd>{order.status}</dd></div>
            <div><dt className="text-gray-500">Payment Status</dt><dd>{order.paymentStatus}</dd></div>
            <div><dt className="text-gray-500">Payment Method</dt><dd>{order.paymentMethod}</dd></div>
          </dl>

          <form action={boundUpdate} className="flex gap-2">
            <select name="status" defaultValue={order.status} className="rounded border px-3 py-2 text-sm">
              {Object.values(OrderStatus).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <Button type="submit" size="sm">Update</Button>
          </form>
        </div>
      </div>

      <div className="mt-6 rounded-sm border bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-medium">Items</h2>
        <table className="w-full text-sm">
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
              <td colSpan={3} className="pt-4 text-right font-medium">Total</td>
              <td className="pt-4 font-medium text-warm-brown">{formatPrice(order.totalAmount)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
