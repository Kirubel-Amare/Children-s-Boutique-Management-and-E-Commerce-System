// components/contact/ContactInfo.tsx (updated)
import { PhoneIcon, EnvelopeIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/outline';

interface ContactInfoItem {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  content: string;
  description: string;
  action?: {
    label: string;
    href: string;
    type: 'phone' | 'email' | 'map';
  };
}

interface ContactInfoProps {
  items: ContactInfoItem[];
}

export const ContactInfo: React.FC<ContactInfoProps> = ({ items }) => {
  return (
    <div className="space-y-6">
      {items.map((item, index) => (
        <ContactInfoItem key={index} item={item} />
      ))}
    </div>
  );
};

const ContactInfoItem: React.FC<{ item: ContactInfoItem }> = ({ item }) => {
  const Icon = item.icon;
  
  const handleAction = () => {
    if (!item.action) return;
    
    switch (item.action.type) {
      case 'phone':
        window.open(`tel:${item.content}`);
        break;
      case 'email':
        window.open(`mailto:${item.content}`);
        break;
      case 'map':
        // For demo, open Google Maps - in real app, use actual address
        window.open('https://maps.google.com');
        break;
    }
  };

  return (
    <div className="flex items-start p-4 bg-white rounded-xl border border-gray-200 hover:border-pink-300 transition-colors">
      <div className="bg-pink-100 p-3 rounded-lg">
        <Icon className="h-6 w-6 text-pink-600" />
      </div>
      <div className="ml-4 flex-1">
        <h3 className="font-semibold text-gray-900">{item.title}</h3>
        <p className="text-gray-900">{item.content}</p>
        <p className="text-gray-500 text-sm">{item.description}</p>
        {item.action && (
          <button
            onClick={handleAction}
            className="mt-2 text-pink-600 hover:text-pink-700 text-sm font-medium transition-colors"
          >
            {item.action.label} →
          </button>
        )}
      </div>
    </div>
  );
};