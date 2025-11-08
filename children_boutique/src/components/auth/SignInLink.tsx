// components/auth/SignInLink.tsx
import Link from 'next/link';

export const SignInLink: React.FC = () => {
  return (
    <div className="text-center">
      <p className="text-sm text-gray-600">
        Already have an account?{' '}
        <Link href="/auth/signin" className="font-medium text-pink-600 hover:text-pink-500 transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
};