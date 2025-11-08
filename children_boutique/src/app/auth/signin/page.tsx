// src/app/auth/signin/page.tsx
'use client';

import Layout from '@/components/layout/Layout';
import { useSignIn } from '@/hooks/useSignIn';
import { AuthHeader } from '@/components/auth/AuthHeader';;
import { FormInput } from '@/components/auth/FormInput';
import { RememberForgot } from '@/components/auth/RememberForgot';
import { SubmitButton } from '@/components/auth/SubmitButton';
import { FormDivider } from '@/components/auth/FormDivider';
import { SignUpLink } from '@/components/auth/SignUpLink';
import { FooterLinks } from '@/components/auth/FooterLinks';
import { ErrorMessage } from '@/components/auth/ErrorMessage';
import { DecorativeSide } from '@/components/auth/DecorativeSide';
import { UserIcon, LockClosedIcon } from '@heroicons/react/24/outline';

export default function SignIn() {
  const {
    email,
    password,
    showPassword,
    loading,
    error,
    setEmail,
    setPassword,
    setShowPassword,
    handleSubmit,
    demoLogin,
  } = useSignIn();

  return (
    <Layout>
      <div className="min-h-screen flex">
        {/* Left Side - Form */}
        <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:max-w-md">
            <AuthHeader
              title="Welcome back"
              subtitle="Sign in to your account to continue"
            />

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <ErrorMessage message={error} />

              <div className="space-y-4">
                <FormInput
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  autoComplete="email"
                  icon={UserIcon}
                />

                <FormInput
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  icon={LockClosedIcon}
                  showPasswordToggle={true}
                  onTogglePassword={() => setShowPassword(!showPassword)}
                  showPassword={showPassword}
                />
              </div>

              <RememberForgot />

              <SubmitButton loading={loading}>
                Sign in to your account
              </SubmitButton>

              <FormDivider text="New to our platform?" />

              <SignUpLink />
            </form>

            <FooterLinks />
          </div>
        </div>

        {/* Right Side - Decorative */}
        <DecorativeSide />
      </div>
    </Layout>
  );
}