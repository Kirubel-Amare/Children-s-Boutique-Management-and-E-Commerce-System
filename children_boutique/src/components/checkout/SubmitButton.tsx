// components/checkout/SubmitButton.tsx (updated)
interface SubmitButtonProps {
  loading: boolean;
  total?: number;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({ 
  loading, 
  total, 
  disabled = false, 
  children,
  className = "w-full bg-pink-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg hover:shadow-xl"
}) => {
  return (
    <button
      type="submit"
      disabled={loading || disabled}
      className={className}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
          Processing...
        </div>
      ) : (
        total ? `Complete Order - ETB ${total.toFixed(2)}` : children
      )}
    </button>
  );
};