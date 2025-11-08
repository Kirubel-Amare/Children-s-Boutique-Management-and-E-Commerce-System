// hooks/useOtp.ts
import { useState } from 'react';

interface UseOtpReturn {
  otp: string;
  showOtpField: boolean;
  sendingOtp: boolean;
  setOtp: (otp: string) => void;
  setShowOtpField: (show: boolean) => void;
  sendOtp: (email: string, action: string) => Promise<boolean>;
  resetOtp: () => void;
}

export const useOtp = (): UseOtpReturn => {
  const [otp, setOtp] = useState('');
  const [showOtpField, setShowOtpField] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);

  const sendOtp = async (email: string, action: string): Promise<boolean> => {
    setSendingOtp(true);
    try {
      const res = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, action }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to send OTP');
      }

      setShowOtpField(true);
      return true;
    } catch (error) {
      console.error('Error sending OTP:', error);
      return false;
    } finally {
      setSendingOtp(false);
    }
  };

  const resetOtp = () => {
    setOtp('');
    setShowOtpField(false);
  };

  return {
    otp,
    showOtpField,
    sendingOtp,
    setOtp,
    setShowOtpField,
    sendOtp,
    resetOtp,
  };
};