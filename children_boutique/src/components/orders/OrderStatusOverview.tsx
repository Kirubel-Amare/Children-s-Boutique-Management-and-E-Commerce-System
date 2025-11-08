import { OrderSummary } from '@/types';

interface OrderStatusOverviewProps {
  metrics: OrderSummary;
}

export const OrderStatusOverview: React.FC<OrderStatusOverviewProps> = ({ metrics }) => {
  const statusItems = [
    { count: metrics.pendingOrders, label: 'Pending' },
    { count: metrics.approvedOrders, label: 'Approved' },
    { count: metrics.completedOrders, label: 'Completed' },
    { count: metrics.rejectedOrders, label: 'Rejected' },
  ];

  return (
    <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg shadow-sm p-6 text-white mb-8">
      <h3 className="text-lg font-semibold mb-4">Order Status Overview</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-gray-600">
        {statusItems.map((item, index) => (
          <div key={index} className="text-center">
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <p className="text-2xl font-bold">{item.count}</p>
              <p className="text-sm opacity-90">{item.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};