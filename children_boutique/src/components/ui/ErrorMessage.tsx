// src/components/ui/ErrorMessage.tsx
interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ 
  title = "Something went wrong", 
  message, 
  onRetry 
}: ErrorMessageProps) {
  return (
    <div className="text-center py-8">
      <div className="text-gray-400 text-6xl mb-4">⚠️</div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-4 max-w-md mx-auto">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-pink-600 text-white px-6 py-2 rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
        >
          Try Again
        </button>
      )}
    </div>
  );
}