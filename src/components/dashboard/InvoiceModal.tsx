'use client';

import { Parcel } from '@/types';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ExternalLink, X } from 'lucide-react';

interface InvoiceModalProps {
  parcel: Parcel;
  onClose: () => void;
  userRole?: 'admin' | 'agent' | 'customer';
}

export default function InvoiceModal({ parcel, onClose, userRole }: InvoiceModalProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(true), 10);
    const handleKeyDown = (e: KeyboardEvent) => e.key === 'Escape' && handleClose();
    window.addEventListener('keydown', handleKeyDown);

    // Prevent background page from scrolling
    document.body.style.overflow = 'hidden';

    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
      // Restore background scroll on unmount
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(onClose, 300);
  };

  const fullInvoiceLink = userRole ? `/${userRole}/invoice/${parcel.parcelId}` : '#';

  return (
    <div
      onClick={handleClose}
      className={`fixed inset-0 z-50 flex items-end bg-black/50 backdrop-blur-sm transition-opacity duration-300 sm:items-center sm:justify-center ${isAnimating ? 'opacity-100' : 'opacity-0'}`}
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full rounded-t-xl bg-white p-6 shadow-2xl transition-all duration-300 dark:bg-gray-800 sm:max-w-md sm:rounded-xl ${
          isAnimating
            ? 'translate-y-0 opacity-100 sm:scale-100'
            : 'translate-y-full opacity-0 sm:translate-y-0 sm:scale-95'
        }`}
      >
        <header className="flex items-center justify-between ">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Invoice Summary</h2>
            <p className="text-sm font-semibold text-primary-600 dark:text-primary-400">
              {parcel.parcelId}
            </p>
          </div>
          <button
            onClick={handleClose}
            className=" rounded-lg bg-gray-800 text-gray-100 dark:bg-white dark:text-gray-800 py-1 px-2.5 cursor-pointer"
            aria-label="Close modal"
          >
            Close
          </button>
        </header>

        <div className="my-6 space-y-3 border-y py-4 dark:border-gray-700">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Receiver:</span>
            <span className="font-medium text-gray-800 dark:text-gray-200">
              {parcel.receiverName}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Payment Type:</span>
            <span className="font-medium text-gray-800 dark:text-gray-200">
              {parcel.paymentType}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Amount Due:</span>
            <span className="font-bold text-primary-600 dark:text-primary-400">
              {parcel.paymentType === 'COD' ? `${parcel.codAmount || 0} BDT` : 'Paid'}
            </span>
          </div>
        </div>

        <footer className="flex flex-col gap-2 sm:flex-row mb-12 sm:mb-0 sm:gap-4">
          
          {userRole && (
            <Link
              href={fullInvoiceLink}
              target="_blank"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white bg-black hover:bg-primary-700"
            >
              <ExternalLink size={16} />
              View Full Invoice
            </Link>
          )}
        </footer>
      </div>
    </div>
  );
}