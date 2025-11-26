// src/app/products/[id]/page.tsx
import { getProduct, getProducts } from '@/lib/products';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import AddToCartButton from '@/components/products/AddToCartButton';

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-4">
          <Link 
            href="/products"
            className="text-pink-600 hover:text-pink-700 font-medium"
          >
            ← Back to Products
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="md:flex">
            {/* Product Image */}
            <div className="md:w-1/2">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-96 md:h-full object-cover"
                />
              ) : (
                <div className="w-full h-96 md:h-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                  <span className="text-gray-400 text-lg">No image available</span>
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="md:w-1/2 p-8">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h1>
                <p className="text-gray-600 text-lg mb-4">
                  {product.description}
                </p>
                
                <div className="flex items-center space-x-4 mb-4">
                  <span className="text-3xl font-bold text-pink-600">
                    ${product.price}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    product.quantity > 10 
                      ? 'bg-green-100 text-green-800'
                      : product.quantity > 0
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.quantity > 0 ? `${product.quantity} in stock` : 'Out of stock'}
                  </span>
                </div>
              </div>

              {/* Product Meta */}
              <div className="space-y-3 mb-8">
                {product.category && (
                  <div className="flex">
                    <span className="text-gray-700 font-medium w-24">Category:</span>
                    <span className="text-gray-600 capitalize">{product.category}</span>
                  </div>
                )}
                {product.sizes && (
                  <div className="flex">
                    <span className="text-gray-700 font-medium w-24">Size:</span>
                    <span className="text-gray-600">{product.sizes}</span>
                  </div>
                )}
                {product.color && (
                  <div className="flex">
                    <span className="text-gray-700 font-medium w-24">Color:</span>
                    <span className="text-gray-600">{product.color}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <AddToCartButton product={product} />
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}