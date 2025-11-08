// components/settings/PasswordStrength.tsx
import { usePasswordStrength } from '@/hooks/usePasswordStrength';

interface PasswordStrengthProps {
  password: string;
}

export const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password }) => {
  const { strength, getStrengthColor, getStrengthText } = usePasswordStrength(password);

  if (!password) return null;

  return (
    <div className="mt-3">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">Password strength</span>
        <span className={`text-sm font-semibold ${
          strength.score <= 1 ? 'text-red-600' :
          strength.score <= 3 ? 'text-yellow-600' : 'text-green-600'
        }`}>
          {getStrengthText(strength.score)}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(strength.score)}`}
          style={{ width: `${(strength.score / 5) * 100}%` }}
        ></div>
      </div>
      {strength.feedback.length > 0 && (
        <ul className="mt-2 text-sm text-gray-600 space-y-1">
          {strength.feedback.map((item, index) => (
            <li key={index} className="flex items-center">
              <svg className="w-4 h-4 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};