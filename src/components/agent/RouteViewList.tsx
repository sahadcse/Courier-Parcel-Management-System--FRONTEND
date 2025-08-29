// RouteViewList.tsx

'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import dynamic from 'next/dynamic';

const SingleRouteMap = dynamic(() => import('./SingleRouteMap'), {
  ssr: false,
  loading: () => <div className="h-[300px] bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">Loading map...</div>,
});

export default function RouteViewList() {
  const { parcels } = useSelector((state: RootState) => state.parcels);
  const [agentLocation, setAgentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [expandedParcelId, setExpandedParcelId] = useState<string | null>(null);

  // --- DEBUGGING LOG ---
  // This will show you exactly what parcel data the component is receiving from Redux.
//   console.log("Parcels available in RouteViewList:", parcels);
  // ---------------------

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setAgentLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocationError(null);
      },
      () => {
        setLocationError("Could not get your current location. Please enable location services.");
      }
    );
  }, []);

  const activeParcels = useMemo(() =>
    parcels.filter(p => (p.status === 'Assigned' || p.status === 'Picked Up' || p.status === 'In Transit') && p.deliveryCoordinates),
    [parcels]
  );

  const handleToggleRoute = (id: string) => {
    setExpandedParcelId(prevId => (prevId === id ? null : id));
  };

  return (
    <div className="space-y-4">
      {locationError && <div className="p-4 bg-red-100 text-red-700 rounded-lg">{locationError}</div>}
      
      {activeParcels.length > 0 ? (
        activeParcels.map((parcel, index) => (
          <div key={parcel._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md border dark:border-gray-700 transition-all duration-300">
            <div className="p-4 flex justify-between items-center">
              <div>
                <p className="font-bold">{index + 1}. {parcel.receiverName}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Parcel ID: {parcel.parcelId}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{parcel.deliveryAddress}</p>
              </div>
              <button
                onClick={() => handleToggleRoute(parcel._id)}
                disabled={!agentLocation}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50"
              >
                {expandedParcelId === parcel._id ? 'Hide Route' : 'Show Route'}
              </button>
            </div>
            
            {expandedParcelId === parcel._id && agentLocation && (
              <div className="p-2 border-t dark:border-gray-700">
                <SingleRouteMap
                  start={agentLocation}
                  end={{
                    lat: parcel.deliveryCoordinates!.coordinates[1],
                    lng: parcel.deliveryCoordinates!.coordinates[0],
                  }}
                />
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg">
          <p className="font-semibold">No active deliveries to route.</p>
        </div>
      )}
    </div>
  );
}
