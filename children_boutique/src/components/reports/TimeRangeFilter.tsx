// components/reports/TimeRangeFilter.tsx
interface TimeRangeFilterProps {
  timeRange: 'week' | 'month' | 'year';
  onTimeRangeChange: (range: 'week' | 'month' | 'year') => void;
}

export const TimeRangeFilter: React.FC<TimeRangeFilterProps> = ({
  timeRange,
  onTimeRangeChange,
}) => {
  return (
    <select
      value={timeRange}
      onChange={(e) => onTimeRangeChange(e.target.value as any)}
      className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
    >
      <option value="week">Last 7 Days</option>
      <option value="month">Last 30 Days</option>
      <option value="year">Last Year</option>
    </select>
  );
};