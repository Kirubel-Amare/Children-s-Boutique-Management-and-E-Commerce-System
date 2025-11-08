// components/auth/AuthHeader.tsx
import Link from 'next/link';
import { SparklesIcon } from '@heroicons/react/24/outline';

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="text-center lg:text-left">
      <Link href="/" className="inline-flex items-center">
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-2 rounded-lg">
          <SparklesIcon className="h-6 w-6 text-white" />
        </div>
        <span className="ml-3 text-2xl font-bold text-gray-900">Boutique</span>
      </Link>

      <h2 className="mt-8 text-3xl font-bold text-gray-900">
        {title}
      </h2>
      <p className="mt-2 text-sm text-gray-600">
        {subtitle}
      </p>
    </div>
  );
};