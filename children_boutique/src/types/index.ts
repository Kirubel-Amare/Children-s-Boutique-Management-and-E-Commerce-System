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
  
  // Attach custom fields to the NextAuth JWT type (keeps compatibility across versions)
  interface JWT {
    role: string;
    id: string;
  }
}

// Your existing types...
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

// src/types/index.ts
export type User = {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'TELLER' | 'USER';
  status: 'active' | 'inactive';
  createdAt: string; // or Date if you prefer
  updatedAt?: string; // optional if needed
};

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

// Add to src/types/index.ts
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

