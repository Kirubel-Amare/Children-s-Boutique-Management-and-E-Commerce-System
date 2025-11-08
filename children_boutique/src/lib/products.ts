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
export async function createProduct(productData: ProductFormData, token?: string): Promise<Product> {
  return await apiFetch('/api/products', { method: 'POST', body: JSON.stringify(productData) }, token);
}

// Update product
export async function updateProduct(id: string, productData: Partial<ProductFormData>, token?: string): Promise<Product> {
  return await apiFetch(`/api/products/${id}`, { method: 'PUT', body: JSON.stringify(productData) }, token);
}

// Delete product
export async function deleteProduct(id: string, token?: string): Promise<void> {
  await apiFetch(`/api/products/${id}`, { method: 'DELETE' }, token);
}