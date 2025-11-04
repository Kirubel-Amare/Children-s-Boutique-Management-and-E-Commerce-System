// src/components/products/ProductCard.tsx
import { Product } from '@/types';
import Link from 'next/link';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-w-16 aspect-h-12 bg-gray-200 h-48">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
            <span className="text-gray-400 text-sm">No image</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-1">
          {product.name}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-pink-600">
            ${product.price}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            product.quantity > 10 
              ? 'bg-green-100 text-green-800'
              : product.quantity > 0
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {product.quantity > 0 ? `${product.quantity} in stock` : 'Out of stock'}
          </span>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          {product.category && (
            <span className="capitalize">{product.category}</span>
          )}
          {product.size && (
            <span>Size: {product.size}</span>
          )}
        </div>
        
        <div className="flex space-x-2">
          <Link
            href={`/products/${product.id}`}
            className="flex-1 bg-pink-600 text-white text-center py-2 px-4 rounded-md hover:bg-pink-700 transition-colors"
          >
            View Details
          </Link>
          <button className="bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}