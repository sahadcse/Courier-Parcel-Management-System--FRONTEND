'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';

export default function UserProfile() {
  const { user } = useSelector((state: RootState) => state.auth);

  // Try to get user data from localStorage if not available in Redux state
  const localUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null;
  

  if (!user) {
    return <p>Loading user profile...</p>;
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
        My Profile
      </h2>
      <div className="space-y-3 text-sm border-t pt-4 dark:border-gray-700">
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Name:</span>
          <span className="font-semibold text-gray-800 dark:text-gray-200">{user.customerName || localUser?.customerName || 'N/A'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Email:</span>
          <span className="font-semibold text-gray-800 dark:text-gray-200">{user.email || localUser?.email || 'N/A'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Role:</span>
          <span className="font-semibold text-gray-800 dark:text-gray-200 capitalize">{user.role || localUser?.role || 'N/A'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Phone:</span>
          <span className="font-semibold text-gray-800 dark:text-gray-200">{user.phone || localUser?.phone || 'N/A'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Address:</span>
          <span className="font-semibold text-gray-800 dark:text-gray-200">{user.address || localUser?.address || 'N/A'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Active:</span>
          <span className="font-semibold text-gray-800 dark:text-gray-200">{user.isActive ? 'Yes' : 'No'}</span>
        </div>
        {/* Add other user details here if they exist in your user object */}
      </div>
    </div>
  );
}
