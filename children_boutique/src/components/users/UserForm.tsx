import React from 'react';
import { FormData } from '@/types';
import Link from 'next/link';

interface UserFormProps {
  formData: FormData;
  onSubmit: (e: React.FormEvent) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onResetPassword: () => void;
  loading: boolean;
  submitLabel?: string;
}

export const UserForm: React.FC<UserFormProps> = ({
  formData,
  onSubmit,
  onInputChange,
  onResetPassword,
  loading,
  submitLabel = 'Update User'
}) => {
  return (
    <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Edit User Details</h2>
      </div>
      <form onSubmit={onSubmit} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={onInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 text-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              placeholder="Enter full name"
            />
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={onInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 text-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              placeholder="Enter email address"
            />
          </div>

          {/* Role Field */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
              Role *
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={onInputChange}
              className="w-full px-3 py-2 border border-gray-300 text-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            >
              <option value="TELLER">Teller</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          {/* Status Field */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
              Status *
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={onInputChange}
              className="w-full px-3 py-2 border border-gray-300 text-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-8 pt-6 border-t border-gray-200 space-y-4 sm:space-y-0">
          <div>
            <button
              type="button"
              onClick={onResetPassword}
              disabled={loading}
              className="text-red-600 hover:text-red-700 font-medium disabled:opacity-50"
            >
              Reset Password
            </button>
          </div>
          
          <div className="flex space-x-3">
            <Link
              href="/admin/users"
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="bg-pink-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-pink-700 transition-colors shadow-sm disabled:opacity-50"
            >
              {loading ? 'Updating...' : submitLabel}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};