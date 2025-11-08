// hooks/useContactMessages.ts
import { useState, useEffect } from 'react';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  status: 'UNREAD' | 'READ' | 'ARCHIVED' | 'REPLIED';
  createdAt: string;
  updatedAt: string;
}

interface MessagesResponse {
  messages: ContactMessage[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
  stats: {
    unreadCount: number;
    totalCount: number;
  };
}

interface UseContactMessagesProps {
  status?: string;
  page?: number;
  limit?: number;
}

export const useContactMessages = ({
  status = 'ALL',
  page = 1,
  limit = 10
}: UseContactMessagesProps = {}) => {
  const [data, setData] = useState<MessagesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = new URLSearchParams({
        status: status === 'ALL' ? '' : status,
        page: page.toString(),
        limit: limit.toString()
      });

      const response = await fetch(`/api/admin/messages?${queryParams}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }

      const result = await response.json();
      setData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [status, page, limit]);

  const updateMessageStatus = async (messageId: string, status: string) => {
    try {
      const response = await fetch('/api/admin/messages', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messageId, status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update message status');
      }

      // Refresh the messages
      await fetchMessages();
      return true;
    } catch (error) {
      console.error('Error updating message status:', error);
      return false;
    }
  };

  const deleteMessage = async (messageId: string) => {
    try {
      const response = await fetch(`/api/admin/messages/${messageId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete message');
      }

      // Refresh the messages
      await fetchMessages();
      return true;
    } catch (error) {
      console.error('Error deleting message:', error);
      return false;
    }
  };

  return {
    data,
    loading,
    error,
    refetch: fetchMessages,
    updateMessageStatus,
    deleteMessage,
  };
};