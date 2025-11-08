// components/admin/ContactMessages.tsx
import { useState } from 'react';
import { useContactMessages } from '@/hooks/useContactMessages';
import { EnvelopeIcon, EyeIcon, ArchiveBoxIcon, CheckIcon, TrashIcon } from '@heroicons/react/24/outline';

interface ContactMessagesProps {
  maxItems?: number;
  showViewAll?: boolean;
}

export const ContactMessages: React.FC<ContactMessagesProps> = ({ 
  maxItems = 5, 
  showViewAll = true 
}) => {
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'UNREAD' | 'READ'>('ALL');
  const { data, loading, error, updateMessageStatus, deleteMessage } = useContactMessages({
    status: statusFilter,
    limit: maxItems
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'UNREAD': return 'bg-red-100 text-red-800';
      case 'READ': return 'bg-blue-100 text-blue-800';
      case 'REPLIED': return 'bg-green-100 text-green-800';
      case 'ARCHIVED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusUpdate = async (messageId: string, newStatus: string) => {
    await updateMessageStatus(messageId, newStatus);
  };

  const handleDelete = async (messageId: string) => {
    if (confirm('Are you sure you want to delete this message?')) {
      await deleteMessage(messageId);
    }
  };

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Contact Messages</h3>
        </div>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Contact Messages</h3>
        </div>
        <div className="p-6">
          <div className="text-center text-red-600">
            Error loading messages: {error}
          </div>
        </div>
      </div>
    );
  }

  const messages = data?.messages || [];
  const stats = data?.stats;

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Contact Messages</h3>
            {stats && (
              <p className="text-sm text-gray-500 mt-1">
                {stats.unreadCount} unread • {stats.totalCount} total
              </p>
            )}
          </div>
          <div className="flex space-x-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="ALL">All Messages</option>
              <option value="UNREAD">Unread</option>
              <option value="READ">Read</option>
            </select>
            {showViewAll && (
              <button className="text-pink-600 hover:text-pink-700 text-sm font-medium">
                View All
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="p-6">
        {messages.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <EnvelopeIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p>No messages found</p>
            <p className="text-sm mt-1">Contact form messages will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <MessageItem
                key={message.id}
                message={message}
                onStatusUpdate={handleStatusUpdate}
                onDelete={handleDelete}
                getStatusColor={getStatusColor}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const MessageItem: React.FC<{
  message: any;
  onStatusUpdate: (id: string, status: string) => void;
  onDelete: (id: string) => void;
  getStatusColor: (status: string) => string;
}> = ({ message, onStatusUpdate, onDelete, getStatusColor }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <h4 className="font-medium text-gray-900 truncate">{message.name}</h4>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(message.status)}`}>
              {message.status}
            </span>
          </div>
          <p className="text-sm text-gray-600 truncate">{message.email}</p>
          <p className="text-xs text-gray-500 mt-1">
            {new Date(message.createdAt).toLocaleDateString()} at {new Date(message.createdAt).toLocaleTimeString()}
          </p>
        </div>
        <div className="flex space-x-1 ml-4">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-gray-400 hover:text-gray-600 p-1"
            title={expanded ? 'Collapse' : 'Expand'}
          >
            <EyeIcon className="h-4 w-4" />
          </button>
          {message.status === 'UNREAD' && (
            <button
              onClick={() => onStatusUpdate(message.id, 'READ')}
              className="text-blue-400 hover:text-blue-600 p-1"
              title="Mark as read"
            >
              <CheckIcon className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={() => onStatusUpdate(message.id, 'ARCHIVED')}
            className="text-gray-400 hover:text-gray-600 p-1"
            title="Archive"
          >
            <ArchiveBoxIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(message.id)}
            className="text-red-400 hover:text-red-600 p-1"
            title="Delete"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{message.message}</p>
          <div className="mt-3 flex space-x-2">
            <a
              href={`mailto:${message.email}?subject=Re: Your message to Boutique&body=Dear ${message.name},%0D%0A%0D%0AThank you for your message...`}
              className="text-sm bg-pink-600 text-white px-3 py-1 rounded hover:bg-pink-700 transition-colors"
            >
              Reply via Email
            </a>
            <button
              onClick={() => onStatusUpdate(message.id, 'REPLIED')}
              className="text-sm border border-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-50 transition-colors"
            >
              Mark as Replied
            </button>
          </div>
        </div>
      )}
    </div>
  );
};