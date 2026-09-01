import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { setMainProductImage } from '@/server/services/product.service';

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { imageId, productId } = await request.json();
  if (!imageId || !productId) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  await setMainProductImage(productId, imageId);
  return NextResponse.json({ success: true });
}
