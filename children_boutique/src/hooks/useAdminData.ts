// hooks/useAdminData.ts
import { useState, useEffect } from 'react';
import { getProducts } from '@/lib/products';
import { getNotifications } from '@/lib/notifications';
import { getSales, SaleWithDetails } from '@/lib/sales';
import { getUsers } from '@/lib/users';
import { Product, Order } from '@/types';
import { Notification } from '@/lib/notifications';

interface AdminData {
  products: Product[];
  sales: SaleWithDetails[];
  orders: Order[];
  notifications: Notification[];
  users: any[];
  loading: boolean;
  error: string | null;
}

export const useAdminData = (): AdminData => {
  const [data, setData] = useState<AdminData>({
    products: [],
    sales: [],
    orders: [],
    notifications: [],
    users: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        setData(prev => ({ ...prev, loading: true, error: null }));
        
        const [productsData, salesData, notificationsData, usersData, ordersData] = await Promise.all([
          getProducts().catch(() => []),
          getSales().catch(() => []),
          getNotifications().catch(() => []),
          getUsers().catch(() => []),
          fetch('/api/orders?status=COMPLETED')
            .then(res => res.ok ? res.json() : [])
            .catch(() => [])
        ]);

        // Process users data
        let usersArray = [];
        if (usersData) {
          usersArray = Array.isArray(usersData.users) ? usersData.users : 
                      Array.isArray(usersData) ? usersData : [];
        }

        // Process orders data
        let ordersArray = [];
        if (ordersData) {
          ordersArray = Array.isArray(ordersData) ? ordersData : 
                       Array.isArray(ordersData.orders) ? ordersData.orders : [];
        }

        setData({
          products: Array.isArray(productsData) ? productsData : [],
          sales: Array.isArray(salesData) ? salesData : [],
          notifications: Array.isArray(notificationsData) ? notificationsData : [],
          users: usersArray,
          orders: ordersArray,
          loading: false,
          error: null,
        });

      } catch (error) {
        console.error('Error loading admin data:', error);
        setData(prev => ({ 
          ...prev, 
          loading: false, 
          error: 'Failed to load admin data' 
        }));
      }
    };

    loadAdminData();
  }, []);

  return data;
};