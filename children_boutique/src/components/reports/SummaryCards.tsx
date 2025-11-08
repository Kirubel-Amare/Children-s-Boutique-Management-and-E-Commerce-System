// components/reports/SummaryCards.tsx
interface SummaryCardsProps {
  sales: any[];
  orders: any[];
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ sales, orders }) => {
  const inStoreRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
  const onlineRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const inStoreCount = sales.length;
  const onlineCount = orders.length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg shadow-sm p-6 text-white">
        <h3 className="text-lg font-semibold mb-2">Revenue Summary</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm opacity-80">In-Store Sales</p>
            <p className="text-xl font-bold">${inStoreRevenue.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm opacity-80">Online Orders</p>
            <p className="text-xl font-bold">${onlineRevenue.toFixed(2)}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-lg shadow-sm p-6 text-white">
        <h3 className="text-lg font-semibold mb-2">Transaction Summary</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm opacity-80">In-Store Sales</p>
            <p className="text-xl font-bold">{inStoreCount}</p>
          </div>
          <div>
            <p className="text-sm opacity-80">Online Orders</p>
            <p className="text-xl font-bold">{onlineCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
};