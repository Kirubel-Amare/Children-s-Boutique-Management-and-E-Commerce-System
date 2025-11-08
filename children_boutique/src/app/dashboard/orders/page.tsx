'use client';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import SidebarLayout from '@/components/layout/SidebarLayout';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { PageHeader } from '@/components/orders/PageHeader';
import { OrderSummaryCards } from '@/components/orders/OrderSummaryCards';
import { OrderStatusOverview } from '@/components/orders/OrderStatusOverview';
import { OrdersTable } from '@/components/orders/OrdersTable';
import { useOrders } from '@/hooks/useOrders';
import { useOrderMetrics } from '@/hooks/useOrderMetrics';

export default function AdminOrdersPage() {
  const {
    orders,
    products,
    loading,
    updating, 
    statusFilter,
    setStatusFilter,
    updateOrderStatus,
  } = useOrders('');

  const { metrics, calculateOrderProfit } = useOrderMetrics(orders, products);

  const handleUpdateOrderStatus = async (orderId: string, status: string, notes?: string) => {
    try {
      await updateOrderStatus(orderId, status, notes);
    } catch (error) {
      alert('Failed to update order status');
    }
  };

  if (loading) {
    return (
      <ProtectedRoute requiredRole="ADMIN">
        <SidebarLayout>
          <LoadingSpinner message="Loading orders..." />
        </SidebarLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole="ADMIN">
      <SidebarLayout>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <PageHeader
              title="Order Management"
              description="Review and manage customer orders"
            />

            <OrderSummaryCards metrics={metrics} />
            <OrderStatusOverview metrics={metrics} />

            <OrdersTable
              orders={orders}
              products={products}
              updating={updating}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              calculateOrderProfit={calculateOrderProfit}
            />
          </div>
        </div>
      </SidebarLayout>
    </ProtectedRoute>
  );
}