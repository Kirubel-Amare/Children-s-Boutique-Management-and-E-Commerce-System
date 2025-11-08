// src/app/dashboard/reports/page.tsx
'use client';

import { useState } from 'react';
import { useReportsData } from '@/hooks/useReportsData';
import { useReportsMetrics } from '@/hooks/useReportsMetrics';
import { ReportsMetrics } from '@/components/reports/ReportsMetrics';
import { TransactionsTable } from '@/components/reports/TransactionsTable';
import { SummaryCards } from '@/components/reports/SummaryCards';
import { TimeRangeFilter } from '@/components/reports/TimeRangeFilter';
import SalesChart from '@/components/reports/SalesChart';
import ProductPerformance from '@/components/reports/ProductPerformance';
import { AdminLoading } from '@/components/admin/AdminLoading';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import SidebarLayout from '@/components/layout/SidebarLayout';

export default function ReportsPage() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');
  const { sales, orders, products, loading } = useReportsData();
  const metrics = useReportsMetrics(sales, orders, timeRange);

  if (loading) {
    return (
      <ProtectedRoute>
        <SidebarLayout>
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              <AdminLoading />
            </div>
          </div>
        </SidebarLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <SidebarLayout>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* Header */}
            <PageHeader 
              timeRange={timeRange}
              onTimeRangeChange={setTimeRange}
            />

            {/* Key Metrics */}
            <ReportsMetrics metrics={metrics} />

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <SalesChart sales={sales} timeRange={timeRange} />
              <ProductPerformance sales={sales} products={products} />
            </div>

            {/* Recent Transactions Table */}
            <TransactionsTable 
              transactions={metrics.filteredTransactions}
              title="Recent Transactions"
              description="In-store sales and online orders"
              maxRows={10}
            />

            {/* Summary Cards */}
            <SummaryCards sales={sales} orders={orders} />
          </div>
        </div>
      </SidebarLayout>
    </ProtectedRoute>
  );
}

// Sub-components for better organization
interface PageHeaderProps {
  timeRange: 'week' | 'month' | 'year';
  onTimeRangeChange: (range: 'week' | 'month' | 'year') => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({ timeRange, onTimeRangeChange }) => (
  <div className="mb-8">
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Sales Reports & Analytics</h1>
        <p className="text-gray-600">Comprehensive business performance metrics</p>
      </div>
      <div className="flex space-x-2 text-gray-700">
        <TimeRangeFilter 
          timeRange={timeRange}
          onTimeRangeChange={onTimeRangeChange}
        />
      </div>
    </div>
  </div>
);