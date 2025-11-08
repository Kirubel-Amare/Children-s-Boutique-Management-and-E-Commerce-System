// src/types/index.ts
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }

  interface User {
    role: string;
  }

  interface JWT {
    role: string;
    id: string;
  }
}

export interface Product {
  [x: string]: any;
  id: string;
  name: string;
  description: string | null;
  price: number;
  quantity: number;
  category: string;
  size: string | null;
  color: string | null;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface FormData {
  name: string;
  email: string;
  role: 'ADMIN' | 'TELLER';
  status: 'active' | 'inactive';
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'TELLER';
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

export interface Sale {
  id: string;
  productId: string;
  quantity: number;
  total: number;
  tellerId: string;
  createdAt: Date;
  product: Product;
  teller: User;
}

export type ProductFormData = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;

export interface LoginFormData {
  email: string;
  password: string;
}




export interface UserApiResponse {
  users: User[];
  message?: string;
}



export interface SaleWithDetails {
  profit: number;
  id: string;
  productId: string;
  quantity: number;
  total: number;
  tellerId: string;
  createdAt: string;
  product: Product;
  teller: {
    id: string;
    name: string;
    email: string;
  };
}
export interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    quantity: number;
  };
}

export interface ShippingAddress {
  street: string;
  city: string;
  zipCode: string;
  country: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED' | 'CANCELLED';
  subtotal: number;
  shippingFee: number;
  tax: number;
  total: number;
  paymentMethod: string;
  shippingAddress: ShippingAddress;
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItem[];
  adminNotes?: string;
  approvedBy?: string;
  approvedAt?: string;
}

export interface OrderStatusUpdate {
  status: Order['status'];
  adminNotes?: string;
  approvedBy?: string;
}


export interface OrderSummary {
  totalOrders: number;
  totalRevenue: number;
  totalProfit: number;
  totalItems: number;
  profitMargin: number;
  pendingOrders: number;
  approvedOrders: number;
  completedOrders: number;
  rejectedOrders: number;
  todayOrders: number;
  todayRevenue: number;
  todayProfit: number;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  productId?: string;
  userId?: string;
  createdAt: string;
  product?: {
    id: string;
    name: string;
    quantity: number;
  };
}

export interface AdminData {
  products: Product[];
  sales: SaleWithDetails[];
  orders: Order[];
  notifications: Notification[];
  users: any[];
  loading: boolean;
  error: string | null;
}
