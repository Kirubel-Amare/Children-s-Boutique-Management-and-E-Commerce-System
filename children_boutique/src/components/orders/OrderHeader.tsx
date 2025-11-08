import { Order } from '@/types';
import { getStatusColor } from '@/utils/orderUtils';

interface OrderHeaderProps {
  order: Order;
  onBack: () => void;
}

export const OrderHeader: React.FC<OrderHeaderProps> = ({ order, onBack }) => {
  return (
    <div className="mb-8">
      <button
        onClick={onBack}
        className="text-pink-600 hover:text-pink-700 mb-4 flex items-center"
      >
        ← Back to Orders
      </button>
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order {order.orderNumber}</h1>
          <p className="text-gray-600 mt-2">
            Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
          </p>
        </div>
        <span className={`inline-flex px-4 py-2 text-sm font-semibold rounded-full border ${getStatusColor(order.status)}`}>
          {order.status}
        </span>
      </div>
    </div>
  );
};