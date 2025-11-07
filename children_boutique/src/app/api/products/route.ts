// src/app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import type { Session } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

// 🟢 GET - Fetch all products
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    const where = category ? { category } : {};
    
    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// 🟢 POST - Create new product (Admin only)
export async function POST(request: NextRequest) {
  try {
    const session = (await getServerSession(authOptions as any)) as Session | null;

    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // 🟡 Calculate profit and final selling price
    const originalPrice = parseFloat(body.originalPrice);
    const profitPercent = parseFloat(body.profitPercent);

    const profitAmount = (originalPrice * profitPercent) / 100;
    const sellingPrice = originalPrice + profitAmount;

    // 🟢 Create product with profit fields
    const product = await prisma.product.create({
   data: {
    name: body.name,
    description: body.description,
    category: body.category,
    quantity: parseInt(body.quantity),
    size: body.size,
    color: body.color,
    imageUrl: body.imageUrl,
    originalPrice: parseFloat(body.originalPrice),
    profitAmount: parseFloat(body.profit), // user manually enters
    price: parseFloat(body.originalPrice) + parseFloat(body.profit),
  },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
