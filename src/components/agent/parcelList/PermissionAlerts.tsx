'use client';

import { useState, useEffect, useMemo } from 'react';
import { useLocationTracker } from '@/hooks/useLocationTracker';
import { useClientTranslation } from '@/hooks/useClientTranslation';
import { Parcel } from '@/types';

interface PermissionAlertsProps {
  ongoingDeliveries: Parcel[];
}

export default function PermissionAlerts({ ongoingDeliveries }: PermissionAlertsProps) {
  const { t } = useClientTranslation();
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt' | 'unknown'>('unknown');

  const activeParcelForTracking = useMemo(() => ongoingDeliveries[0], [ongoingDeliveries]);

  // Effect to check and monitor location permission status
  useEffect(() => {
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        setLocationPermission(result.state);
        result.onchange = () => setLocationPermission(result.state);
      });
    }
  }, []);

  // Custom hook to start tracking when a parcel is active
  useLocationTracker(activeParcelForTracking ? activeParcelForTracking.parcelId : null);

  const requestLocationPermission = () => {
    navigator.geolocation.getCurrentPosition(
      () => setLocationPermission('granted'),
      () => setLocationPermission('denied')
    );
  };

  if (!activeParcelForTracking) {
    return null; // Don't show any alerts if there are no ongoing deliveries
  }

  return (
    <>
      {locationPermission !== 'granted' && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 flex items-center justify-between rounded-r-lg">
          <strong>{t('location_access_required')}</strong>
          {locationPermission !== 'denied' && (
            <button onClick={requestLocationPermission} className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600">
              {t('enable')}
            </button>
          )}
        </div>
      )}
      {locationPermission === 'granted' && (
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-800 p-4 rounded-r-lg">
          {t('currently_tracking', { parcelId: activeParcelForTracking.parcelId })}
        </div>
      )}
    </>
  );
}