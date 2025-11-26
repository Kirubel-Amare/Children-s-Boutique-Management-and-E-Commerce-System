// src/components/cart/CartSidebar.tsx
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
    if (quantity <= 0) {
      dispatch({ type: 'REMOVE_ITEM', payload: productId });
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
    }
  };

  const handleContinueShopping = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation(); // Prevent the parent click event
    }
    dispatch({ type: 'TOGGLE_CART' });
    router.push('/products');
  };

  const handleProceedToCheckout = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    dispatch({ type: 'TOGGLE_CART' });
    router.push('/checkout');
  };

  const handleClearCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({ type: 'CLEAR_CART' });
  };

  const handleProductClick = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({ type: 'TOGGLE_CART' });
    router.push(`/products/${productId}`);
  };

  const handleCloseCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({ type: 'TOGGLE_CART' });
  };

  if (!state.isOpen) return null;

  return (
    <>
      {/* Left Side - Selected Items Display */}
      <div
        className="fixed left-0 top-0 h-full w-2/3 bg-white z-40 overflow-y-auto"
        onClick={() => dispatch({ type: 'TOGGLE_CART' })}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <h2 className="text-2xl font-bold text-gray-900">
                Your Selected Items ({state.items.length})
              </h2>
            </div>
          </div>

          {/* Items Grid */}
          {state.items.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🛒</div>
              <p className="text-gray-500 mb-4">Your cart is empty</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {state.items.map((item) => (
                  <div
                    key={item.product.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors cursor-pointer"
                    onClick={(e) => handleProductClick(item.product.id, e)}
                  >
                    {/* Product Image */}
                    <div className="w-full h-48 bg-gray-200 rounded-lg overflow-hidden mb-4">
                      {item.product.imageUrl ? (
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                          <span className="text-gray-500">No image available</span>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-3">
                      <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 hover:text-pink-600 transition-colors">
                        {item.product.name}
                      </h3>

                      {item.product.description && (
                        <p className="text-gray-600 text-sm line-clamp-2">{item.product.description}</p>
                      )}

                      <div className="flex items-center justify-between">
                        <p className="text-pink-600 font-bold text-lg">${item.product.price.toFixed(2)}</p>
                        <p className="text-gray-500 text-sm">Each</p>
                      </div>

                      {/* Quantity Controls */}
                      <div
                        className="flex items-center justify-between pt-3 border-t border-gray-200"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-sm text-gray-900">Quantity:</span>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                updateQuantity(item.product.id, item.quantity - 1);
                              }}
                              className="w-8 h-8 flex items-center justify-center border border-gray-500 rounded-lg hover:bg-gray-300 transition-colors text-gray-900"
                            >
                              -
                            </button>
                            <span className="w-8 text-center font-medium text-gray-500">{item.quantity}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                updateQuantity(item.product.id, item.quantity + 1);
                              }}
                              className="w-8 h-8 flex items-center justify-center border border-gray-500 rounded-lg hover:bg-gray-300 transition-colors text-gray-900"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Item Total */}
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch({ type: 'REMOVE_ITEM', payload: item.product.id });
                        }}
                        className="w-full mt-3 bg-red-50 text-red-600 py-2 rounded-lg hover:bg-red-100 transition-colors font-medium flex items-center justify-center space-x-2"
                      >
                        <XMarkIcon className="h-4 w-4" />
                        <span>Remove Item</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Actions at Bottom of Left Side */}
              <div className="mt-8 flex justify-between items-center pt-6 border-t border-gray-200">
                <button
                  onClick={handleContinueShopping}
                  className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                >
                  Continue Shopping
                </button>

                {state.items.length > 0 && (
                  <button
                    onClick={handleClearCart}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center space-x-2"
                  >
                    <XMarkIcon className="h-4 w-4" />
                    <span>Clear Cart</span>
                  </button>
                )}


              </div>
            </>
          )}
        </div>
      </div>

      {/* Right Side - Cart Actions (Always visible when cart is open) */}
      <div className="fixed right-0 top-0 h-full w-1/3 bg-white shadow-xl z-50">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-600">
              {state.items.length > 0 ? 'Checkout' : 'Cart'}
            </h2>
            <button
              onClick={handleCloseCart}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Order Summary - Shows content based on cart state */}
          <div className="flex-1 overflow-y-auto p-6">
            {state.items.length === 0 ? (
              // Empty cart state for right sidebar
              <div className="text-center py-12">
                <div className="text-4xl mb-4">📦</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Cart Empty</h3>
                <p className="text-gray-500 mb-6">Your cart is currently empty</p>
                <button
                  onClick={handleContinueShopping}
                  className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              // Cart has items
              <div className="space-y-4">
                {/* Items List */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 mb-2">Order Items</h3>
                  {state.items.map((item) => (
                    <div key={item.product.id} className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                          {item.product.imageUrl && (
                            <img
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <span className="font-medium truncate max-w-[120px]">{item.product.name}</span>
                        <span className="text-gray-500">x{item.quantity}</span>
                      </div>
                      <span className="font-semibold">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="border-t pt-4 space-y-2">
                  <h3 className="font-semibold text-gray-900 mb-2">Price Summary</h3>
                  <div className="flex justify-between text-gray-600">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium text-gray-600">$0.00</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span className="text-gray-600 text-gray-600">Tax</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold border-t pt-2 text-gray-600">
                    <span>Total</span>
                    <span className="text-pink-600">${finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer - Checkout Button (only when items exist) */}
          {state.items.length > 0 && (
            <div className="border-t p-6">
              <button
                onClick={handleProceedToCheckout}
                className="w-full bg-pink-600 text-white text-center py-4 rounded-lg font-semibold hover:bg-pink-700 transition-colors text-lg"
              >
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}