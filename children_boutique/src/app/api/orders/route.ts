// src/app/api/orders/route.ts
import { NextRequest, NextResponse } from 'next/server';
import type { OrderStatus } from '@prisma/client';
import { prisma } from '@/lib/db';
import { sendAdminOrderNotification, sendCustomerOrderConfirmation } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    console.log('🎯 Orders API Route Hit');
    const body = await request.json();
    console.log('📦 Received order data');

    const { customerInfo, items, paymentMethod, subtotal, shippingFee, tax, total } = body;

    // Validate required fields
    if (!customerInfo?.email || !items?.length) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if products exist before creating order
    const productIds = items.map((item: any) => item.product.id);
    const existingProducts = await prisma.product.findMany({
      where: {
        id: { in: productIds }
      }
    });

    // If any products are missing, return error
    const missingProducts = productIds.filter((id: string) => 
      !existingProducts.find(p => p.id === id)
    );

    if (missingProducts.length > 0) {
      return NextResponse.json(
        { 
          error: 'Some products are no longer available',
          missingProducts 
        },
        { status: 400 }
      );
    }

    // Generate order number
    const orderNumber = `BOUTIQUE-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    console.log('🛒 Creating order in database...');

    // Create order in database with PENDING status
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
        shippingAddress: {
          street: customerInfo.address,
          city: customerInfo.city,
          zipCode: customerInfo.zipCode,
          country: customerInfo.country,
        },
        paymentMethod,
        subtotal,
        shippingFee,
        tax,
        total,
        status: 'PENDING',
        orderItems: {
          create: items.map((item: any) => ({
            productId: item.product.id,
            quantity: item.quantity,
            price: item.product.price,
            productName: item.product.name,
          })),
        },
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    console.log('✅ Order created successfully:', order.id);

    // Create notification for admin
    await prisma.notification.create({
      data: {
        type: 'new_order',
        title: 'New Order Received - Needs Approval',
        message: `New order #${order.orderNumber} from ${customerInfo.firstName} ${customerInfo.lastName} requires approval.`,
      },
    });

    console.log('📧 Sending email notifications...');

    // Send email notification to admin
    try {
      console.log('📨 Sending admin notification...');
      const adminResult = await sendAdminOrderNotification(order);
      if (adminResult.success) {
        console.log('✅ Admin notification sent successfully');
      } else {
        console.error('❌ Failed to send admin notification:', adminResult.error);
      }
    } catch (adminEmailError) {
      console.error('❌ Error sending admin email:', adminEmailError);
    }

    // Send confirmation email to customer
    try {
      console.log('📨 Sending customer confirmation...');
      const customerResult = await sendCustomerOrderConfirmation(order);
      if (customerResult.success) {
        console.log('✅ Customer confirmation sent successfully');
      } else {
        console.error('❌ Failed to send customer confirmation:', customerResult.error);
      }
    } catch (customerEmailError) {
      console.error('❌ Error sending customer email:', customerEmailError);
    }

    return NextResponse.json({ 
      success: true, 
      orderId: order.id,
      orderNumber: order.orderNumber,
      message: 'Order placed successfully! It is pending admin approval.'
    });
  } catch (error: any) {
    console.error('💥 Error creating order:', error);
    
    // More specific error handling
    if (error.code === 'P2003') {
      return NextResponse.json(
        { 
          error: 'Product not found. Please refresh the page and try again.',
          details: 'The product in your cart may no longer be available.'
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Failed to create order',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    const where = status ? { status: status as OrderStatus } : {};
    
    console.log('📋 Fetching orders with filter:', { status });
    
    const orders = await prisma.order.findMany({
      where,
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log(`✅ Found ${orders.length} orders`);
    return NextResponse.json(orders);
  } catch (error) {
    console.error('❌ Error fetching orders:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch orders',
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      },
      { status: 500 }
    );
  }
}