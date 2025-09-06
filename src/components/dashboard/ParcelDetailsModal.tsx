'use client';

import { Parcel } from '@/types';
import { useEffect, useState } from 'react';
import StatusTimeline from "./../common/ParcelStatus";
import { X } from 'lucide-react';

interface ParcelDetailsModalProps {
  parcel: Parcel;
  onClose: () => void;
}

export default function ParcelDetailsModal({ parcel, onClose }: ParcelDetailsModalProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const enterTimer = setTimeout(() => setIsAnimating(true), 10);
    return () => clearTimeout(enterTimer);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(onClose, 300);
  };

  const handleModalContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      onClick={handleClose}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300 ease-in-out
        ${isAnimating ? 'opacity-100' : 'opacity-0'}
      `}
      role="dialog"
      aria-modal="true"
      aria-labelledby="parcel-details-title"
    >
      {/* Modal Panel with responsive width, max-height, and animations */}
      <div
        onClick={handleModalContentClick}
        className={`relative flex w-full max-w-2xl flex-col rounded-xl bg-white shadow-2xl transition-all duration-300 ease-in-out dark:bg-gray-800 mx-4 max-h-[90vh]
          ${isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
        `}
      >
        {/* Modal Header */}
        <header className="flex items-center justify-between border-b p-4 dark:border-gray-700">
          <div>
            <h2 id="parcel-details-title" className="text-xl font-bold text-gray-900 dark:text-white">
              Parcel Details
            </h2>
            <p className="text-sm font-semibold text-primary-600 dark:text-primary-400">{parcel.parcelId}</p>
          </div>
          <button
            onClick={handleClose}
            aria-label="Close modal"
            className="rounded-full p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
          >
            <X size={24} />
          </button>
        </header>

        {/* Modal Body (Scrollable Content) */}
        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          {/* Status Timeline */}
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