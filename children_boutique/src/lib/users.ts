// src/lib/users.ts

import { User } from '@/types';
import { apiFetch } from './apiClient';

export async function getUsers(): Promise<any> {
  try {
    const data = await apiFetch('/api/users');

    // The API may return the users array directly or wrap it.
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.users)) return data.users;
    if (Array.isArray(data?.data)) return data.data;

    console.warn('Unexpected response format from /api/users:', data);
    return [];
  } catch (error: any) {
    console.error('Error in getUsers:', error);
    // Keep previous behavior: return empty array on error to avoid breaking admin page
    if (error?.status === 404) {
      console.warn('Users API endpoint not found, returning empty array');
      return [];
    }
    return [];
  }
}