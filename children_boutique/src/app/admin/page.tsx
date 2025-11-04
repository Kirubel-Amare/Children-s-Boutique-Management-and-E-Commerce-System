// src/app/admin/page.tsx
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function AdminPage() {
  return (
    <ProtectedRoute requiredRole="ADMIN">
      <DashboardLayout>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 p-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Admin Dashboard
                </h2>
                <p className="text-gray-600">
                  This is the admin-only section. Here you can manage users, 
                  system settings, and view all store data.
                </p>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}