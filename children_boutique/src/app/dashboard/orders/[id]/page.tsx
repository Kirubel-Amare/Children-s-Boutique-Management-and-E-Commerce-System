// app/admin/orders/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import SidebarLayout from '@/components/layout/SidebarLayout';

interface Order {
  updatedAt: string;
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
  adminNotes?: string;
  approvedBy?: string;
  approvedAt?: string;
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

export default function OrderDetailPage() {
  const { data: session } = useSession();
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [notes, setNotes] = useState('');
  const [stockIssues, setStockIssues] = useState<string[]>([]);

  // Get the order ID from params
  const orderId = params.id as string;

  const fetchOrder = async () => {
    if (!orderId) return;
    
    try {
      const res = await fetch(`/api/orders/${orderId}`);
      if (!res.ok) throw new Error('Failed to fetch order');
      const data = await res.json();
      setOrder(data);
      setNotes(data.adminNotes || '');
      
      // Check stock availability
      checkStockAvailability(data);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkStockAvailability = (orderData: Order) => {
    const issues: string[] = [];
    orderData.orderItems.forEach(item => {
      if (item.product.quantity < item.quantity) {
        issues.push(
          `Insufficient stock for ${item.productName}. Available: ${item.product.quantity}, Required: ${item.quantity}`
        );
      }
    });
    setStockIssues(issues);
  };

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const updateOrderStatus = async (status: string) => {
    if (!orderId) return;
    
    setUpdating(true);
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

      if (!res.ok) {
        const errorData = await res.json();
        if (errorData.issues) {
          setStockIssues(errorData.issues);
          alert(`Cannot approve order due to stock issues:\n${errorData.issues.join('\n')}`);
          return;
        }
        throw new Error(errorData.error || 'Failed to update order');
      }
      
      await fetchOrder(); // Refresh order data
      router.push('/admin/orders');
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'APPROVED': return 'bg-green-100 text-green-800 border-green-200';
      case 'REJECTED': return 'bg-red-100 text-red-800 border-red-200';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'CANCELLED': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
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
            {/* Header */}
            <div className="mb-8">
              <button
                onClick={() => router.push('/admin/orders')}
                className="text-pink-600 hover:text-pink-700 mb-4 flex items-center"
              >
                ← Back to Orders
              </button>
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Order {order.orderNumber}</h1>
                  <p className="text-gray-600 mt-2">
                    Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                <span className={`inline-flex px-4 py-2 text-sm font-semibold rounded-full border ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
            </div>

            {/* Stock Issues Warning */}
            {stockIssues.length > 0 && order.status === 'PENDING' && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <h3 className="text-lg font-semibold text-red-800">Stock Issues Detected</h3>
                </div>
                <ul className="mt-2 text-red-700 list-disc list-inside">
                  {stockIssues.map((issue, index) => (
                    <li key={index}>{issue}</li>
                  ))}
                </ul>
                <p className="mt-2 text-red-600 text-sm">
                  Cannot approve order until stock issues are resolved.
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Order Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Customer Information */}
                <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Name</p>
                      <p className="text-sm text-gray-900">{order.customerName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Email</p>
                      <p className="text-sm text-gray-900">{order.customerEmail}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Phone</p>
                      <p className="text-sm text-gray-900">{order.customerPhone || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Payment Method</p>
                      <p className="text-sm text-gray-900">{order.paymentMethod.toUpperCase()}</p>
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h3>
                  <div className="text-sm text-gray-900">
                    <p className="font-medium">{order.customerName}</p>
                    <p>{order.shippingAddress.street}</p>
                    <p>{order.shippingAddress.city}, {order.shippingAddress.zipCode}</p>
                    <p>{order.shippingAddress.country}</p>
                  </div>
                </div>

                {/* Order Items with Stock Information */}
                <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
                  <div className="space-y-4">
                    {order.orderItems.map((item) => (
                      <div key={item.id} className="flex justify-between items-start py-3 border-b border-gray-200">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{item.productName}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                            <p className="text-sm text-gray-500">Price: ${item.price.toFixed(2)}</p>
                            <p className={`text-sm font-medium ${
                              item.product.quantity >= item.quantity ? 'text-green-600' : 'text-red-600'
                            }`}>
                              Stock: {item.product.quantity} available
                            </p>
                          </div>
                          {item.product.quantity < item.quantity && (
                            <p className="text-xs text-red-600 mt-1">
                              ⚠️ Insufficient stock! Need {item.quantity - item.product.quantity} more
                            </p>
                          )}
                        </div>
                        <p className="font-medium text-gray-900">${(item.quantity * item.price).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                    <div className="flex justify-between text-sm">
                      <p>Subtotal</p>
                      <p>${order.subtotal.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between text-sm">
                      <p>Shipping</p>
                      <p>${order.shippingFee.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between text-sm">
                      <p>Tax</p>
                      <p>${order.tax.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between text-lg font-semibold mt-2 pt-2 border-t border-gray-200">
                      <p>Total</p>
                      <p>${order.total.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-6">
                {/* Order Actions */}
                <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Actions</h3>
                  <div className="space-y-3">
                    {order.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => updateOrderStatus('APPROVED')}
                          disabled={updating || stockIssues.length > 0}
                          className="w-full bg-green-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                          {updating ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Processing...
                            </>
                          ) : (
                            '✅ Approve Order & Update Stock'
                          )}
                        </button>
                        <button
                          onClick={() => {
                            if (notes.trim() || window.confirm('Are you sure you want to reject this order without adding notes?')) {
                              updateOrderStatus('REJECTED');
                            }
                          }}
                          disabled={updating}
                          className="w-full bg-red-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                        >
                          {updating ? 'Rejecting...' : '❌ Reject Order'}
                        </button>
                      </>
                    )}
                    {order.status === 'APPROVED' && (
                      <button
                        onClick={() => updateOrderStatus('COMPLETED')}
                        disabled={updating}
                        className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                      >
                        {updating ? 'Completing...' : '🚚 Mark as Completed'}
                      </button>
                    )}
                    {(order.status === 'APPROVED' || order.status === 'COMPLETED') && (
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
                            updateOrderStatus('CANCELLED');
                          }
                        }}
                        disabled={updating}
                        className="w-full bg-gray-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors disabled:opacity-50"
                      >
                        {updating ? 'Cancelling...' : 'Cancel Order'}
                      </button>
                    )}
                  </div>
                  
                  {stockIssues.length > 0 && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        <strong>Note:</strong> Resolve stock issues before approving this order.
                      </p>
                    </div>
                  )}
                </div>

                {/* Admin Notes */}
                <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Notes</h3>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add notes about this order (required for rejection)..."
                    className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 resize-none"
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    These notes will be saved with the order and are required when rejecting orders.
                  </p>
                </div>

                {/* Order Timeline */}
                <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Timeline</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Created:</span>
                      <span>{new Date(order.createdAt).toLocaleString()}</span>
                    </div>
                    {order.approvedAt && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Approved:</span>
                        <span>{new Date(order.approvedAt).toLocaleString()}</span>
                      </div>
                    )}
                    {order.approvedBy && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Approved by:</span>
                        <span>{order.approvedBy}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last updated:</span>
                      <span>{new Date(order.updatedAt || order.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarLayout>
    </ProtectedRoute>
  );
}