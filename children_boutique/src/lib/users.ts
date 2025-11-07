// src/lib/users.ts

import { User } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';



export async function getUsers(): Promise<User[]> {
  try {
    const response = await fetch(`${API_URL}/api/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      // If the endpoint doesn't exist yet, return empty array
      if (response.status === 404) {
        console.warn('Users API endpoint not found, returning empty array');
        return [];
      }
      throw new Error(`Failed to fetch users: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error in getUsers:', error);
    // Return empty array instead of throwing to prevent breaking the admin page
    return [];
  }
}