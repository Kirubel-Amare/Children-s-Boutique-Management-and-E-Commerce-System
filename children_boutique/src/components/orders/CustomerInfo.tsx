import { Order } from '@/types';

interface CustomerInfoProps {
  order: Order;
}

export const CustomerInfo: React.FC<CustomerInfoProps> = ({ order }) => {
  return (
    <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium text-gray-700">Name</p>
          <p className="text-sm text-gray-900">{order.customerName}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700">Email</p>
          <p className="text-sm text-gray-900">{order.customerEmail}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700">Phone</p>
          <p className="text-sm text-gray-900">{order.customerPhone || 'N/A'}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700">Payment Method</p>
          <p className="text-sm text-gray-900">{order.paymentMethod.toUpperCase()}</p>
        </div>
      </div>
    </div>
  );
};