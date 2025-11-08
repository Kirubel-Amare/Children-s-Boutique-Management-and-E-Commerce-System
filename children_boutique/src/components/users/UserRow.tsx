import { User } from '@/types';
import Link from 'next/link';

interface UserRowProps {
  user: User;
  actionLoading: string | null;
  onUpdateRole: (userId: string, currentRole: 'ADMIN' | 'TELLER') => void;
  onToggleStatus: (userId: string, currentStatus: 'active' | 'inactive') => void;
  onRecordLastLogin: (userId: string) => void;
  onDeleteUser: (userId: string) => void;
}

export const UserRow: React.FC<UserRowProps> = ({
  user,
  actionLoading,
  onUpdateRole,
  onToggleStatus,
  onRecordLastLogin,
  onDeleteUser,
}) => {
  return (
    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg flex items-center justify-center">
            <span className="text-pink-600 font-bold text-sm">
              {user.name
                ? user.name.split(' ').map(n => n[0]).join('')
                : '?'}
            </span>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {user.name || 'Unknown'}
            </div>
            <div className="text-sm text-gray-500">
              {user.email}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <button
          onClick={() => onUpdateRole(user.id, user.role)}
          disabled={actionLoading === `role-${user.id}`}
          className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full transition-colors ${
            user.role === 'ADMIN'
              ? 'bg-purple-100 text-purple-800 hover:bg-purple-200'
              : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
          } disabled:opacity-50`}
        >
          {actionLoading === `role-${user.id}` ? 'Updating...' : user.role}
        </button>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <button
          onClick={() => onToggleStatus(user.id, user.status)}
          disabled={actionLoading === `status-${user.id}`}
          className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full transition-colors ${
            user.status === 'active'
              ? 'bg-green-100 text-green-800 hover:bg-green-200'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          } disabled:opacity-50`}
        >
          {actionLoading === `status-${user.id}` ? 'Updating...' : user.status === 'active' ? 'Active' : 'Inactive'}
        </button>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {user.lastLogin
            ? new Date(user.lastLogin).toLocaleDateString()
            : 'Never'}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {user.createdAt
            ? new Date(user.createdAt).toLocaleDateString()
            : 'N/A'}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex space-x-3">
          <button 
            onClick={() => onRecordLastLogin(user.id)}
            disabled={actionLoading === `login-${user.id}`}
            className="text-blue-600 hover:text-blue-900 font-medium disabled:opacity-50"
          >
            {actionLoading === `login-${user.id}` ? 'Recording...' : 'Record Login'}
          </button>
          <span className="text-gray-300">|</span>
          <Link
            href={`/admin/users/edit/${user.id}`}
            className="text-pink-600 hover:text-pink-900 font-medium"
          >
            Edit
          </Link>
          <span className="text-gray-300">|</span>
          <button
            onClick={() => onDeleteUser(user.id)}
            disabled={actionLoading === `delete-${user.id}`}
            className="text-red-600 hover:text-red-900 font-medium disabled:opacity-50"
          >
            {actionLoading === `delete-${user.id}` ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </td>
    </tr>
  );
};