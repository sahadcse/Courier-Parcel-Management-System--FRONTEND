// RouteViewList.tsx

'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import dynamic from 'next/dynamic';

import { MapPin, ChevronDown } from 'lucide-react';
import clsx from 'clsx';

const SingleRouteMap = dynamic(() => import('./SingleRouteMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
      Loading map...
    </div>
  ),
});

export default function RouteViewList() {
  const { parcels } = useSelector((state: RootState) => state.parcels);
  const [agentLocation, setAgentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [expandedParcelId, setExpandedParcelId] = useState<string | null>(null);

  const isExpanded = (id: string) => expandedParcelId === id;

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      position => {
        setAgentLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocationError(null);
      },
      () => {
        setLocationError('Could not get your current location. Please enable location services.');
      },
    );
  }, []);

  const activeParcels = useMemo(
    () =>
      parcels.filter(
        p => ['Assigned', 'Picked Up', 'In Transit'].includes(p.status) && p.deliveryCoordinates,
      ),
    [parcels],
  );

  const handleToggleRoute = (id: string) => {
    setExpandedParcelId(prevId => (prevId === id ? null : id));
  };

  return (
    <div className="space-y-4">
      {locationError && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">{locationError}</div>
      )}

      {activeParcels.length > 0 ? (
        activeParcels.map((parcel, index) => (
          <article
            key={parcel._id}
            className="overflow-hidden rounded-lg border bg-white shadow-sm transition-shadow duration-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
          >
            <header className="flex flex-col items-start gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {index + 1}. {parcel.receiverName}
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Parcel ID: {parcel.parcelId}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{parcel.deliveryAddress}</p>
              </div>
              <button
                onClick={() => handleToggleRoute(parcel._id)}
                disabled={!agentLocation}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold  transition-colors hover:bg-primary-700 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                {expandedParcelId === parcel._id ? 'Hide Route' : 'Show Route'}
                <ChevronDown
                  size={16}
                  className={clsx(
                    'transition-transform duration-300',
                    isExpanded(parcel._id) && 'rotate-180',
                  )}
                />
              </button>
            </header>

            <div
              className={clsx(
                'grid transition-[grid-template-rows] duration-300 ease-in-out',
                isExpanded(parcel._id) ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
              )}
            >
              <div className="overflow-hidden">
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
            </div>
          </article>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-gray-200 bg-white py-12 text-center dark:border-gray-700 dark:bg-gray-800">
          <MapPin size={40} className="text-gray-400" />
          <p className="font-semibold text-gray-600 dark:text-gray-400">
            No active deliveries to route.
          </p>
        </div>
      )}
    </div>
  );
}
