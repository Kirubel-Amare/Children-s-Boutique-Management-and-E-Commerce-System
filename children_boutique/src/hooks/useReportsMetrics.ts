// hooks/useReportsMetrics.ts
import { useMemo } from 'react';
import { SaleWithDetails } from '@/lib/sales';
import { Order } from '@/types';

interface ReportsMetrics {
  totalRevenue: number;
  filteredRevenue: number;
  totalTransactionsCount: number;
  averageTransactionValue: number;
  inStoreSalesCount: number;
  onlineOrdersCount: number;
  allTransactions: any[];
  filteredTransactions: any[];
}

export const useReportsMetrics = (
  sales: SaleWithDetails[],
  orders: Order[],
  timeRange: 'week' | 'month' | 'year'
): ReportsMetrics => {
  return useMemo(() => {
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

    return {
      totalRevenue,
      filteredRevenue,
      totalTransactionsCount,
      averageTransactionValue,
      inStoreSalesCount,
      onlineOrdersCount,
      allTransactions,
      filteredTransactions,
    };
  }, [sales, orders, timeRange]);
};