// components/checkout/PaymentMethod.tsx
interface PaymentMethodProps {
  value: 'cod' | 'card';
  onChange: (method: 'cod' | 'card') => void;
}

export const PaymentMethod: React.FC<PaymentMethodProps> = ({ value, onChange }) => {
  const paymentOptions = [
    {
      value: 'cod',
      label: 'Cash on Delivery',
      description: 'Pay when you receive your order',
      activeClass: 'border-pink-500 bg-pink-50'
    },
    {
      value: 'card',
      label: 'Credit/Debit Card',
      description: 'Pay securely with your card',
      activeClass: 'border-gray-300'
    }
  ];

  return (
    <div className="space-y-3">
      {paymentOptions.map((option) => (
        <label
          key={option.value}
          className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
            value === option.value ? option.activeClass : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <input
            type="radio"
            name="paymentMethod"
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value as 'cod' | 'card')}
            className="text-pink-600 focus:ring-pink-500"
          />
          <div className="ml-3">
            <span className="font-medium text-gray-900">{option.label}</span>
            <p className="text-sm text-gray-600">{option.description}</p>
          </div>
        </label>
      ))}
    </div>
  );
};