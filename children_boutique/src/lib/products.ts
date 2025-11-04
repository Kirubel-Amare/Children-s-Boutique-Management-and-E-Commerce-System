// src/lib/products.ts
import { Product, ProductFormData } from '@/types';

const API_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';

// Fetch all products
export async function getProducts(category?: string): Promise<Product[]> {
  try {
    const url = category 
      ? `${API_URL}/api/products?category=${category}`
      : `${API_URL}/api/products`;

    const response = await fetch(url, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error in getProducts:', error);
    throw error;
  }
}

// Fetch single product
export async function getProduct(id: string): Promise<Product> {
  try {
    const response = await fetch(`${API_URL}/api/products/${id}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Product not found');
      }
      throw new Error(`Failed to fetch product: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error in getProduct:', error);
    throw error;
  }

}
// Create product
export async function createProduct(productData: ProductFormData, token?: string): Promise<Product> {
  const response = await fetch(`${API_URL}/api/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(productData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create product');
  }

  return response.json();
}

// Update product
export async function updateProduct(id: string, productData: Partial<ProductFormData>, token?: string): Promise<Product> {
  const response = await fetch(`${API_URL}/api/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(productData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update product');
  }

  return response.json();
}

// Delete product
export async function deleteProduct(id: string, token?: string): Promise<void> {
  const response = await fetch(`${API_URL}/api/products/${id}`, {
    method: 'DELETE',
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete product');
  }
}