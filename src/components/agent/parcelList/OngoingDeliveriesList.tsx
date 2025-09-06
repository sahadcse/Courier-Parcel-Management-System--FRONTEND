'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/lib/store';
import { updateParcelStatus } from '@/lib/parcelSlice';
import { Parcel } from '@/types';
import { useClientTranslation } from '@/hooks/useClientTranslation';

interface OngoingDeliveriesListProps {
  parcels: Parcel[];
  onViewDetails: (parcel: Parcel) => void;
}

export default function OngoingDeliveriesList({ parcels, onViewDetails }: OngoingDeliveriesListProps) {
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

  const getNextStatusOptions = (currentStatus: Parcel['status']) => {
    if (currentStatus === 'Picked Up') return ['Picked Up', 'In Transit', 'Delivered', 'Failed'];
    if (currentStatus === 'In Transit') return ['In Transit', 'Delivered', 'Failed'];
    return [currentStatus];
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2 text-gray-600 dark:text-gray-400">
        {t('ongoing_deliveries')} ({parcels.length})
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {parcels.length > 0 ? (
          parcels.map((parcel) => {
            const availableStatuses = getNextStatusOptions(parcel.status);
            const isFinalStatus = parcel.status === 'Delivered' || parcel.status === 'Failed';
            return (
              <div key={parcel._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md border dark:border-gray-700 flex flex-col justify-between">
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-mono text-sm text-gray-500 dark:text-gray-400">{parcel.parcelId}</p>
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">{t('live_tracking')}</span>
                  </div>
                  <p className="font-semibold text-gray-800 dark:text-white">To: {parcel.receiverName}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{parcel.deliveryAddress}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-3 flex items-center justify-between gap-2 border-t dark:border-gray-700 rounded-b-lg">
                  <button onClick={() => onViewDetails(parcel)} className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-500">{t('view_details')}</button>
                  <div className="flex items-center gap-2">
                    <select onChange={(e) => handleStatusChange(parcel.parcelId, e.target.value)} className="p-2 border rounded text-sm w-full" defaultValue={parcel.status} disabled={isFinalStatus}>
                      {availableStatuses.map((status) => (<option key={status} value={status}>{status}</option>))}
                    </select>
                    <button onClick={() => handleUpdate(parcel.parcelId)} className="bg-primary-500 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-primary-700 disabled:opacity-50" disabled={isFinalStatus || !selectedStatus[parcel.parcelId] || selectedStatus[parcel.parcelId] === parcel.status}>
                      {t('update')}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="col-span-full text-center text-gray-500 py-4">{t('no_parcels_in_transit')}</p>
        )}
      </div>
    </div>
  );
}