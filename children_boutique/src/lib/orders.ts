// src/lib/orders.ts
export interface OrderItem {
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl?: string;
  };
  quantity: number;
  price: number;
}

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  status: string;
  total: number;
  createdAt: string;
  orderItems: Array<{
    productName: string;
    quantity: number;
    price: number;
    product: {
      name: string;
    };
  }>;
}

export interface OrderData {
  customerInfo: CustomerInfo;
  items: OrderItem[];
  paymentMethod: 'cod' | 'card';
  subtotal: number;
  shippingFee: number;
  tax: number;
  total: number;
}

export interface OrderResponse {
  success: boolean;
  orderId: string;
  orderNumber: string;
}

import { apiFetch } from './apiClient';

export async function createOrder(orderData: OrderData): Promise<OrderResponse> {
  try {
    return await apiFetch('/api/orders', { method: 'POST', body: JSON.stringify(orderData) });
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

export async function getOrders(): Promise<any[]> {
  try {
    return await apiFetch('/api/orders', { cache: 'no-store' });
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
}

