// src/components/dashboard/QuickStats.tsx
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';

interface Stat {
  name: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
}

interface QuickStatsProps {
  stats: Stat[];
}

export default function QuickStats({ stats }: QuickStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((item) => (
        <div key={item.name} className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">{item.name}</dt>
            <dd className="mt-1 flex items-baseline">
              <div className="text-2xl font-semibold text-gray-900">{item.value}</div>
              <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                item.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
              }`}>
                {item.changeType === 'increase' ? (
                  <ArrowUpIcon className="self-center flex-shrink-0 h-4 w-4 text-green-500" />
                ) : (
                  <ArrowDownIcon className="self-center flex-shrink-0 h-4 w-4 text-red-500" />
                )}
                <span className="sr-only">
                  {item.changeType === 'increase' ? 'Increased' : 'Decreased'} by
                </span>
                {item.change}
              </div>
            </dd>
          </div>
        </div>
      ))}
    </div>
  );
}