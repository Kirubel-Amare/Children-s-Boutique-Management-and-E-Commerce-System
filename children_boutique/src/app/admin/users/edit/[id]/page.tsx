'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import SidebarLayout from '@/components/layout/SidebarLayout';
import { Alert } from '@/components/ui/Alert';
import { UserInfoCard } from '@/components/users/UserInfoCard';
import { UserForm } from '@/components/users/UserForm';
import { useUser } from '@/hooks/useUser';
import { useUserMutation } from '@/hooks/useUserMutation';
import { FormData } from '@/types';
import Link from 'next/link';

export default function EditUserPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const { user, loading: fetchLoading, error: fetchError, setUser } = useUser(userId);
  const { loading, error, success, updateUser, resetPassword, clearMessages } = useUserMutation(userId);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    role: 'TELLER',
    status: 'active'
  });

  // Initialize form data when user is fetched
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    try {
      const updatedUser = await updateUser(formData);
      setUser(updatedUser);
      
      // Redirect back to users list after 2 seconds
      setTimeout(() => {
        router.push('/admin/users');
      }, 2000);
    } catch (err) {
      // Error is handled in the hook
    }
  };

  const handleResetPassword = async () => {
    if (!confirm('Are you sure you want to reset this user\'s password? A temporary password will be generated and shown.')) {
      return;
    }

    try {
      const tempPassword = await resetPassword();
      alert(`Password reset successful! Temporary password: ${tempPassword}\n\nPlease provide this to the user and ask them to change it immediately.`);
    } catch (err) {
      // Error is handled in the hook
    }
  };

  // Loading state
  if (fetchLoading) {
    return (
      <ProtectedRoute requiredRole="ADMIN">
        <SidebarLayout>
          <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              <div className="text-center py-12">
                <div className="text-gray-600">Loading user data...</div>
              </div>
            </div>
          </div>
        </SidebarLayout>
      </ProtectedRoute>
    );
  }

  // Error state
  if (fetchError && !user) {
    return (
      <ProtectedRoute requiredRole="ADMIN">
        <SidebarLayout>
          <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              <div className="text-center py-12">
                <Alert type="error" message={fetchError} />
                <Link
                  href="/admin/users"
                  className="text-pink-600 hover:text-pink-700 font-medium"
                >
                  ← Back to Users
                </Link>
              </div>
            </div>
          </div>
        </SidebarLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole="ADMIN">
      <SidebarLayout>
        <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* Header */}
            <div className="mb-8">
              <Link
                href="/admin/users"
                className="inline-flex items-center text-sm text-pink-600 hover:text-pink-700 font-medium mb-4"
              >
                ← Back to Users
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Edit User</h1>
              <p className="text-gray-600 mt-1">
                Update user information and permissions
              </p>
            </div>

            {/* Success Message */}
            {success && (
              <Alert 
                type="success" 
                message={success}
                onDismiss={clearMessages}
              />
            )}

            {/* Error Message */}
            {error && (
              <Alert 
                type="error" 
                message={error}
                onDismiss={clearMessages}
              />
            )}

            {/* User Information Card */}
            {user && <UserInfoCard user={user} />}

            {/* Edit Form */}
            <UserForm
              formData={formData}
              onSubmit={handleSubmit}
              onInputChange={handleInputChange}
              onResetPassword={handleResetPassword}
              loading={loading}
            />

            {/* Security Note */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="text-sm font-medium text-blue-800">Security Note</h3>
                  <p className="text-sm text-blue-700 mt-1">
                    User roles and status changes take effect immediately. Admin users have full access to all system features, 
                    while Tellers have limited permissions based on their assigned responsibilities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarLayout>
    </ProtectedRoute>
  );
}