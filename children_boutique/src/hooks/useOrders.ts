import { useState, useCallback, useEffect } from 'react';
import { Order } from '@/types';
import { useSession } from 'next-auth/react';

export const useOrders = (orderId: string) => {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchOrders = useCallback(async () => {
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
      throw error;
    }
  }, [statusFilter]);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([fetchOrders(), fetchProducts()]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }, [fetchOrders, fetchProducts]);

  const updateOrderStatus = useCallback(async (orderId: string, status: string, notes?: string) => {
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
      throw error;
    } finally {
      setUpdating(null);
    }
  }, [fetchOrders, session]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    orders,
    products,
    loading,
    updating,
    statusFilter,
    setStatusFilter,
    fetchOrders,
    updateOrderStatus,
    refreshData: loadData,
  };
};