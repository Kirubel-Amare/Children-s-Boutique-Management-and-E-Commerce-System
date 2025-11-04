// src/app/page.tsx
import Link from 'next/link'

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Welcome to Children&apos;s Boutique
        </h1>
        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
          Discover beautiful, high-quality clothing and accessories for your little ones. 
          From everyday essentials to special occasion outfits.
        </p>
        
        <div className="flex justify-center space-x-6">
          <Link
            href="/products"
            className="bg-pink-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors"
          >
            Shop Now
          </Link>
          <Link
            href="/dashboard"
            className="border border-pink-600 text-pink-600 px-8 py-3 rounded-lg font-semibold hover:bg-pink-50 transition-colors"
          >
            Manage Store
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Quality Products</h3>
            <p className="text-gray-600">Carefully selected items for comfort and style</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Easy Management</h3>
            <p className="text-gray-600">Simple tools to manage your boutique</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Fast Support</h3>
            <p className="text-gray-600">We're here to help you succeed</p>
          </div>
        </div>
      </div>
    </div>
  )
}