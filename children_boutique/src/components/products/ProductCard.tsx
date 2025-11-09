// src/components/products/ProductCard.tsx
import { Product } from '@/types';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { dispatch } = useCart();

  // Helper function to parse sizes from string or array
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

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { text: 'Out of stock', color: 'bg-red-100 text-red-800' };
    if (quantity <= 5) return { text: `Only ${quantity} left`, color: 'bg-yellow-100 text-yellow-800' };
    if (quantity <= 10) return { text: `${quantity} in stock`, color: 'bg-blue-100 text-blue-800' };
    return { text: 'In stock', color: 'bg-green-100 text-green-800' };
  };

  const stockStatus = getStockStatus(product.quantity);

  const handleAddToCart = () => {
    dispatch({ type: 'ADD_ITEM', payload: product });
  };

  const sizesArray = parseSizes(product.sizes);

  return (
    <div className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative overflow-hidden">
        <div className="aspect-w-16 aspect-h-12 bg-gray-200 h-48">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
              <span className="text-gray-400 text-sm">No image</span>
            </div>
          )}
        </div>
        
        {/* Stock Badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${stockStatus.color}`}>
            {stockStatus.text}
          </span>
        </div>

        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <Link
              href={`/products/${product.id}`}
              className="bg-white text-pink-600 px-6 py-2 rounded-lg font-semibold hover:bg-pink-50 transition-colors shadow-lg mx-1"
            >
              Quick View
            </Link>
          </div>
        </div>
      </div>
      
      <div className="p-5">
        <div className="mb-3">
          <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1 group-hover:text-pink-600 transition-colors">
            <Link href={`/products/${product.id}`} className="hover:no-underline">
              {product.name}
            </Link>
          </h3>
          
          <p className="text-gray-600 text-sm line-clamp-2 min-h-[2.5rem]">
            {product.description || 'Beautiful children&apos;s product with premium quality.'}
          </p>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-2xl font-bold text-pink-600">
              ${product.price.toFixed(2)}
            </span>
          </div>
          
          {/* Updated Sizes Display - Show as tags */}
          {sizesArray.length > 0 && (
            <div className="flex flex-wrap gap-1 justify-end">
              <p className='text-gray-900'>size </p>
              {sizesArray.map((size, index) => (
                <span 
                  key={index}
                  className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-md font-medium"
                >
                  {" "+size}
                </span>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          {product.category && (
            <span className="capitalize bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-xs font-medium">
              {product.category}
            </span>
          )}
          {product.color && (
            <span className="text-gray-600 flex items-center">
              <span 
                className="w-3 h-3 rounded-full mr-1 border border-gray-300"
                style={{ 
                  backgroundColor: product.color.toLowerCase() === 'white' ? '#f3f4f6' : 
                                 product.color.toLowerCase() === 'black' ? '#000' : 
                                 product.color 
                }}
              ></span>
              {product.color}
            </span>
          )}
        </div>
        
        <div className="flex space-x-2">
          <Link
            href={`/products/${product.id}`}
            className="flex-1 bg-pink-600 text-white text-center py-3 px-4 rounded-lg font-semibold hover:bg-pink-700 transition-colors shadow-md hover:shadow-lg"
          >
            View Details
          </Link>
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
        </div>
      </div>
    </div>
  );
}