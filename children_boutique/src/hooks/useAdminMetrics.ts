// hooks/useAdminMetrics.ts
import { useMemo } from 'react';
import { Product, Order } from '@/types';
import { SaleWithDetails } from '@/lib/sales';

interface AdminMetrics {
  totalFromOrders: number;
  totalProducts: number;
  totalInPersonSales: number;
  totalCompletedOrders: number;
  totalSales: number;
  totalRevenue: number;
  totalProfit: number;
  profitMargin: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  totalUsers: number;
  unreadNotifications: number;
  allTransactions: any[];
}

export const useAdminMetrics = (
  products: Product[],
  sales: SaleWithDetails[],
  orders: Order[],
  notifications: any[],
  users: any[]
): AdminMetrics => {
  return useMemo(() => {
    // Calculate profit for sales
    const calculateSalesProfit = () => {
      return sales.reduce((profit, sale) => {
        if (sale.profit) return profit + sale.profit;
        
        const product = products.find(p => p.id === sale.product.id);
        if (product?.profitAmount) return profit + (product.profitAmount * sale.quantity);
        
        return profit + (sale.total * 0.6);
      }, 0);
    };

    // Calculate profit for orders
    const calculateOrdersProfit = () => {
      return orders.reduce((profit, order) => {
        return profit + order.orderItems.reduce((orderProfit, item) => {
          const product = products.find(p => 
            p.id === (item.product as any)?.id || p.name === item.product?.name
          );
          
          if (product?.profitAmount) {
            return orderProfit + (product.profitAmount * item.quantity);
          }
          
          if (product?.originalPrice) {
            const profitPerItem = item.price - product.originalPrice;
            return orderProfit + (profitPerItem * item.quantity);
          }
          
          return orderProfit + (item.price * item.quantity * 0.6);
        }, 0);
      }, 0);
    };

    // Core metrics
    const totalProducts = products.length;
    const totalInPersonSales = sales.length;
    const totalCompletedOrders = orders.length;
    const totalSales = totalInPersonSales + totalCompletedOrders;
    
    const revenueFromSales = sales.reduce((sum, sale) => sum + (sale?.total || 0), 0);
    const revenueFromOrders = orders.reduce((sum, order) => sum + (order?.total || 0), 0);
    const totalFromOrders = revenueFromOrders
    const totalRevenue = revenueFromSales + revenueFromOrders;
    
    const profitFromSales = calculateSalesProfit();
    const profitFromOrders = calculateOrdersProfit();
    const totalProfit = profitFromSales + profitFromOrders;
    
    const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

    // Inventory metrics
    const lowStockProducts = products.filter(p => p.quantity <= 5).length;
    const outOfStockProducts = products.filter(p => p.quantity === 0).length;
    
    // User metrics
    const totalUsers = users.length;
    const unreadNotifications = notifications.filter(n => !n.isRead).length;

    // Recent transactions
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

    return {
      totalProducts,
      totalInPersonSales,
      totalCompletedOrders,
      totalSales,
      totalFromOrders,
      totalRevenue,
      totalProfit,
      profitMargin,
      lowStockProducts,
      outOfStockProducts,
      totalUsers,
      unreadNotifications,
      allTransactions,
    };
  }, [products, sales, orders, notifications, users]);
};