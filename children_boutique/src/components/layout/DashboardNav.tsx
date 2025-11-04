// src/components/layout/DashboardNav.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

// Update the navigation array in DashboardNav.tsx
const navigation = [
  { name: 'Overview', href: '/dashboard', role: ['ADMIN', 'TELLER'] },
  { name: 'Products', href: '/dashboard/products', role: ['ADMIN', 'TELLER'] },
  { name: 'Sales', href: '/dashboard/sales', role: ['ADMIN', 'TELLER'] },
  { name: 'Users', href: '/admin/users', role: ['ADMIN'] },
];
export default function DashboardNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  const filteredNavigation = navigation.filter(item => 
    item.role.includes(user?.role as any)
  );

  return (
    <nav className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex space-x-4">
              {filteredNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === item.href
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  } transition-colors`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}