// src/components/reports/ProductPerformance.tsx
'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { SaleWithDetails } from '@/lib/sales';

interface ProductPerformanceProps {
  sales: SaleWithDetails[];
  products: any[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export default function ProductPerformance({ sales, products }: ProductPerformanceProps) {
  // Calculate product performance
  const productPerformance = products.map(product => {
    const productSales = sales.filter(sale => sale.productId === product.id);
    const revenue = productSales.reduce((sum, sale) => sum + sale.total, 0);
    const quantitySold = productSales.reduce((sum, sale) => sum + sale.quantity, 0);

    return {
      name: product.name,
      revenue,
      quantitySold,
      salesCount: productSales.length,
    };
  }).filter(item => item.revenue > 0)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 6); // Top 6 products

  const pieData = productPerformance.map(item => ({
    name: item.name,
    value: item.revenue,
    quantity: item.quantitySold,
  }));

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Products by Revenue</h3>
      
      {productPerformance.length === 0 ? (
        <div className="h-80 flex items-center justify-center text-gray-500">
          No sales data available for the selected period.
        </div>
      ) : (
        <>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(props: any) => {
                    const name = props?.name ?? 'Unknown';
                    const percent = props?.percent ?? 0;
                    return `${name} (${(percent * 100).toFixed(0)}%)`;
                  }}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`$${value.toFixed(2)}`, 'Revenue']}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Product Performance Table */}
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Product Details</h4>
            <div className="space-y-2">
              {productPerformance.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <span className="text-sm font-medium text-gray-900">
                      {product.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">
                      ${product.revenue.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {product.quantitySold} sold
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}