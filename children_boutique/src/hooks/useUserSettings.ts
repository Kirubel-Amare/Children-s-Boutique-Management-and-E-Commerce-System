// hooks/useUserSettings.ts
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

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

interface UserSettings {
  user: User | null;
  loading: boolean;
  error: string | null;
  fetchUserSettings: () => Promise<void>;
}

export const useUserSettings = (): UserSettings => {
  const { data: session } = useSession();
  const [state, setState] = useState<Omit<UserSettings, 'fetchUserSettings'>>({
    user: null,
    loading: true,
    error: null,
  });

  const fetchUserSettings = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const res = await fetch('/api/settings');
      if (!res.ok) throw new Error('Failed to fetch settings');
      const data = await res.json();
      setState(prev => ({ ...prev, user: data.user, loading: false }));
    } catch (err: any) {
      setState(prev => ({ ...prev, error: err.message, loading: false }));
    }
  };

  useEffect(() => {
    fetchUserSettings();
  }, []);

  return { ...state, fetchUserSettings };
};