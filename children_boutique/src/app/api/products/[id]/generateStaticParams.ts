// src/app/products/[id]/generateStaticParams.ts
import { getProducts } from '@/lib/products';

export async function generateStaticParams() {
  try {
    const products = await getProducts();
    
    return products.map((product) => ({
      id: product.id,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}