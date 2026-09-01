import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { deleteProductImage } from '@/server/services/product.service';

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { imageId } = await request.json();
  if (!imageId) {
    return NextResponse.json({ error: 'Missing imageId' }, { status: 400 });
  }

  await deleteProductImage(imageId);
  return NextResponse.json({ success: true });
}
