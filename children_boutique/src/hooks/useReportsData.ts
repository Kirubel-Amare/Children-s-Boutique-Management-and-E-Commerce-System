// hooks/useReportsData.ts
import { useState, useEffect } from 'react';
import { SaleWithDetails, getSales } from '@/lib/sales';
import { getProducts } from '@/lib/products';
import { Order } from '@/types';

interface ReportsData {
  sales: SaleWithDetails[];
  orders: Order[];
  products: any[];
  loading: boolean;
  error: string | null;
}

export const useReportsData = (): ReportsData => {
  const [data, setData] = useState<ReportsData>({
    sales: [],
    orders: [],
    products: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setData(prev => ({ ...prev, loading: true, error: null }));
        
        const [salesData, productsData, ordersData] = await Promise.all([
          getSales().catch(() => []),
          getProducts().catch(() => []),
          fetch('/api/orders?status=COMPLETED')
            .then(res => res.ok ? res.json() : [])
            .catch(() => [])
        ]);

        // Process orders data
        let ordersArray = [];
        if (ordersData) {
          ordersArray = Array.isArray(ordersData) ? ordersData : 
                       Array.isArray(ordersData.orders) ? ordersData.orders : [];
        }

        setData({
          sales: Array.isArray(salesData) ? salesData : [],
          products: Array.isArray(productsData) ? productsData : [],
          orders: ordersArray,
          loading: false,
          error: null,
        });

      } catch (error) {
        console.error('Error loading reports data:', error);
        setData(prev => ({ 
          ...prev, 
          loading: false, 
          error: 'Failed to load reports data' 
        }));
      }
    };

    loadData();
  }, []);

  return data;
};