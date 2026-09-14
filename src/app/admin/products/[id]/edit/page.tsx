import { notFound } from 'next/navigation';
import { getProductByIdAdmin } from '@/server/services/product.service';
import { getAllCategoriesFlat } from '@/server/services/category.service';
import { getMakers } from '@/server/services/maker.service';
import { ProductForm } from '@/components/admin/ProductForm';
import { updateProductAction, deleteProductFormAction } from '@/app/actions/admin';
import { ProductImageManager } from '@/components/admin/ProductImageManager';
import { Button } from '@/components/ui/Button';

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const [product, categories, makers] = await Promise.all([
    getProductByIdAdmin(id),
    getAllCategoriesFlat(),
    getMakers(true),
  ]);

  if (!product) notFound();

  const boundUpdate = updateProductAction.bind(null, id);
  const boundDelete = deleteProductFormAction.bind(null, id);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold break-words sm:text-2xl">Edit: {product.name}</h1>
        <form action={boundDelete}>
          <Button type="submit" variant="danger" size="sm">
            Delete
          </Button>
        </form>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <ProductForm
          categories={categories}
          makers={makers}
          product={product}
          action={boundUpdate}
        />
        <ProductImageManager product={product} />
      </div>
    </div>
  );
}
