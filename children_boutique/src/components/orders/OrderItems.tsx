import { Order } from '@/types';
import { formatCurrency } from '@/utils/orderUtils';

interface OrderItemsProps {
  order: Order;
}

export const OrderItems: React.FC<OrderItemsProps> = ({ order }) => {
  return (
    <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
      <div className="space-y-4">
        {order.orderItems.map((item) => (
          <OrderItemRow key={item.id} item={item} />
        ))}
      </div>
      <OrderSummary order={order} />
    </div>
  );
};

const OrderItemRow: React.FC<{ item: Order['orderItems'][0] }> = ({ item }) => {
  const hasStockIssue = item.product.quantity < item.quantity;
  
  return (
    <div className="flex justify-between items-start py-3 border-b border-gray-200">
      <div className="flex-1">
        <p className="font-medium text-gray-900">{item.productName}</p>
        <div className="flex items-center space-x-4 mt-1">
          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
          <p className="text-sm text-gray-500">Price: {formatCurrency(item.price)}</p>
          <p className={`text-sm font-medium ${
            !hasStockIssue ? 'text-green-600' : 'text-red-600'
          }`}>
            Stock: {item.product.quantity} available
          </p>
        </div>
        {hasStockIssue && (
          <p className="text-xs text-red-600 mt-1">
            ⚠️ Insufficient stock! Need {item.quantity - item.product.quantity} more
          </p>
        )}
      </div>
      <p className="font-medium text-gray-900">{formatCurrency(item.quantity * item.price)}</p>
    </div>
  );
};

const OrderSummary: React.FC<{ order: Order }> = ({ order }) => {
  return (
    <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
      <div className="flex justify-between text-sm">
        <p>Subtotal</p>
        <p>{formatCurrency(order.subtotal)}</p>
      </div>
      <div className="flex justify-between text-sm">
        <p>Shipping</p>
        <p>{formatCurrency(order.shippingFee)}</p>
      </div>
      <div className="flex justify-between text-sm">
        <p>Tax</p>
        <p>{formatCurrency(order.tax)}</p>
      </div>
      <div className="flex justify-between text-lg font-semibold mt-2 pt-2 border-t border-gray-200">
        <p>Total</p>
        <p>{formatCurrency(order.total)}</p>
      </div>
    </div>
  );
};