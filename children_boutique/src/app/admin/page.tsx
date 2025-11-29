// src/app/admin/page.tsx
'use client';

import { useAdminData } from '@/hooks/useAdminData';
import { useAdminMetrics } from '@/hooks/useAdminMetrics';
import { AdminStats } from '@/components/admin/AdminStats';
import { QuickActions } from '@/components/admin/QuickActions';
import { RecentTransactions } from '@/components/admin/RecentTransactions';
import { SystemAlerts } from '@/components/admin/SystemAlerts';
import { InventoryStatus } from '@/components/admin/InventoryStatus';
import { UserManagementPreview } from '@/components/admin/UserManagementPreview';
import { SystemOverview } from '@/components/admin/SystemOverview';
import { AdminLoading } from '@/components/admin/AdminLoading';
import SidebarLayout from '@/components/layout/SidebarLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { 
  ChartBarIcon, 
  UserGroupIcon, 
  ShoppingBagIcon, 
  CurrencyDollarIcon 
} from '@heroicons/react/24/outline';
import { ContactMessages } from '@/components/admin/ContactMessages';

// Constants for better maintainability
const QUICK_ACTIONS = [
  {
    href: "/admin/users/new",
    icon: "👥",
    title: "Add User",
    description: "Create system user"
  },
  {
    href: "/dashboard/products/new",
    icon: "📦",
    title: "Add Product",
    description: "New product listing"
  },
  {
    href: "/dashboard/reports",
    icon: "📊",
    title: "View Reports",
    description: "Analytics & insights"
  },
  {
    href: "/admin/users",
    icon: "⚙️",
    title: "Manage Users",
    description: "User permissions"
  }
];

const STATS_CONFIG = (metrics: any) => [
  {
    name: 'Total Revenue',
    value: `ETB ${metrics.totalRevenue.toFixed(2)}`,
    change: '12.5%',
    changeType: 'increase' as const,
    icon: ChartBarIcon,
    color: 'blue' as const,
  },
  {
    name: 'Total Profit',
    value: `ETB ${metrics.totalProfit.toFixed(2)}`,
    change: `${metrics.profitMargin.toFixed(1)}% margin`,
    changeType: 'increase' as const,
    icon: CurrencyDollarIcon,
    color: 'green' as const,
  },
  {
    name: 'Total Products',
    value: metrics.totalProducts.toString(),
    change: '3.2%',
    changeType: 'increase' as const,
    icon: ShoppingBagIcon,
    color: 'purple' as const,
  },
  {
    name: 'System Users',
    value: metrics.totalUsers.toString(),
    change: '0%',
    changeType: 'increase' as const,
    icon: UserGroupIcon,
    color: 'yellow' as const,
  },
];

export default function AdminPage() {
  const { products, sales, orders, notifications, users, loading } = useAdminData();
  const metrics = useAdminMetrics(products, sales, orders, notifications, users);


  // Additional smaller components
const AdminWelcomeBanner: React.FC = () => (
  <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl shadow-sm p-6 text-white ">
    <div className="flex items-center justify-between ">
      <div>
        <h1 className="text-2xl font-bold mb-2">Admin Dashboard 👑</h1>
        <p className="opacity-90">Complete system overview and management controls</p>
      </div>
      <div className="hidden md:block">
        <div className="bg-white bg-opacity-20 rounded-lg p-3">
          <p  className="font-semibold text-gray-600">All Systems Operational</p>
        </div>
      </div>
    </div>
  </div>
);

// Main content grid component for better organization
interface MainContentGridProps {
  metrics: any;
  notifications: any[];
  users: any[];
}

const MainContentGrid: React.FC<MainContentGridProps> = ({ metrics, notifications, users }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <RecentTransactions transactions={metrics.allTransactions} />
    <SystemAlerts notifications={notifications} unreadCount={metrics.unreadNotifications} />
    <InventoryStatus 
      lowStockProducts={metrics.lowStockProducts}
      outOfStockProducts={metrics.outOfStockProducts}
      totalProducts={metrics.totalProducts}
    />
    <UserManagementPreview users={users} />
  </div>
);

  if (loading) {
    return (
      <ProtectedRoute requiredRole="ADMIN">
        <SidebarLayout>
          <AdminLoading />
        </SidebarLayout>
      </ProtectedRoute>
    );
  }

  const stats = STATS_CONFIG(metrics);

  // Ensure SystemOverview receives the expected shape by providing a fallback for revenueFromOrders
  const systemMetrics = {
    ...metrics,
    revenueFromOrders: (metrics as any).revenueFromOrders ?? metrics.totalFromOrders ?? 0,
  };

  return (
    <ProtectedRoute requiredRole="ADMIN">
      <SidebarLayout>
        <div className="space-y-6">
          <AdminWelcomeBanner />
          <AdminStats stats={stats} />
          <QuickActions actions={QUICK_ACTIONS} />
          
          <MainContentGrid 
            metrics={metrics}
            notifications={notifications}
            users={users}
          />
          <ContactMessages maxItems={5} showViewAll={true} />
          
          <SystemOverview metrics={systemMetrics} />


        </div> 
      </SidebarLayout>
    </ProtectedRoute>
  );
}

