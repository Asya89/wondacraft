import Link from 'next/link';
import { getAllProductsAdmin } from '@/server/services/product.service';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export default async function AdminProductsPage() {
  const products = await getAllProductsAdmin();

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Products</h1>
        <Link href="/admin/products/create">
          <Button size="sm">+ Create Product</Button>
        </Link>
      </div>

      <div className="overflow-x-auto rounded-sm border bg-white shadow-sm">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Name</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Category</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Price</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Stock</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b last:border-0">
                <td className="px-4 py-3 font-medium">{product.name}</td>
                <td className="px-4 py-3 text-gray-500">{product.category.name}</td>
                <td className="px-4 py-3">{formatPrice(product.price)}</td>
                <td className="px-4 py-3">{product.stock}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${product.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}
                  >
                    {product.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    className="text-warm-brown hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
