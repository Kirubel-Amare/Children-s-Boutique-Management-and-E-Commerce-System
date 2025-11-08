// src/app/checkout/page.tsx
'use client';

import { useCart } from '@/context/CartContext';
import Layout from '@/components/layout/Layout';
import { useCheckout } from '@/hooks/useCheckout';
import { ProgressSteps } from '@/components/checkout/ProgressSteps';
import { FormInput } from '@/components/checkout/FormInput';
import { FormSection } from '@/components/checkout/FormSection';
import { PaymentMethod } from '@/components/checkout/PaymentMethod';
import { OrderSummary } from '@/components/checkout/OrderSummary';
import { SubmitButton } from '@/components/checkout/SubmitButton';
import { SecurityNotice } from '@/components/checkout/SecurityNotice';
import { EmptyCart } from '@/components/checkout/EmptyCart';
import { ErrorMessage } from '@/components/auth/ErrorMessage';
import { 
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CreditCardIcon 
} from '@heroicons/react/24/outline';

const PROGRESS_STEPS = [
  { number: 1, label: 'Information', active: true },
  { number: 2, label: 'Payment', active: false },
  { number: 3, label: 'Confirmation', active: false }
];

export default function CheckoutPage() {
  const { state } = useCart();
  const {
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
  } = useCheckout();

  if (state.items.length === 0) {
    return (
      <Layout>
        <EmptyCart />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
            <p className="text-gray-600 mt-2">Complete your purchase</p>
          </div>

          <ProgressSteps steps={PROGRESS_STEPS} currentStep={1} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Customer Information */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Customer Information</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <FormSection title="Personal Information" icon={UserIcon}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={customerInfo.firstName}
                      onChange={handleInputChange}
                      placeholder="John"
                      label="First Name"
                      error={errors.firstName}
                    />
                    <FormInput
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={customerInfo.lastName}
                      onChange={handleInputChange}
                      placeholder="Doe"
                      label="Last Name"
                      error={errors.lastName}
                    />
                  </div>
                </FormSection>

                {/* Contact Information */}
                <FormSection title="Contact Information" icon={EnvelopeIcon}>
                  <div className="space-y-4">
                    <FormInput
                      id="email"
                      name="email"
                      type="email"
                      value={customerInfo.email}
                      onChange={handleInputChange}
                      placeholder="john@example.com"
                      label="Email Address"
                      error={errors.email}
                    />
                    <FormInput
                      id="phone"
                      name="phone"
                      type="tel"
                      value={customerInfo.phone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 123-4567"
                      label="Phone Number"
                      error={errors.phone}
                    />
                  </div>
                </FormSection>

                {/* Shipping Address */}
                <FormSection title="Shipping Address" icon={MapPinIcon}>
                  <div className="space-y-4">
                    <FormInput
                      id="address"
                      name="address"
                      type="text"
                      value={customerInfo.address}
                      onChange={handleInputChange}
                      placeholder="123 Main Street"
                      label="Street Address"
                      error={errors.address}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormInput
                        id="city"
                        name="city"
                        type="text"
                        value={customerInfo.city}
                        onChange={handleInputChange}
                        placeholder="New York"
                        label="City"
                        error={errors.city}
                      />
                      <FormInput
                        id="zipCode"
                        name="zipCode"
                        type="text"
                        value={customerInfo.zipCode}
                        onChange={handleInputChange}
                        placeholder="10001"
                        label="ZIP Code"
                        error={errors.zipCode}
                      />
                    </div>
                    <FormInput
                      id="country"
                      name="country"
                      type="text"
                      value={customerInfo.country}
                      onChange={handleInputChange}
                      placeholder="United States"
                      label="Country"
                      error={errors.country}
                    />
                  </div>
                </FormSection>

                {/* Payment Method */}
                <FormSection title="Payment Method" icon={CreditCardIcon}>
                  <PaymentMethod value={paymentMethod} onChange={setPaymentMethod} />
                </FormSection>

                <ErrorMessage message={errors.submit || ''} />

                <SubmitButton loading={loading} total={total} children={undefined} />

                <SecurityNotice />
              </form>
            </div>

            {/* Right Column - Order Summary */}
            <OrderSummary
              subtotal={subtotal}
              shippingFee={shippingFee}
              tax={tax}
              total={total}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}