// src/app/api/orders/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sendOrderApprovalNotification, sendOrderRejectionNotification } from '@/lib/email';

// Note: In Next.js 14, params is a Promise
interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    // Await the params to get the actual values
    const { id } = await params;

    const body = await request.json();
    const { status, adminNotes, approvedBy } = body;

    console.log(`🔄 Updating order ${id} to status: ${status}`);

    // Find the order
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Prevent updating completed or cancelled orders
    if (order.status === 'COMPLETED' || order.status === 'CANCELLED') {
      return NextResponse.json(
        { error: 'Cannot modify completed or cancelled orders' },
        { status: 400 }
      );
    }

    const updateData: any = {
      status,
      adminNotes,
      updatedAt: new Date(),
    };

    let updatedOrder;

    // If approving, set approvedBy and approvedAt, and update stock
    if (status === 'APPROVED') {
      updateData.approvedBy = approvedBy;
      updateData.approvedAt = new Date();

      console.log('📦 Checking stock availability and updating quantities...');

      // Check stock availability first
      const stockIssues = [];
      for (const item of order.orderItems) {
        const product = await prisma.product.findUnique({
          where: { id: item.productId }
        });

        if (!product) {
          stockIssues.push(`Product ${item.productName} not found`);
        } else if (product.quantity < item.quantity) {
          stockIssues.push(
            `Insufficient stock for ${item.productName}. Available: ${product.quantity}, Requested: ${item.quantity}`
          );
        }
      }

      if (stockIssues.length > 0) {
        return NextResponse.json(
          { 
            error: 'Stock issues prevented order approval',
            issues: stockIssues 
          },
          { status: 400 }
        );
      }

      // Update product quantities (reduce stock)
      console.log('🔄 Updating product quantities...');
      for (const item of order.orderItems) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            quantity: {
              decrement: item.quantity,
            },
          },
        });
        console.log(`✅ Reduced stock for ${item.productName} by ${item.quantity}`);
      }

      // Update the order
      updatedOrder = await prisma.order.update({
        where: { id },
        data: updateData,
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
        },
      });

      // Send approval email to customer
      try {
        console.log('📨 Sending approval notification to customer...');
        await sendOrderApprovalNotification(updatedOrder);
        console.log('✅ Approval email sent to customer');
      } catch (emailError) {
        console.error('❌ Failed to send approval email:', emailError);
      }

    } else if (status === 'REJECTED') {
      // If rejecting, just update status and send rejection email
      updatedOrder = await prisma.order.update({
        where: { id },
        data: updateData,
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
        },
      });

      // Send rejection email to customer
      try {
        console.log('📨 Sending rejection notification to customer...');
        await sendOrderRejectionNotification(updatedOrder, adminNotes);
        console.log('✅ Rejection email sent to customer');
      } catch (emailError) {
        console.error('❌ Failed to send rejection email:', emailError);
      }

    } else {
      // For other status changes (COMPLETED, CANCELLED)
      updatedOrder = await prisma.order.update({
        where: { id },
        data: updateData,
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
        },
      });
    }

    // Create notification
    await prisma.notification.create({
      data: {
        type: 'order_updated',
        title: `Order ${status.toLowerCase()}`,
        message: `Order #${order.orderNumber} has been ${status.toLowerCase()}.`,
      },
    });

    console.log(`✅ Order ${order.orderNumber} updated to: ${status}`);

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('💥 Error updating order:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update order',
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // Await the params to get the actual values
    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}