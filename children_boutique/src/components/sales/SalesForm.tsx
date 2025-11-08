// src/components/sales/SalesForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/types';
import { createSale } from '@/lib/sales';
import {getProducts} from '@/lib/products';
import { useRouter } from 'next/navigation';

interface SalesFormProps {
  onSaleCreated?: () => void | Promise<void>;
}

export default function SalesForm({ onSaleCreated }: SalesFormProps) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (selectedProductId) {
      const product = products.find(p => p.id === selectedProductId);
      setSelectedProduct(product || null);
    } else {
      setSelectedProduct(null);
    }
  }, [selectedProductId, products]);

  const loadProducts = async () => {
    try {
      const productsData = await getProducts();
      setProducts(productsData.filter(p => p.quantity > 0)); // Only show in-stock products
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId) return;

    setLoading(true);
    setError('');

    try {
      await createSale(selectedProductId, quantity);
      
      // Reset form
      setSelectedProductId('');
      setQuantity(1);
      setSelectedProduct(null);
      
  // Refresh data and notify parent if provided
  await loadProducts();
  if (onSaleCreated) await onSaleCreated();
  router.refresh();
  alert('Sale recorded successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = selectedProduct ? selectedProduct.price * quantity : 0;

  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Record New Sale</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="product" className="block text-sm font-medium text-gray-700 mb-1">
            Select Product *
          </label>
          <select
            id="product"
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            required
            className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-white text-gray-900 placeholder-gray-500 transition-colors"
          >
            <option value="">Choose a product</option>
            {products.map(product => (
              <option key={product.id} value={product.id}>
                {product.name} - ${product.price} ({product.quantity} in stock)
              </option>
            ))}
          </select>
        </div>

        {selectedProduct && (
          <div className="bg-gray-50 p-4 rounded-md">
            <h4 className="font-medium text-gray-900 mb-2">Product Details</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-900">Price:</span>
                <span className="ml-2 font-medium text-gray-900">${selectedProduct.price}</span>
              </div>
              <div>
                <span className="text-gray-900">Available:</span>
                <span className="ml-2 font-medium text-gray-900">{selectedProduct.quantity}</span>
              </div>
              {selectedProduct.size && (
                <div>
                  <span className="text-gray-900">Size:</span>
                  <span className="ml-2 font-medium text-gray-900">{selectedProduct.size}</span>
                </div>
              )}
              {selectedProduct.color && (
                <div>
                  <span className="text-gray-900">Color:</span>
                  <span className="ml-2 font-medium text-gray-900">{selectedProduct.color}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
            Quantity *
          </label>
          <input
            type="number"
            id="quantity"
            min="1"
            max={selectedProduct?.quantity || 1}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            required
            className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-white text-gray-900 placeholder-gray-500 transition-colors"
          />
          {selectedProduct && (
            <p className="text-sm text-gray-500 mt-1">
              Maximum: {selectedProduct.quantity} available
            </p>
          )}
        </div>

        {selectedProduct && (
          <div className="bg-pink-50 p-4 rounded-md">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">Total Amount:</span>
              <span className="text-2xl font-bold text-pink-600">${totalPrice.toFixed(2)}</span>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !selectedProductId}
          className="w-full bg-pink-600 text-white py-3 px-4 rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Recording Sale...' : 'Record Sale'}
        </button>
      </form>
    </div>
  );
}