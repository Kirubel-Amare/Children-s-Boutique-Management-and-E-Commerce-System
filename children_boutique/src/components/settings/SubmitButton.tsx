// components/settings/SubmitButton.tsx
interface SubmitButtonProps {
  loading: boolean;
  loadingText: string;
  defaultText: string;
  disabled?: boolean;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  loading,
  loadingText,
  defaultText,
  disabled = false,
}) => {
  return (
    <button
      type="submit"
      disabled={disabled || loading}
      className="bg-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-pink-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
    >
      {loading ? (
        <>
          <Spinner />
          {loadingText}
        </>
      ) : (
        defaultText
      )}
    </button>
  );
};

const Spinner: React.FC = () => (
  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);