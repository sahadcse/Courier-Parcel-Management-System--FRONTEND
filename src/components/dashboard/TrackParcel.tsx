// src/components/dashboard/TrackParcel.tsx

'use client';

import api from '@/lib/api';

import { useState, useEffect, useCallback } from 'react';
import { isApiError, PublicTrackingInfo } from '@/types';
import { useSocket } from '@/hooks/useRealtimeParcels';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { Search, MapPin, Truck, Calendar, Clock, User, Phone, Navigation } from 'lucide-react';
import { motion } from 'framer-motion';

// Dynamically import the map component to prevent SSR issues
const LeafletMap = dynamic(() => import('@/components/maps/LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] bg-gray-100 dark:bg-gray-800 animate-pulse rounded-2xl flex items-center justify-center text-gray-400">
      Loading map engine...
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

      if (data.trackingHistory && data.trackingHistory.length > 0) {
        const lastKnownLocation = data.trackingHistory[data.trackingHistory.length - 1];
        setLiveLocation(lastKnownLocation.coordinates);
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
    Delivered: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    'In Transit': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'Picked Up': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
    Assigned: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    Booked: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    Failed: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    Default: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
  };

  return (
    <div className="space-y-8">

      {/* Search Header */}
      <div className="bg-white dark:bg-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none rounded-3xl p-6 md:p-10 text-center relative overflow-hidden">
        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Track your shipment
          </h2>
          <p className="text-gray-500 dark:text-gray-400 pb-2">Enter your tracking ID to see real-time updates.</p>

          <div className="relative flex items-center shadow-lg rounded-2xl bg-white dark:bg-gray-900 overflow-hidden ring-1 ring-gray-100 dark:ring-gray-700 focus-within:ring-2 focus-within:ring-primary-500 transition-all">
            <Search className="absolute left-4 text-gray-400" size={20} />
            <input
              value={parcelIdInput}
              onChange={e => setParcelIdInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="e.g. TRK-837492..."
              className="w-full pl-12 pr-32 py-4 bg-transparent border-none focus:ring-0 text-lg outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400"
            />
            <button
              onClick={handleTrack}
              disabled={loading || !parcelIdInput.trim()}
              className="absolute right-2 px-6 py-2 bg-gray-900 dark:bg-white text-white dark:text-black rounded-xl font-bold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Searching...' : 'Track'}
            </button>
          </div>
          {error && <p className="text-red-500 font-medium">{error}</p>}
        </div>

        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      </div>

      {/* Results Section */}
      {trackingInfo && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid lg:grid-cols-3 gap-8"
        >
          {/* Main Info Card */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Card */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 md:p-8 border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                  <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Current Status</span>
                  <div className="flex items-center gap-3 mt-1">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{trackingInfo.status}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusStyles[trackingInfo.status as keyof typeof statusStyles] || statusStyles.Default}`}>
                      {trackingInfo.status}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Last Update</span>
                  <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
                    {trackingInfo.trackingHistory?.length ? new Date(trackingInfo.trackingHistory[trackingInfo.trackingHistory.length - 1].timestamp).toLocaleTimeString() : 'N/A'}
                  </span>
                  <span className="text-sm text-gray-500">
                    {trackingInfo.trackingHistory?.length ? new Date(trackingInfo.trackingHistory[trackingInfo.trackingHistory.length - 1].timestamp).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>

              {/* Timeline Visualization */}
              <div className="relative pl-8 border-l-2 border-gray-100 dark:border-gray-700 space-y-10 my-10">
                <div className="relative">
                  <div className="absolute -left-[41px] top-1 p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-full ring-4 ring-white dark:ring-gray-800 box-content">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase">From (Pickup)</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{trackingInfo.pickupAddress}</p>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -left-[41px] top-1 p-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded-full ring-4 ring-white dark:ring-gray-800 box-content">
                    <Navigation size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase">To (Delivery)</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{trackingInfo.deliveryAddress}</p>
                  </div>
                </div>
              </div>

              {/* Agent Info */}
              {trackingInfo.assignedAgent && (
                <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-2xl border border-gray-100 dark:border-gray-700">
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center text-gray-500">
                    <User size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase">Delivery Agent</p>
                    <p className="font-bold text-gray-900 dark:text-white">{trackingInfo.assignedAgent.customerName}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Phone size={14} /> {trackingInfo.assignedAgent.phone}
                    </div>
                  </div>
                  <button className="ml-auto px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-bold rounded-lg hover:opacity-90">
                    Call
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Map Column */}
          <div className="lg:col-span-1 h-[500px] lg:h-auto rounded-3xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 relative">
            <div className="absolute top-4 left-4 z-[400] bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${liveLocation ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
              {liveLocation ? 'Live Updates' : 'Last Known Location'}
            </div>
            <LeafletMap
              currentPosition={liveLocation}
              popupInfo={{
                status: trackingInfo.status,
                agent: trackingInfo.assignedAgent,
              }}
            />
          </div>

        </motion.div>
      )}
    </div>
  );
}
