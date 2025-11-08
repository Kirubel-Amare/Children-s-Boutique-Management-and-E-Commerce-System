import { Order } from '@/types';

interface ShippingAddressProps {
  order: Order;
}

export const ShippingAddress: React.FC<ShippingAddressProps> = ({ order }) => {
  return (
    <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h3>
      <div className="text-sm text-gray-900">
        <p className="font-medium">{order.customerName}</p>
        <p>{order.shippingAddress.street}</p>
        <p>{order.shippingAddress.city}, {order.shippingAddress.zipCode}</p>
        <p>{order.shippingAddress.country}</p>
      </div>
    </div>
  );
};