import { useState, useCallback } from 'react';
import { User } from '@/types';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/users');
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();

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
  }, []);

  const deleteUser = useCallback(async (userId: string) => {
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

      setUsers(prev => prev.filter(user => user.id !== userId));
      return true;
    } catch (error: any) {
      console.error('Error deleting user:', error);
      throw error;
    } finally {
      setActionLoading(null);
    }
  }, []);

  const toggleStatus = useCallback(async (userId: string, currentStatus: 'active' | 'inactive') => {
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

      setUsers(prev =>
        prev.map(user =>
          user.id === userId ? updatedUser : user
        )
      );
      
      return newStatus;
    } catch (error: any) {
      console.error('Error updating user status:', error);
      throw error;
    } finally {
      setActionLoading(null);
    }
  }, []);

  const updateRole = useCallback(async (userId: string, currentRole: 'ADMIN' | 'TELLER') => {
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

      setUsers(prev =>
        prev.map(user =>
          user.id === userId ? updatedUser : user
        )
      );
      
      return newRole;
    } catch (error: any) {
      console.error('Error updating user role:', error);
      throw error;
    } finally {
      setActionLoading(null);
    }
  }, []);

  const recordLastLogin = useCallback(async (userId: string) => {
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

      setUsers(prev =>
        prev.map(user =>
          user.id === userId ? updatedUser : user
        )
      );
      
      return true;
    } catch (error: any) {
      console.error('Error recording last login:', error);
      throw error;
    } finally {
      setActionLoading(null);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return {
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
  };
};