'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/lib/store';
import { updateParcelStatus } from '@/lib/parcelSlice';
import { Parcel } from '@/types';
import { useClientTranslation } from '@/hooks/useClientTranslation';

interface PendingPickupsListProps {
  parcels: Parcel[];
  onViewDetails: (parcel: Parcel) => void;
  onViewInvoice: (parcel: Parcel) => void;
}

export default function PendingPickupsList({ parcels, onViewDetails, onViewInvoice }: PendingPickupsListProps) {
  const { t } = useClientTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const [selectedStatus, setSelectedStatus] = useState<{ [key: string]: string }>({});

  const handleStatusChange = (parcelId: string, status: string) => {
    setSelectedStatus((prev) => ({ ...prev, [parcelId]: status }));
  };

  const handleUpdate = (parcelId: string) => {
    const status = selectedStatus[parcelId];
    if (status) {
      dispatch(updateParcelStatus({ parcelId, status }));
    }
  };

  // Status options are simpler here
  const availableStatuses = ['Assigned', 'Picked Up'];

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2 text-gray-600 dark:text-gray-400">
        {t('pending_pickups')} ({parcels.length})
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {parcels.length > 0 ? (
          parcels.map((parcel) => (
            <div key={parcel._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md border dark:border-gray-700 flex flex-col justify-between">
              <div className="p-4">
                <p className="font-mono text-sm text-gray-500 dark:text-gray-400">{parcel.parcelId}</p>
                <p className="font-semibold text-gray-800 dark:text-white">To: {parcel.receiverName}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{parcel.pickupAddress}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 p-3 flex items-center justify-between gap-2 border-t dark:border-gray-700 rounded-b-lg">
                <div className="flex gap-1">
                  <button onClick={() => onViewDetails(parcel)} className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-500">{t('view_details')}</button>
                  <button onClick={() => onViewInvoice(parcel)} className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-500">{t('invoice')}</button>
                </div>
                <div className="flex items-center gap-2">
                  <select onChange={(e) => handleStatusChange(parcel.parcelId, e.target.value)} className="p-2 border rounded text-sm w-full" defaultValue={parcel.status}>
                    {availableStatuses.map((status) => (<option key={status} value={status}>{status}</option>))}
                  </select>
                  <button onClick={() => handleUpdate(parcel.parcelId)} className="bg-primary-500 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-primary-700 disabled:opacity-50" disabled={!selectedStatus[parcel.parcelId] || selectedStatus[parcel.parcelId] === parcel.status}>
                    {t('update')}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500 py-4">{t('no_parcels_for_pickup')}</p>
        )}
      </div>
    </div>
  );
}