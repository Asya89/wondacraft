'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import type { CategoryWithRelations } from '@/server/services/category.service';

interface CategoryFormProps {
  category?: CategoryWithRelations;
  parentCategories: Array<{ id: string; name: string; parent: { name: string } | null }>;
  action: (formData: FormData) => Promise<{ error?: string; success?: boolean } | void>;
}

export function CategoryForm({ category, parentCategories, action }: CategoryFormProps) {
  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string; success?: boolean } | null, formData: FormData) => {
      const result = await action(formData);
      return result ?? { success: true };
    },
    null,
  );

  const parentOptions = [
    { value: '', label: 'None (root category)' },
    ...parentCategories.map((c) => ({
      value: c.id,
      label: c.parent ? `${c.parent.name} → ${c.name}` : c.name,
    })),
  ];

  return (
    <form action={formAction} className="max-w-lg space-y-4 rounded-sm border bg-white p-4 shadow-sm sm:p-6">
      <Input name="name" label="Name *" defaultValue={category?.name} required />
      <Input name="slug" label="Slug" defaultValue={category?.slug ?? ''} />
      <Textarea name="description" label="Description" defaultValue={category?.description ?? ''} />
      <Input name="image" label="Image URL" defaultValue={category?.image ?? ''} />
      <Select
        name="parentId"
        label="Parent Category"
        options={parentOptions}
        defaultValue={category?.parentId ?? ''}
      />
      <Input name="sortOrder" label="Sort Order" type="number" defaultValue={category?.sortOrder ?? 0} />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="isActive" defaultChecked={category?.isActive ?? true} />
        Active
      </label>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.success && <p className="text-sm text-green-600">Saved successfully</p>}

      <Button type="submit" loading={pending}>
        {category ? 'Save Changes' : 'Create Category'}
      </Button>
    </form>
  );
}
