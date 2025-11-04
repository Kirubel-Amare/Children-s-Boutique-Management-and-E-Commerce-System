// src/app/products/page.tsx
import { getProducts } from '@/lib/products';
import ProductCard from '@/components/products/ProductCard';

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Our Products
        </h1>
        <p className="text-gray-600">
          Discover our beautiful collection of children's clothing and accessories
        </p>
      </div>

      {/* Category Filters */}
      <div className="mb-8">
        <div className="flex space-x-4">
          <button className="bg-pink-600 text-white px-4 py-2 rounded-md">
            All
          </button>
          <button className="bg-white text-gray-700 px-4 py-2 rounded-md border hover:bg-gray-50">
            Clothes
          </button>
          <button className="bg-white text-gray-700 px-4 py-2 rounded-md border hover:bg-gray-50">
            Shoes
          </button>
          <button className="bg-white text-gray-700 px-4 py-2 rounded-md border hover:bg-gray-50">
            Accessories
          </button>
        </div>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}