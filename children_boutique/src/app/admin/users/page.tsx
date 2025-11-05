'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Link from 'next/link';
import SidebarLayout from '@/components/layout/SidebarLayout';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'TELLER';
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null); // For individual action loading states

  // Fetch users from API
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/users');
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();

      // ✅ Make sure data.users is an array
      const usersArray = Array.isArray(data.users)
        ? data.users
        : Array.isArray(data)
        ? data
        : [];

      setUsers(usersArray);
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(err.message);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    
    setActionLoading(`delete-${userId}`);
    try {
      const res = await fetch('/api/users', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: userId }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to delete user');
      }

      // Remove user from local state
      setUsers(prev => prev.filter(user => user.id !== userId));
      
      alert('User deleted successfully');
    } catch (error: any) {
      console.error('Error deleting user:', error);
      alert(error.message || 'Failed to delete user');
      // Refresh the list to ensure consistency
      fetchUsers();
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleStatus = async (userId: string, currentStatus: 'active' | 'inactive') => {
    setActionLoading(`status-${userId}`);
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      
      const res = await fetch('/api/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          id: userId, 
          status: newStatus 
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update user status');
      }

      const { user: updatedUser } = await res.json();

      // Update user in local state
      setUsers(prev =>
        prev.map(user =>
          user.id === userId ? updatedUser : user
        )
      );
      
      alert(`User ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
    } catch (error: any) {
      console.error('Error updating user status:', error);
      alert(error.message || 'Failed to update user status');
      // Refresh the list to ensure consistency
      fetchUsers();
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpdateRole = async (userId: string, currentRole: 'ADMIN' | 'TELLER') => {
    setActionLoading(`role-${userId}`);
    try {
      const newRole = currentRole === 'ADMIN' ? 'TELLER' : 'ADMIN';
      
      const res = await fetch('/api/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          id: userId, 
          role: newRole 
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update user role');
      }

      const { user: updatedUser } = await res.json();

      // Update user in local state
      setUsers(prev =>
        prev.map(user =>
          user.id === userId ? updatedUser : user
        )
      );
      
      alert(`User role updated to ${newRole} successfully`);
    } catch (error: any) {
      console.error('Error updating user role:', error);
      alert(error.message || 'Failed to update user role');
      // Refresh the list to ensure consistency
      fetchUsers();
    } finally {
      setActionLoading(null);
    }
  };

  const handleRecordLastLogin = async (userId: string) => {
    setActionLoading(`login-${userId}`);
    try {
      const res = await fetch('/api/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: userId }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to record last login');
      }

      const { user: updatedUser } = await res.json();

      // Update user in local state
      setUsers(prev =>
        prev.map(user =>
          user.id === userId ? updatedUser : user
        )
      );
      
      alert('Last login recorded successfully');
    } catch (error: any) {
      console.error('Error recording last login:', error);
      alert(error.message || 'Failed to record last login');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <ProtectedRoute requiredRole="ADMIN">
      <SidebarLayout>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                <p className="text-gray-600 mt-1">Manage system users and their permissions</p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={fetchUsers}
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

            {/* ✅ Error & Loading States */}
            {error && (
              <div className="text-red-600 bg-red-50 border border-red-200 p-4 rounded-lg mb-4">
                {error}
              </div>
            )}
            {loading && (
              <div className="text-center py-6 text-gray-600">Loading users...</div>
            )}

            {/* Users Table */}
            {!loading && (
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
                                onClick={() => handleUpdateRole(user.id, user.role)}
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
                                onClick={() => handleToggleStatus(user.id, user.status)}
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
                                  onClick={() => handleRecordLastLogin(user.id)}
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
                                  onClick={() => handleDeleteUser(user.id)}
                                  disabled={actionLoading === `delete-${user.id}`}
                                  className="text-red-600 hover:text-red-900 font-medium disabled:opacity-50"
                                >
                                  {actionLoading === `delete-${user.id}` ? 'Deleting...' : 'Delete'}
                                </button>
                              </div>
                            </td>
                          </tr>
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
            )}

            {/* Users Summary */}
            {!loading && users.length > 0 && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="text-sm font-medium text-gray-500">Total Users</div>
                  <div className="text-2xl font-bold text-gray-900">{users.length}</div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="text-sm font-medium text-gray-500">Active Users</div>
                  <div className="text-2xl font-bold text-green-600">
                    {users.filter(user => user.status === 'active').length}
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="text-sm font-medium text-gray-500">Admins</div>
                  <div className="text-2xl font-bold text-purple-600">
                    {users.filter(user => user.role === 'ADMIN').length}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </SidebarLayout>
    </ProtectedRoute>
  );
}