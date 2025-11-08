import { apiFetch } from './apiClient';
import {SaleWithDetails} from '@/types'


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

export type { SaleWithDetails };
