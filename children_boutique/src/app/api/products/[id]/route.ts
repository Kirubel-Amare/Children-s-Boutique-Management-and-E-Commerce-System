// src/app/api/products/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession, Session } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// GET - Fetch single product
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    
    const product = await prisma.product.findUnique({
      where: { id }
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

// PUT - Update product (admin only)
export async function PUT(
  request: NextRequest,
  { params }: RouteParams  // Use the same RouteParams interface
) {
  try {
    const session = (await getServerSession(authOptions as any)) as Session | null;

    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params; // Await the params here
    
    console.log('=== UPDATE PRODUCT REQUEST ===');
    console.log('Product ID:', id);
    console.log('Full params:', await params);

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    console.log('Request body:', body);

    // Validate required fields
    const requiredFields = ['name', 'originalPrice', 'profitAmount', 'quantity', 'category', 'sizes', 'color'];
    for (const field of requiredFields) {
      if (!body[field] && body[field] !== 0) {
        console.log(`Missing field: ${field}`);
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Ensure sizes is properly formatted as array
    let sizesArray: string[];
    if (Array.isArray(body.sizes)) {
      sizesArray = body.sizes;
    } else if (typeof body.sizes === 'string') {
      try {
        sizesArray = JSON.parse(body.sizes);
      } catch {
        sizesArray = [body.sizes];
      }
    } else {
      sizesArray = [];
    }

    const originalPrice = parseFloat(body.originalPrice);
    const profitAmount = parseFloat(body.profitAmount);
    const sellingPrice = originalPrice + profitAmount;

    // Check if product exists first
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Update product
    const product = await prisma.product.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description || '',
        category: body.category,
        quantity: parseInt(body.quantity),
        sizes: sizesArray,
        color: body.color,
        imageUrl: body.imageUrl || '',
        originalPrice: originalPrice,
        profitAmount: profitAmount,
        price: sellingPrice,
      },
    });

    console.log('Updated product:', product);

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE - Delete product (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await getServerSession(authOptions as any) as Session | null;
    
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    await prisma.product.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}