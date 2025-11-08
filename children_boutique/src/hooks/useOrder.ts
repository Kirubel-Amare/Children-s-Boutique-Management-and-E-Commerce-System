import { useState, useCallback } from 'react';
import { Order, OrderStatusUpdate } from '@/types';

export const useOrder = (orderId: string) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [stockIssues, setStockIssues] = useState<string[]>([]);

  const fetchOrder = useCallback(async () => {
    if (!orderId) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`);
      if (!res.ok) throw new Error('Failed to fetch order');
      const data: Order = await res.json();
      setOrder(data);
      
      // Check stock availability
      checkStockAvailability(data);
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  const checkStockAvailability = useCallback((orderData: Order) => {
    const issues: string[] = [];
    orderData.orderItems.forEach(item => {
      if (item.product.quantity < item.quantity) {
        issues.push(
          `Insufficient stock for ${item.productName}. Available: ${item.product.quantity}, Required: ${item.quantity}`
        );
      }
    });
    setStockIssues(issues);
  }, []);

  const updateOrderStatus = useCallback(async (updateData: OrderStatusUpdate) => {
    if (!orderId) return;
    
    setUpdating(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        if (errorData.issues) {
          setStockIssues(errorData.issues);
          throw new Error(`Stock issues: ${errorData.issues.join(', ')}`);
        }
        throw new Error(errorData.error || 'Failed to update order');
      }

      const updatedOrder: Order = await res.json();
      setOrder(updatedOrder);
      checkStockAvailability(updatedOrder);
      return updatedOrder;
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    } finally {
      setUpdating(false);
    }
  }, [orderId, checkStockAvailability]);

  return {
    order,
    loading,
    updating,
    stockIssues,
    fetchOrder,
    updateOrderStatus,
    setStockIssues,
  };
};