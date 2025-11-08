import { Product } from '@prisma/client';
import { apiFetch } from './apiClient';

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

// Fetch all sales
export async function getSales(): Promise<SaleWithDetails[]> {
  try {
    return await apiFetch('/api/sales', { cache: 'no-store' });
  } catch (error) {
    console.error('Error in getSales:', error);
    throw error;
  }
}

// Create new sale
export async function createSale(productId: string, quantity: number): Promise<SaleWithDetails> {
  try {
    return await apiFetch('/api/sales', { method: 'POST', body: JSON.stringify({ productId, quantity }) });
  } catch (error) {
    console.error('Error in createSale:', error);
    throw error;
  }
}