// components/admin/SystemOverview.tsx
import { ChartBarIcon, CurrencyDollarIcon, UserGroupIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';

interface SystemOverviewProps {
  metrics: {
    totalSales: number;
    totalInPersonSales: number;
    totalCompletedOrders: number;
    profitMargin: number;
    totalUsers: number;
    totalRevenue: number;
    revenueFromOrders: number;
  };
}

export const SystemOverview: React.FC<SystemOverviewProps> = ({ metrics }) => {
  const overviewItems = [
    {
      icon: ChartBarIcon,
      label: 'Total Transactions',
      value: metrics.totalSales.toString(),
      description: `${metrics.totalInPersonSales} in-store, ${metrics.totalCompletedOrders} online`,
      color: 'blue' as const,
    },
    {
      icon: CurrencyDollarIcon,
      label: 'Profit Margin',
      value: `${metrics.profitMargin.toFixed(1)}%`,
      description: 'Overall profit percentage',
      color: 'green' as const,
    },
    {
      icon: UserGroupIcon,
      label: 'User Activity',
      value: `${metrics.totalUsers} active`,
      description: 'System users',
      color: 'purple' as const,
    },
    {
      icon: ShoppingBagIcon,
      label: 'Online Revenue',
      value: `$${metrics.revenueFromOrders.toFixed(0)}`,
      description: 'From Online Orders',
      color: 'orange' as const,
    },
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-50 text-blue-600';
      case 'green': return 'bg-green-50 text-green-600';
      case 'purple': return 'bg-purple-50 text-purple-600';
      case 'orange': return 'bg-orange-50 text-orange-600';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">System Overview</h3>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {overviewItems.map((item) => (
            <OverviewItem key={item.label} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

const OverviewItem: React.FC<{ 
  item: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: string;
    description: string;
    color: string;
  }
}> = ({ item }) => (
  <div className="text-center">
    <div className={`rounded-lg p-4 ${getColorClasses(item.color)}`}>
      <item.icon className="h-8 w-8 mx-auto mb-2" />
      <p className="text-sm font-medium text-gray-900">{item.label}</p>
      <p className="text-2xl font-bold">{item.value}</p>
      <p className="text-xs text-gray-500">{item.description}</p>
    </div>
  </div>
);

// Helper function for OverviewItem
const getColorClasses = (color: string) => {
  switch (color) {
    case 'blue': return 'bg-blue-50 text-blue-600';
    case 'green': return 'bg-green-50 text-green-600';
    case 'purple': return 'bg-purple-50 text-purple-600';
    case 'orange': return 'bg-orange-50 text-orange-600';
    default: return 'bg-gray-50 text-gray-600';
  }
};