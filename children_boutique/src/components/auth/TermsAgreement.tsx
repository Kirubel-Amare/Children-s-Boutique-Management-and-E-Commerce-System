// components/auth/TermsAgreement.tsx
interface TermsAgreementProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

export const TermsAgreement: React.FC<TermsAgreementProps> = ({ checked = false, onChange }) => {
  return (
    <div className="flex items-center">
      <input
        id="terms"
        name="terms"
        type="checkbox"
        required
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
      />
      <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
        I agree to the{' '}
        <a href="#" className="text-pink-600 hover:text-pink-500 transition-colors">
          Terms of Service
        </a>{' '}
        and{' '}
        <a href="#" className="text-pink-600 hover:text-pink-500 transition-colors">
          Privacy Policy
        </a>
      </label>
    </div>
  );
};