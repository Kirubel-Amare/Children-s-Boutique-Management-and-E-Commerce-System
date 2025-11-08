import Link from 'next/link';

interface UsersHeaderProps {
  onRefresh: () => void;
  loading: boolean;
}

export const UsersHeader: React.FC<UsersHeaderProps> = ({ onRefresh, loading }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600 mt-1">Manage system users and their permissions</p>
      </div>
      <div className="flex space-x-3">
        <button
          onClick={onRefresh}
          disabled={loading}
          className="bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-700 transition-colors shadow-sm disabled:opacity-50"
        >
          Refresh
        </button>
        <Link
          href="/admin/users/new"
          className="bg-pink-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-pink-700 transition-colors shadow-sm"
        >
          Add New User
        </Link>
      </div>
    </div>
  );
};