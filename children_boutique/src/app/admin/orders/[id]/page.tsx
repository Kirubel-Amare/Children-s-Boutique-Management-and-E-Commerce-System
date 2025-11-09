'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import SidebarLayout from '@/components/layout/SidebarLayout';
import { OrderHeader } from '@/components/orders/OrderHeader';
import { StockIssuesWarning } from '@/components/orders/StockIssuesWarning';
import { CustomerInfo } from '@/components/orders/CustomerInfo';
import { ShippingAddress } from '@/components/orders/ShippingAddress';
import { OrderItems } from '@/components/orders/OrderItems';
import { OrderActions } from '@/components/orders/OrderActions';
import { AdminNotes } from '@/components/orders/AdminNotes';
import { OrderTimeline } from '@/components/orders/OrderTimeline';
import { useOrder } from '@/hooks/useOrder';
import { useOrderNotes } from '@/hooks/useOrderNotes';

export default function OrderDetailPage() {
  const { data: session } = useSession();
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const { order, loading, updating, stockIssues, fetchOrder, updateOrderStatus } = useOrder(orderId);
  const { notes, updateNotes } = useOrderNotes(order?.adminNotes);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId, fetchOrder]);

  const handleStatusUpdate = async (status: string, updateNotes?: string) => {
    try {
      await updateOrderStatus({
        status: status as any,
        adminNotes: updateNotes || notes,
        approvedBy: session?.user?.name ?? undefined,
      });
      router.push('/admin/orders');
    } catch (error: any) {
      if (error.message.includes('Stock issues')) {
        alert(`Cannot approve order due to stock issues:\n${stockIssues.join('\n')}`);
      } else {
        alert('Failed to update order status');
      }
    }
  };

  const checkNotesRequired = () => {
    if (!notes.trim()) {
      alert('Please add admin notes before rejecting the order.');
      return false;
    }
    return true;
  };

  if (loading) {
    return (
      <ProtectedRoute requiredRole="ADMIN">
        <SidebarLayout>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
            <span className="ml-3 text-gray-600">Loading order...</span>
          </div>
        </SidebarLayout>
      </ProtectedRoute>
    );
  }

  if (!order) {
    return (
      <ProtectedRoute requiredRole="ADMIN">
        <SidebarLayout>
          <div className="text-center py-12">
            <p className="text-gray-500">Order not found.</p>
            <button
              onClick={() => router.push('/admin/orders')}
              className="mt-4 text-pink-600 hover:text-pink-700"
            >
              Back to Orders
            </button>
          </div>
        </SidebarLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole="ADMIN">
      <SidebarLayout>
        <div className="max-w-6xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <OrderHeader order={order} onBack={() => router.push('/admin/orders')} />

            <StockIssuesWarning 
              issues={stockIssues} 
              isPending={order.status === 'PENDING'} 
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Order Details */}
              <div className="lg:col-span-2 space-y-6">
                <CustomerInfo order={order} />
                <ShippingAddress order={order} />
                <OrderItems order={order} />
              </div>

              {/* Sidebar Actions */}
              <div className="space-y-6">
                <OrderActions
                  order={order}
                  updating={updating}
                  stockIssues={stockIssues}
                  onStatusUpdate={handleStatusUpdate}
                  onNotesRequired={checkNotesRequired}
                />
                <AdminNotes notes={notes} onNotesChange={updateNotes} />
                <OrderTimeline order={order} />
              </div>
            </div>
          </div>
        </div>
      </SidebarLayout>
    </ProtectedRoute>
  );
}