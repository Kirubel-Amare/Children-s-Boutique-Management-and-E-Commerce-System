import { User } from '@/types';

interface UsersSummaryProps {
  users: User[];
}

export const UsersSummary: React.FC<UsersSummaryProps> = ({ users }) => {
  const totalUsers = users.length;
  const activeUsers = users.filter(user => user.status === 'active').length;
  const adminUsers = users.filter(user => user.role === 'ADMIN').length;

  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="text-sm font-medium text-gray-500">Total Users</div>
        <div className="text-2xl font-bold text-gray-900">{totalUsers}</div>
      </div>
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="text-sm font-medium text-gray-500">Active Users</div>
        <div className="text-2xl font-bold text-green-600">{activeUsers}</div>
      </div>
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="text-sm font-medium text-gray-500">Admins</div>
        <div className="text-2xl font-bold text-purple-600">{adminUsers}</div>
      </div>
    </div>
  );
};