// app/admin/orders/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import SidebarLayout from '@/components/layout/SidebarLayout';
import Link from 'next/link';

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  status: string;
  subtotal: number;
  shippingFee: number;
  tax: number;
  total: number;
  paymentMethod: string;
  shippingAddress: any;
  createdAt: string;
  orderItems: OrderItem[];
}

interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    quantity: number;
  };
}

export default function AdminOrdersPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      if (!res.ok) throw new Error('Failed to fetch orders');
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId: string, status: string, notes?: string) => {
    setUpdating(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          adminNotes: notes,
          approvedBy: session?.user?.name,
        }),
      });

      if (!res.ok) throw new Error('Failed to update order');
      
      await fetchOrders(); // Refresh the list
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Failed to update order status');
    } finally {
      setUpdating(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadge = (status: string) => {
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(status)}`}>
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <ProtectedRoute requiredRole="ADMIN">
        <SidebarLayout>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
            <span className="ml-3 text-gray-600">Loading orders...</span>
          </div>
        </SidebarLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole="ADMIN">
      <SidebarLayout>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
              <p className="text-gray-600 mt-2">
                Review and manage customer orders
              </p>
            </div>

            {/* Orders List */}
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No orders found.</p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {orders.map((order) => (
                    <li key={order.id}>
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              {getStatusBadge(order.status)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {order.orderNumber}
                              </div>
                              <div className="text-sm text-gray-500">
                                {order.customerName} • {order.customerEmail}
                              </div>
                              <div className="text-sm text-gray-500">
                                ${order.total} • {new Date(order.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                            <Link
                              href={`/admin/orders/${order.id}`}
                              className="text-pink-600 hover:text-pink-900 text-sm font-medium"
                            >
                              View Details
                            </Link>
                            {order.status === 'PENDING' && (
                              <>
                                <button
                                  onClick={() => updateOrderStatus(order.id, 'APPROVED')}
                                  disabled={updating === order.id}
                                  className="text-green-600 hover:text-green-900 text-sm font-medium disabled:opacity-50"
                                >
                                  {updating === order.id ? 'Approving...' : 'Approve'}
                                </button>
                                <button
                                  onClick={() => {
                                    const reason = prompt('Reason for rejection:');
                                    if (reason) updateOrderStatus(order.id, 'REJECTED', reason);
                                  }}
                                  disabled={updating === order.id}
                                  className="text-red-600 hover:text-red-900 text-sm font-medium disabled:opacity-50"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            {order.status === 'APPROVED' && (
                              <button
                                onClick={() => updateOrderStatus(order.id, 'COMPLETED')}
                                disabled={updating === order.id}
                                className="text-blue-600 hover:text-blue-900 text-sm font-medium disabled:opacity-50"
                              >
                                {updating === order.id ? 'Completing...' : 'Mark Complete'}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </SidebarLayout>
    </ProtectedRoute>
  );
}