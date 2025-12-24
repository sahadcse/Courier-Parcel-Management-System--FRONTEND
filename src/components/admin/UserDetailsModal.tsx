'use client';

import { User } from '@/lib/adminSlice';
import { useCallback, useEffect, useState } from 'react';
import { UserCircle } from 'lucide-react';

interface UserDetailsModalProps {
  user: User;
  onClose: () => void;
}

// Helper component for a visually distinct status badge
const StatusBadge = ({ isActive }: { isActive: boolean }) => (
  <span
    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${isActive
      ? 'bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-400'
      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/10 dark:text-yellow-400'
      }`}
  >
    {isActive ? 'Active' : 'Pending'}
  </span>
);

// Helper component for consistent row styling
const DetailRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex flex-col py-2 sm:flex-row sm:items-center sm:justify-between">
    <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
    <span className="font-semibold text-gray-800 dark:text-gray-200">{value}</span>
  </div>
);


export default function UserDetailsModal({ user, onClose }: UserDetailsModalProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClose = useCallback(() => {
    setIsAnimating(false);
    setTimeout(onClose, 300); // Wait for animation before unmounting
  }, [onClose]);

  useEffect(() => {
    // Animate modal in
    const enterTimer = setTimeout(() => setIsAnimating(true), 10);
    // Add keyboard listener for 'Escape' key
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    // Prevent background page from scrolling
    document.body.style.overflow = 'hidden';

    return () => {
      clearTimeout(enterTimer);
      window.removeEventListener('keydown', handleKeyDown);
      // Restore background scroll on unmount
      document.body.style.overflow = 'unset';
    };
  }, [handleClose]);

  return (
    <div
      onClick={handleClose}
      className={`fixed inset-0 z-50 flex items-end bg-black/50 backdrop-blur-sm transition-opacity duration-300 sm:items-center sm:justify-center ${isAnimating ? 'opacity-100' : 'opacity-0'}`}
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full rounded-t-xl bg-white transition-all duration-300 dark:bg-gray-800 sm:max-w-md sm:rounded-xl ${isAnimating
          ? 'translate-y-0 opacity-100 sm:scale-100'
          : 'translate-y-full opacity-0 sm:translate-y-0 sm:scale-95'
          }`}
      >
        {/* --- Header with Avatar --- */}
        <header className="flex flex-col items-center p-6 text-center">
          <button
            onClick={handleClose}
            className="absolute right-6 top-6 rounded-lg bg-gray-300 px-3 py-1.5 text-sm font-semibold text-gray-900 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            Close
          </button>
          <div className="rounded-full bg-primary-100 p-3 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400">
            <UserCircle size={40} strokeWidth={1.5} />

          </div>
          <h2 className="mt-2 text-xl font-bold text-gray-900 dark:text-white">{user.customerName}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
          <div className="mt-3">
            <StatusBadge isActive={user.isActive} />
          </div>
        </header>

        {/* --- Body with Details --- */}
        <div className="border-y px-6 py-2 dark:border-gray-700 mb-14">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            <DetailRow label="Role" value={<span className="capitalize">{user.role}</span>} />
            <DetailRow label="Phone" value={user.phone ?? 'N/A'} />
            <DetailRow label="Address" value={user.address ?? 'N/A'} />
            <DetailRow label="User ID" value={<span className="font-mono text-xs">{user._id}</span>} />
          </div>
        </div>

      </div>
    </div>
  );
}