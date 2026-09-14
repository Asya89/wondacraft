import Link from 'next/link';
import { getAllOrdersAdmin } from '@/server/services/order.service';
import { formatPrice, formatDate } from '@/lib/utils';
import { OrderStatus } from '@prisma/client';
import { ORDER_STATUS_LABELS } from '@/lib/admin/order-status';

interface AdminOrdersPageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function AdminOrdersPage({ searchParams }: AdminOrdersPageProps) {
  const { status } = await searchParams;
  const orders = await getAllOrdersAdmin(
    status && status in OrderStatus ? (status as OrderStatus) : undefined,
  );

  const statuses = Object.values(OrderStatus);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Orders</h1>

      <div className="mb-4 flex gap-2">
        <Link
          href="/admin/orders"
          className={`rounded-sm px-3 py-1 text-sm ${!status ? 'bg-warm-brown text-white' : 'bg-white border'}`}
        >
          All
        </Link>
        {statuses.map((s) => (
          <Link
            key={s}
            href={`/admin/orders?status=${s}`}
            className={`rounded-sm px-3 py-1 text-sm ${status === s ? 'bg-warm-brown text-white' : 'bg-white border'}`}
          >
            {ORDER_STATUS_LABELS[s]}
          </Link>
        ))}
      </div>

      <div className="overflow-hidden rounded-sm border bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Order</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Customer</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Phone</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Total</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b last:border-0">
                <td className="px-4 py-3">
                  <Link href={`/admin/orders/${order.id}`} className="text-warm-brown hover:underline">
                    {order.orderNumber}
                  </Link>
                </td>
                <td className="px-4 py-3">{order.customerName}</td>
                <td className="px-4 py-3">{order.customerPhone}</td>
                <td className="px-4 py-3">{formatPrice(order.totalAmount)}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs">
                    {ORDER_STATUS_LABELS[order.status]}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500">{formatDate(order.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
