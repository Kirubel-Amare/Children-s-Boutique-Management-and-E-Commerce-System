// src/app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { getProducts} from '@/lib/products';
import { getNotifications } from '@/lib/notifications';
import { SaleWithDetails, getSales } from '@/lib/sales';
import { Product } from '@/types';
import { Notification } from '@/types';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Link from 'next/link';
import SidebarLayout from '@/components/layout/SidebarLayout';
import { RecentTransactions } from '@/components/admin/RecentTransactions';
import { SystemAlerts } from '@/components/admin/SystemAlerts';
import { InventoryStatus } from '@/components/admin/InventoryStatus';
import { UserManagementPreview } from '@/components/admin/UserManagementPreview';
import { useAdminMetrics } from '@/hooks/useAdminMetrics';
import { useAdminData } from '@/hooks/useAdminData';

export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<SaleWithDetails[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { orders, users} = useAdminData();
    const metrics = useAdminMetrics(products, sales, orders, notifications, users);

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


  interface MainContentGridProps {
    metrics: any;
    notifications: any[];
    users: any[];
  }
  
  const MainContentGrid: React.FC<MainContentGridProps> = ({ metrics, notifications, users }) => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <RecentTransactions transactions={metrics.allTransactions} />
      <SystemAlerts notifications={notifications} unreadCount={metrics.unreadNotifications} />
      <InventoryStatus 
        lowStockProducts={metrics.lowStockProducts}
        outOfStockProducts={metrics.outOfStockProducts}
        totalProducts={metrics.totalProducts}
      />
      <UserManagementPreview users={users} />
    </div>
  );

  if (loading) {
    return (
      <ProtectedRoute>
        <SidebarLayout>
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
              </div>
            </div>
          </div>
        </SidebarLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <SidebarLayout>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Dashboard Overview
              </h1>
              <p className="text-gray-600">
                Welcome to your boutique management dashboard
              </p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                      <span className="text-pink-600 font-bold">₿</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">${totalRevenue.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-green-600 font-bold">📦</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Products</p>
                    <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
                  </div>
                </div>
              </div>

              {/* <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <span className="text-yellow-600 font-bold">⚠️</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Low Stock</p>
                    <p className="text-2xl font-bold text-gray-900">{lowStockProducts}</p>
                  </div>
                </div>
              </div> */}

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 font-bold">🔔</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Notifications</p>
                    <p className="text-2xl font-bold text-gray-900">{unreadNotifications}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions and Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Quick Actions */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link
                    href="/dashboard/products/new"
                    className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-pink-600 font-bold mr-3">+</span>
                    <span className='text-gray-600 font-bold mr-3'>Add New Product</span>
                  </Link>
                  <Link
                    href="/dashboard/sales"
                    className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-green-600 font-bold mr-3">💰</span>
                    <span className='text-gray-600 font-bold mr-3'>Record Sale</span>
                  </Link>
                  <Link
                    href="/dashboard/products"
                    className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-blue-600 font-bold mr-3">📊</span>
                    <span className='text-gray-600 font-bold mr-3'>View Products</span>
                  </Link>
                  {lowStockProducts > 0 && (
                    <Link
                      href="/dashboard/products?filter=low-stock"
                      className="flex items-center p-3 border border-yellow-200 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors"
                    >
                      <span className="text-yellow-600 font-bold mr-3">⚠️</span>
                      <span>View Low Stock Items ({lowStockProducts})</span>
                    </Link>
                  )}
                </div>
              </div>

              {/* Recent Sales */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Sales</h3>
                {sales.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No recent sales</p>
                ) : (
                  <div className="space-y-3">
                    {sales.slice(0, 5).map((sale) => (
                      <div key={sale.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{sale.product.name}</p>
                          <p className="text-sm text-gray-500">
                            {sale.quantity} x ${sale.product.price}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600">${sale.total.toFixed(2)}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(sale.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    {sales.length > 5 && (
                      <Link
                        href="/dashboard/sales"
                        className="block text-center text-pink-600 hover:text-pink-700 font-medium py-2"
                      >
                        View All Sales
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Low Stock Alert */}
            {lowStockProducts > 0 && (
              <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-yellow-600 text-2xl">⚠️</span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-yellow-800">
                      Low Stock Alert
                    </h3>
                    <p className="text-yellow-700">
                      You have {lowStockProducts} product{lowStockProducts > 1 ? 's' : ''} running low on stock.
                    </p>
                  </div>
                  <div className="ml-auto">
                    <Link
                      href="/dashboard/products?filter=low-stock"
                      className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 transition-colors"
                    >
                      Review Stock
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
           <MainContentGrid 
            metrics={metrics}
            notifications={notifications}
            users={users}
          />
        </div>
      </SidebarLayout>
    </ProtectedRoute>
  );
}