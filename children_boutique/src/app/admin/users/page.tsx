'use client';

import { useEffect } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import SidebarLayout from '@/components/layout/SidebarLayout';
import { Alert } from '@/components/ui/Alert';
import { UsersHeader } from '@/components/users/UsersHeader';
import { UsersTable } from '@/components/users/UsersTable';
import { UsersSummary } from '@/components/users/UsersSummary';
import { useUsers } from '@/hooks/useUsers';

export default function UsersPage() {
  const {
    users,
    loading,
    error,
    actionLoading,
    fetchUsers,
    deleteUser,
    toggleStatus,
    updateRole,
    recordLastLogin,
    clearError,
  } = useUsers();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    
    try {
      await deleteUser(userId);
      alert('User deleted successfully');
    } catch (error: any) {
      alert(error.message || 'Failed to delete user');
      fetchUsers(); // Refresh the list to ensure consistency
    }
  };

  const handleToggleStatus = async (userId: string, currentStatus: 'active' | 'inactive') => {
    try {
      const newStatus = await toggleStatus(userId, currentStatus);
      alert(`User ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
    } catch (error: any) {
      alert(error.message || 'Failed to update user status');
      fetchUsers(); // Refresh the list to ensure consistency
    }
  };

  const handleUpdateRole = async (userId: string, currentRole: 'ADMIN' | 'TELLER') => {
    try {
      const newRole = await updateRole(userId, currentRole);
      alert(`User role updated to ${newRole} successfully`);
    } catch (error: any) {
      alert(error.message || 'Failed to update user role');
      fetchUsers(); // Refresh the list to ensure consistency
    }
  };

  const handleRecordLastLogin = async (userId: string) => {
    try {
      await recordLastLogin(userId);
      alert('Last login recorded successfully');
    } catch (error: any) {
      alert(error.message || 'Failed to record last login');
    }
  };

  return (
    <ProtectedRoute requiredRole="ADMIN">
      <SidebarLayout>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <UsersHeader onRefresh={fetchUsers} loading={loading} />

            {/* Error State */}
            {error && (
              <Alert 
                type="error" 
                message={error}
                onDismiss={clearError}
              />
            )}

            {/* Loading State */}
            {loading && (
              <div className="text-center py-6 text-gray-600">Loading users...</div>
            )}

            {/* Users Table */}
            {!loading && (
              <UsersTable
                users={users}
                actionLoading={actionLoading}
                onUpdateRole={handleUpdateRole}
                onToggleStatus={handleToggleStatus}
                onRecordLastLogin={handleRecordLastLogin}
                onDeleteUser={handleDeleteUser}
              />
            )}

            {/* Users Summary */}
            {!loading && users.length > 0 && (
              <UsersSummary users={users} />
            )}
          </div>
        </div>
      </SidebarLayout>
    </ProtectedRoute>
  );
}