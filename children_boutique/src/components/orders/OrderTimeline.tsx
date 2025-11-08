import { Order } from '@/types';
import { formatDateTime } from '@/utils/orderUtils';

interface OrderTimelineProps {
  order: Order;
}

export const OrderTimeline: React.FC<OrderTimelineProps> = ({ order }) => {
  return (
    <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Timeline</h3>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Created:</span>
          <span>{formatDateTime(order.createdAt)}</span>
        </div>
        {order.approvedAt && (
          <div className="flex justify-between">
            <span className="text-gray-600">Approved:</span>
            <span>{formatDateTime(order.approvedAt)}</span>
          </div>
        )}
        {order.approvedBy && (
          <div className="flex justify-between">
            <span className="text-gray-600">Approved by:</span>
            <span>{order.approvedBy}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-gray-600">Last updated:</span>
          <span>{formatDateTime(order.updatedAt || order.createdAt)}</span>
        </div>
      </div>
    </div>
  );
};