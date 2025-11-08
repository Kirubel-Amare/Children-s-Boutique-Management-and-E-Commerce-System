import { Order } from '@/types';
import Link from 'next/link';
import { JSX } from 'react';

interface OrdersTableProps {
  orders: Order[];
  products: any[];
  updating: string | null;
  statusFilter: string;
  onStatusFilterChange: (filter: string) => void;
  onUpdateOrderStatus: (orderId: string, status: string, notes?: string) => void;
  calculateOrderProfit: (order: Order) => number;
}

export const OrdersTable: React.FC<OrdersTableProps> = ({
  orders,
  products,
  updating,
  statusFilter,
  onStatusFilterChange,
  onUpdateOrderStatus,
  calculateOrderProfit,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'APPROVED': return 'bg-green-100 text-green-800 border-green-200';
      case 'REJECTED': return 'bg-red-100 text-red-800 border-red-200';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusBadge = (status: string) => {
    return (
      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(status)}`}>
        {status}
      </span>
    );
  };

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <p className="text-gray-500 text-lg">No orders found</p>
        <p className="text-gray-400 mt-1">
          {statusFilter !== 'all' ? `No orders with status "${statusFilter}"` : 'No orders have been placed yet'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="mb-4 sm:mb-0">
            <h3 className="text-lg font-semibold text-gray-900">Order List</h3>
            <p className="text-sm text-gray-500 mt-1">
              Manage and track customer orders
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border text-gray-900 border-gray-300 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm rounded-md"
            >
              <option value="all">All Orders</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Profit
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => {
              const orderProfit = calculateOrderProfit(order);
              const orderMargin = order.total > 0 ? (orderProfit / order.total) * 100 : 0;
              
              return (
                <OrderTableRow
                  key={order.id}
                  order={order}
                  orderProfit={orderProfit}
                  orderMargin={orderMargin}
                  updating={updating}
                  onUpdateOrderStatus={onUpdateOrderStatus}
                  getStatusBadge={getStatusBadge}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const OrderTableRow: React.FC<{
  order: Order;
  orderProfit: number;
  orderMargin: number;
  updating: string | null;
  onUpdateOrderStatus: (orderId: string, status: string, notes?: string) => void;
  getStatusBadge: (status: string) => JSX.Element;
}> = ({ order, orderProfit, orderMargin, updating, onUpdateOrderStatus, getStatusBadge }) => {
  return (
    <tr key={order.id} className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">
          {order.orderNumber}
        </div>
        <div className="text-sm text-gray-500">
          {order.paymentMethod.toUpperCase()}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">
          {order.customerName}
        </div>
        <div className="text-sm text-gray-500">
          {order.customerEmail}
        </div>
        <div className="text-sm text-gray-500">
          {order.customerPhone || 'No phone'}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">
          ${order.total.toFixed(2)}
        </div>
        <div className="text-sm text-gray-500">
          {order.orderItems.length} item(s)
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-green-600">
          ${orderProfit.toFixed(2)}
        </div>
        <div className={`text-xs ${
          orderMargin >= 50 ? 'text-green-600' :
          orderMargin >= 30 ? 'text-yellow-600' :
          'text-red-600'
        }`}>
          {orderMargin.toFixed(1)}% margin
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {getStatusBadge(order.status)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {new Date(order.createdAt).toLocaleDateString()}
        <div className="text-xs text-gray-400">
          {new Date(order.createdAt).toLocaleTimeString()}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <OrderActions
          order={order}
          updating={updating}
          onUpdateOrderStatus={onUpdateOrderStatus}
        />
      </td>
    </tr>
  );
};

const OrderActions: React.FC<{
  order: Order;
  updating: string | null;
  onUpdateOrderStatus: (orderId: string, status: string, notes?: string) => void;
}> = ({ order, updating, onUpdateOrderStatus }) => {
  return (
    <div className="flex flex-col space-y-2">
      <Link
        href={`/admin/orders/${order.id}`}
        className="text-pink-600 hover:text-pink-900 font-medium inline-flex items-center"
      >
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        View Details
      </Link>
      
      {order.status === 'PENDING' && (
        <div className="flex space-x-2">
          <button
            onClick={() => onUpdateOrderStatus(order.id, 'APPROVED')}
            disabled={updating === order.id}
            className="text-green-600 hover:text-green-900 text-sm font-medium disabled:opacity-50 inline-flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {updating === order.id ? 'Approving...' : 'Approve'}
          </button>
          <button
            onClick={() => {
              const reason = prompt('Reason for rejection:');
              if (reason) onUpdateOrderStatus(order.id, 'REJECTED', reason);
            }}
            disabled={updating === order.id}
            className="text-red-600 hover:text-red-900 text-sm font-medium disabled:opacity-50 inline-flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Reject
          </button>
        </div>
      )}
      
      {order.status === 'APPROVED' && (
        <button
          onClick={() => onUpdateOrderStatus(order.id, 'COMPLETED')}
          disabled={updating === order.id}
          className="text-blue-600 hover:text-blue-900 text-sm font-medium disabled:opacity-50 inline-flex items-center"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {updating === order.id ? 'Completing...' : 'Complete'}
        </button>
      )}
    </div>
  );
};