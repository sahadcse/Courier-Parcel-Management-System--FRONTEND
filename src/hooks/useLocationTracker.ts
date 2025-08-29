// useLocationTracker.ts
'use client';

import { useEffect, useRef, useCallback } from 'react';
import api from '@/lib/axios';

// This hook will watch the user's position and send updates
export function useLocationTracker(activeParcelId: string | null) {
  const watchIdRef = useRef<number | null>(null);
  const lastSentLocationRef = useRef<{ lat: number; lng: number } | null>(null);
  const lastSentTimeRef = useRef<number>(0);

  // Function to calculate distance between two points
  const calculateDistance = useCallback((lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lng2-lng1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distance in meters
  }, []);

  const sendLocationUpdate = useCallback(async (parcelId: string, lat: number, lng: number) => {
    try {
      const response = await api.post('/track', {
        parcelId,
        coordinates: { lat, lng },
      });
      console.log('✅ Location update sent:', { lat, lng });
      if(response.data && response.data.success) {
        return response.data;
      }
    } catch (error) {
      console.error('❌ Failed to send location update:', error);
    }
  }, []);

  useEffect(() => {
    // If there's no active parcel, stop tracking
    if (!activeParcelId) {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
        console.log('🔴 Location tracking stopped - no active parcel');
      }
      return;
    }

    // Check if geolocation is supported
    if (!navigator.geolocation) {
      console.error('❌ Geolocation is not supported by this browser');
      return;
    }

    console.log('🟢 Starting location tracking for parcel:', activeParcelId);

    // Start tracking if there is an active parcel
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const now = Date.now();
        
        // Only send updates if:
        // 1. It's been more than 10 seconds since last update, OR
        // 2. The user has moved more than 10 meters
        const timeSinceLastUpdate = now - lastSentTimeRef.current;
        const shouldSendTimeUpdate = timeSinceLastUpdate > 10000; // 10 seconds
        
        let shouldSendDistanceUpdate = false;
        if (lastSentLocationRef.current) {
          const distance = calculateDistance(
            lastSentLocationRef.current.lat,
            lastSentLocationRef.current.lng,
            latitude,
            longitude
          );
          shouldSendDistanceUpdate = distance > 10; // 10 meters
        }

        if (shouldSendTimeUpdate || shouldSendDistanceUpdate || !lastSentLocationRef.current) {
          sendLocationUpdate(activeParcelId, latitude, longitude);
          lastSentLocationRef.current = { lat: latitude, lng: longitude };
          lastSentTimeRef.current = now;
        }
      },
      (error) => {
        let errorMessage = 'Unknown geolocation error';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
        }
        console.warn('⚠️ Geolocation error:', errorMessage);
        
        // For timeout errors, we don't need to stop tracking completely
        if (error.code !== error.TIMEOUT) {
          console.error('🔴 Stopping location tracking due to error:', errorMessage);
          if (watchIdRef.current !== null) {
            navigator.geolocation.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
          }
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 20000, // Reduced from 30000 to 10000
        maximumAge: 30000, // Reduced from 60000 to 20000
      }
    );

    // Cleanup function to stop watching when the component unmounts or parcel changes
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        console.log('🔴 Location tracking stopped - component unmounted');
      }
    };
  }, [activeParcelId, calculateDistance, sendLocationUpdate]);
}