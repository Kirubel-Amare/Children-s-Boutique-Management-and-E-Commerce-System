// src/components/layout/Header.tsx
'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import NotificationBell from '@/components/notifications/NotificationBell';

export default function Header() {
  const { isAuthenticated, user } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-pink-600">
              Children&apos;s Boutique
            </Link>
          </div>
          <nav className="flex items-center space-x-6">
            <Link href="/" className="text-gray-700 hover:text-pink-600">
              Home
            </Link>
            <Link href="/products" className="text-gray-700 hover:text-pink-600">
              Products
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" className="text-gray-700 hover:text-pink-600">
                  Dashboard
                </Link>
                {user?.role === 'ADMIN' && (
                  <Link href="/admin" className="text-gray-700 hover:text-pink-600">
                    Admin
                  </Link>
                )}
                
                {/* Add Notification Bell */}
                <NotificationBell />
                
                <span className="text-sm text-gray-500">
                  {user?.name} ({user?.role})
                </span>
              </>
            ) : (
              <Link 
                href="/auth/signin" 
                className="bg-pink-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-pink-700"
              >
                Sign In
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}