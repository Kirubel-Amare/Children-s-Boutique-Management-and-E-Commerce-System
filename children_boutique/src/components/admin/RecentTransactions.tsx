// components/admin/RecentTransactions.tsx
import Link from 'next/link';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';

interface Transaction {
  id: string;
  type: 'sale' | 'order';
  product: { name: string };
  total: number;
  quantity: number;
  createdAt: string;
  customerName: string;
  orderNumber: string;
}

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions }) => {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Transactions</h3>
          <Link href="/dashboard/sales" className="text-purple-600 hover:text-purple-700 text-sm font-medium">
            View All
          </Link>
        </div>
        <p className="text-sm text-gray-500 mt-1">In-store sales and online orders</p>
      </div>
      <div className="p-6">
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <ShoppingBagIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p>No recent transactions</p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const TransactionItem: React.FC<{ transaction: Transaction }> = ({ transaction }) => (
  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
    <div className="flex items-center space-x-3">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
        transaction.type === 'sale' ? 'bg-green-100' : 'bg-blue-100'
      }`}>
        <span className={`text-sm ${
          transaction.type === 'sale' ? 'text-green-600' : 'text-blue-600'
        }`}>
          {transaction.type === 'sale' ? '🛒' : '📦'}
        </span>
      </div>
      <div>
        <p className="font-medium text-gray-900">
          {transaction.type === 'sale' 
            ? transaction.product.name 
            : `${transaction.quantity} items`
          }
        </p>
        <p className="text-sm text-gray-500">
          {transaction.customerName} • {new Date(transaction.createdAt).toLocaleDateString()}
        </p>
        <p className="text-xs text-gray-400">
          {transaction.orderNumber} • {transaction.type === 'sale' ? 'In-Store' : 'Online'}
        </p>
      </div>
    </div>
    <div className="text-right">
      <p className="font-semibold text-green-600">${transaction.total.toFixed(2)}</p>
      <p className="text-sm text-gray-500">{transaction.quantity} items</p>
    </div>
  </div>
);