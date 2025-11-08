// components/checkout/SecurityNotice.tsx
import { ShieldCheckIcon } from '@heroicons/react/24/outline';

export const SecurityNotice: React.FC = () => {
  return (
    <p className="text-center text-sm text-gray-500 flex items-center justify-center">
      <ShieldCheckIcon className="h-4 w-4 mr-1" />
      Your order is secure and encrypted
    </p>
  );
};