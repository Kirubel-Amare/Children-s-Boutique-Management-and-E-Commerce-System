// components/contact/StoreHours.tsx (updated)
interface StoreHour {
  day: string;
  hours: string;
  isOpen: boolean;
}

interface StoreHoursProps {
  hours: StoreHour[];
}

export const StoreHours: React.FC<StoreHoursProps> = ({ hours }) => {
  const getCurrentStatus = () => {
    const now = new Date();
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
    const currentHour = now.getHours();
    
    const today = hours.find(h => 
      h.day.toLowerCase().includes(currentDay.toLowerCase())
    );
    
    if (!today) return { status: 'Unknown', isOpen: false };
    
    if (!today.isOpen) return { status: 'Closed today', isOpen: false };
    
    // Simple check for demo purposes - in real app, parse hours
    const isOpen = currentHour >= 9 && currentHour < 18; // 9 AM - 6 PM
    
    return {
      status: isOpen ? 'Open now' : 'Closed now',
      isOpen
    };
  };

  const status = getCurrentStatus();

  return (
    <div className="mt-8 p-6 bg-gray-50 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Store Hours</h3>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          status.isOpen 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {status.status}
        </span>
      </div>
      <div className="space-y-2 text-sm">
        {hours.map((hour, index) => (
          <div key={index} className="flex justify-between">
            <span className={`${!hour.isOpen ? 'text-gray-400' : 'text-gray-700'}`}>
              {hour.day}
            </span>
            <span className={`font-medium ${!hour.isOpen ? 'text-gray-400' : 'text-gray-700'}`}>
              {hour.hours}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};