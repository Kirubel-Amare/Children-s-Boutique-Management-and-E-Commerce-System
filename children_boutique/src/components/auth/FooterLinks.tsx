// components/auth/FooterLinks.tsx
export const FooterLinks: React.FC = () => {
  return (
    <div className="mt-8 text-center">
      <p className="text-xs text-gray-500">
        By continuing, you agree to our{' '}
        <a href="#" className="text-pink-600 hover:text-pink-500 transition-colors">
          Terms of Service
        </a>{' '}
        and{' '}
        <a href="#" className="text-pink-600 hover:text-pink-500 transition-colors">
          Privacy Policy
        </a>
      </p>
    </div>
  );
};