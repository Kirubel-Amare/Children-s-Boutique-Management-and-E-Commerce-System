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
    profitAmount?: number;
    originalPrice?: number;
  };
}

export default function AdminOrdersPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchOrders = async () => {
    try {
      const url = statusFilter === 'all' 
        ? '/api/orders' 
        : `/api/orders?status=${statusFilter}`;
      
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch orders');
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchOrders(), fetchProducts()]);
      setLoading(false);
    };
    loadData();
  }, [statusFilter]);

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
      
      await fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Failed to update order status');
    } finally {
      setUpdating(null);
    }
  };

  // Calculate order profit using product profitAmount
  const calculateOrderProfit = (order: Order) => {
    return order.orderItems.reduce((profit, item) => {
      const product = products.find(p => p.id === item.product?.id);
      if (product && product.profitAmount) {
        return profit + (product.profitAmount * item.quantity);
      }
      // Fallback: if no profitAmount, calculate from originalPrice
      if (product && product.originalPrice) {
        const profitPerItem = item.price - product.originalPrice;
        return profit + (profitPerItem * item.quantity);
      }
      // Final fallback: assume 60% profit margin
      return profit + (item.price * item.quantity * 0.6);
    }, 0);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'APPROVED': return 'bg-green-100 text-green-800 border-green-200';
      case 'REJECTED': return 'bg-red-100 text-red-800 border-red-200';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusBadge = (status: string) => {
    return (
      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(status)}`}>
        {status}
      </span>
    );
  };

  // Calculate summary metrics including profit
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalProfit = orders.reduce((sum, order) => sum + calculateOrderProfit(order), 0);
  const totalItems = orders.reduce((sum, order) => 
    sum + order.orderItems.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
  );
  
  const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
  
  // Orders by status
  const pendingOrders = orders.filter(order => order.status === 'PENDING').length;
  const approvedOrders = orders.filter(order => order.status === 'APPROVED').length;
  const completedOrders = orders.filter(order => order.status === 'COMPLETED').length;
  const rejectedOrders = orders.filter(order => order.status === 'REJECTED').length;

  // Today's orders
  const todayOrders = orders.filter(order => 
    new Date(order.createdAt).toDateString() === new Date().toDateString()
  );
  const todayRevenue = todayOrders.reduce((sum, order) => sum + order.total, 0);
  const todayProfit = todayOrders.reduce((sum, order) => sum + calculateOrderProfit(order), 0);

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

            {/* Summary Section */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
              {/* Total Revenue */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-green-600 font-bold text-xl">💰</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">${totalRevenue.toFixed(2)}</p>
                    <p className="text-xs text-gray-500 mt-1">{totalOrders} orders</p>
                  </div>
                </div>
              </div>

              {/* Total Profit */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-xl">📈</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Profit</p>
                    <p className="text-2xl font-bold text-gray-900">${totalProfit.toFixed(2)}</p>
                    <p className="text-xs text-gray-500 mt-1">{profitMargin.toFixed(1)}% margin</p>
                  </div>
                </div>
              </div>

              {/* Today's Performance */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <span className="text-purple-600 font-bold text-xl">📊</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Today</p>
                    <p className="text-2xl font-bold text-gray-900">${todayRevenue.toFixed(2)}</p>
                    <p className="text-xs text-gray-500 mt-1">{todayOrders.length} orders</p>
                  </div>
                </div>
              </div>

              {/* Items Sold */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <span className="text-orange-600 font-bold text-xl">📦</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Items Sold</p>
                    <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
                    <p className="text-xs text-gray-500 mt-1">Across all orders</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Overview */}
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg shadow-sm p-6 text-white mb-8">
              <h3 className="text-lg font-semibold mb-4">Order Status Overview</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="bg-white bg-opacity-20 rounded-lg p-3">
                    <p className="text-2xl font-bold">{pendingOrders}</p>
                    <p className="text-sm opacity-90">Pending</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="bg-white bg-opacity-20 rounded-lg p-3">
                    <p className="text-2xl font-bold">{approvedOrders}</p>
                    <p className="text-sm opacity-90">Approved</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="bg-white bg-opacity-20 rounded-lg p-3">
                    <p className="text-2xl font-bold">{completedOrders}</p>
                    <p className="text-sm opacity-90">Completed</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="bg-white bg-opacity-20 rounded-lg p-3">
                    <p className="text-2xl font-bold">{rejectedOrders}</p>
                    <p className="text-sm opacity-90">Rejected</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filter and Orders List */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="mb-4 sm:mb-0">
                    <h3 className="text-lg font-semibold text-gray-900">Order List</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Manage and track customer orders • ${totalProfit.toFixed(2)} total profit
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Filter by Status
                    </label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm rounded-md"
                    >
                      <option value="all">All Orders</option>
                      <option value="PENDING">Pending</option>
                      <option value="APPROVED">Approved</option>
                      <option value="REJECTED">Rejected</option>
                      <option value="COMPLETED">Completed</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Orders Table */}
              <div className="overflow-hidden">
                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <p className="text-gray-500 text-lg">No orders found</p>
                    <p className="text-gray-400 mt-1">
                      {statusFilter !== 'all' ? `No orders with status "${statusFilter}"` : 'No orders have been placed yet'}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Order
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Customer
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Profit
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map((order) => {
                          const orderProfit = calculateOrderProfit(order);
                          const orderMargin = order.total > 0 ? (orderProfit / order.total) * 100 : 0;
                          
                          return (
                            <tr key={order.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  {order.orderNumber}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {order.paymentMethod.toUpperCase()}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  {order.customerName}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {order.customerEmail}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {order.customerPhone || 'No phone'}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  ${order.total.toFixed(2)}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {order.orderItems.length} item(s)
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-green-600">
                                  ${orderProfit.toFixed(2)}
                                </div>
                                <div className={`text-xs ${
                                  orderMargin >= 50 ? 'text-green-600' :
                                  orderMargin >= 30 ? 'text-yellow-600' :
                                  'text-red-600'
                                }`}>
                                  {orderMargin.toFixed(1)}% margin
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {getStatusBadge(order.status)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(order.createdAt).toLocaleDateString()}
                                <div className="text-xs text-gray-400">
                                  {new Date(order.createdAt).toLocaleTimeString()}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex flex-col space-y-2">
                                  <Link
                                    href={`/admin/orders/${order.id}`}
                                    className="text-pink-600 hover:text-pink-900 font-medium inline-flex items-center"
                                  >
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    View Details
                                  </Link>
                                  
                                  {order.status === 'PENDING' && (
                                    <div className="flex space-x-2">
                                      <button
                                        onClick={() => updateOrderStatus(order.id, 'APPROVED')}
                                        disabled={updating === order.id}
                                        className="text-green-600 hover:text-green-900 text-sm font-medium disabled:opacity-50 inline-flex items-center"
                                      >
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        {updating === order.id ? 'Approving...' : 'Approve'}
                                      </button>
                                      <button
                                        onClick={() => {
                                          const reason = prompt('Reason for rejection:');
                                          if (reason) updateOrderStatus(order.id, 'REJECTED', reason);
                                        }}
                                        disabled={updating === order.id}
                                        className="text-red-600 hover:text-red-900 text-sm font-medium disabled:opacity-50 inline-flex items-center"
                                      >
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        Reject
                                      </button>
                                    </div>
                                  )}
                                  
                                  {order.status === 'APPROVED' && (
                                    <button
                                      onClick={() => updateOrderStatus(order.id, 'COMPLETED')}
                                      disabled={updating === order.id}
                                      className="text-blue-600 hover:text-blue-900 text-sm font-medium disabled:opacity-50 inline-flex items-center"
                                    >
                                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                      </svg>
                                      {updating === order.id ? 'Completing...' : 'Complete'}
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </SidebarLayout>
    </ProtectedRoute>
  );
}