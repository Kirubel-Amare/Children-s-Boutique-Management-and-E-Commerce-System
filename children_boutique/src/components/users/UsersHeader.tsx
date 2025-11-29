import Link from 'next/link';

interface UsersHeaderProps {
  onRefresh: () => void;
  loading: boolean;
}

export const UsersHeader: React.FC<UsersHeaderProps> = ({ onRefresh, loading }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
      {/* Left Section */}
      <div className="text-center sm:text-left">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          User Management
        </h1>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">
          Manage system users and their permissions
        </p>
      </div>

      {/* Right Section (buttons) */}
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <button
          onClick={onRefresh}
          disabled={loading}
          className="w-full sm:w-auto bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold 
                     hover:bg-gray-700 transition-colors shadow-sm disabled:opacity-50"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>

        <Link
          href="/admin/users/new"
          className="w-full sm:w-auto text-center bg-pink-600 text-white px-4 py-2 rounded-lg 
                     font-semibold hover:bg-pink-700 transition-colors shadow-sm"
        >
          Add New User
        </Link>
      </div>
    </div>
  );
};
