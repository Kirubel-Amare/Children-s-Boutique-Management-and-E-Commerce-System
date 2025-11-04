// src/app/dashboard/page.tsx
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 p-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Welcome to Your Dashboard
                </h2>
                <p className="text-gray-600 mb-8">
                  This is your boutique management dashboard. Here you can manage products, 
                  track sales, and monitor inventory.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                  <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h3 className="font-semibold text-lg mb-2">Products</h3>
                    <p className="text-gray-600 text-sm">
                      Manage your product catalog and inventory
                    </p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h3 className="font-semibold text-lg mb-2">Sales</h3>
                    <p className="text-gray-600 text-sm">
                      Record and track sales transactions
                    </p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h3 className="font-semibold text-lg mb-2">Reports</h3>
                    <p className="text-gray-600 text-sm">
                      View sales reports and analytics
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}