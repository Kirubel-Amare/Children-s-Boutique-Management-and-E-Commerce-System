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
// src/app/api/products/route.ts - POST function
// src/app/api/products/route.ts - POST function
export async function POST(request: NextRequest) {
  try {
    const session = (await getServerSession(authOptions as any)) as Session | null;

    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    console.log('Received product data:', body);

    // Validate required fields
    const requiredFields = ['name', 'originalPrice', 'profitAmount', 'quantity', 'category', 'sizes', 'color'];
    for (const field of requiredFields) {
      if (!body[field] && body[field] !== 0) {
        console.log(`Missing required field: ${field}`);
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // 🟡 Calculate final price
    const originalPrice = parseFloat(body.originalPrice);
    const profitAmount = parseFloat(body.profitAmount);
    const sellingPrice = originalPrice + profitAmount;

    console.log('Calculated prices:', { originalPrice, profitAmount, sellingPrice });

    // Ensure sizes is properly formatted as array
    let sizesArray: string[];
    if (Array.isArray(body.sizes)) {
      sizesArray = body.sizes;
    } else if (typeof body.sizes === 'string') {
      // If it's a string, try to parse it as array or create array with single value
      try {
        sizesArray = JSON.parse(body.sizes);
      } catch {
        sizesArray = [body.sizes];
      }
    } else {
      sizesArray = [];
    }

    console.log('Processed sizes array:', sizesArray);

    // 🟢 Create product with profit fields
    const product = await prisma.product.create({
      data: {
        name: body.name,
        description: body.description || '',
        category: body.category,
        quantity: parseInt(body.quantity),
        sizes: sizesArray, // Store as array
        color: body.color,
        imageUrl: body.imageUrl || '',
        originalPrice: originalPrice,
        profitAmount: profitAmount,
        price: sellingPrice,
      },
    });

    console.log('Created product:', product);

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    
    let errorMessage = 'Failed to create product';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}