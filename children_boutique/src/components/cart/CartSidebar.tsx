'use client';

import { useCart } from '@/context/CartContext';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CartSidebar() {
  const { state, dispatch } = useCart();
  const router = useRouter();

  const total = state.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const tax = total * 0.1;
  const finalTotal = total + tax;

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) dispatch({ type: 'REMOVE_ITEM', payload: productId });
    else dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  };

  if (!state.isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-40"
        onClick={() => dispatch({ type: 'TOGGLE_CART' })}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">
              Your Cart ({state.items.length})
            </h2>
            <button
              onClick={() => dispatch({ type: 'TOGGLE_CART' })}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {state.items.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">🛒</div>
                <p className="text-gray-500 mb-4">Your cart is empty</p>
                <button
                  onClick={() => {
                    dispatch({ type: 'TOGGLE_CART' });
                    router.push('/products');
                  }}
                  className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              state.items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:shadow-md transition-all cursor-pointer"
                  onClick={() => {
                    dispatch({ type: 'TOGGLE_CART' });
                    router.push(`/products/${item.product.id}`);
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      {item.product.imageUrl && (
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900 line-clamp-1">{item.product.name}</span>
                      <span className="text-gray-500 text-sm">x{item.quantity}</span>
                      <span className="text-pink-600 font-semibold">${(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex flex-col items-end space-y-1">
                    <div className="flex space-x-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateQuantity(item.product.id, item.quantity - 1);
                        }}
                        className="w-7 h-7 flex items-center justify-center border rounded hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span className="w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateQuantity(item.product.id, item.quantity + 1);
                        }}
                        className="w-7 h-7 flex items-center justify-center border rounded hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch({ type: 'REMOVE_ITEM', payload: item.product.id });
                      }}
                      className="text-red-600 text-xs hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer - Summary & Checkout */}
          {state.items.length > 0 && (
            <div className="p-6 border-t space-y-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax (10%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg text-pink-600">
                <span>Total</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
              <button
                onClick={() => {
                  dispatch({ type: 'TOGGLE_CART' });
                  router.push('/checkout');
                }}
                className="w-full bg-pink-600 text-white py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors"
              >
                Proceed to Checkout
              </button>
              <button
                onClick={() => dispatch({ type: 'CLEAR_CART' })}
                className="w-full text-red-600 py-2 rounded-lg border border-red-600 hover:bg-red-50 transition-colors font-medium"
              >
                Clear Cart
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
