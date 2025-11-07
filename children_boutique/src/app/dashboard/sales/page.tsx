// src/app/dashboard/sales/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { SaleWithDetails } from '@/lib/sales';
import { getSales } from '@/lib/sales';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import SalesForm from '@/components/sales/SalesForm';
import SidebarLayout from '@/components/layout/SidebarLayout';

export default function SalesPage() {
  const [sales, setSales] = useState<SaleWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSales();
  }, []);

  const loadSales = async () => {
    try {
      const salesData = await getSales();
      setSales(salesData);
    } catch (error) {
      console.error('Error loading sales:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate metrics including profit
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
  const totalItemsSold = sales.reduce((sum, sale) => sum + sale.quantity, 0);
  const totalProfit = sales.reduce((sum, sale) => sum + (sale.profit || 0), 0);
  const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  // Today's sales
  const todaySales = sales.filter(sale => 
    new Date(sale.createdAt).toDateString() === new Date().toDateString()
  );
  const todayRevenue = todaySales.reduce((sum, sale) => sum + sale.total, 0);
  const todayProfit = todaySales.reduce((sum, sale) => sum + (sale.profit || 0), 0);

  // This week's sales
  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  
  const weekSales = sales.filter(sale => 
    new Date(sale.createdAt) >= startOfWeek
  );
  const weekRevenue = weekSales.reduce((sum, sale) => sum + sale.total, 0);
  const weekProfit = weekSales.reduce((sum, sale) => sum + (sale.profit || 0), 0);

  return (
    <ProtectedRoute>
      <SidebarLayout>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Sales Management</h1>
              <p className="text-gray-600">Record new sales and view sales history</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Sales Form */}
              <div className="lg:col-span-1">
                <SalesForm onSaleCreated={loadSales} />
              </div>

              {/* Sales Stats and History */}
              <div className="lg:col-span-2 space-y-6">
                {/* Sales Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Total Revenue</h3>
                    <p className="text-2xl font-bold text-pink-600">${totalRevenue.toFixed(2)}</p>
                    <p className="text-xs text-gray-500 mt-1">All time</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Total Profit</h3>
                    <p className="text-2xl font-bold text-green-600">${totalProfit.toFixed(2)}</p>
                    <p className="text-xs text-gray-500 mt-1">{profitMargin.toFixed(1)}% margin</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Today's Revenue</h3>
                    <p className="text-2xl font-bold text-blue-600">${todayRevenue.toFixed(2)}</p>
                    <p className="text-xs text-gray-500 mt-1">{todaySales.length} sales</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">This Week</h3>
                    <p className="text-2xl font-bold text-purple-600">${weekRevenue.toFixed(2)}</p>
                    <p className="text-xs text-gray-500 mt-1">{weekSales.length} sales</p>
                  </div>
                </div>

                {/* Performance Summary */}
                <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg shadow-sm p-6 text-white">
                  <h3 className="text-lg font-semibold mb-4">Sales Performance</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm opacity-80">Total Sales</p>
                      <p className="text-xl font-bold">{sales.length}</p>
                    </div>
                    <div>
                      <p className="text-sm opacity-80">Items Sold</p>
                      <p className="text-xl font-bold">{totalItemsSold}</p>
                    </div>
                    <div>
                      <p className="text-sm opacity-80">Avg. Sale</p>
                      <p className="text-xl font-bold">
                        ${sales.length > 0 ? (totalRevenue / sales.length).toFixed(2) : '0.00'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm opacity-80">Profit Margin</p>
                      <p className="text-xl font-bold">{profitMargin.toFixed(1)}%</p>
                    </div>
                  </div>
                </div>

                {/* Sales History */}
                <div className="bg-white shadow-sm rounded-lg border border-gray-200">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Recent Sales</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {sales.length} total sales • ${totalProfit.toFixed(2)} total profit
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          ${todayRevenue.toFixed(2)} today
                        </p>
                        <p className="text-xs text-gray-500">
                          {todaySales.length} sales today
                        </p>
                      </div>
                    </div>
                  </div>

                  {loading ? (
                    <div className="p-6 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto"></div>
                    </div>
                  ) : sales.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                      <div className="text-gray-400 mb-4">
                        <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      No sales recorded yet.
                      <p className="text-sm mt-2">Record your first sale using the form on the left!</p>
                    </div>
                  ) : (
                    <div className="overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Product
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Qty
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Revenue
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Profit
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Margin
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Teller
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {sales.map((sale) => {
                            const saleProfit = sale.profit || 0;
                            const saleMargin = sale.total > 0 ? (saleProfit / sale.total) * 100 : 0;
                            const isToday = new Date(sale.createdAt).toDateString() === new Date().toDateString();
                            
                            return (
                              <tr key={sale.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                                      <span className="text-green-600 text-sm">💰</span>
                                    </div>
                                    <div>
                                      <div className="text-sm font-medium text-gray-900">
                                        {sale.product.name}
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        ${sale.product.price.toFixed(2)} each
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">{sale.quantity}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-pink-600">
                                    ${sale.total.toFixed(2)}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-green-600">
                                    ${saleProfit.toFixed(2)}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className={`text-sm font-medium ${
                                    saleMargin >= 50 ? 'text-green-600' :
                                    saleMargin >= 30 ? 'text-yellow-600' :
                                    'text-red-600'
                                  }`}>
                                    {saleMargin.toFixed(1)}%
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">{sale.teller.name}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-500">
                                    {new Date(sale.createdAt).toLocaleDateString()}
                                  </div>
                                  <div className={`text-xs ${isToday ? 'text-green-600 font-medium' : 'text-gray-400'}`}>
                                    {new Date(sale.createdAt).toLocaleTimeString()}
                                    {isToday && ' • Today'}
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
        </div>
      </SidebarLayout>
    </ProtectedRoute>
  );
}