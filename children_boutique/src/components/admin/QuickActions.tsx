// components/admin/QuickActions.tsx
import Link from 'next/link';

interface QuickAction {
  href: string;
  icon: string;
  title: string;
  description: string;
}

interface QuickActionsProps {
  actions: QuickAction[];
}

export const QuickActions: React.FC<QuickActionsProps> = ({ actions }) => {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Admin Quick Actions</h3>
        <p className="mt-1 text-sm text-gray-500">Manage your boutique system efficiently</p>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {actions.map((action, index) => (
            <Link
              key={index}
              href={action.href}
              className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all group"
            >
              <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">
                {action.icon}
              </span>
              <span className="font-medium text-gray-900 text-center">{action.title}</span>
              <span className="text-sm text-gray-500 text-center mt-1">{action.description}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};