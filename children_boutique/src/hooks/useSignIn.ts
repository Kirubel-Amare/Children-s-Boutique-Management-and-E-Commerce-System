// hooks/useSignIn.ts
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface UseSignInReturn {
  email: string;
  password: string;
  showPassword: boolean;
  loading: boolean;
  error: string;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setShowPassword: (show: boolean) => void;
  setError: (error: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  
}

export const useSignIn = (): UseSignInReturn => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
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

  return {
    email,
    password,
    showPassword,
    loading,
    error,
    setEmail,
    setPassword,
    setShowPassword,
    setError,
    handleSubmit,
  };
};