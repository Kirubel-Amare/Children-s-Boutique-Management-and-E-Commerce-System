// Updated src/app/dashboard/page.tsx with new layout
'use client';

import { useEffect, useState } from 'react';
import { getProducts} from '@/lib/products';
import { getNotifications } from '@/lib/notifications';
import {SaleWithDetails, getSales } from '@/lib/sales';
import { Product } from '@/types';
import { Notification } from '@/lib/notifications';
import SidebarLayout from '@/components/layout/SidebarLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Link from 'next/link';
import QuickStats from '@/components/dashboard/QuickStats';
import RecentActivity from '@/components/dashboard/RecentActivity';
import { ChartBarIcon, CheckCircleIcon, ExclamationTriangleIcon, ShoppingBagIcon, UserGroupIcon } from '@heroicons/react/24/outline';

export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<SaleWithDetails[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [productsData, salesData, notificationsData] = await Promise.all([
        getProducts(),
        getSales(),
        getNotifications(),
      ]);

      setProducts(productsData);
      setSales(salesData);
      setNotifications(notificationsData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate metrics
  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => p.quantity <= 5).length;
  const outOfStockProducts = products.filter(p => p.quantity === 0).length;
  
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
  const todaySales = sales.filter(sale => 
    new Date(sale.createdAt).toDateString() === new Date().toDateString()
  );
  const todayRevenue = todaySales.reduce((sum, sale) => sum + sale.total, 0);
  
  const unreadNotifications = notifications.filter(n => !n.isRead).length;

  // Mock activity data - in real app, this would come from API
  const recentActivities = [
    {
      id: 1,
      type: 'sale' as const,
      description: 'New sale recorded - Kids T-Shirt',
      time: '2 minutes ago',
      user: 'Teller User'
    },
    {
      id: 2,
      type: 'alert' as const,
      description: 'Low stock alert - Children Sneakers',
      time: '1 hour ago',
      user: 'System'
    },
    {
      id: 3,
      type: 'sale' as const,
      description: 'New sale recorded - Baby Romper',
      time: '2 hours ago',
      user: 'Teller User'
    }
  ];

  const stats = [
    {
      name: 'Total Revenue',
      value: `$${totalRevenue.toFixed(2)}`,
      change: '10.2%',
      changeType: 'increase' as const,
    },
    {
      name: 'Today\'s Sales',
      value: `$${todayRevenue.toFixed(2)}`,
      change: '5.1%',
      changeType: 'increase' as const,
    },
    {
      name: 'Total Products',
      value: totalProducts.toString(),
      change: '2.4%',
      changeType: 'increase' as const,
    },
    {
      name: 'Alerts',
      value: unreadNotifications.toString(),
      change: '12.1%',
      changeType: 'increase' as const,
    },
  ];

  if (loading) {
    return (
      <ProtectedRoute>
        <SidebarLayout>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
          </div>
        </SidebarLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <SidebarLayout>
        <div className="space-y-6">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl shadow-sm p-6 text-white">
            <h1 className="text-2xl font-bold mb-2">Welcome back! 👋</h1>
            <p className="opacity-90">Here's what's happening with your boutique today.</p>
          </div>

          {/* Quick Stats */}
          <QuickStats stats={stats} />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Quick Actions & Recent Activity */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick Actions */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Quick Actions</h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Link
                      href="/dashboard/products/new"
                      className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-pink-500 hover:bg-pink-50 transition-all group"
                    >
                      <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">➕</span>
                      <span className="font-medium text-gray-900">Add Product</span>
                    </Link>

                    <Link
                      href="/dashboard/sales"
                      className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-pink-500 hover:bg-pink-50 transition-all group"
                    >
                      <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">💰</span>
                      <span className="font-medium text-gray-900">Record Sale</span>
                    </Link>

                    <Link
                      href="/dashboard/products"
                      className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-pink-500 hover:bg-pink-50 transition-all group"
                    >
                      <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">📦</span>
                      <span className="font-medium text-gray-900">View Products</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <RecentActivity activities={recentActivities} />
            </div>

            {/* Right Column - Alerts & Inventory Status */}
            <div className="space-y-6">
              {/* Stock Alerts */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Stock Alerts</h3>
                </div>
                <div className="p-6 space-y-4">
                  {lowStockProducts > 0 && (
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="flex items-center">
                        <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500 mr-3" />
                        <span className="font-medium text-yellow-800">Low Stock</span>
                      </div>
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm font-medium">
                        {lowStockProducts}
                      </span>
                    </div>
                  )}
                  
                  {outOfStockProducts > 0 && (
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                      <div className="flex items-center">
                        <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-3" />
                        <span className="font-medium text-red-800">Out of Stock</span>
                      </div>
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-medium">
                        {outOfStockProducts}
                      </span>
                    </div>
                  )}

                  {(lowStockProducts === 0 && outOfStockProducts === 0) && (
                    <div className="text-center py-4 text-gray-500">
                      <CheckCircleIcon className="h-8 w-8 text-green-500 mx-auto mb-2" />
                      <p>All products are well stocked!</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Quick Links</h3>
                </div>
                <div className="p-6 space-y-3">
                  <Link
                    href="/dashboard/reports"
                    className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <ChartBarIcon className="h-5 w-5 text-gray-400 mr-3 group-hover:text-pink-500" />
                    <span className="font-medium text-gray-900">View Reports</span>
                  </Link>
                  
                  <Link
                    href="/admin/users"
                    className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <UserGroupIcon className="h-5 w-5 text-gray-400 mr-3 group-hover:text-pink-500" />
                    <span className="font-medium text-gray-900">Manage Users</span>
                  </Link>
                  
                  <Link
                    href="/products"
                    className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <ShoppingBagIcon className="h-5 w-5 text-gray-400 mr-3 group-hover:text-pink-500" />
                    <span className="font-medium text-gray-900">Public Store</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarLayout>
    </ProtectedRoute>
  );
}