'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/context/CartContext';
import { ShoppingCartIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import CartSidebar from '@/components/cart/CartSidebar';

export default function Header() {
  const { isAuthenticated, user } = useAuth();
  const { state, dispatch } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartItemsCount = state.items.reduce((count, item) => count + item.quantity, 0);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  if (user?.role === 'ADMIN') navLinks.push({ href: '/admin', label: 'Admin' });
  if (user?.role === 'TELLER') navLinks.push({ href: '/dashboard', label: 'Teller' });

  return (
    <>
      <header className="bg-white shadow-md border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="text-2xl font-extrabold text-pink-600 hover:text-pink-700 transition-colors">
              Kiya Children&apos;s Boutique
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center space-x-6">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-700 hover:text-pink-600 font-medium transition-colors"
                >
                  {link.label}
                </Link>
              ))}

              {!isAuthenticated && (
                <Link
                  href="/auth/signin"
                  className="bg-pink-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-pink-700 shadow-md hover:shadow-lg transition-all"
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

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-gray-600 hover:text-pink-600 transition-colors"
              >
                {mobileMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`fixed inset-0 z-40 md:hidden transition-transform duration-300 ease-in-out ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Slide-in menu */}
          <div className="absolute right-0 top-0 w-64 h-full bg-white shadow-xl p-6 flex flex-col space-y-4">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-800 hover:text-pink-600 font-medium text-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {!isAuthenticated && (
              <Link
                href="/auth/signin"
                className="block bg-pink-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-pink-700 shadow-md hover:shadow-lg text-center transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
            )}

            <button
              onClick={() => {
                dispatch({ type: 'TOGGLE_CART' });
                setMobileMenuOpen(false);
              }}
              className="relative flex items-center justify-center p-2 text-gray-700 hover:text-pink-600 font-medium text-lg rounded-lg shadow-sm hover:shadow-md transition-all"
            >
              <ShoppingCartIcon className="h-6 w-6 mr-2" /> Cart ({cartItemsCount})
            </button>
          </div>
        </div>
      </header>

      <CartSidebar />
    </>
  );
}
