// src/app/about/page.tsx
import Link from 'next/link';
import { HeartIcon, UsersIcon, SparklesIcon } from '@heroicons/react/24/outline';
import Layout from '@/components/layout/Layout';

export default function AboutPage() {
  return (
    <Layout>
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-pink-50 to-purple-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Our Story
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Creating magical moments through beautiful children&apos;s fashion
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Born from Love for Little Ones
              </h2>
              <p className="text-gray-600 mb-6 text-lg">
                Children&apos;s Boutique started with a simple dream: to create clothing that lets kids be kids, 
                while giving parents peace of mind about quality, comfort, and safety.
              </p>
              <p className="text-gray-600 mb-8 text-lg">
                Every piece in our collection is thoughtfully designed with both style and practicality in mind. 
                We believe that children&apos;s clothing should be durable enough for playground adventures 
                yet beautiful enough for special family moments.
              </p>
              
              <div className="space-y-4">
                {[
                  { icon: HeartIcon, text: '100% Child-Safe Materials' },
                  { icon: UsersIcon, text: 'Family-Owned Business' },
                  { icon: SparklesIcon, text: 'Unique Designs' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center">
                    <item.icon className="h-6 w-6 text-pink-500 mr-3" />
                    <span className="text-gray-700">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl p-8 text-white text-center">
              <div className="text-6xl mb-4">🌟</div>
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-pink-100">
                To bring joy and confidence to children through beautiful, 
                comfortable clothing that supports their adventures and imagination.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Quality First',
                description: 'We never compromise on materials or craftsmanship.',
                icon: '🎯'
              },
              {
                title: 'Child-Centered',
                description: 'Every design considers comfort, safety, and fun.',
                icon: '👶'
              },
              {
                title: 'Sustainable',
                description: 'We care about our planet and future generations.',
                icon: '🌱'
              }
            ].map((value, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-xl shadow-sm">
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Explore Our Collection?
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            Discover the perfect pieces for your little one&apos;s wardrobe
          </p>
          <Link
            href="/products"
            className="bg-pink-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-pink-700 transition-colors inline-block"
          >
            Shop Now
          </Link>
        </div>
      </section>
    </div>
    </Layout>
  );
}