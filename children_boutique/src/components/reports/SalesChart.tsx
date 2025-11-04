// src/components/reports/SalesChart.tsx
'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { SaleWithDetails } from '@/lib/sales';
import { format, subDays, startOfDay, eachDayOfInterval } from 'date-fns';

interface SalesChartProps {
  sales: SaleWithDetails[];
  timeRange: 'week' | 'month' | 'year';
}

export default function SalesChart({ sales, timeRange }: SalesChartProps) {
  // Generate chart data based on time range
  const generateChartData = () => {
    const now = new Date();
    let daysToShow = 7;
    
    switch (timeRange) {
      case 'week':
        daysToShow = 7;
        break;
      case 'month':
        daysToShow = 30;
        break;
      case 'year':
        daysToShow = 12; // Months
        break;
    }

    if (timeRange === 'year') {
      // Monthly data
      const monthlyData = Array.from({ length: 12 }, (_, i) => {
        const month = new Date(now.getFullYear(), i, 1);
        const monthSales = sales.filter(sale => {
          const saleDate = new Date(sale.createdAt);
          return saleDate.getMonth() === i && saleDate.getFullYear() === now.getFullYear();
        });
        
        return {
          name: format(month, 'MMM'),
          revenue: monthSales.reduce((sum, sale) => sum + sale.total, 0),
          sales: monthSales.length,
        };
      });

      return monthlyData;
    } else {
      // Daily data
      const days = eachDayOfInterval({
        start: subDays(now, daysToShow - 1),
        end: now,
      });

      return days.map(day => {
        const daySales = sales.filter(sale => {
          const saleDate = new Date(sale.createdAt);
          return startOfDay(saleDate).getTime() === startOfDay(day).getTime();
        });

        return {
          name: format(day, 'MMM dd'),
          revenue: daySales.reduce((sum, sale) => sum + sale.total, 0),
          sales: daySales.length,
        };
      });
    }
  };

  const chartData = generateChartData();

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Performance</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              fontSize={12}
            />
            <YAxis fontSize={12} />
            <Tooltip 
              formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Revenue']}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Bar 
              dataKey="revenue" 
              fill="#ec4899" 
              radius={[4, 4, 0, 0]}
              name="Revenue"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}