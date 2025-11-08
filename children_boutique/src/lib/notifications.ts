// src/lib/notifications.ts


import { apiFetch } from './apiClient';

// Fetch notifications
export async function getNotifications(): Promise<Notification[]> {
  try {
    return await apiFetch('/api/notifications', { cache: 'no-store' });
  } catch (error) {
    console.error('Error in getNotifications:', error);
    throw error;
  }
}

// Mark notification as read
export async function markNotificationAsRead(id: string): Promise<void> {
  try {
    await apiFetch(`/api/notifications/${id}`, { method: 'PATCH' });
  } catch (error) {
    console.error('Error in markNotificationAsRead:', error);
    throw error;
  }
}

// Check for low stock and create notifications
export async function checkLowStock(): Promise<void> {
  try {
    await apiFetch('/api/products/low-stock-check', { method: 'POST' });
  } catch (error) {
    console.error('Error in checkLowStock:', error);
    throw error;
  }
}