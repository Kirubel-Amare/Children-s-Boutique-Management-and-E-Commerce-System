// components/admin/UserManagementPreview.tsx
import Link from 'next/link';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status?: string;
}

interface UserManagementPreviewProps {
  users: User[];
}

export const UserManagementPreview: React.FC<UserManagementPreviewProps> = ({ users }) => {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">User Management</h3>
          <Link href="/admin/users" className="text-purple-600 hover:text-purple-700 text-sm font-medium">
            Manage Users
          </Link>
        </div>
      </div>
      <div className="p-6">
        <UsersList users={users} />
        <AddUserButton />
      </div>
    </div>
  );
};

const UsersList: React.FC<{ users: User[] }> = ({ users }) => (
  <div className="space-y-3">
    {users.slice(0, 3).map((user) => (
      <UserItem key={user.id} user={user} />
    ))}
  </div>
);

const UserItem: React.FC<{ user: User }> = ({ user }) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getRoleStyles = (role: string) => {
    return role === 'ADMIN' 
      ? 'bg-purple-100 text-purple-800' 
      : 'bg-blue-100 text-blue-800';
  };

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-lg flex items-center justify-center">
          <span className="text-purple-600 font-bold text-sm">
            {getInitials(user.name)}
          </span>
        </div>
        <div>
          <p className="font-medium text-gray-900">{user.name}</p>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      </div>
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleStyles(user.role)}`}>
        {user.role}
      </span>
    </div>
  );
};

const AddUserButton: React.FC = () => (
  <div className="mt-4 pt-4 border-t border-gray-200">
    <Link
      href="/admin/users/new"
      className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors text-center block"
    >
      + Add New User
    </Link>
  </div>
);