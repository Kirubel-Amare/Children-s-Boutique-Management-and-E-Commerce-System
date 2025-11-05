// app/settings/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import SidebarLayout from '@/components/layout/SidebarLayout';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'TELLER';
  status: 'active' | 'inactive';
  isEmailVerified: boolean;
  createdAt: string;
  lastLogin?: string;
}

interface PasswordStrength {
  score: number;
  feedback: string[];
}

export default function SettingsPage() {
  const { data: session, update: updateSession } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'preferences'>('profile');

  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpField, setShowOtpField] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({ score: 0, feedback: [] });

  // Calculate password strength
  const calculatePasswordStrength = (password: string): PasswordStrength => {
    const feedback: string[] = [];
    let score = 0;

    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push('At least 8 characters');
    }

    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('One uppercase letter');
    }

    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('One lowercase letter');
    }

    if (/[0-9]/.test(password)) {
      score += 1;
    } else {
      feedback.push('One number');
    }

    if (/[^A-Za-z0-9]/.test(password)) {
      score += 1;
    } else {
      feedback.push('One special character');
    }

    return { score, feedback };
  };

  // Fetch user settings
  const fetchUserSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/settings');
      if (!res.ok) throw new Error('Failed to fetch settings');
      const data = await res.json();
      setUser(data.user);
      setName(data.user.name);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserSettings();
  }, []);

  useEffect(() => {
    if (newPassword) {
      setPasswordStrength(calculatePasswordStrength(newPassword));
    } else {
      setPasswordStrength({ score: 0, feedback: [] });
    }
  }, [newPassword]);

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const sendOtp = async (action: string) => {
    setSendingOtp(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user?.email,
          action: action,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to send OTP');
      }

      setShowOtpField(true);
      setSuccess(`OTP sent to your email! It will expire in ${data.expiresIn}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSendingOtp(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    clearMessages();

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      setUser(data.user);
      // Update session if name changed
      if (session?.user?.name !== data.user.name) {
        await updateSession({ ...session, user: { ...session?.user, name: data.user.name } });
      }
      setSuccess('Profile updated successfully!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (passwordStrength.score < 3) {
      setError('Please choose a stronger password');
      return;
    }

    if (!showOtpField) {
      await sendOtp('change your password');
      return;
    }

    setUpdating(true);

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          otp,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to change password');
      }

      setSuccess('Password changed successfully!');
      // Reset form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setOtp('');
      setShowOtpField(false);
      setShowPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const getPasswordStrengthColor = (score: number) => {
    if (score <= 1) return 'bg-red-500';
    if (score <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = (score: number) => {
    if (score <= 1) return 'Weak';
    if (score <= 3) return 'Medium';
    return 'Strong';
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <SidebarLayout>
          <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
                <span className="ml-3 text-gray-600">Loading settings...</span>
              </div>
            </div>
          </div>
        </SidebarLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <SidebarLayout>
        <div className="max-w-6xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600 mt-2">
                Manage your account settings and security preferences
              </p>
            </div>

            {/* Success/Error Messages */}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-6 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {success}
              </div>
            )}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
              {/* Tab Navigation */}
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'profile'
                        ? 'border-pink-500 text-pink-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                  >
                    <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Profile
                  </button>
                  <button
                    onClick={() => setActiveTab('security')}
                    className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'security'
                        ? 'border-pink-500 text-pink-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                  >
                    <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Security
                  </button>
                  <button
                    onClick={() => setActiveTab('preferences')}
                    className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'preferences'
                        ? 'border-pink-500 text-pink-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                  >
                    <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Preferences
                  </button>
                </nav>
              </div>

              <div className="p-6">
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Information */}
                    <div className="lg:col-span-1">
                      <div className="bg-gray-50 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          Profile Information
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Role
                            </label>
                            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${user?.role === 'ADMIN'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-blue-100 text-blue-800'
                              }`}>
                              {user?.role}
                            </span>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Status
                            </label>
                            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${user?.status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                              }`}>
                              {user?.status}
                            </span>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Member Since
                            </label>
                            <div className="text-sm text-gray-900">
                              {new Date(user?.createdAt || '').toLocaleDateString()}
                            </div>
                          </div>
                          {user?.lastLogin && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Last Login
                              </label>
                              <div className="text-sm text-gray-900">
                                {new Date(user.lastLogin).toLocaleString()}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Update Profile Form */}
                    <div className="lg:col-span-2">
                      <form onSubmit={handleUpdateProfile}>
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                              Update Profile
                            </h3>
                          </div>

                          <div className="grid grid-cols-1 gap-4">
                            <div>
                              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name
                              </label>
                              <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-white text-gray-900 placeholder-gray-500 transition-colors"
                                required
                              />
                            </div>
                            <div>
                              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                              </label>
                              <input
                                type="email"
                                id="email"
                                value={user?.email}
                                disabled
                                className="block w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                              />
                              <p className="mt-2 text-sm text-gray-500">
                                Email address cannot be changed. Contact administrator for email updates.
                              </p>
                            </div>
                          </div>

                          <div className="flex justify-end">
                            <button
                              type="submit"
                              disabled={updating}
                              className="bg-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-pink-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                            >
                              {updating ? (
                                <>
                                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Updating...
                                </>
                              ) : 'Update Profile'}
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {/* Security Tab */}
                {activeTab === 'security' && (
                  <div className="max-w-2xl">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">
                      Change Password
                    </h3>

                    <form onSubmit={handleChangePassword}>
                      <div className="space-y-6">

                        {!showOtpField ? (
                          <>
                            {/* Current Password */}
                            <div className="relative">
                              <label
                                htmlFor="currentPassword"
                                className="block text-sm font-medium text-gray-700 mb-2"
                              >
                                Current Password
                              </label>
                              <input
                                type={showPassword ? "text" : "password"}
                                id="currentPassword"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-white text-gray-900 placeholder-gray-500 transition-colors pr-10"
                                placeholder="Enter your current password"
                                required
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform text-gray-500 hover:text-gray-700"
                              >
                                {showPassword ? (
                                  <EyeSlashIcon className="h-5 w-5" />
                                ) : (
                                  <EyeIcon className="h-5 w-5" />
                                )}
                              </button>
                            </div>

                            {/* New Password */}
                            <div>
                              <label
                                htmlFor="newPassword"
                                className="block text-sm font-medium text-gray-700 mb-2"
                              >
                                New Password
                              </label>

                              {/* Input + Eye Container */}
                              <div className="relative">
                                <input
                                  type={showNewPassword ? "text" : "password"}
                                  id="newPassword"
                                  value={newPassword}
                                  onChange={(e) => setNewPassword(e.target.value)}
                                  className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-white text-gray-900 placeholder-gray-500 transition-colors pr-10"
                                  placeholder="Enter your new password"
                                  required
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowNewPassword(!showNewPassword)}
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                  {showNewPassword ? (
                                    <EyeSlashIcon className="h-5 w-5" />
                                  ) : (
                                    <EyeIcon className="h-5 w-5" />
                                  )}
                                </button>
                              </div>

                              {/* Password Strength Indicator */}
                              {newPassword && (
                                <div className="mt-3">
                                  <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium text-gray-700">Password strength</span>
                                    <span className={`text-sm font-semibold ${passwordStrength.score <= 1 ? 'text-red-600' :
                                        passwordStrength.score <= 3 ? 'text-yellow-600' : 'text-green-600'
                                      }`}>
                                      {getPasswordStrengthText(passwordStrength.score)}
                                    </span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                      className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor(passwordStrength.score)}`}
                                      style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                                    ></div>
                                  </div>
                                  {passwordStrength.feedback.length > 0 && (
                                    <ul className="mt-2 text-sm text-gray-600 space-y-1">
                                      {passwordStrength.feedback.map((item, index) => (
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
                              )}
                            </div>


                            {/* Confirm Password */}
                            <div className="relative">
                              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm New Password
                              </label>
                              <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-white text-gray-900 placeholder-gray-500 transition-colors pr-10"
                                placeholder="Re-enter new password"
                                required
                              />
                              <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 transform text-gray-500 hover:text-gray-700"
                              >
                                {showConfirmPassword ? (
                                  <EyeSlashIcon className="h-5 w-5" />
                                ) : (
                                  <EyeIcon className="h-5 w-5" />
                                )}
                              </button>
                            </div>
                            {confirmPassword && newPassword !== confirmPassword && (
                              <p className="text-sm text-red-600">Passwords do not match</p>
                            )}
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

                        {/* Submit Buttons */}
                        <div className="flex space-x-3">
                          {!showOtpField ? (
                            <button
                              type="submit"
                              disabled={sendingOtp || !currentPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword}
                              className="bg-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-pink-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                            >
                              {sendingOtp ? (
                                <>
                                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Sending OTP...
                                </>
                              ) : 'Request OTP & Change Password'}
                            </button>
                          ) : (
                            <>
                              <button
                                type="submit"
                                disabled={updating || !otp || otp.length !== 6}
                                className="bg-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-pink-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                              >
                                {updating ? (
                                  <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Changing Password...
                                  </>
                                ) : 'Verify OTP & Change Password'}
                              </button>
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

                    {/* Security Information */}
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
                  </div>
                )}

                {/* Preferences Tab */}
                {activeTab === 'preferences' && (
                  <div className="max-w-2xl">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">
                      Application Preferences
                    </h3>

                    <div className="space-y-6">
                      <div className="bg-gray-50 rounded-xl p-6">
                        <h4 className="font-medium text-gray-900 mb-4">Coming Soon</h4>
                        <p className="text-gray-600">
                          User preferences and customization options will be available in a future update.
                          This may include theme settings, notification preferences, and display options.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </SidebarLayout>
    </ProtectedRoute>
  );
}