import { User } from '@/types';
import { UserRow } from './UserRow';

interface UsersTableProps {
  users: User[];
  actionLoading: string | null;
  onUpdateRole: (userId: string, currentRole: 'ADMIN' | 'TELLER') => void;
  onToggleStatus: (userId: string, currentStatus: 'active' | 'inactive') => void;
  onRecordLastLogin: (userId: string) => void;
  onDeleteUser: (userId: string) => void;
}

export const UsersTable: React.FC<UsersTableProps> = ({
  users,
  actionLoading,
  onUpdateRole,
  onToggleStatus,
  onRecordLastLogin,
  onDeleteUser,
}) => {
  return (
    <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Login
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Array.isArray(users) && users.length > 0 ? (
              users.map(user => (
                <UserRow
                  key={user.id}
                  user={user}
                  actionLoading={actionLoading}
                  onUpdateRole={onUpdateRole}
                  onToggleStatus={onToggleStatus}
                  onRecordLastLogin={onRecordLastLogin}
                  onDeleteUser={onDeleteUser}
                />
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};