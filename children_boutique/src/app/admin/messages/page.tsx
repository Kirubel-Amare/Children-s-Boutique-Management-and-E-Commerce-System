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

          {/* ===== HEADER (Mobile-friendly) ===== */}
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl shadow-sm p-6 text-white">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

              <div className="text-center sm:text-left">
                <h1 className="text-xl sm:text-2xl font-bold">Contact Messages</h1>
                <p className="opacity-90 text-sm sm:text-base">Manage and respond to customer inquiries</p>
              </div>

              {data?.stats && (
                <div className="text-center sm:text-right">
                  <div className="text-2xl font-bold">{data.stats.totalCount}</div>
                  <div className="text-sm opacity-90">Total Messages</div>

                  {data.stats.unreadCount > 0 && (
                    <div className="text-sm bg-red-500 px-2 py-1 rounded-full mt-2 inline-block">
                      {data.stats.unreadCount} unread
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>

          {/* ===== FILTERS (Now wraps cleanly on mobile) ===== */}
          <div className="bg-white shadow rounded-lg p-4 sm:p-6">
            <div className="flex flex-wrap gap-2">
              {(['ALL', 'UNREAD', 'READ', 'REPLIED', 'ARCHIVED'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    setStatusFilter(status);
                    setCurrentPage(1);
                  }}
                  className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
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

          {/* ===== MESSAGE LIST ===== */}
          <div className="bg-white shadow rounded-lg">
            <div className="p-4 sm:p-6">

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

              {/* ===== PAGINATION (Centered + mobile-friendly) ===== */}
              {data?.pagination && data.pagination.totalPages > 1 && (
                <div className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-3">

                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md text-sm font-medium bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>

                  <span className="text-sm text-gray-700">
                    Page {currentPage} of {data.pagination.totalPages}
                  </span>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(data.pagination.totalPages, prev + 1))}
                    disabled={currentPage === data.pagination.totalPages}
                    className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md text-sm font-medium bg-white hover:bg-gray-50 disabled:opacity-50"
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

/* ============================================================
   ✨ MOBILE FRIENDLY MessageCard
   - Buttons wrap cleanly (flex-wrap)
   - Layout stacks on small screens
   ============================================================ */
const MessageCard: React.FC<{
  message: any;
  onStatusUpdate: (id: string, status: string) => void;
  onDelete: (id: string) => void;
  getStatusColor: (status: string) => string;
}> = ({ message, onStatusUpdate, onDelete, getStatusColor }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg p-4 sm:p-6 hover:border-gray-300 transition-colors">

      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-3 mb-4">

        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">{message.name}</h3>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(message.status)}`}>
              {message.status}
            </span>
          </div>

          <p className="text-gray-600 text-sm break-words">{message.email}</p>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Received: {new Date(message.createdAt).toLocaleString()}
          </p>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="self-end sm:self-auto text-gray-400 hover:text-gray-600 text-sm"
        >
          {expanded ? 'Collapse' : 'Expand'}
        </button>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-gray-200">

          <p className="text-gray-700 text-sm sm:text-base whitespace-pre-wrap">
            {message.message}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">

            {/* Reply */}
            <a
              href={`mailto:${message.email}?subject=Re: Your message&body=Dear ${message.name},%0D%0A%0D%0A`}
              className="bg-pink-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-pink-700 transition-colors"
            >
              Reply via Email
            </a>

            {/* Actions */}
            {message.status !== 'READ' && (
              <button
                onClick={() => onStatusUpdate(message.id, 'READ')}
                className="border border-gray-300 text-gray-700 px-3 py-2 rounded-lg text-sm hover:bg-gray-50"
              >
                Mark as Read
              </button>
            )}

            {message.status !== 'REPLIED' && (
              <button
                onClick={() => onStatusUpdate(message.id, 'REPLIED')}
                className="border border-gray-300 text-gray-700 px-3 py-2 rounded-lg text-sm hover:bg-gray-50"
              >
                Mark as Replied
              </button>
            )}

            {message.status !== 'ARCHIVED' && (
              <button
                onClick={() => onStatusUpdate(message.id, 'ARCHIVED')}
                className="border border-gray-300 text-gray-700 px-3 py-2 rounded-lg text-sm hover:bg-gray-50"
              >
                Archive
              </button>
            )}

            {/* Delete */}
            <button
              onClick={() => {
                if (confirm('Are you sure you want to delete this message?')) {
                  onDelete(message.id);
                }
              }}
              className="border border-red-300 text-red-700 px-3 py-2 rounded-lg text-sm hover:bg-red-50"
            >
              Delete
            </button>

          </div>
        </div>
      )}

    </div>
  );
};
