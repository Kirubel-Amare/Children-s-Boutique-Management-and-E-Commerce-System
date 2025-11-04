// src/app/dashboard/products/new/page.tsx
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import ProductForm from '@/components/forms/ProductForm';

export default function NewProductPage() {
  return (
    <ProtectedRoute requiredRole="ADMIN">
      <DashboardLayout>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <ProductForm mode="create" />
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}