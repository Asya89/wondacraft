'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import type { ProductWithRelations } from '@/server/services/product.service';

interface ProductFormProps {
  categories: Array<{ id: string; name: string; parent: { name: string } | null }>;
  product?: ProductWithRelations;
  action: (formData: FormData) => Promise<{ error?: string; success?: boolean } | void>;
}

export function ProductForm({ categories, product, action }: ProductFormProps) {
  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string; success?: boolean } | null, formData: FormData) => {
      const result = await action(formData);
      return result ?? { success: true };
    },
    null,
  );

  const categoryOptions = categories.map((c) => ({
    value: c.id,
    label: c.parent ? `${c.parent.name} → ${c.name}` : c.name,
  }));

  return (
    <form action={formAction} className="space-y-4 rounded-sm border bg-white p-6 shadow-sm">
      <Input name="name" label="Name *" defaultValue={product?.name} required />
      <Input name="slug" label="Slug" defaultValue={product?.slug ?? ''} placeholder="Auto-generated if empty" />
      <Select
        name="categoryId"
        label="Category *"
        options={[{ value: '', label: 'Select...' }, ...categoryOptions]}
        defaultValue={product?.categoryId ?? ''}
        required
      />
      <Input name="shortDescription" label="Short Description" defaultValue={product?.shortDescription ?? ''} />
      <Textarea name="description" label="Description" defaultValue={product?.description ?? ''} rows={5} />
      <div className="grid grid-cols-2 gap-4">
        <Input name="price" label="Price (AMD) *" type="number" defaultValue={product?.price ?? 0} required />
        <Input name="oldPrice" label="Old Price" type="number" defaultValue={product?.oldPrice ?? ''} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input name="sku" label="SKU" defaultValue={product?.sku ?? ''} />
        <Input name="stock" label="Stock *" type="number" defaultValue={product?.stock ?? 0} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input name="material" label="Material" defaultValue={product?.material ?? ''} />
        <Input name="size" label="Size" defaultValue={product?.size ?? ''} />
      </div>
      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="isFeatured" defaultChecked={product?.isFeatured} />
          Featured
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="isNew" defaultChecked={product?.isNew} />
          New
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="isActive" defaultChecked={product?.isActive ?? true} />
          Active
        </label>
      </div>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.success && <p className="text-sm text-green-600">Saved successfully</p>}

      <Button type="submit" loading={pending}>
        {product ? 'Save Changes' : 'Create Product'}
      </Button>
    </form>
  );
}
