'use client';

import { Parcel } from '@/types';
import { useEffect, useState } from 'react';
import StatusTimeline from "./../common/ParcelStatus";

interface ParcelDetailsModalProps {
  parcel: Parcel;
  onClose: () => void;
}

export default function ParcelDetailsModal({ parcel, onClose }: ParcelDetailsModalProps) {
  const [isAnimating, setIsAnimating] =useState(false);

  useEffect(() => {
    // Animate modal in
    const enterTimer = setTimeout(() => setIsAnimating(true), 10);

    // Add keyboard listener for 'Escape' key
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    // --- FIX #1: Prevent background page from scrolling ---
    // On mount, hide the body's scrollbar
    document.body.style.overflow = 'hidden';

    // Cleanup function to run when the component unmounts
    return () => {
      clearTimeout(enterTimer);
      window.removeEventListener('keydown', handleKeyDown);
      // On unmount, restore the body's scrollbar
      document.body.style.overflow = 'unset';
    };
  }, []); // Empty dependency array ensures this runs only on mount and unmount

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(onClose, 300); // Wait for animation before unmounting
  };

  return (
    <div
      onClick={handleClose}
      className={`fixed inset-0 z-50 mb-8 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300 ease-in-out
        ${isAnimating ? 'opacity-100' : 'opacity-0'}
      `}
      role="dialog"
      aria-modal="true"
      aria-labelledby="parcel-details-title"
    >
      {/* Modal Panel: Centered on desktop, bottom sheet on mobile */}
      <div
        onClick={(e) => e.stopPropagation()}
        // --- FIX #2: Removed 'h-auto' to allow internal scrolling to work correctly ---
        className={`relative flex max-h-[90vh] w-full flex-col overflow-hidden rounded-t-xl bg-white shadow-2xl transition-all duration-300 ease-in-out dark:bg-gray-800
          sm:max-w-md sm:rounded-xl
          ${isAnimating
            ? 'translate-y-0 sm:scale-100 sm:opacity-100'
            : 'translate-y-full sm:scale-95 sm:opacity-0'
          }
        `}
      >
        {/* Modal Header */}
        <header className="flex flex-shrink-0 items-center justify-between border-b p-4 dark:border-gray-700">
          <div>
            <h2 id="parcel-details-title" className="text-xl font-bold text-gray-900 dark:text-white">
              Parcel Details
            </h2>
            <p className="text-sm font-semibold text-primary-600 dark:text-primary-400">{parcel.parcelId}</p>
          </div>
          <button
            onClick={handleClose}
            aria-label="Close modal"
            className="rounded-lg px-3 py-1 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:text-gray-300 dark:ring-gray-600 dark:hover:bg-gray-700"
          >
            Close
          </button>
        </header>

        {/* Modal Body (This will now scroll correctly) */}
        <div className="flex-1 space-y-6 overflow-y-auto p-6 mb-6">
          <StatusTimeline status={parcel.status} />
          {/* Details Grid */}
          <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">Receiver Name</p>
              <p className="font-semibold text-gray-800 dark:text-gray-200">{parcel.receiverName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Receiver Number</p>
              <p className="font-semibold text-gray-800 dark:text-gray-200">{parcel.receiverNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Parcel Type</p>
              <p className="font-semibold text-gray-800 dark:text-gray-200">{parcel.parcelType}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">Pickup Address</p>
              <p className="font-semibold text-gray-800 dark:text-gray-200">{parcel.pickupAddress}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">Delivery Address</p>
              <p className="font-semibold text-gray-800 dark:text-gray-200">{parcel.deliveryAddress}</p>
            </div>
            <div className="sm:col-span-2 border-t pt-4 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">Payment</p>
              <p className="font-semibold text-gray-800 dark:text-gray-200">
                {parcel.paymentType}
                {parcel.paymentType === 'COD' && ` (${parcel.codAmount} BDT)`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}