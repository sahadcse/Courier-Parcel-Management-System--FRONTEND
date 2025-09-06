'use client';

import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/store';
import {
  fetchLiveParcels,
  updateParcelLocation,
  updateLiveParcelStatus,
} from '@/lib/trackingSlice';
import { useSocket } from '@/hooks/useRealtimeParcels';
import { Parcel } from '@/types';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Loader2 } from 'lucide-react'; // For a better loading icon

// The dynamic import for the map remains the same
const AdminMultiParcelMap = dynamic(() => import('@/components/admin/AdminMultiParcelMap'), {
  ssr: false,
  loading: () => <LoadingIndicator text="Loading map..." />,
});

// A styled loading component for a better user experience
const LoadingIndicator = ({ text }: { text: string }) => (
  <div className="flex h-[calc(100vh-200px)] flex-col items-center justify-center gap-4 text-gray-500">
    <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
    <p className="font-semibold">{text}</p>
  </div>
);

// The MapLegend component is now styled to be an overlay
const MapLegend = () => (
  <div className="rounded-lg border bg-white/80 p-2 text-sm shadow-lg backdrop-blur-sm dark:bg-gray-800/80 dark:border-gray-700">
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Image src="/marker-green.png" alt="Picked Up" width={15} height={25} />
        <span className="font-medium text-gray-700 dark:text-gray-300">Picked Up</span>
      </div>
      <div className="flex items-center gap-2">
        <Image src="/marker-blue.png" alt="In Transit" width={15} height={25} />
        <span className="font-medium text-gray-700 dark:text-gray-300">In Transit</span>
      </div>
    </div>
  </div>
);

export default function LiveMonitorDashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const socket = useSocket();
  const { liveParcels, loading } = useSelector((state: RootState) => state.tracking);
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    dispatch(fetchLiveParcels());
  }, [dispatch]);

  // The socket effect remains the same
  useEffect(() => {
    if (!socket) return;
    const handleLocationUpdate = (data: { parcelId: string; coordinates: { lat: number; lng: number }; }) => {
      dispatch(updateParcelLocation(data));
    };
    const handleStatusUpdate = (data: Parcel) => {
      dispatch(updateLiveParcelStatus(data));
    };
    socket.on('tracking:updated', handleLocationUpdate);
    socket.on('parcel:updated', handleStatusUpdate);
    return () => {
      socket.off('tracking:updated', handleLocationUpdate);
      socket.off('parcel:updated', handleStatusUpdate);
    };
  }, [socket, dispatch]);

  // Calculate counts once for better performance
  const counts = useMemo(() => {
    const allParcels = Object.values(liveParcels);
    return {
      All: allParcels.length,
      'Picked Up': allParcels.filter(p => p.status === 'Picked Up').length,
      'In Transit': allParcels.filter(p => p.status === 'In Transit').length,
    };
  }, [liveParcels]);

  const filteredParcels = useMemo(() => {
    const allParcels = Object.values(liveParcels);
    if (statusFilter === 'All') return allParcels;
    return allParcels.filter(p => p.status === statusFilter);
  }, [liveParcels, statusFilter]);
  
  const filters = [
    { label: 'All Active', value: 'All' as const, count: counts.All },
    { label: 'Picked Up', value: 'Picked Up' as const, count: counts['Picked Up'] },
    { label: 'In Transit', value: 'In Transit' as const, count: counts['In Transit'] },
  ];

  if (loading === 'pending') return <LoadingIndicator text="Loading live data..." />;

  return (
    <div className='z-30 space-y-4 mt-4'>
      {/* --- UI FIX #1: Controls are now in a responsive container --- */}
      {/* It stacks on mobile and becomes a row on larger screens */}
      <div className="mb-4 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
          {filters.map(filter => (
            <button
              key={filter.value}
              onClick={() => setStatusFilter(filter.value)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
                ${statusFilter === filter.value
                  ? 'bg-black text-white shadow-md dark:bg-white dark:text-black'
                  : 'bg-white border border-black text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
            >
              <span>{filter.label}</span>
              <span className={`rounded-full px-2 text-xs
                ${statusFilter === filter.value ? 'bg-white/20' : 'bg-gray-200 dark:bg-gray-700'}`}>
                {filter.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* --- UI FIX #2: The map container is now 'relative' to position the legend --- */}
      <div className="relative h-[calc(100vh-220px)] rounded-lg">
        <AdminMultiParcelMap parcels={filteredParcels} />
        
        {/* The MapLegend is now an overlay, positioned on top of the map */}
        <div className="absolute top-3 left-3 z-10">
          <MapLegend />
        </div>
      </div>
    </div>
  );
}