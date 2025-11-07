import { Product } from "@prisma/client";
const API_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';


// Add to src/lib/products.ts or create new file src/lib/sales.ts
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
    const response = await fetch(`${API_URL}/api/sales`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch sales: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error in getSales:', error);
    throw error;
  }
}

// Create new sale
export async function createSale(productId: string, quantity: number): Promise<SaleWithDetails> {
  try {
    const response = await fetch(`${API_URL}/api/sales`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId, quantity }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create sale');
    }

    return response.json();
  } catch (error) {
    console.error('Error in createSale:', error);
    throw error;
  }
}