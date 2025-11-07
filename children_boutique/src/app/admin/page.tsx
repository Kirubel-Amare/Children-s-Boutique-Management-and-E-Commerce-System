// src/app/admin/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { getProducts } from '@/lib/products';
import { getNotifications } from '@/lib/notifications';
import { getSales, SaleWithDetails } from '@/lib/sales';
import { Product } from '@/types';
import { Notification } from '@/lib/notifications';
import SidebarLayout from '@/components/layout/SidebarLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { getUsers } from '@/lib/users';
import { Order } from '@/types';

import Link from 'next/link';
import { 
  ChartBarIcon, 
  UserGroupIcon, 
  ShoppingBagIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<SaleWithDetails[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      
      const [productsData, salesData, notificationsData, usersData, ordersData] = await Promise.all([
        getProducts().catch(() => []),
        getSales().catch(() => []),
        getNotifications().catch(() => []),
        getUsers().catch(() => []),
        // Fetch completed orders
        fetch('/api/orders?status=COMPLETED')
          .then(res => res.ok ? res.json() : [])
          .catch(() => [])
      ]);

      setProducts(Array.isArray(productsData) ? productsData : []);
      setSales(Array.isArray(salesData) ? salesData : []);
      setNotifications(Array.isArray(notificationsData) ? notificationsData : []);
      
      // Handle users data
      let usersArray = [];
      if (usersData) {
        if (Array.isArray(usersData.users)) {
          usersArray = usersData.users;
        } else if (Array.isArray(usersData)) {
          usersArray = usersData;
        }
      }
      setUsers(usersArray);

      // Handle orders data
      let ordersArray = [];
      if (ordersData) {
        if (Array.isArray(ordersData)) {
          ordersArray = ordersData;
        } else if (Array.isArray(ordersData.orders)) {
          ordersArray = ordersData.orders;
        }
      }
      setOrders(ordersArray);

    } catch (error) {
      console.error('Error loading admin data:', error);
      setProducts([]);
      setSales([]);
      setNotifications([]);
      setUsers([]);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Calculate profit for sales (assuming product has costPrice and sellingPrice)
  const calculateSalesProfit = () => {
  return sales.reduce((profit, sale) => {
    // Use the stored profit from sale if available
    if (sale.profit) {
      return profit + sale.profit;
    }
    
    // Fallback: calculate using product profitAmount
    const product = products.find(p => p.id === sale.product.id);
    if (product && product.profitAmount) {
      return profit + (product.profitAmount * sale.quantity);
    }
    
    // Final fallback: assume 60% profit margin
    return profit + (sale.total * 0.6);
  }, 0);
};

// Calculate profit for orders using product profitAmount
const calculateOrdersProfit = () => {
  return orders.reduce((profit, order) => {
    return profit + order.orderItems.reduce((orderProfit, item) => {
      const product = products.find(p => p.id === item.product?.id);
      if (product && product.profitAmount) {
        return orderProfit + (product.profitAmount * item.quantity);
      }
      
      // If no profitAmount, calculate from price difference
      if (product && product.originalPrice) {
        const profitPerItem = item.price - product.originalPrice;
        return orderProfit + (profitPerItem * item.quantity);
      }
      
      // Final fallback: assume 60% profit margin
      return orderProfit + (item.price * item.quantity * 0.6);
    }, 0);
  }, 0);
};
  // Calculate admin-specific metrics - include both sales and completed orders
  const totalProducts = products.length;
  const totalInPersonSales = sales.length;
  const totalCompletedOrders = orders.length;
  const totalSales = totalInPersonSales + totalCompletedOrders;
  
  // Calculate total revenue from both sales and orders
  const revenueFromSales = sales.reduce((sum, sale) => sum + (sale?.total || 0), 0);
  const revenueFromOrders = orders.reduce((sum, order) => sum + (order?.total || 0), 0);
  const totalRevenue = revenueFromSales + revenueFromOrders;
  
  // Calculate total profit
  const profitFromSales = calculateSalesProfit();
  const profitFromOrders = calculateOrdersProfit();
  const totalProfit = profitFromSales + profitFromOrders;
  
  const lowStockProducts = products.filter(p => p.quantity <= 5).length;
  const outOfStockProducts = products.filter(p => p.quantity === 0).length;
  const totalUsers = users.length;
  const unreadNotifications = notifications.filter(n => !n.isRead).length;

  // Calculate profit margin percentage
  const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  // Combine sales and orders for recent activities
  const allTransactions = [
    ...sales.map(sale => ({
      id: sale.id,
      type: 'sale' as const,
      product: sale.product,
      total: sale.total,
      quantity: sale.quantity,
      createdAt: sale.createdAt,
      customerName: sale.teller?.name || 'In-Store Customer',
      orderNumber: `SALE-${sale.id.slice(-6)}`
    })),
    ...orders.map(order => ({
      id: order.id,
      type: 'order' as const,
      product: { name: `${order.orderItems.length} items` },
      total: order.total,
      quantity: order.orderItems.reduce((sum, item) => sum + item.quantity, 0),
      createdAt: order.createdAt,
      customerName: order.customerName,
      orderNumber: order.orderNumber
    }))
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
   .slice(0, 5);

  // Stats for the admin dashboard
  const stats = [
    {
      name: 'Total Revenue',
      value: `$${totalRevenue.toFixed(2)}`,
      change: '12.5%',
      changeType: 'increase' as const,
      icon: ChartBarIcon,
      color: 'blue',
    },
    {
      name: 'Total Profit',
      value: `$${totalProfit.toFixed(2)}`,
      change: `${profitMargin.toFixed(1)}% margin`,
      changeType: 'increase' as const,
      icon: CurrencyDollarIcon,
      color: 'green',
    },
    {
      name: 'Total Products',
      value: totalProducts.toString(),
      change: '3.2%',
      changeType: 'increase' as const,
      icon: ShoppingBagIcon,
      color: 'purple',
    },
    {
      name: 'System Users',
      value: totalUsers.toString(),
      change: '0%',
      changeType: 'increase' as const,
      icon: UserGroupIcon,
      color: 'yellow',
    },
  ];

  if (loading) {
    return (
      <ProtectedRoute requiredRole="ADMIN">
        <SidebarLayout>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
          </div>
        </SidebarLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole="ADMIN">
      <SidebarLayout>
        <div className="space-y-6">
          {/* Admin Welcome Banner */}
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl shadow-sm p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-2">Admin Dashboard 👑</h1>
                <p className="opacity-90">Complete system overview and management controls</p>
              </div>
              <div className="hidden md:block">
                <div className="bg-white bg-opacity-20 rounded-lg p-3">
                  <p className="text-sm">System Status: <span className="font-semibold">All Systems Operational</span></p>
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((item) => (
              <div key={item.name} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className={`p-3 rounded-lg ${
                        item.color === 'green' ? 'bg-green-100 text-green-600' :
                        item.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                        item.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                        'bg-yellow-100 text-yellow-600'
                      }`}>
                        <item.icon className="h-6 w-6" />
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="text-sm font-medium text-gray-500 truncate">{item.name}</p>
                      <div className="flex items-baseline">
                        <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
                        <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                          item.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {item.changeType === 'increase' ? (
                            <ArrowUpIcon className="self-center flex-shrink-0 h-4 w-4 text-green-500" />
                          ) : (
                            <ArrowDownIcon className="self-center flex-shrink-0 h-4 w-4 text-red-500" />
                          )}
                          <span className="sr-only">
                            {item.changeType === 'increase' ? 'Increased' : 'Decreased'} by
                          </span>
                          {item.change}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Admin Quick Actions</h3>
              <p className="mt-1 text-sm text-gray-500">Manage your boutique system efficiently</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link
                  href="/admin/users/new"
                  className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all group"
                >
                  <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">👥</span>
                  <span className="font-medium text-gray-900 text-center">Add User</span>
                  <span className="text-sm text-gray-500 text-center mt-1">Create system user</span>
                </Link>

                <Link
                  href="/dashboard/products/new"
                  className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all group"
                >
                  <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">📦</span>
                  <span className="font-medium text-gray-900 text-center">Add Product</span>
                  <span className="text-sm text-gray-500 text-center mt-1">New product listing</span>
                </Link>

                <Link
                  href="/dashboard/reports"
                  className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all group"
                >
                  <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">📊</span>
                  <span className="font-medium text-gray-900 text-center">View Reports</span>
                  <span className="text-sm text-gray-500 text-center mt-1">Analytics & insights</span>
                </Link>

                <Link
                  href="/admin/users"
                  className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all group"
                >
                  <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">⚙️</span>
                  <span className="font-medium text-gray-900 text-center">Manage Users</span>
                  <span className="text-sm text-gray-500 text-center mt-1">User permissions</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Sales & Orders */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Transactions</h3>
                  <Link href="/dashboard/sales" className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                    View All
                  </Link>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  In-store sales and online orders
                </p>
              </div>
              <div className="p-6">
                {allTransactions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <ShoppingBagIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p>No recent transactions</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {allTransactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            transaction.type === 'sale' ? 'bg-green-100' : 'bg-blue-100'
                          }`}>
                            <span className={`text-sm ${
                              transaction.type === 'sale' ? 'text-green-600' : 'text-blue-600'
                            }`}>
                              {transaction.type === 'sale' ? '🛒' : '📦'}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {transaction.type === 'sale' 
                                ? transaction.product.name 
                                : `${transaction.quantity} items`
                              }
                            </p>
                            <p className="text-sm text-gray-500">
                              {transaction.customerName} • {new Date(transaction.createdAt).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-gray-400">
                              {transaction.orderNumber} • {transaction.type === 'sale' ? 'In-Store' : 'Online'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600">${transaction.total.toFixed(2)}</p>
                          <p className="text-sm text-gray-500">{transaction.quantity} items</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* System Alerts */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">System Alerts</h3>
                  <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded-full">
                    {unreadNotifications} new
                  </span>
                </div>
              </div>
              <div className="p-6">
                {notifications.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircleIcon className="h-12 w-12 text-green-400 mx-auto mb-3" />
                    <p>No alerts at this time</p>
                    <p className="text-sm">All systems are running smoothly</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {notifications.slice(0, 5).map((notification) => (
                      <div 
                        key={notification.id} 
                        className={`p-3 rounded-lg border-l-4 ${
                          notification.type === 'low_stock' 
                            ? 'border-l-yellow-400 bg-yellow-50' 
                            : 'border-l-blue-400 bg-blue-50'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-900">{notification.title}</p>
                            <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                            {notification.product && (
                              <p className="text-xs text-gray-500 mt-1">
                                Product: {notification.product.name}
                              </p>
                            )}
                          </div>
                          <span className="text-xs text-gray-400 whitespace-nowrap">
                            {new Date(notification.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Inventory Status */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Inventory Status</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <CheckCircleIcon className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">In Stock</p>
                        <p className="text-sm text-gray-500">Products with sufficient inventory</p>
                      </div>
                    </div>
                    <span className="text-2xl font-bold text-green-600">
                      {products.filter(p => p.quantity > 10).length}
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Low Stock</p>
                        <p className="text-sm text-gray-500">Needs restocking soon</p>
                      </div>
                    </div>
                    <span className="text-2xl font-bold text-yellow-600">
                      {lowStockProducts}
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Out of Stock</p>
                        <p className="text-sm text-gray-500">Urgent restocking needed</p>
                      </div>
                    </div>
                    <span className="text-2xl font-bold text-red-600">
                      {outOfStockProducts}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* User Management Preview */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">User Management</h3>
                  <Link href="/admin/users" className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                    Manage Users
                  </Link>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {users.slice(0, 3).map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-lg flex items-center justify-center">
                          <span className="text-purple-600 font-bold text-sm">
                            {user.name?.split(' ').map((n: string) => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        user.role === 'ADMIN' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Link
                    href="/admin/users/new"
                    className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors text-center block"
                  >
                    + Add New User
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* System Overview */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">System Overview</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <ChartBarIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-900">Total Transactions</p>
                    <p className="text-2xl font-bold text-blue-600">{totalSales}</p>
                    <p className="text-xs text-gray-500">
                      {totalInPersonSales} in-store, {totalCompletedOrders} online
                    </p>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="bg-green-50 rounded-lg p-4">
                    <CurrencyDollarIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-900">Profit Margin</p>
                    <p className="text-2xl font-bold text-green-600">
                      {profitMargin.toFixed(1)}%
                    </p>
                    <p className="text-xs text-gray-500">Overall profit percentage</p>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="bg-purple-50 rounded-lg p-4">
                    <UserGroupIcon className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-900">User Activity</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {users.filter(u => u.status === 'active').length}/{totalUsers}
                    </p>
                    <p className="text-xs text-gray-500">Active Users</p>
                  </div>
                </div>

                <div className="text-center">
                  <div className="bg-orange-50 rounded-lg p-4">
                    <ShoppingBagIcon className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-900">Revenue Split</p>
                    <p className="text-2xl font-bold text-orange-600">
                      ${revenueFromOrders.toFixed(0)}
                    </p>
                    <p className="text-xs text-gray-500">From Online Orders</p>
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