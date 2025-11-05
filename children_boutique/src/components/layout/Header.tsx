// src/components/layout/Header.tsx
'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import NotificationBell from '@/components/notifications/NotificationBell';
import { useCart } from '@/context/CartContext';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import CartSidebar from '@/components/cart/CartSidebar';

export default function Header() {
  const { isAuthenticated, user } = useAuth();
  const { state, dispatch } = useCart();

  const cartItemsCount = state.items.reduce((count, item) => count + item.quantity, 0);

  return (
    <>
      <header className="bg-white shadow-sm border-b sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-pink-600 hover:text-pink-700 transition-colors">
                Kiya Children&apos;s Boutique
              </Link>
            </div>

            <nav className="flex items-center space-x-6">
              <Link href="/" className="text-gray-700 hover:text-pink-600 font-medium transition-colors">
                Home
              </Link>
              <Link href="/products" className="text-gray-700 hover:text-pink-600 font-medium transition-colors">
                Products
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-pink-600 font-medium transition-colors">
                About
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-pink-600 font-medium transition-colors">
                Contact
              </Link>
              {user?.role === 'ADMIN' && (
                <Link href="/admin" className="text-gray-700 hover:text-pink-600 font-medium transition-colors">
                  Admin
                </Link>
              )}
              {!isAuthenticated && (
                <Link
                  href="/auth/signin"
                  className="bg-pink-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-pink-700 transition-colors shadow-sm hover:shadow-md"
                >
                  Sign In
                </Link>
              )}

              {/* Cart Icon */}
              <button
                onClick={() => dispatch({ type: 'TOGGLE_CART' })}
                className="relative p-2 text-gray-600 hover:text-pink-600 transition-colors"
              >
                <ShoppingCartIcon className="h-6 w-6" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-pink-500 text-xs font-medium text-white shadow-sm">
                    {cartItemsCount}
                  </span>
                )}
              </button>
            </nav>
          </div>
        </div>
      </header>

      <CartSidebar />
    </>
  );
}