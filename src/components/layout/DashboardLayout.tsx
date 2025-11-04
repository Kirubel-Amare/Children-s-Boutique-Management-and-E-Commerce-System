// src/components/layout/DashboardLayout.tsx
'use client';

import { useAuth } from '@/hooks/useAuth';
import { signOut } from 'next-auth/react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user } = useAuth();

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Dashboard
              </h1>
              <p className="text-sm text-gray-600">
                Welcome back, {user?.name} ({user?.role})
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleSignOut}
                className="text-gray-700 hover:text-pink-600 font-medium"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}