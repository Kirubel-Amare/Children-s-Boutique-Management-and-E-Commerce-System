// components/settings/SecurityTab.tsx
import { useState } from 'react';
import { PasswordInput } from './PasswordInput';
import { PasswordStrength } from './PasswordStrength';
import { useOtp } from '@/hooks/useOtp';
import { SubmitButton } from './SubmitButton';

interface SecurityTabProps {
  userEmail: string;
  onChangePassword: (data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
    otp: string;
  }) => Promise<void>;
  updating: boolean;
}

export const SecurityTab: React.FC<SecurityTabProps> = ({
  userEmail,
  onChangePassword,
  updating,
}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    otp,
    showOtpField,
    sendingOtp,
    setOtp,
    setShowOtpField,
    sendOtp,
    resetOtp,
  } = useOtp();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      return;
    }

    if (!showOtpField) {
      const success = await sendOtp(userEmail, 'change your password');
      if (!success) {
        // Error handling will be done in parent component via the onChangePassword callback
        return;
      }
      return;
    }

    await onChangePassword({
      currentPassword,
      newPassword,
      confirmPassword,
      otp,
    });

    // Reset form on success
    if (!updating) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setOtp('');
      setShowOtpField(false);
      resetOtp();
    }
  };

  const passwordMatchError = confirmPassword && newPassword !== confirmPassword 
    ? 'Passwords do not match' 
    : undefined;

  return (
    <div className="max-w-2xl">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Change Password
      </h3>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {!showOtpField ? (
            <>
              <PasswordInput
                id="currentPassword"
                label="Current Password"
                value={currentPassword}
                onChange={setCurrentPassword}
                placeholder="Enter your current password"
                required
                showPassword={showPassword}
                onToggleVisibility={() => setShowPassword(!showPassword)}
              />

              <div>
                <PasswordInput
                  id="newPassword"
                  label="New Password"
                  value={newPassword}
                  onChange={setNewPassword}
                  placeholder="Enter your new password"
                  required
                  showPassword={showNewPassword}
                  onToggleVisibility={() => setShowNewPassword(!showNewPassword)}
                />
                <PasswordStrength password={newPassword} />
              </div>

              <PasswordInput
                id="confirmPassword"
                label="Confirm New Password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                placeholder="Re-enter new password"
                required
                showPassword={showConfirmPassword}
                onToggleVisibility={() => setShowConfirmPassword(!showConfirmPassword)}
                error={passwordMatchError}
              />
            </>
          ) : (
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                OTP Verification Code
              </label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter 6-digit OTP"
                className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-white text-gray-900 placeholder-gray-500 transition-colors text-center text-lg tracking-widest"
                required
              />
              <p className="mt-2 text-sm text-gray-500">
                Check your email for the OTP code. It will expire in 10 minutes.
              </p>
            </div>
          )}

          <div className="flex space-x-3">
            {!showOtpField ? (
              <SubmitButton
                loading={sendingOtp}
                loadingText="Sending OTP..."
                defaultText="Request OTP & Change Password"
                disabled={!currentPassword || !newPassword || !confirmPassword || !!passwordMatchError}
              />
            ) : (
              <>
                <SubmitButton
                  loading={updating}
                  loadingText="Changing Password..."
                  defaultText="Verify OTP & Change Password"
                  disabled={!otp || otp.length !== 6}
                />
                <button
                  type="button"
                  onClick={() => {
                    setShowOtpField(false);
                    setOtp('');
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </form>

      <SecurityNotice />
    </div>
  );
};

const SecurityNotice: React.FC = () => (
  <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-4">
    <div className="flex items-start">
      <svg className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
      <div>
        <h3 className="text-sm font-semibold text-blue-800">Security Notice</h3>
        <p className="text-sm text-blue-700 mt-1">
          For security reasons, password changes require OTP verification sent to your registered email address.
          This ensures that only authorized users can modify sensitive account information.
        </p>
      </div>
    </div>
  </div>
);