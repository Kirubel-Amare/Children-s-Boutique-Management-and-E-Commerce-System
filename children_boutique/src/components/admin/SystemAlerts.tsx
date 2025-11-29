// components/admin/SystemAlerts.tsx
import Link from 'next/link';
import { CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { getNotifications } from '@/lib/notifications';
import { Notification } from '@/types';

interface SystemAlertsProps {
  notifications: Notification[];
  unreadCount: number;
}

export const SystemAlerts: React.FC<SystemAlertsProps> = ({ notifications, unreadCount }) => {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">System Alerts</h3>
          <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded-full">
            {unreadCount} new
          </span>
        </div>
      </div>
      <div className="p-6">
        {notifications.length === 0 ? (
          <NoAlerts />
        ) : (
          <AlertsList notifications={notifications} />
        )}
      </div>
    </div>
  );
};

const NoAlerts: React.FC = () => (
  <div className="text-center py-8 text-gray-500">
    <CheckCircleIcon className="h-12 w-12 text-green-400 mx-auto mb-3" />
    <p>No alerts at this time</p>
    <p className="text-sm">All systems are running smoothly</p>
  </div>
);

const AlertsList: React.FC<{ notifications: Notification[] }> = ({ notifications }) => (
  <div className="space-y-3">
    {notifications.slice(0, 5).map((notification) => (
      <AlertItem key={notification.id} notification={notification} />
    ))}
  </div>
);

const AlertItem: React.FC<{ notification: Notification }> = ({ notification }) => {
  const getAlertStyles = (type: string) => {
    switch (type) {
      case 'low_stock':
        return 'border-l-yellow-400 bg-yellow-50';
      case 'out_of_stock':
        return 'border-l-red-400 bg-red-50';
      default:
        return 'border-l-blue-400 bg-blue-50';
    }
  };

  return (
    <div className={`p-3 rounded-lg border-l-4 ${getAlertStyles(notification.type)}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="font-medium text-gray-900">{notification.title}</p>
          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
          {notification.product && (
            <p className="text-xs text-gray-500 mt-1">
              Product: {notification.product.name}
            </p>
          )}
        </div>
        <span className="text-xs text-gray-400 whitespace-nowrap">
          {new Date(notification.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};