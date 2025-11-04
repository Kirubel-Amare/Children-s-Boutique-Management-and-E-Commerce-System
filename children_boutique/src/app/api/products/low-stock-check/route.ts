// src/app/api/products/low-stock-check/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

const LOW_STOCK_THRESHOLD = 5;

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions as any) as any;
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Find products with low stock
    const lowStockProducts = await prisma.product.findMany({
      where: {
        quantity: {
          lte: LOW_STOCK_THRESHOLD,
        },
      },
    });

    // Create notifications for low stock products
    for (const product of lowStockProducts) {
      // Check if notification already exists for this product
      const existingNotification = await (prisma as any).notification.findFirst({
        where: {
          productId: product.id,
          type: 'low_stock',
          isRead: false,
        },
      });

      if (!existingNotification) {
        await (prisma as any).notification.create({
          data: {
            type: 'low_stock',
            title: 'Low Stock Alert',
            message: `${product.name} is running low (${product.quantity} items left)`,
            productId: product.id,
          },
        });
      }
    }

    return NextResponse.json({
      message: `Checked ${lowStockProducts.length} low stock products`,
      lowStockCount: lowStockProducts.length,
    });
  } catch (error) {
    console.error('Error checking low stock:', error);
    return NextResponse.json(
      { error: 'Failed to check low stock' },
      { status: 500 }
    );
  }
}