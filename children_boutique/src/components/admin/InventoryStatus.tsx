// components/admin/InventoryStatus.tsx
import { CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface InventoryStatusProps {
  lowStockProducts: number;
  outOfStockProducts: number;
  totalProducts: number;
}

export const InventoryStatus: React.FC<InventoryStatusProps> = ({
  lowStockProducts,
  outOfStockProducts,
  totalProducts,
}) => {
  const inventoryItems = [
    {
      label: 'In Stock',
      description: 'Products with sufficient inventory',
      count: totalProducts - lowStockProducts - outOfStockProducts,
      color: 'green' as const,
      icon: CheckCircleIcon,
    },
    {
      label: 'Low Stock',
      description: 'Needs restocking soon',
      count: lowStockProducts,
      color: 'yellow' as const,
      icon: ExclamationTriangleIcon,
    },
    {
      label: 'Out of Stock',
      description: 'Urgent restocking needed',
      count: outOfStockProducts,
      color: 'red' as const,
      icon: ExclamationTriangleIcon,
    },
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'green': return 'bg-green-50 border-green-200 text-green-600 bg-green-100';
      case 'yellow': return 'bg-yellow-50 border-yellow-200 text-yellow-600 bg-yellow-100';
      case 'red': return 'bg-red-50 border-red-200 text-red-600 bg-red-100';
      default: return 'bg-gray-50 border-gray-200 text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Inventory Status</h3>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {inventoryItems.map((item) => (
            <div
              key={item.label}
              className={`flex justify-between items-center p-3 rounded-lg border ${getColorClasses(item.color)}`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getColorClasses(item.color)}`}>
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{item.label}</p>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
              </div>
              <span className="text-2xl font-bold">{item.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};