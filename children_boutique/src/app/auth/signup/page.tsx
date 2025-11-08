// src/app/auth/signup/page.tsx
'use client';

import Layout from '@/components/layout/Layout';
import { useSignUp } from '@/hooks/useSignUp';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { FormInput } from '@/components/auth/FormInput';
import { TermsAgreement } from '@/components/auth/TermsAgreement';
import { SubmitButton } from '@/components/auth/SubmitButton';
import { SignInLink } from '@/components/auth/SignInLink';
import { ErrorMessage } from '@/components/auth/ErrorMessage';
import { SignUpDecorativeSide } from '@/components/auth/SignUpDecorativeSide';
import { PasswordMatchValidator } from '@/components/auth/PasswordMatchValidator';
import { UserIcon, EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';

export default function SignUp() {
  const {
    formData,
    showPassword,
    showConfirmPassword,
    loading,
    error,
    setShowPassword,
    setShowConfirmPassword,
    handleChange,
    handleSubmit,
  } = useSignUp();

  return (
    <Layout>
      <div className="min-h-screen flex">
        {/* Left Side - Form */}
        <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:max-w-md">
            <AuthHeader
              title="Create your account"
              subtitle="Join us and start managing your boutique"
            />

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <ErrorMessage message={error} />

              <div className="space-y-4">
                <FormInput
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  icon={UserIcon}
                  label="Full Name"
                />

                <FormInput
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  autoComplete="email"
                  icon={EnvelopeIcon}
                  label="Email Address"
                />

                <div>
                  <FormInput
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    autoComplete="new-password"
                    icon={LockClosedIcon}
                    showPasswordToggle={true}
                    onTogglePassword={() => setShowPassword(!showPassword)}
                    showPassword={showPassword}
                    label="Password"
                  />
                </div>

                <div>
                  <FormInput
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    icon={LockClosedIcon}
                    showPasswordToggle={true}
                    onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
                    showPassword={showConfirmPassword}
                    label="Confirm Password"
                  />
                  <PasswordMatchValidator
                    password={formData.password}
                    confirmPassword={formData.confirmPassword}
                  />
                </div>
              </div>

              <TermsAgreement />

              <SubmitButton loading={loading}>
                Create your account
              </SubmitButton>

              <SignInLink />
            </form>
          </div>
        </div>

        {/* Right Side - Decorative */}
        <SignUpDecorativeSide />
      </div>
    </Layout>
  );
}