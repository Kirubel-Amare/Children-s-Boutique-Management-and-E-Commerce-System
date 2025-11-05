// src/app/api/orders/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    console.log('API route hit')
    console.log('Prisma available:', !!prisma)
    console.log('Order model available:', !!prisma?.order)

    // Read the request body ONLY ONCE
    const body = await request.json();
    console.log('Received order data:', JSON.stringify(body, null, 2))

    const { customerInfo, items, paymentMethod, subtotal, shippingFee, tax, total } = body;

    // Validate required fields
    if (!customerInfo?.email || !items?.length) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create order in database
    const order = await (prisma as any).order.create({
      data: {
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
        status: 'pending',
        orderItems: {
          create: items.map((item: any) => ({
            productId: item.product.id,
            quantity: item.quantity,
            price: item.product.price,
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

    // Update product quantities (in a real app, you'd want to handle stock properly)
    for (const item of items) {
      await prisma.product.update({
        where: { id: item.product.id },
        data: {
          quantity: {
            decrement: item.quantity,
          },
        },
      });
    }

    // Create notification for admin
    await prisma.notification.create({
      data: {
        type: 'new_order',
        title: 'New Order Received',
        message: `New order #${order.id} from ${customerInfo.firstName} ${customerInfo.lastName}`,
      },
    });

    return NextResponse.json({ 
      success: true, 
      orderId: order.id,
      orderNumber: `BOUTIQUE-${order.id}`
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const orders = await (prisma as any).order.findMany({
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

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}