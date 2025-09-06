'use client';

import { Parcel } from '@/types';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ExternalLink, X } from 'lucide-react';

interface InvoiceModalProps {
  parcel: Parcel;
  onClose: () => void;
}

export default function InvoiceModal({ parcel, onClose }: InvoiceModalProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(true), 10);
    // Add escape key listener
    const handleKeyDown = (e: KeyboardEvent) => e.key === 'Escape' && handleClose();
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(onClose, 300); // Wait for animation
  };

  return (
    <div
      onClick={handleClose}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-md rounded-xl bg-white p-6 shadow-2xl transition-all duration-300 dark:bg-gray-800 ${isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
      >
        <header className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Invoice Summary</h2>
            <p className="text-sm font-semibold text-primary-600 dark:text-primary-400">{parcel.parcelId}</p>
          </div>
          <button onClick={handleClose} className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700">
            <X size={20} />
          </button>
        </header>

        <div className="my-6 space-y-3 border-y py-4 dark:border-gray-700">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Receiver:</span>
            <span className="font-medium text-gray-800 dark:text-gray-200">{parcel.receiverName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Payment Type:</span>
            <span className="font-medium text-gray-800 dark:text-gray-200">{parcel.paymentType}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Amount Due:</span>
            <span className="font-bold text-primary-600 dark:text-primary-400">
              {parcel.paymentType === 'COD' ? `${parcel.codAmount || 0} BDT` : 'Paid'}
            </span>
          </div>
        </div>

        <footer className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={handleClose}
            className="w-full rounded-lg px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:text-gray-300 dark:ring-gray-600 dark:hover:bg-gray-700"
          >
            Close
          </button>
          <Link
            href={`/admin/invoice/${parcel.parcelId}`}
            target="_blank" // Opens the full invoice in a new tab
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white bg-black hover:bg-primary-700"
          >
            <ExternalLink size={16} />
            View Full Invoice
          </Link>
        </footer>
      </div>
    </div>
  );
}
