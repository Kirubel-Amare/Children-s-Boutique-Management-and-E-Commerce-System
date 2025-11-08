// components/settings/ProfileTab.tsx
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { SubmitButton } from './SubmitButton';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'TELLER';
  status: 'active' | 'inactive';
  createdAt: string;
  lastLogin?: string;
}

interface ProfileTabProps {
  user: User;
  onUpdateProfile: (name: string) => Promise<void>;
  updating: boolean;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({ user, onUpdateProfile, updating }) => {
  const { update: updateSession } = useSession();
  const [name, setName] = useState(user.name);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdateProfile(name);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Profile Information */}
      <div className="lg:col-span-1">
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Profile Information
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                user.role === 'ADMIN'
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {user.role}
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                user.status === 'active'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {user.status}
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Member Since
              </label>
              <div className="text-sm text-gray-900">
                {new Date(user.createdAt).toLocaleDateString()}
              </div>
            </div>
            {user.lastLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Login
                </label>
                <div className="text-sm text-gray-900">
                  {new Date(user.lastLogin).toLocaleString()}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Update Profile Form */}
      <div className="lg:col-span-2">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Update Profile
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-white text-gray-900 placeholder-gray-500 transition-colors"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={user.email}
                  disabled
                  className="block w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                />
                <p className="mt-2 text-sm text-gray-500">
                  Email address cannot be changed. Contact administrator for email updates.
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <SubmitButton
                loading={updating}
                loadingText="Updating..."
                defaultText="Update Profile"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};