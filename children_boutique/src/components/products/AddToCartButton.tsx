// src/components/product/AddToCartButton.tsx (updated)
'use client';

import { useCart } from '@/context/CartContext';
import { Product } from '@/types';


interface ProductCardProps {
  product: Product;
    variant?: 'default' | 'card';
}

export default function AddToCartButton({ product, variant = 'default' }: ProductCardProps) {
  const { dispatch } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch({ type: 'ADD_ITEM', payload: product });
  };

  if (variant === 'card') {
    return (
      <button 
        onClick={handleAddToCart}
        disabled={product.quantity === 0}
        className={`px-4 py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg ${
          product.quantity > 0
            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        {product.quantity > 0 ? '🛒' : '❌'}
      </button>
    );
  }

  // Default variant (for product detail page)
  return (
    <button 
      onClick={handleAddToCart}
      disabled={product.quantity === 0}
      className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
        product.quantity > 0
          ? 'bg-pink-600 text-white hover:bg-pink-700'
          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
      }`}
    >
      {product.quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
    </button>
  );
}