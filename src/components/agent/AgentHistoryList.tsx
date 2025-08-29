// agentHistoryList.tsx
'use client';

import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { Parcel } from '@/types';
import ParcelDetailsModal from '../dashboard/ParcelDetailsModal';

// 1. Define the props interface correctly
interface AgentHistoryListProps {
  parcels: Parcel[];
}

// 2. Accept the props object and destructure 'parcels' from it
export default function AgentHistoryList({ parcels }: AgentHistoryListProps) {
  const { loading, error } = useSelector((state: RootState) => state.parcels);
  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null);


  const historicalParcels = useMemo(() =>
    parcels.filter(p => p.status === 'Delivered' || p.status === 'Failed'),
    [parcels]
  );

  if (loading === 'pending') {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        <span className="ml-2">Loading delivery history...</span>
      </div>
    );
  }
  
  if (error) {
     return <div className="text-red-500 bg-red-100 p-4 rounded-lg">Error: {error}</div>;
  }

  return (
    <>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Completed & Failed Deliveries</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {historicalParcels.length > 0 ? (
            historicalParcels.map(parcel => {
              const isDelivered = parcel.status === 'Delivered';
              const statusStyle = isDelivered
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';

              return (
                <div key={parcel._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md border dark:border-gray-700 flex flex-col justify-between">
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-mono text-sm text-gray-500 dark:text-gray-400">{parcel.parcelId}</p>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyle}`}>
                        {parcel.status}
                      </span>
                    </div>
                    <p className="font-semibold text-lg text-gray-800 dark:text-white">To: {parcel.receiverName}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{parcel.deliveryAddress}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-3 flex items-center justify-end border-t dark:border-gray-700 rounded-b-lg">
                    <button
                      onClick={() => setSelectedParcel(parcel)}
                      className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 px-3 py-1"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-10 text-gray-500 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p>No delivery history found.</p>
            </div>
          )}
        </div>
      </div>
      
      {selectedParcel && (
        <ParcelDetailsModal 
          parcel={selectedParcel} 
          onClose={() => setSelectedParcel(null)} 
        />
      )}
    </>
  );
}
