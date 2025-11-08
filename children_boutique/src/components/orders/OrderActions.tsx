import { Order } from '@/types';

interface OrderActionsProps {
  order: Order;
  updating: boolean;
  stockIssues: string[];
  onStatusUpdate: (status: Order['status'], notes?: string) => void;
  onNotesRequired?: () => boolean;
}

export const OrderActions: React.FC<OrderActionsProps> = ({
  order,
  updating,
  stockIssues,
  onStatusUpdate,
  onNotesRequired,
}) => {
  const handleReject = () => {
    if (onNotesRequired?.() || window.confirm('Are you sure you want to reject this order without adding notes?')) {
      onStatusUpdate('REJECTED');
    }
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
      onStatusUpdate('CANCELLED');
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Actions</h3>
      <div className="space-y-3">
        {order.status === 'PENDING' && (
          <>
            <button
              onClick={() => onStatusUpdate('APPROVED')}
              disabled={updating || stockIssues.length > 0}
              className="w-full bg-green-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {updating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                '✅ Approve Order & Update Stock'
              )}
            </button>
            <button
              onClick={handleReject}
              disabled={updating}
              className="w-full bg-red-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              {updating ? 'Rejecting...' : '❌ Reject Order'}
            </button>
          </>
        )}
        {order.status === 'APPROVED' && (
          <button
            onClick={() => onStatusUpdate('COMPLETED')}
            disabled={updating}
            className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            {updating ? 'Completing...' : '🚚 Mark as Completed'}
          </button>
        )}
        {(order.status === 'APPROVED' || order.status === 'COMPLETED') && (
          <button
            onClick={handleCancel}
            disabled={updating}
            className="w-full bg-gray-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            {updating ? 'Cancelling...' : 'Cancel Order'}
          </button>
        )}
      </div>
      
      {stockIssues.length > 0 && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> Resolve stock issues before approving this order.
          </p>
        </div>
      )}
    </div>
  );
};