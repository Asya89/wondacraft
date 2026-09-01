import { getDashboardStats } from '@/server/services/order.service';
import { formatPrice, formatDate } from '@/lib/utils';
import Link from 'next/link';

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const statCards = [
    { label: 'Total Products', value: stats.totalProducts },
    { label: 'Active Products', value: stats.activeProducts },
    { label: 'Total Orders', value: stats.totalOrders },
    { label: 'Pending Orders', value: stats.pendingOrders },
    { label: 'Completed Orders', value: stats.completedOrders },
    { label: 'Revenue (Completed)', value: formatPrice(stats.totalRevenue) },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card) => (
          <div key={card.label} className="rounded-sm border bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">{card.label}</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="mb-4 text-lg font-medium">Recent Orders</h2>
        <div className="overflow-hidden rounded-sm border bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Order</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Customer</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Total</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Date</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map((order) => (
                <tr key={order.id} className="border-b last:border-0">
                  <td className="px-4 py-3">
                    <Link href={`/admin/orders/${order.id}`} className="text-warm-brown hover:underline">
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{order.customerName}</td>
                  <td className="px-4 py-3">{formatPrice(order.totalAmount)}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs text-yellow-800">
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{formatDate(order.createdAt)}</td>
                </tr>
              ))}
              {stats.recentOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    No orders yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
