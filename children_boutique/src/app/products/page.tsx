// src/app/products/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/types';
import { getProducts } from '@/lib/products';
import ProductCard from '@/components/products/ProductCard';
import Layout from '@/components/layout/Layout';

const categories = ['all', 'clothes', 'shoes', 'accessories'];
const sortOptions = [
  { value: 'name', label: 'Name A-Z' },
  { value: 'name-desc', label: 'Name Z-A' },
  { value: 'price', label: 'Price Low to High' },
  { value: 'price-desc', label: 'Price High to Low' },
  { value: 'newest', label: 'Newest First' },
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [inStockOnly, setInStockOnly] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, searchTerm, selectedCategory, sortBy, inStockOnly]);

  const loadProducts = async () => {
    try {
      const productsData = await getProducts();
      setProducts(productsData);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = [...products];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.color?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by stock
    if (inStockOnly) {
      filtered = filtered.filter(product => product.quantity > 0);
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'price':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSortBy('newest');
    setInStockOnly(false);
  };

  const activeFilters = [
    searchTerm && 'search',
    selectedCategory !== 'all' && 'category',
    inStockOnly && 'in stock',
    sortBy !== 'newest' && 'sort',
  ].filter(Boolean).length;

  return (
    <Layout>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Our Products
        </h1>
        <p className="text-gray-600">
          Discover our beautiful collection of children's clothing and accessories
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          {/* Search */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search Products
            </label>
            <input
              type="text"
              id="search"
              placeholder="Search by name, description"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-3 pr-4 py-3 border rounded-xl focus:ring-1 focus:ring-pink-500 focus:border-pink-500 bg-white text-gray-900 placeholder-gray-500 transition-colors"
            />
          </div>

          {/* Category Filter */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="block w-full pl-3 pr-4 py-3 border rounded-xl focus:ring-1 focus:ring-pink-500 focus:border-pink-500 bg-white text-gray-900 placeholder-gray-500 transition-colors"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="block w-full pl-3 pr-4 py-3 border rounded-xl focus:ring-1 focus:ring-pink-500 focus:border-pink-500 bg-white text-gray-900 placeholder-gray-500 transition-colors"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Stock Filter */}
          <div className="flex items-end">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
              />
              <span className="ml-2 text-sm text-gray-700">In Stock Only</span>
            </label>
          </div>
        </div>

        {/* Active Filters and Clear */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            {activeFilters > 0 && (
              <>
                <span className="text-sm text-gray-500">
                  {filteredProducts.length} products found
                </span>
                <span className="text-sm text-gray-400">•</span>
                <span className="text-sm text-gray-500">
                  {activeFilters} active filter{activeFilters > 1 ? 's' : ''}
                </span>
              </>
            )}
          </div>
          
          {activeFilters > 0 && (
            <button
              onClick={clearFilters}
              className="text-sm text-pink-600 hover:text-pink-700 font-medium"
            >
              Clear all filters
            </button>
          )}
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-500 mb-4">
            {products.length === 0 
              ? "No products available in the store." 
              : "Try adjusting your search or filters."
            }
          </p>
          {products.length > 0 && (
            <button
              onClick={clearFilters}
              className="bg-pink-600 text-white px-6 py-2 rounded-md hover:bg-pink-700"
            >
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="mb-4 flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Showing {filteredProducts.length} of {products.length} products
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
    </Layout>
  );
}