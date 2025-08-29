// src/components/dashboard/TrackParcel.tsx

'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/axios';
import { isApiError, PublicTrackingInfo, TrackingPoint } from '@/types';
import { useSocket } from '@/hooks/useRealtimeParcels';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

// Dynamically import the map component to prevent SSR issues
const LeafletMap = dynamic(() => import('@/components/maps/LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
      Loading map...
    </div>
  ),
});

export default function TrackParcel({ initialParcelId }: { initialParcelId: string | null }) {
  const [parcelIdInput, setParcelIdInput] = useState(initialParcelId || '');
  const [trackingInfo, setTrackingInfo] = useState<PublicTrackingInfo | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const socket = useSocket();
  const [liveLocation, setLiveLocation] = useState<{ lat: number; lng: number } | null>(null);

  const handleTrack = useCallback(async () => {
    if (!parcelIdInput.trim()) return;

    setLoading(true);
    setError('');
    setTrackingInfo(null);
    setLiveLocation(null);

    try {
      const response = await api.get(`/track/${parcelIdInput.trim()}`);
      const data: PublicTrackingInfo = response.data.data;
      setTrackingInfo(data);

      console.log('Initial tracking data:', data);

      if (data.trackingHistory && data.trackingHistory.length > 0) {
        const lastKnownLocation = data.trackingHistory[data.trackingHistory.length - 1];
        setLiveLocation(lastKnownLocation.coordinates);
        console.log('Last known location set to:', lastKnownLocation.coordinates);
      }
    } catch (err: unknown) {
      if (isApiError(err)) {
        setError(err.response?.data?.message || 'Parcel not found.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [parcelIdInput]);

  useEffect(() => {
    if (initialParcelId) {
      setParcelIdInput(initialParcelId);
      handleTrack();
    }
  }, [initialParcelId, handleTrack]);

  useEffect(() => {
    if (!socket || !trackingInfo) return;
    const handleTrackingUpdate = (data: {
      parcelId: string;
      coordinates: { lat: number; lng: number };
    }) => {
      if (data.parcelId === trackingInfo.parcelId) {
        setLiveLocation(data.coordinates);
      }
    };
    socket.on('tracking:updated', handleTrackingUpdate);
    return () => {
      socket.off('tracking:updated', handleTrackingUpdate);
    };
  }, [trackingInfo, socket]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTrack();
    }
  };

  const statusStyles = {
    Delivered: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    'In Transit': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    'Picked Up': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300',
    Assigned: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    Booked: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    Failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
        Track Your Parcel
      </h2>
      <div className="flex gap-2 mb-4">
        <input
          value={parcelIdInput}
          onChange={e => setParcelIdInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter Tracking ID"
          className="flex-grow p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          disabled
        />
        <button
          onClick={handleTrack}
          disabled={loading || !parcelIdInput.trim()}
          className="bg-secondary-500 text-white px-6 py-3 rounded-lg hover:bg-secondary-700 disabled:opacity-50"
        >
          {loading ? 'Tracking...' : 'Track'}
        </button>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

      {trackingInfo && (
        <div className="mt-6 border-t pt-6 dark:border-gray-700">
          {liveLocation && (
            <div
              className="mb-6 bg-green-100 border-l-4 border-green-500 text-green-800 p-4 rounded-r-lg dark:bg-green-900 dark:text-green-200"
              role="alert"
            >
              <p className="font-bold">📍 Live Tracking Active</p>
              <p>This parcel&apos;s location is being updated in real-time.</p>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-8">
            {/* --- Left Column: Details --- */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Tracking Details
                </h3>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 dark:text-gray-400">Status</span>
                    <span
                      className={`px-2.5 py-1 rounded-full font-medium text-xs ${statusStyles[trackingInfo.status] || ''}`}
                    >
                      {trackingInfo.status}
                    </span>
                  </div>
                  <div className="flex items-start gap-3 border-t pt-3 dark:border-gray-600">
                    <span className="mt-1 text-lg">🏠</span>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400 block">Pickup Address</span>
                      <span className="font-medium text-gray-800 dark:text-gray-200">
                        {trackingInfo.pickupAddress}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="mt-1 text-lg">📍</span>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400 block">
                        Destination Address
                      </span>
                      <span className="font-medium text-gray-800 dark:text-gray-200">
                        {trackingInfo.deliveryAddress}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {trackingInfo.assignedAgent && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    Agent Information
                  </h3>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <span className="mt-1 text-lg">👤</span>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400 block">Agent Name</span>
                        <span className="font-medium text-gray-800 dark:text-gray-200">
                          {trackingInfo.assignedAgent.customerName}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="mt-1 text-lg">📞</span>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400 block">Contact</span>
                        <span className="font-medium text-gray-800 dark:text-gray-200">
                          {trackingInfo.assignedAgent.phone}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* --- Right Column: Map --- */}
            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                {liveLocation ? 'Live Location' : 'Last Known Location'}
              </h3>
              <div className="rounded-lg overflow-hidden shadow-md">
                <LeafletMap
                  currentPosition={liveLocation}
                  popupInfo={{
                    status: trackingInfo.status,
                    agent: trackingInfo.assignedAgent,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
