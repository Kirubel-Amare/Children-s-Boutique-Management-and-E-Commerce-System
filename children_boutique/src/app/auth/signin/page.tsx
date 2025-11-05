// src/app/auth/signin/page.tsx
'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { EyeIcon, EyeSlashIcon, LockClosedIcon, UserIcon, SparklesIcon } from '@heroicons/react/24/outline';
import Layout from '@/components/layout/Layout';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password. Please try again.');
      } else {
        router.push('/admin');
        router.refresh();
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const demoLogin = (role: 'admin' | 'teller') => {
    setEmail(role === 'admin' ? 'admin@boutique.com' : 'teller@boutique.com');
    setPassword('password');
  };

  return (
    <Layout>
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:max-w-md">
          {/* Header */}
          <div className="text-center lg:text-left">
            <Link href="/" className="inline-flex items-center">
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-2 rounded-lg">
                <SparklesIcon className="h-6 w-6 text-white" />
              </div>
              <span className="ml-3 text-2xl font-bold text-gray-900">Boutique</span>
            </Link>

            <h2 className="mt-8 text-3xl font-bold text-gray-900">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Sign in to your account to continue
            </p>
          </div>

          {/* Demo Accounts */}
          <div className="mt-8 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-4 border border-pink-100">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Demo Accounts:</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => demoLogin('admin')}
                className="flex items-center justify-center px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <UserIcon className="h-4 w-4 mr-2 text-purple-600" />
                Admin
              </button>
              <button
                onClick={() => demoLogin('teller')}
                className="flex items-center justify-center px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <UserIcon className="h-4 w-4 mr-2 text-blue-600" />
                Teller
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Password: <code className="bg-gray-100 px-1 rounded">password</code>
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center">
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <div className="space-y-4">
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-white text-gray-900 placeholder-gray-500 transition-colors"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-white text-gray-900 placeholder-gray-500 transition-colors"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-pink-600 hover:text-pink-500 transition-colors">
                  Forgot your password?
                </a>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign in to your account'
                )}
              </button>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">New to our platform?</span>
              </div>
            </div>

            {/* Sign Up Link */}
            <div className="text-center">
              <Link
                href="/auth/signup"
                className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm hover:shadow-md"
              >
                Create new account
              </Link>
            </div>
          </form>

          {/* Footer Links */}
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
        </div>
      </div>

      {/* Right Side - Decorative */}
      <div className="hidden lg:block relative flex-1 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>

        {/* Floating Elements */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white bg-opacity-20 rounded-full mix-blend-overlay filter blur-xl animate-float"></div>
        <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-white bg-opacity-30 rounded-full mix-blend-overlay filter blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/3 left-1/3 w-28 h-28 bg-white bg-opacity-25 rounded-full mix-blend-overlay filter blur-xl animate-float" style={{ animationDelay: '4s' }}></div>

        {/* Content */}
        <div className="relative flex flex-col justify-center items-center h-full px-12 text-white">
          <div className="max-w-md text-center">
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-8 border border-white border-opacity-30">
              <div className="text-6xl mb-6">👑</div>
              <h3 className="text-2xl font-bold mb-4">Boutique Management</h3>
              <p className="text-white text-opacity-90 leading-relaxed">
                Manage your children&apos;s boutique with ease. Track inventory, record sales,
                and grow your business with our comprehensive management system.
              </p>

              {/* Features List */}
              <div className="mt-8 space-y-4 text-left">
                {[
                  { icon: '📦', text: 'Inventory Management' },
                  { icon: '💰', text: 'Sales Tracking' },
                  { icon: '📊', text: 'Real-time Analytics' },
                  { icon: '👥', text: 'User Management' }
                ].map((feature, index) => (
                  <div key={index} className="flex items-center text-white text-opacity-90">
                    <span className="text-xl mr-3">{feature.icon}</span>
                    <span>{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom decorative curve */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full">
            <path
              fill="#FFFFFF"
              fillOpacity="1"
              d="M0,64L80,58.7C160,53,320,43,480,48C640,53,800,75,960,74.7C1120,75,1280,53,1360,42.7L1440,32L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
            ></path>
          </svg>
        </div>
      </div>
    </div>
    </Layout>
  );
}