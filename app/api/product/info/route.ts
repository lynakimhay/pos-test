import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Update with your Prisma setup

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch product detSails' }, { status: 500 });
  }
}
