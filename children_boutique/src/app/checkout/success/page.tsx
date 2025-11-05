// src/app/checkout/success/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircleIcon, TruckIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import Layout from '@/components/layout/Layout';

export default function OrderSuccessPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [estimatedDelivery, setEstimatedDelivery] = useState('');

  useEffect(() => {
    // Generate a random order number and delivery date
    setOrderNumber(`BOUTIQUE-${Math.random().toString(36).substr(2, 9).toUpperCase()}`);
    
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 3);
    setEstimatedDelivery(deliveryDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }));
  }, []);

  return (
    <Layout>
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircleIcon className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600">Thank you for your purchase. Your order has been received.</p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="text-center mb-6">
            <p className="text-sm text-gray-600">Order Number</p>
            <p className="text-xl font-bold text-gray-900">{orderNumber}</p>
          </div>

          {/* Delivery Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex items-start">
              <TruckIcon className="h-6 w-6 text-pink-600 mr-3 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900">Estimated Delivery</h3>
                <p className="text-gray-600">{estimatedDelivery}</p>
              </div>
            </div>
            <div className="flex items-start">
              <EnvelopeIcon className="h-6 w-6 text-pink-600 mr-3 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900">Order Confirmation</h3>
                <p className="text-gray-600">Sent to your email</p>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">What's Next?</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• You'll receive an order confirmation email shortly</li>
              <li>• We'll notify you when your order ships</li>
              <li>• Your order will be delivered within 3-5 business days</li>
            </ul>
          </div>
        </div>

        {/* Support Information */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">Need Help?</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <p>If you have any questions about your order, please contact our customer service team.</p>
            <p>Email: support@boutique.com</p>
            <p>Phone: +1 (555) 123-4567</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/products"
            className="bg-pink-600 text-white text-center py-3 px-6 rounded-lg font-semibold hover:bg-pink-700 transition-colors"
          >
            Continue Shopping
          </Link>
          <Link
            href="/"
            className="border border-gray-300 text-gray-700 text-center py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
    </Layout>
  );
}