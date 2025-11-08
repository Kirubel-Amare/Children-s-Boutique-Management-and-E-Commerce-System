// components/auth/SignUpLink.tsx
import Link from 'next/link';

export const SignUpLink: React.FC = () => {
  return (
    <div className="text-center">
      <Link
        href="/auth/signup"
        className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm hover:shadow-md"
      >
        Create new account
      </Link>
    </div>
  );
};