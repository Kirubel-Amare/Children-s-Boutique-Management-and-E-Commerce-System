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

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export async function createOrder(orderData: OrderData): Promise<OrderResponse> {
  try {
    const response = await fetch(`${API_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create order');
    }

    return response.json();
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

export async function getOrders(): Promise<any[]> {
  try {
    const response = await fetch(`${API_URL}/api/orders`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch orders');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
}