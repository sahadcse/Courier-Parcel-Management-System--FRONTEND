'use client';

import { User } from '@/lib/adminSlice';

interface UserDetailsModalProps {
  user: User;
  onClose: () => void;
}

export default function UserDetailsModal({ user, onClose }: UserDetailsModalProps) {
  return (
    // Backdrop
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
    >
      {/* Modal Content */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md relative"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl font-bold mb-4">{user.customerName}</h2>
        
        <div className="space-y-3 text-sm border-t pt-4 dark:border-gray-700">
            <p className="flex justify-between">
                <span className="text-gray-500">Role:</span>
                <span className="font-semibold capitalize">{user.role}</span>
            </p>
            <p className="flex justify-between">
                <span className="text-gray-500">Email:</span>
                <span className="font-semibold">{user.email}</span>
            </p>
            <p className="flex justify-between">
                <span className="text-gray-500">Status:</span>
                <span className={`font-semibold ${user.isActive ? 'text-green-600' : 'text-yellow-600'}`}>
                    {user.isActive ? 'Active' : 'Pending'}
                </span>
            </p>
            <p className="flex justify-between">
                <span className="text-gray-500">ID:</span>
                <span className="font-semibold">{user._id}</span>
            </p>
            <p className="flex justify-between">
                <span className="text-gray-500">Address:</span>
                <span className="font-semibold">{user.address ?? 'N/A'}</span>
            </p>
            <p className="flex justify-between">
                <span className="text-gray-500">Phone:</span>
                <span className="font-semibold">{user.phone ?? 'N/A'}</span>
            </p>
        </div>
      </div>
    </div>
  );
}
