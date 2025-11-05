// src/app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getProducts } from '@/lib/products';
import { Product } from '@/types';
import { ChevronRightIcon, StarIcon, ShieldCheckIcon, TruckIcon, HeartIcon } from '@heroicons/react/24/outline';
import Layout from '@/components/layout/Layout';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    try {
      const products = await getProducts();
      // Get 4 random products for featured section
      const shuffled = [...products].sort(() => 0.5 - Math.random());
      setFeaturedProducts(shuffled.slice(0, 4));
    } catch (error) {
      console.error('Error loading featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-pink-50 via-white to-purple-50 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
        <div className="absolute top-40 right-10 w-20 h-20 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-1/2 w-20 h-20 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: '4s' }}></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-pink-100 text-pink-800 text-sm font-medium mb-6">
                <StarIcon className="h-4 w-4 mr-2" />
                Beautiful Children&apos;s Fashion
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Where Little Dreams
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
                  Come to Life
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 max-w-2xl">
                Discover magical clothing and accessories that blend comfort, quality, and style. 
                Perfect for your little ones&apos; everyday adventures and special moments.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/products"
                  className="group bg-pink-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 inline-flex items-center justify-center"
                >
                  Shop Collection
                  <ChevronRightIcon className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/about"
                  className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:border-pink-500 hover:text-pink-600 transition-all duration-300 inline-flex items-center justify-center"
                >
                  Our Story
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="mt-12 flex flex-wrap justify-center lg:justify-start gap-8 text-sm text-gray-500">
                <div className="flex items-center">
                  <ShieldCheckIcon className="h-5 w-5 text-green-500 mr-2" />
                  Premium Quality
                </div>
                <div className="flex items-center">
                  <TruckIcon className="h-5 w-5 text-blue-500 mr-2" />
                  Free Shipping
                </div>
                <div className="flex items-center">
                  <HeartIcon className="h-5 w-5 text-red-500 mr-2" />
                  Eco-Friendly
                </div>
              </div>
            </div>

            {/* Right Content - Hero Image */}
            <div className="relative">
              <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-4 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="bg-gradient-to-br from-pink-400 to-purple-500 rounded-xl overflow-hidden aspect-square flex items-center justify-center">
                  <div className="text-white text-center p-8">
                    <div className="text-6xl mb-4">👶</div>
                    <p className="text-xl font-semibold">Beautiful Kids Fashion</p>
                    <p className="opacity-90 mt-2">Age 0-12 Years</p>
                  </div>
                </div>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-60"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-60"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why Parents Love Us
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We understand what matters most for your children&apos;s comfort and style
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '🌿',
                title: 'Premium Materials',
                description: 'Soft, breathable fabrics that are gentle on sensitive skin and perfect for active kids.'
              },
              {
                icon: '🎨',
                title: 'Creative Designs',
                description: 'Unique patterns and colors that spark imagination and express personality.'
              },
              {
                icon: '🛡️',
                title: 'Safe & Durable',
                description: 'High-quality construction that withstands playtime while keeping safety first.'
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="group text-center p-8 rounded-2xl bg-gradient-to-b from-white to-gray-50 hover:from-pink-50 hover:to-purple-50 transition-all duration-300 border border-gray-100 hover:border-pink-200 hover:shadow-xl"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Featured Favorites
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our most loved items that parents and kids adore
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-sm p-6 animate-pulse">
                  <div className="bg-gray-200 rounded-lg h-48 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <div 
                  key={product.id}
                  className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
                >
                  <div className="relative overflow-hidden">
                    <div className="aspect-square bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="text-center p-4">
                          <div className="text-4xl mb-2">👕</div>
                          <p className="text-gray-400 text-sm">No image</p>
                        </div>
                      )}
                    </div>
                    
                    {/* Quick View Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <Link
                        href={`/products/${product.id}`}
                        className="bg-white text-pink-600 px-6 py-3 rounded-lg font-semibold hover:bg-pink-50 transition-colors transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                      >
                        Quick View
                      </Link>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900 line-clamp-1 group-hover:text-pink-600 transition-colors">
                        {product.name}
                      </h3>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        product.quantity > 10 
                          ? 'bg-green-100 text-green-800'
                          : product.quantity > 0
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {product.description || 'Beautiful children\'s clothing with premium quality.'}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-pink-600">
                        ${product.price.toFixed(2)}
                      </span>
                      <Link
                        href={`/products/${product.id}`}
                        className="text-pink-600 hover:text-pink-700 font-semibold text-sm flex items-center"
                      >
                        View Details
                        <ChevronRightIcon className="h-4 w-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/products"
              className="inline-flex items-center px-8 py-4 border-2 border-pink-600 text-pink-600 rounded-xl font-semibold hover:bg-pink-600 hover:text-white transition-all duration-300 group"
            >
              View All Products
              <ChevronRightIcon className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-pink-500 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Dress Your Little Stars?
          </h2>
          <p className="text-xl text-pink-100 mb-8 max-w-2xl mx-auto">
            Join thousands of happy parents who trust us for their children&apos;s wardrobe needs. 
            Quality, style, and comfort all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="bg-white text-pink-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Start Shopping Now
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-pink-600 transition-all duration-300"
            >
              Get In Touch
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Loved by Parents & Kids
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Don&apos;t just take our word for it - hear from our happy families
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah M.",
                role: "Mom of 2",
                content: "The quality is outstanding! My kids love the soft fabrics and cute designs. We've been customers for over a year now.",
                rating: 5
              },
              {
                name: "James L.",
                role: "Dad of 3",
                content: "Finally found a store that combines style with durability. The clothes survive my kids' adventures!",
                rating: 5
              },
              {
                name: "Emily R.",
                role: "New Mom",
                content: "As a first-time mom, I appreciate the safe materials and thoughtful designs. The customer service is amazing too!",
                rating: 5
              }
            ].map((testimonial, index) => (
              <div 
                key={index}
                className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 border border-gray-100"
              >
                {/* Stars */}
                <div className="flex justify-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-600 text-center mb-6 italic">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
                
                <div className="text-center">
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>

    </Layout>
  );
}