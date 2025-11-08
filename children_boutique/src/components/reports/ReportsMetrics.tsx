// components/reports/ReportsMetrics.tsx
interface MetricItem {
  label: string;
  value: string;
  subValue?: string;
  icon: string;
  color: 'green' | 'blue' | 'purple' | 'orange';
}

interface ReportsMetricsProps {
  metrics: {
    totalRevenue: number;
    filteredRevenue: number;
    totalTransactionsCount: number;
    averageTransactionValue: number;
    inStoreSalesCount: number;
    onlineOrdersCount: number;
  };
}

export const ReportsMetrics: React.FC<ReportsMetricsProps> = ({ metrics }) => {
  const metricItems: MetricItem[] = [
    {
      label: 'Total Revenue',
      value: `$${metrics.totalRevenue.toFixed(2)}`,
      subValue: `$${metrics.filteredRevenue.toFixed(2)} in selected period`,
      icon: '💰',
      color: 'green',
    },
    {
      label: 'Total Transactions',
      value: metrics.totalTransactionsCount.toString(),
      subValue: `${metrics.totalTransactionsCount} in selected period`,
      icon: '📈',
      color: 'blue',
    },
    {
      label: 'Average Value',
      value: `$${metrics.averageTransactionValue.toFixed(2)}`,
      icon: '📊',
      color: 'purple',
    },
    {
      label: 'Sales Channels',
      value: `${metrics.inStoreSalesCount} In-Store`,
      subValue: `${metrics.onlineOrdersCount} Online`,
      icon: '🛒',
      color: 'orange',
    },
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'green': return 'bg-green-100 text-green-600';
      case 'blue': return 'bg-blue-100 text-blue-600';
      case 'purple': return 'bg-purple-100 text-purple-600';
      case 'orange': return 'bg-orange-100 text-orange-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {metricItems.map((item) => (
        <div key={item.label} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getColorClasses(item.color)}`}>
                <span className="font-bold">{item.icon}</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">{item.label}</p>
              <p className="text-2xl font-bold text-gray-900">{item.value}</p>
              {item.subValue && (
                <p className="text-xs text-gray-500 mt-1">{item.subValue}</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};