// src/components/ui/EmptyState.tsx
import Link from 'next/link';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: string;
  action?: {
    label: string;
    href: string;
  };
}

export default function EmptyState({ title, description, icon = "📦", action }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 max-w-md mx-auto mb-6">{description}</p>
      {action && (
        <Link
          href={action.href}
          className="bg-pink-600 text-white px-6 py-2 rounded-md hover:bg-pink-700 transition-colors inline-block"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}