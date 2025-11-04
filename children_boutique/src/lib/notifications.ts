// src/lib/notifications.ts
export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  productId?: string;
  userId?: string;
  createdAt: string;
  product?: {
    id: string;
    name: string;
    quantity: number;
  };
}

const API_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';

// Fetch notifications
export async function getNotifications(): Promise<Notification[]> {
  try {
    const response = await fetch(`${API_URL}/api/notifications`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch notifications: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error in getNotifications:', error);
    throw error;
  }
}

// Mark notification as read
export async function markNotificationAsRead(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/api/notifications/${id}`, {
      method: 'PATCH',
    });

    if (!response.ok) {
      throw new Error(`Failed to mark notification as read: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error in markNotificationAsRead:', error);
    throw error;
  }
}

// Check for low stock and create notifications
export async function checkLowStock(): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/api/products/low-stock-check`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error(`Failed to check low stock: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error in checkLowStock:', error);
    throw error;
  }
}