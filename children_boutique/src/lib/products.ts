// src/lib/products.ts
import { Product, ProductFormData } from '@/types';
import { apiFetch } from './apiClient';

// Fetch all products
export async function getProducts(category?: string): Promise<Product[]> {
  try {
    const path = category ? `/api/products?category=${category}` : '/api/products';
    return await apiFetch(path, { cache: 'no-store' });
  } catch (error) {
    console.error('Error in getProducts:', error);
    throw error;
  }
}

// Fetch single product
export async function getProduct(id: string): Promise<Product> {
  try {
    return await apiFetch(`/api/products/${id}`, { cache: 'no-store' });
  } catch (error: any) {
    // preserve previous behavior: throw 'Product not found' for 404
    if (error?.status === 404) {
      throw new Error('Product not found');
    }
    console.error('Error in getProduct:', error);
    throw error;
  }
}

// Create product
export async function createProduct(data: ProductFormData): Promise<Product> {
  const response = await fetch('/api/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to create product');
  }

  return response.json();
}

// Update product
export async function updateProduct(id: string, data: ProductFormData): Promise<Product> {
  const response = await fetch(`/api/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to update product');
  }

  return response.json();
}

// Delete product
export async function deleteProduct(id: string): Promise<void> {
  const response = await fetch(`/api/products/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to delete product');
  }
}