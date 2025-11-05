// src/app/dashboard/products/[id]/edit/page.tsx
import { getProduct } from '@/lib/products';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import ProductForm from '@/components/forms/ProductForm';
import { notFound } from 'next/navigation';
import SidebarLayout from '@/components/layout/SidebarLayout';

interface EditProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return (
    <ProtectedRoute requiredRole={['ADMIN', 'TELLER']}>
      <SidebarLayout>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <ProductForm product={product} mode="edit" />
          </div>
        </div>
      </SidebarLayout>
    </ProtectedRoute>
  );
}