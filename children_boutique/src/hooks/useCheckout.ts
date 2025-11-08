// hooks/useCheckout.ts
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { createOrder } from '@/lib/orders';

interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
}

interface UseCheckoutReturn {
  customerInfo: CustomerInfo;
  paymentMethod: 'cod' | 'card';
  loading: boolean;
  errors: Record<string, string>;
  subtotal: number;
  shippingFee: number;
  tax: number;
  total: number;
  setPaymentMethod: (method: 'cod' | 'card') => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  validateForm: () => boolean;
}

export const useCheckout = (): UseCheckoutReturn => {
  const { state, dispatch } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card'>('cod');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    country: '',
  });

  // Calculate order summary
  const subtotal = state.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const shippingFee = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shippingFee + tax;

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!customerInfo.firstName) newErrors.firstName = 'First name is required';
    if (!customerInfo.lastName) newErrors.lastName = 'Last name is required';
    if (!customerInfo.email) newErrors.email = 'Email is required';
    if (!customerInfo.phone) newErrors.phone = 'Phone number is required';
    if (!customerInfo.address) newErrors.address = 'Address is required';
    if (!customerInfo.city) newErrors.city = 'City is required';
    if (!customerInfo.zipCode) newErrors.zipCode = 'Zip code is required';
    if (!customerInfo.country) newErrors.country = 'Country is required';

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (customerInfo.email && !emailRegex.test(customerInfo.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        customerInfo,
        items: state.items,
        paymentMethod,
        subtotal,
        shippingFee,
        tax,
        total,
      };

      const result = await createOrder(orderData as any);
      
      // Clear cart and redirect to confirmation with order number
      dispatch({ type: 'CLEAR_CART' });
      router.push(`/checkout/success?order=${result.orderNumber}`);
      
    } catch (error) {
      console.error('Error creating order:', error);
      setErrors({ submit: 'Failed to create order. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return {
    customerInfo,
    paymentMethod,
    loading,
    errors,
    subtotal,
    shippingFee,
    tax,
    total,
    setPaymentMethod,
    handleInputChange,
    handleSubmit,
    validateForm,
  };
};