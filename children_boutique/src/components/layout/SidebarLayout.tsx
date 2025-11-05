// src/components/layout/SidebarLayout.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import NotificationBell from '@/components/notifications/NotificationBell';
import {
  HomeIcon,
  ShoppingBagIcon,
  ChartBarIcon,
  UserGroupIcon,
  CogIcon,
  XMarkIcon,
  Bars3Icon,
  ShoppingCartIcon
} from '@heroicons/react/24/outline';

interface SidebarLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Admin Dashboard', href: '/admin', icon: CogIcon, role: ['ADMIN'] },
  {name: 'Dashboard', href: '/dashboard', icon: HomeIcon, role: ['TELLER'] },
  { name: 'Home', href: '/', icon: HomeIcon, role: ['ADMIN', 'TELLER'] },
  { name: 'Products', href: '/dashboard/products', icon: ShoppingBagIcon, role: ['ADMIN', 'TELLER'] },
  { name: 'Sales', href: '/dashboard/sales', icon: ShoppingCartIcon, role: ['ADMIN', 'TELLER'] },
  { name: 'User Management', href: '/admin/users', icon: UserGroupIcon, role: ['ADMIN'] },
  { name: 'Orders', href: '/dashboard/orders', icon: ShoppingBagIcon, role: ['ADMIN', 'TELLER'] },
  { name: 'Reports', href: '/dashboard/reports', icon: ChartBarIcon, role: ['ADMIN'] },
  { name: 'Settings', href: '/settings', icon: CogIcon, role: ['ADMIN','TELLER'] },

];

export default function SidebarLayout({ children }: SidebarLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();

  const pathname = usePathname();

  const filteredNavigation = navigation.filter(item =>
    item.role.includes(user?.role as any)
  );

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 flex z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
        </div>
      )}

      {/* Mobile sidebar */}
      <div className={`fixed inset-y-0 left-0 flex flex-col w-64 bg-gray-800 transform transition-transform duration-300 ease-in-out z-50 lg:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        <div className="flex items-center justify-between h-16 px-4 bg-gray-900">
          <span className="text-white text-xl font-bold">Boutique Admin</span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-400 hover:text-white"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 flex flex-col overflow-y-auto">
          <nav className="flex-1 px-4 py-4 space-y-2">
            {filteredNavigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors ${isActive
                      ? 'bg-pink-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className={`mr-3 flex-shrink-0 h-5 w-5 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                    }`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col flex-1 bg-gray-800">
            <div className="flex items-center h-16 px-4 bg-gray-900">
              <span className="text-white text-xl font-bold">Boutique Admin</span>
            </div>

            <div className="flex-1 flex flex-col overflow-y-auto">
              <nav className="flex-1 px-4 py-4 space-y-2">
                {filteredNavigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors ${isActive
                          ? 'bg-pink-600 text-white'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        }`}
                    >
                      <item.icon className={`mr-3 flex-shrink-0 h-5 w-5 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                        }`} />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* User section */}
            <div className="flex-shrink-0 flex bg-gray-700 p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {user?.name?.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                </div>
                <div className="ml-3 min-w-0 flex-1">
                  <p className="text-sm font-medium text-white truncate">
                    {user?.name}
                  </p>
                  <p className="text-sm text-gray-300 truncate">
                    {user?.role}
                  </p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="ml-3 text-gray-300 hover:text-white"
                  title="Sign out"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top header bar */}
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-500 hover:text-gray-600"
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
              <div className="ml-4 lg:ml-0">
                <h1 className="text-xl font-semibold text-gray-900">
                  {filteredNavigation.find(item => item.href === pathname)?.name || 'Dashboard'}
                </h1>
              </div>
            </div>


            <div className="flex items-center space-x-4">
              {isAuthenticated && (<> <NotificationBell /></>)}

              <div className="text-sm text-gray-500">
                Welcome back, <span className="font-medium text-gray-900">{user?.name}</span>
              </div>

              {/* Mobile sign out button */}
              <button
                onClick={handleSignOut}
                className="lg:hidden text-gray-500 hover:text-gray-600"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-auto bg-gray-50">
          <div className="p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}