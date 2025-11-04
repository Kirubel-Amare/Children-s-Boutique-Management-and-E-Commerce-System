// src/components/dashboard/RecentActivity.tsx
import { CheckCircleIcon, ExclamationTriangleIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';

interface Activity {
  id: number;
  type: 'sale' | 'alert' | 'info';
  description: string;
  time: string;
  user: string;
}

interface RecentActivityProps {
  activities: Activity[];
}

export default function RecentActivity({ activities }: RecentActivityProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'sale':
        return <ShoppingCartIcon className="h-5 w-5 text-green-500" />;
      case 'alert':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
      default:
        return <CheckCircleIcon className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Activity</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {activities.map((activity) => (
          <div key={activity.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {getIcon(activity.type)}
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                <div className="flex items-center mt-1">
                  <p className="text-sm text-gray-500">by {activity.user}</p>
                  <span className="mx-2 text-gray-300">•</span>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}