// src/app/dashboard/reports/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { SaleWithDetails, getSales } from '@/lib/sales';
import { getProducts } from '@/lib/products';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import SalesChart from '@/components/reports/SalesChart';
import ProductPerformance from '@/components/reports/ProductPerformance';
import SidebarLayout from '@/components/layout/SidebarLayout';
import {Order} from '@/types'

// interface Order {
//   id: string;
//   orderNumber: string;
//   customerName: string;
//   status: string;
//   total: number;
//   createdAt: string;
//   orderItems: Array<{
//     productName: string;
//     quantity: number;
//     price: number;
//     product: {
//       name: string;
//       category: string;
//       price: number;
//     };
//   }>;
// }

export default function ReportsPage() {
  const [sales, setSales] = useState<SaleWithDetails[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [salesData, productsData, ordersData] = await Promise.all([
        getSales().catch(() => []),
        getProducts().catch(() => []),
        fetch('/api/orders?status=COMPLETED')
          .then(res => res.ok ? res.json() : [])
          .catch(() => [])
      ]);

      setSales(Array.isArray(salesData) ? salesData : []);
      setProducts(Array.isArray(productsData) ? productsData : []);
      
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
      console.error('Error loading reports data:', error);
      setSales([]);
      setProducts([]);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Combine sales and orders for comprehensive reporting
  const allTransactions = [
    ...sales.map(sale => ({
      id: sale.id,
      type: 'sale' as const,
      product: sale.product,
      quantity: sale.quantity,
      total: sale.total,
      createdAt: sale.createdAt,
      customerName: sale.teller?.name || 'In-Store Customer',
      transactionType: 'In-Store Sale'
    })),
    ...orders.map(order => ({
      id: order.id,
      type: 'order' as const,
      product: { 
        name: `${order.orderItems.length} items`,
        category: 'Online Order',
        price: order.total
      },
      quantity: order.orderItems.reduce((sum, item) => sum + item.quantity, 0),
      total: order.total,
      createdAt: order.createdAt,
      customerName: order.customerName,
      transactionType: 'Online Order'
    }))
  ];

  // Filter transactions by time range
  const filteredTransactions = allTransactions.filter(transaction => {
    const transactionDate = new Date(transaction.createdAt);
    const now = new Date();
    let cutoffDate = new Date();

    switch (timeRange) {
      case 'week':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    return transactionDate >= cutoffDate;
  });

  // Calculate metrics including both sales and orders
  const totalRevenue = allTransactions.reduce((sum, transaction) => sum + transaction.total, 0);
  const filteredRevenue = filteredTransactions.reduce((sum, transaction) => sum + transaction.total, 0);
  const totalTransactionsCount = allTransactions.length;
  const averageTransactionValue = totalTransactionsCount > 0 ? totalRevenue / totalTransactionsCount : 0;

  // Calculate transaction types
  const inStoreSalesCount = sales.length;
  const onlineOrdersCount = orders.length;

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
            {/* Header */}
            <div className="mb-8">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Sales Reports & Analytics</h1>
                  <p className="text-gray-600">Comprehensive business performance metrics</p>
                </div>
                <div className="flex space-x-2 text-gray-700">
                  <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value as any)}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="week">Last 7 Days</option>
                    <option value="month">Last 30 Days</option>
                    <option value="year">Last Year</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-green-600 font-bold">💰</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">${totalRevenue.toFixed(2)}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      ${filteredRevenue.toFixed(2)} in selected period
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 font-bold">📈</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Transactions</p>
                    <p className="text-2xl font-bold text-gray-900">{totalTransactionsCount}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {filteredTransactions.length} in selected period
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <span className="text-purple-600 font-bold">📊</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Average Value</p>
                    <p className="text-2xl font-bold text-gray-900">${averageTransactionValue.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                      <span className="text-orange-600 font-bold">🛒</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Sales Channels</p>
                    <p className="text-lg font-bold text-gray-900">
                      {inStoreSalesCount} In-Store
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {onlineOrdersCount} Online
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <SalesChart sales={sales} timeRange={timeRange} />
              <ProductPerformance sales={sales} products={products} />
            </div>

            {/* Recent Transactions Table */}
            <div className="bg-white shadow-sm rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
                <p className="text-sm text-gray-500 mt-1">In-store sales and online orders</p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Transaction
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Items
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTransactions.slice(0, 10).map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {transaction.product.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {transaction.product.category}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{transaction.customerName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{transaction.quantity}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-green-600">
                            ${transaction.total.toFixed(2)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            transaction.type === 'sale' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {transaction.transactionType}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {new Date(transaction.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredTransactions.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-gray-400 mb-4">
                    <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <p>No transactions found in the selected period</p>
                </div>
              )}
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg shadow-sm p-6 text-white">
                <h3 className="text-lg font-semibold mb-2">Revenue Summary</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm opacity-80">In-Store Sales</p>
                    <p className="text-xl font-bold">${sales.reduce((sum, sale) => sum + sale.total, 0).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm opacity-80">Online Orders</p>
                    <p className="text-xl font-bold">${orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-lg shadow-sm p-6 text-white">
                <h3 className="text-lg font-semibold mb-2">Transaction Summary</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm opacity-80">In-Store Sales</p>
                    <p className="text-xl font-bold">{inStoreSalesCount}</p>
                  </div>
                  <div>
                    <p className="text-sm opacity-80">Online Orders</p>
                    <p className="text-xl font-bold">{onlineOrdersCount}</p>
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