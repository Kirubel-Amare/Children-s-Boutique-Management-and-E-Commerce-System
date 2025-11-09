'use client';

import { useState, useEffect } from 'react';
import { Product, ProductFormData } from '@/types';
import { createProduct, updateProduct } from '@/lib/products';
import { useRouter } from 'next/navigation';

interface ProductFormProps {
  product?: Product;
  mode: 'create' | 'edit';
}

const categories = ['clothes', 'shoes', 'accessories'];
const availableSizes = ['XS', 'S', 'M', 'L', 'XL', '2T', '3T', '4T', '5T', '6'];

export default function ProductForm({ product, mode }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shoeSizeInput, setShoeSizeInput] = useState('');

  // Helper function to convert sizes string to array
  const parseSizes = (sizes: string | string[]): string[] => {
    if (Array.isArray(sizes)) return sizes;
    if (typeof sizes === 'string' && sizes.includes(',')) {
      return sizes.split(',').map(s => s.trim()).filter(Boolean);
    }
    if (typeof sizes === 'string' && sizes) {
      return [sizes];
    }
    return [];
  };

  const [formData, setFormData] = useState<ProductFormData>({
    name: product?.name || '',
    description: product?.description || '',
    originalPrice: product?.originalPrice || 0,
    profitAmount: product?.profitAmount || 0,
    price: product?.price || 0,
    quantity: product?.quantity || 0,
    category: product?.category || 'clothes',
    sizes: parseSizes(product?.sizes || []),
    color: product?.color || '',
    imageUrl: product?.imageUrl || '',
  });

  // Initialize shoe size input when product loads or category changes to shoes
  useEffect(() => {
    if (formData.category === 'shoes') {
      if (product?.sizes) {
        const sizesArray = parseSizes(product.sizes);
        setShoeSizeInput(sizesArray.join(', '));
      } else {
        setShoeSizeInput('');
      }
    }
  }, [formData.category, product?.sizes]);

  // Automatically calculate final price when originalPrice or profitAmount changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      price: Number(prev.originalPrice) + Number(prev.profitAmount),
    }));
  }, [formData.originalPrice, formData.profitAmount]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'originalPrice' || name === 'profitAmount' || name === 'quantity' ? Number(value) : value,
    }));
  };

  const handleSizeChange = (size: string) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s: string) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const handleShoeSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setShoeSizeInput(value);
    
    // Convert comma-separated sizes to array
    const sizesArray = value.split(',')
      .map(size => size.trim())
      .filter(size => size !== '');
    
    setFormData(prev => ({
      ...prev,
      sizes: sizesArray,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (formData.sizes.length === 0) {
      setError('Please provide at least one size');
      setLoading(false);
      return;
    }

    try {
      // Prepare data for API
      const submitData = {
        ...formData,
        originalPrice: Number(formData.originalPrice),
        profitAmount: Number(formData.profitAmount),
        quantity: Number(formData.quantity),
      };

      console.log('Submitting product data:', submitData);

      if (mode === 'create') {
        await createProduct(submitData);
      } else if (product) {
        await updateProduct(product.id, submitData);
      }

      router.push('/dashboard/products');
      router.refresh();
    } catch (err) {
      console.error('Error saving product:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const isShoesCategory = formData.category === 'shoes';

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {mode === 'create' ? 'Add New Product' : 'Edit Product'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Product Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="block w-full pl-3 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-white text-gray-900 placeholder-gray-500 transition-colors"
              placeholder="Enter product name"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description || ''}
              onChange={handleChange}
              className="block w-full pl-3 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-white text-gray-900 placeholder-gray-500 transition-colors"
              placeholder="Enter product description"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700 mb-1">
                Original Price ($) *
              </label>
              <input
                type="number"
                id="originalPrice"
                name="originalPrice"
                required
                min="0"
                step="0.01"
                value={formData.originalPrice}
                onChange={handleChange}
                className="block w-full pl-3 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-white text-gray-900 placeholder-gray-500 transition-colors"
                placeholder="0.00"
              />
            </div>

            <div>
              <label htmlFor="profitAmount" className="block text-sm font-medium text-gray-700 mb-1">
                Profit ($) *
              </label>
              <input
                type="number"
                id="profitAmount"
                name="profitAmount"
                required
                min="0"
                step="0.01"
                value={formData.profitAmount}
                onChange={handleChange}
                className="block w-full pl-3 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-white text-gray-900 placeholder-gray-500 transition-colors"
                placeholder="0.00"
              />
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Final Price ($)
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                disabled
                className="block w-full pl-3 pr-4 py-3 border border-gray-300 rounded-xl bg-gray-100 text-gray-900 placeholder-gray-500 transition-colors"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                Quantity in Stock *
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                required
                min="0"
                value={formData.quantity}
                onChange={handleChange}
                className="block w-full pl-3 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-white text-gray-900 placeholder-gray-500 transition-colors"
                placeholder="0"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                id="category"
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="block w-full pl-3 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-white text-gray-900 placeholder-gray-500 transition-colors"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Conditional Size Input based on Category */}
          {isShoesCategory ? (
            /* Shoe Sizes - Text Input */
            <div>
              <label htmlFor="shoeSizes" className="block text-sm font-medium text-gray-700 mb-1">
                Shoe Sizes (comma separated) *
              </label>
              <input
                type="text"
                id="shoeSizes"
                name="shoeSizes"
                required
                value={shoeSizeInput}
                onChange={handleShoeSizeChange}
                className="block w-full pl-3 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-white text-gray-900 placeholder-gray-500 transition-colors"
                placeholder="5, 6, 7, 8, 9, 10, 11, 12, 13"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter sizes separated by commas (e.g., 5, 6, 7, 8)
              </p>
              
              {/* Display selected shoe sizes as tags */}
              {formData.sizes.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm text-gray-600 mb-2">Selected sizes:</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.sizes.map(size => (
                      <span
                        key={size}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-pink-100 text-pink-800"
                      >
                        {size}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Clothing/Accessories Sizes - Checkbox Selection */
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Sizes *
              </label>
              <div className="grid grid-cols-5 gap-2">
                {availableSizes.map(size => (
                  <label key={size} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.sizes.includes(size)}
                      onChange={() => handleSizeChange(size)}
                      className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">{size}</span>
                  </label>
                ))}
              </div>
              
              {/* Display selected sizes as tags */}
              {formData.sizes.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm text-gray-600 mb-2">Selected sizes:</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.sizes.map(size => (
                      <span
                        key={size}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-pink-100 text-pink-800"
                      >
                        {size}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {formData.sizes.length === 0 && (
            <p className="text-sm text-red-600 mt-1">Please provide at least one size</p>
          )}

          {/* Color Input */}
          <div>
            <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
              Color *
            </label>
            <input
              type="text"
              id="color"
              name="color"
              required
              value={formData.color}
              onChange={handleChange}
              className="block w-full pl-3 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-white text-gray-900 placeholder-gray-500 transition-colors"
              placeholder="Enter color"
            />
          </div>

          {/* Image URL */}
          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
              Image URL
            </label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="block w-full pl-3 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-white text-gray-900 placeholder-gray-500 transition-colors"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || formData.sizes.length === 0}
              className="px-4 py-2 text-sm font-medium text-white bg-pink-600 border border-transparent rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 disabled:opacity-50"
            >
              {loading ? 'Saving...' : mode === 'create' ? 'Create Product' : 'Update Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}