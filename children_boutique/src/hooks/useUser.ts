import { useState, useEffect } from 'react';
import { User, FormData,UserApiResponse } from '@/types';

export const useUser = (userId: string) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;
      
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/users');
        if (!res.ok) throw new Error('Failed to fetch users');
        
        const data: UserApiResponse = await res.json();
        const usersArray = Array.isArray(data.users) ? data.users : [];
        const foundUser = usersArray.find((u: User) => u.id === userId);
        
        if (!foundUser) {
          throw new Error('User not found');
        }
        
        setUser(foundUser);
      } catch (err: any) {
        console.error('Error fetching user:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  return { user, loading, error, setUser };
};