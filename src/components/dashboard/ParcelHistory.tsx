// src/components/dashboard/ParcelHistory.tsx
'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/store';
import { fetchParcels } from '@/lib/parcelSlice';
import ParcelDetailsModal from './ParcelDetailsModal';
import { Parcel } from '@/types';
import InvoiceModal from './InvoiceModal';

interface ParcelHistoryProps {
  onTrackClick: (parcelId: string) => void;
}

export default function ParcelHistory({ onTrackClick }: ParcelHistoryProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { parcels, loading, error } = useSelector((state: RootState) => state.parcels);
  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null);
  const [invoiceParcel, setInvoiceParcel] = useState<Parcel | null>(null);

  useEffect(() => {
    dispatch(fetchParcels());
  }, [dispatch]);

  if (loading === 'pending') {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        <span className="ml-2">Loading parcel history...</span>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 bg-red-100 p-4 rounded-lg">Error: {error}</div>;
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
          Booking History
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {parcels.length > 0 ? (
            parcels.map(parcel => {
              const statusStyles = {
                Delivered: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
                'In Transit': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
                'Picked Up': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300',
                Failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
                Default: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
              };
              const currentStatusStyle =
                statusStyles[parcel.status as keyof typeof statusStyles] || statusStyles['Default'];

              return (
                <div
                  key={parcel._id || parcel.parcelId}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md border dark:border-gray-700 flex flex-col justify-between transition-transform hover:scale-105"
                >
                  {/* Main Content */}
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-mono text-sm text-gray-500 dark:text-gray-400">
                        {parcel.parcelId}
                      </p>
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${currentStatusStyle}`}
                      >
                        {parcel.status}
                      </span>
                    </div>
                    <p className="font-semibold text-lg text-gray-800 dark:text-white">
                      To: {parcel.receiverName}
                    </p>
                  </div>

                  {/* Action Buttons Footer */}
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-3 flex items-center justify-end gap-2 border-t dark:border-gray-700 rounded-b-lg">
                    <button
                      onClick={() => setInvoiceParcel(parcel)}
                      className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-500 px-3 py-1"
                    >
                      Invoice
                    </button>
                    <button
                      onClick={() => setSelectedParcel(parcel)}
                      className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 px-3 py-1 cursor-pointer"
                    >
                      View Details
                    </button>
                    {(parcel.status === 'Picked Up' || parcel.status === 'In Transit') && (
                      <button
                        onClick={() => onTrackClick(parcel.parcelId)}
                        className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-semibold hover:bg-blue-700 transition-colors shadow cursor-pointer"
                      >
                        Track
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-10 text-gray-500 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p>You have not booked any parcels yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* Conditionally render the modal */}
      {selectedParcel && (
        <ParcelDetailsModal parcel={selectedParcel} onClose={() => setSelectedParcel(null)} />
      )}
      {invoiceParcel && (
        <InvoiceModal parcel={invoiceParcel} onClose={() => setInvoiceParcel(null)} />
      )}
    </>
  );
}
