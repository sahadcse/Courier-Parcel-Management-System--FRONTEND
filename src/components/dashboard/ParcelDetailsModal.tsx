'use client';

import { Parcel } from '@/types';
import { useEffect, useState } from 'react';

interface ParcelDetailsModalProps {
  parcel: Parcel;
  onClose: () => void;
}

export default function ParcelDetailsModal({ parcel, onClose }: ParcelDetailsModalProps) {
  // State to control the enter/exit animation
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Trigger the "enter" animation shortly after the component mounts
    const timer = setTimeout(() => setIsAnimating(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsAnimating(false);
    // Wait for the "exit" animation to finish before calling the parent's onClose
    setTimeout(onClose, 300); // Duration should match the transition duration
  };

  // Prevent clicks inside the modal from closing it
  const handleModalContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    // Backdrop with blur and fade animation
    <div
      onClick={handleClose}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm transition-opacity duration-300 ease-in-out
        ${isAnimating ? 'opacity-100' : 'opacity-0'}
      `}
    >
      {/* Modal Content with scale and fade animation */}
      <div
        onClick={handleModalContentClick}
        className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg relative transform transition-all duration-300 ease-in-out
          ${isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
        `}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute cursor-pointer top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
          Parcel Details
        </h2>
        <p className="text-sm font-bold text-primary-500 mb-4">{parcel.parcelId}</p>

        <div className="space-y-3 text-sm border-t pt-4 dark:border-gray-700">
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Status:</span>
            <span className="font-semibold text-gray-800 dark:text-gray-200">{parcel.status}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Receiver Name:</span>
            <span className="font-semibold text-gray-800 dark:text-gray-200">{parcel.receiverName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Receiver Number:</span>
            <span className="font-semibold text-gray-800 dark:text-gray-200">{parcel.receiverNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Pickup Address:</span>
            <span className="font-semibold text-gray-800 dark:text-gray-200 text-right">{parcel.pickupAddress}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Delivery Address:</span>
            <span className="font-semibold text-gray-800 dark:text-gray-200 text-right">{parcel.deliveryAddress}</span>
          </div>
           <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Parcel Type:</span>
            <span className="font-semibold text-gray-800 dark:text-gray-200">{parcel.parcelType}</span>
          </div>
           <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Payment:</span>
            <span className="font-semibold text-gray-800 dark:text-gray-200">{parcel.paymentType} {parcel.paymentType === 'COD' && `(${parcel.codAmount} BDT)`}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
