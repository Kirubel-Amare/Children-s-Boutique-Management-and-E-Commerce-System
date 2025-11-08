import { useCallback, useMemo } from 'react';
import { Order } from '@/types';
import { OrderSummary } from '@/types';

export const useOrderMetrics = (orders: Order[], products: any[]) => {
  const calculateOrderProfit = useCallback((order: Order) => {
    return order.orderItems.reduce((profit, item) => {
      const product = products.find(p => p.id === item.product?.id);
      if (product && product.profitAmount) {
        return profit + (product.profitAmount * item.quantity);
      }
      if (product && product.originalPrice) {
        const profitPerItem = item.price - product.originalPrice;
        return profit + (profitPerItem * item.quantity);
      }
      return profit + (item.price * item.quantity * 0.6);
    }, 0);
  }, [products]);

  const metrics = useMemo((): OrderSummary => {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalProfit = orders.reduce((sum, order) => sum + calculateOrderProfit(order), 0);
    const totalItems = orders.reduce((sum, order) => 
      sum + order.orderItems.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
    );
    
    const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
    
    const pendingOrders = orders.filter(order => order.status === 'PENDING').length;
    const approvedOrders = orders.filter(order => order.status === 'APPROVED').length;
    const completedOrders = orders.filter(order => order.status === 'COMPLETED').length;
    const rejectedOrders = orders.filter(order => order.status === 'REJECTED').length;

    const todayOrders = orders.filter(order => 
      new Date(order.createdAt).toDateString() === new Date().toDateString()
    );
    const todayRevenue = todayOrders.reduce((sum, order) => sum + order.total, 0);
    const todayProfit = todayOrders.reduce((sum, order) => sum + calculateOrderProfit(order), 0);

    return {
      totalOrders,
      totalRevenue,
      totalProfit,
      totalItems,
      profitMargin,
      pendingOrders,
      approvedOrders,
      completedOrders,
      rejectedOrders,
      todayOrders: todayOrders.length,
      todayRevenue,
      todayProfit,
    };
  }, [orders, calculateOrderProfit]);

  return {
    metrics,
    calculateOrderProfit,
  };
};