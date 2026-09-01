'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import type { ProductWithRelations } from '@/server/services/product.service';

interface ProductImageManagerProps {
  product: ProductWithRelations;
}

export function ProductImageManager({ product }: ProductImageManagerProps) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('productId', product.id);

      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? 'Upload failed');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  async function setMain(imageId: string) {
    await fetch('/api/upload/set-main', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageId, productId: product.id }),
    });
    router.refresh();
  }

  async function deleteImage(imageId: string) {
    await fetch('/api/upload/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageId, productId: product.id }),
    });
    router.refresh();
  }

  return (
    <div className="rounded-sm border bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-medium">Images</h2>

      <div className="space-y-3">
        {product.images.map((img) => (
          <div key={img.id} className="flex items-center gap-3 rounded border p-2">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded">
              <Image src={img.imageUrl} alt={img.alt ?? ''} fill className="object-cover" sizes="64px" />
            </div>
            <div className="flex-1 text-sm">
              {img.isMain && <span className="rounded bg-warm-brown px-1.5 py-0.5 text-xs text-white">Main</span>}
            </div>
            <div className="flex gap-2">
              {!img.isMain && (
                <Button type="button" size="sm" variant="outline" onClick={() => setMain(img.id)}>
                  Set Main
                </Button>
              )}
              <Button type="button" size="sm" variant="danger" onClick={() => deleteImage(img.id)}>
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium mb-2">Upload Image</label>
        <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} />
        {uploading && <p className="mt-2 text-sm text-gray-500">Uploading...</p>}
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
}
