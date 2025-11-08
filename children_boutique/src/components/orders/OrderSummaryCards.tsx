import { OrderSummary } from '@/types';

interface OrderSummaryCardsProps {
  metrics: OrderSummary;
}

export const OrderSummaryCards: React.FC<OrderSummaryCardsProps> = ({ metrics }) => {
  type Color = 'green' | 'blue' | 'purple' | 'orange';

  type Card = {
    title: string;
    value: string;
    subtitle: string;
    icon: string;
    color: Color;
  };

  const cards: Card[] = [
    {
      title: 'Total Revenue',
      value: `$${metrics.totalRevenue.toFixed(2)}`,
      subtitle: `${metrics.totalOrders} orders`,
      icon: '💰',
      color: 'green',
    },
    {
      title: 'Total Profit',
      value: `$${metrics.totalProfit.toFixed(2)}`,
      subtitle: `${metrics.profitMargin.toFixed(1)}% margin`,
      icon: '📈',
      color: 'blue',
    },
    {
      title: 'Today',
      value: `$${metrics.todayRevenue.toFixed(2)}`,
      subtitle: `${metrics.todayOrders} orders`,
      icon: '📊',
      color: 'purple',
    },
    {
      title: 'Items Sold',
      value: metrics.totalItems.toString(),
      subtitle: 'Across all orders',
      icon: '📦',
      color: 'orange',
    },
  ];

  const colorClasses: Record<Color, string> = {
    green: 'bg-green-100 text-green-600',
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className={`w-12 h-12 ${colorClasses[card.color]} rounded-lg flex items-center justify-center`}>
                <span className="font-bold text-xl">{card.icon}</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">{card.title}</p>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              <p className="text-xs text-gray-500 mt-1">{card.subtitle}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};