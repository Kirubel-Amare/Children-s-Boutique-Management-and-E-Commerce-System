// components/checkout/OrderSummary.tsx
import { useCart } from '@/context/CartContext';
import { TruckIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

interface OrderSummaryProps {
  subtotal: number;
  shippingFee: number;
  tax: number;
  total: number;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  subtotal,
  shippingFee,
  tax,
  total,
}) => {
  const { state } = useCart();

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 h-fit sticky top-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
      
      {/* Order Items */}
      <div className="space-y-4 mb-6">
        {state.items.map((item) => (
          <OrderItem key={item.product.id} item={item} />
        ))}
      </div>

      {/* Order Totals */}
      <OrderTotals
        subtotal={subtotal}
        shippingFee={shippingFee}
        tax={tax}
        total={total}
      />

      {/* Shipping Info */}
      {subtotal < 50 && (
        <FreeShippingNotice subtotal={subtotal} />
      )}

      {/* Trust Badges */}
      <TrustBadges />
    </div>
  );
};

const OrderItem: React.FC<{ item: any }> = ({ item }) => (
  <div className="flex items-center space-x-4">
    <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
      {item.product.imageUrl ? (
        <img
          src={item.product.imageUrl}
          alt={item.product.name}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gray-300 flex items-center justify-center">
          <span className="text-gray-500 text-xs">No image</span>
        </div>
      )}
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="font-medium text-gray-900 truncate">{item.product.name}</h4>
      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
    </div>
    <div className="text-right">
      <p className="font-semibold text-gray-900">
        ETB {(item.product.price * item.quantity).toFixed(2)}
      </p>
    </div>
  </div>
);

const OrderTotals: React.FC<OrderSummaryProps> = ({
  subtotal,
  shippingFee,
  tax,
  total,
}) => (
  <div className="border-t border-gray-200 pt-4 space-y-3">
    <div className="flex justify-between text-sm">
      <span className="text-gray-600">Subtotal</span>
      <span className="text-gray-900">ETB {subtotal.toFixed(2)}</span>
    </div>
    <div className="flex justify-between text-sm">
      <span className="text-gray-600">Shipping</span>
      <span className="text-gray-900">
        {shippingFee === 0 ? 'FREE' : `ETB ${shippingFee.toFixed(2)}`}
      </span>
    </div>
    <div className="flex justify-between text-sm">
      <span className="text-gray-600">Tax</span>
      <span className="text-gray-900">ETB {tax.toFixed(2)}</span>
    </div>
    <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-3">
      <span className="text-gray-900">Total</span>
      <span className="text-pink-600">ETB {total.toFixed(2)}</span>
    </div>
  </div>
);

const FreeShippingNotice: React.FC<{ subtotal: number }> = ({ subtotal }) => (
  <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
    <p className="text-sm text-blue-800 text-center">
      Add ETB {(50 - subtotal).toFixed(2)} more for free shipping!
    </p>
  </div>
);

const TrustBadges: React.FC = () => (
  <div className="mt-6 grid grid-cols-3 gap-4 text-center">
    <div>
      <TruckIcon className="h-6 w-6 text-gray-400 mx-auto mb-1" />
      <p className="text-xs text-gray-600">Free Shipping Over ETB50</p>
    </div>
    <div>
      <ShieldCheckIcon className="h-6 w-6 text-gray-400 mx-auto mb-1" />
      <p className="text-xs text-gray-600">Secure Payment</p>
    </div>
    <div>
      <svg className="h-6 w-6 text-gray-400 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
      <p className="text-xs text-gray-600">Easy Returns</p>
    </div>
  </div>
);