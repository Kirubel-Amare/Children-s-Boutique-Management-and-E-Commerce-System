interface StockIssuesWarningProps {
  issues: string[];
  isPending: boolean;
}

export const StockIssuesWarning: React.FC<StockIssuesWarningProps> = ({ 
  issues, 
  isPending 
}) => {
  if (!isPending || issues.length === 0) return null;

  return (
    <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
      <div className="flex items-center">
        <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <h3 className="text-lg font-semibold text-red-800">Stock Issues Detected</h3>
      </div>
      <ul className="mt-2 text-red-700 list-disc list-inside">
        {issues.map((issue, index) => (
          <li key={index}>{issue}</li>
        ))}
      </ul>
      <p className="mt-2 text-red-600 text-sm">
        Cannot approve order until stock issues are resolved.
      </p>
    </div>
  );
};