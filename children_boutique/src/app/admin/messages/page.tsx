// src/app/admin/messages/page.tsx
'use client';

import { useState } from 'react';
import { useContactMessages } from '@/hooks/useContactMessages';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import SidebarLayout from '@/components/layout/SidebarLayout';
import { AdminLoading } from '@/components/admin/AdminLoading';
import { EnvelopeIcon } from '@heroicons/react/24/outline';

export default function MessagesPage() {
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'UNREAD' | 'READ' | 'REPLIED' | 'ARCHIVED'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data, loading, error, updateMessageStatus, deleteMessage } = useContactMessages({
    status: statusFilter,
    page: currentPage,
    limit: itemsPerPage
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'UNREAD': return 'bg-red-100 text-red-800 border-red-200';
      case 'READ': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'REPLIED': return 'bg-green-100 text-green-800 border-green-200';
      case 'ARCHIVED': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <ProtectedRoute requiredRole="ADMIN">
        <SidebarLayout>
          <AdminLoading />
        </SidebarLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole="ADMIN">
      <SidebarLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl shadow-sm p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-2">Contact Messages</h1>
                <p className="opacity-90">Manage and respond to customer inquiries</p>
              </div>
              {data?.stats && (
                <div className="text-right">
                  <div className="text-2xl font-bold">{data.stats.totalCount}</div>
                  <div className="text-sm opacity-90">Total Messages</div>
                  {data.stats.unreadCount > 0 && (
                    <div className="text-sm bg-red-500 px-2 py-1 rounded-full mt-1">
                      {data.stats.unreadCount} unread
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex space-x-2">
                {(['ALL', 'UNREAD', 'READ', 'REPLIED', 'ARCHIVED'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setStatusFilter(status);
                      setCurrentPage(1);
                    }}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                      statusFilter === status
                        ? 'bg-pink-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {status === 'ALL' ? 'All Messages' : status}
                    {status === 'UNREAD' && (data?.stats?.unreadCount ?? 0) > 0 && (
                      <span className="ml-2 bg-red-500 text-white px-1.5 py-0.5 rounded-full text-xs">
                        {data?.stats?.unreadCount ?? 0}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Messages List */}
          <div className="bg-white shadow rounded-lg">
            <div className="p-6">
              {error ? (
                <div className="text-center py-8 text-red-600">
                  Error loading messages: {error}
                </div>
              ) : data?.messages.length === 0 ? (
                <div className="text-center py-12">
                  <EnvelopeIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No messages found</h3>
                  <p className="text-gray-500">No contact messages match your current filter.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {data?.messages.map((message) => (
                    <MessageCard
                      key={message.id}
                      message={message}
                      onStatusUpdate={updateMessageStatus}
                      onDelete={deleteMessage}
                      getStatusColor={getStatusColor}
                    />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {data?.pagination && data.pagination.totalPages > 1 && (
                <div className="mt-6 flex justify-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-2 text-sm text-gray-700">
                    Page {currentPage} of {data.pagination.totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(data.pagination.totalPages, prev + 1))}
                    disabled={currentPage === data.pagination.totalPages}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </SidebarLayout>
    </ProtectedRoute>
  );
}

const MessageCard: React.FC<{
  message: any;
  onStatusUpdate: (id: string, status: string) => void;
  onDelete: (id: string) => void;
  getStatusColor: (status: string) => string;
}> = ({ message, onStatusUpdate, onDelete, getStatusColor }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{message.name}</h3>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(message.status)}`}>
              {message.status}
            </span>
          </div>
          <p className="text-gray-600">{message.email}</p>
          <p className="text-sm text-gray-500 mt-1">
            Received: {new Date(message.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="flex space-x-2 ml-4">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-gray-400 hover:text-gray-600"
          >
            {expanded ? 'Collapse' : 'Expand'}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-gray-700 whitespace-pre-wrap">{message.message}</p>
          
          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href={`mailto:${message.email}?subject=Re: Your message to Boutique&body=Dear ${message.name},%0D%0A%0D%0AThank you for contacting us regarding:%0D%0A"${message.message}"%0D%0A%0D%0AWe appreciate your inquiry and will get back to you soon.%0D%0A%0D%0ABest regards,%0D%0AThe Boutique Team`}
              className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors"
            >
              Reply via Email
            </a>
            
            <div className="flex space-x-2">
              {message.status !== 'READ' && (
                <button
                  onClick={() => onStatusUpdate(message.id, 'READ')}
                  className="border border-gray-300 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Mark as Read
                </button>
              )}
              {message.status !== 'REPLIED' && (
                <button
                  onClick={() => onStatusUpdate(message.id, 'REPLIED')}
                  className="border border-gray-300 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Mark as Replied
                </button>
              )}
              {message.status !== 'ARCHIVED' && (
                <button
                  onClick={() => onStatusUpdate(message.id, 'ARCHIVED')}
                  className="border border-gray-300 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Archive
                </button>
              )}
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to delete this message?')) {
                    onDelete(message.id);
                  }
                }}
                className="border border-red-300 text-red-700 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};