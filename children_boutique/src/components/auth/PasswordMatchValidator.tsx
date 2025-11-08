// components/auth/PasswordMatchValidator.tsx
interface PasswordMatchValidatorProps {
  password: string;
  confirmPassword: string;
}

export const PasswordMatchValidator: React.FC<PasswordMatchValidatorProps> = ({
  password,
  confirmPassword,
}) => {
  if (!confirmPassword) return null;

  const passwordsMatch = password === confirmPassword;

  return (
    <div className={`text-sm ${passwordsMatch ? 'text-green-600' : 'text-red-600'}`}>
      {passwordsMatch ? (
        <div className="flex items-center">
          <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Passwords match
        </div>
      ) : (
        <div className="flex items-center">
          <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          Passwords do not match
        </div>
      )}
    </div>
  );
};