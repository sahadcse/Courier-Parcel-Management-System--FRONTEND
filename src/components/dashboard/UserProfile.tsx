'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { useEffect, useState } from 'react';
import { AuthUser } from '@/lib/authSlice'; // <-- FIX: Import the correct 'AuthUser' type

export default function UserProfile() {
  const reduxUser = useSelector((state: RootState) => state.auth.user);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  // Safely get user data from Redux or localStorage only on the client-side
  useEffect(() => {
    if (reduxUser && reduxUser._id) {
      // Ensure reduxUser is not the initial empty state
      setCurrentUser(reduxUser);
    } else {
      const localUserStr = localStorage.getItem('user');
      if (localUserStr) {
        setCurrentUser(JSON.parse(localUserStr));
      }
    }
  }, [reduxUser]);

  if (!currentUser) {
    return (
      <div className="p-4 text-center">
        <p>Loading user profile...</p>
      </div>
    );
  }

  // Helper component for consistent row styling
  const ProfileRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
    // Stacks vertically by default, becomes a row on larger screens
    <div className="flex flex-col py-3 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
      <span className="font-semibold text-gray-800 dark:text-gray-200">{value}</span>
    </div>
  );

  return (
    // Container is full-width on mobile, becomes a card on larger screens
    <div className="w-full sm:mx-auto sm:mt-4 sm:max-w-lg sm:rounded-lg sm:bg-white sm:p-6 sm:shadow-md dark:sm:bg-gray-800">
      <div className="p-4 sm:p-0">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">My Profile</h2>
      </div>

      {/* Details list with dividers between items */}
      <div className="mt-4 divide-y divide-gray-200 border-y border-gray-200 p-4 dark:divide-gray-700 dark:border-gray-700 sm:border-none sm:p-0">
        <ProfileRow label="Name" value={currentUser.customerName || 'N/A'} />
        <ProfileRow label="Email" value={currentUser.email || 'N/A'} />
        <ProfileRow
          label="Role"
          value={<span className="capitalize">{currentUser.role || 'N/A'}</span>}
        />
        <ProfileRow label="Phone" value={currentUser.phone || 'N/A'} />
        <ProfileRow label="Address" value={currentUser.address || 'N/A'} />
        <ProfileRow label="Active" value={currentUser.isActive ? 'Yes' : 'No'} />
      </div>
    </div>
  );
}
