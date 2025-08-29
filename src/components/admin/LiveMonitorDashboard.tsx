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
// import AdminMultiParcelMap from '@/components/admin/AdminMultiParcelMap';
import dynamic from 'next/dynamic';
import Image from 'next/image';

const AdminMultiParcelMap = dynamic(() => import('@/components/admin/AdminMultiParcelMap'), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});

const MapLegend = () => (
  <div className="p-2 bg-white rounded shadow-lg border text-sm flex gap-4">
    <div className="flex items-center gap-2">
      <Image
        src="/marker-green.png"
        alt="Picked Up"
        className="h-5 w-auto"
        width={15}
        height={25}
      />
      <span>Picked Up</span>
    </div>
    <div className="flex items-center gap-2">
      <Image
        src="/marker-blue.png"
        alt="In Transit"
        className="h-5 w-auto"
        width={15}
        height={25}
      />
      <span>In Transit</span>
    </div>
  </div>
);

const filters = [
  { label: 'All Active', value: 'All' },
  { label: 'Picked Up', value: 'Picked Up' },
  { label: 'In Transit', value: 'In Transit' },
];

export default function LiveMonitorDashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const socket = useSocket();
  const { liveParcels, loading } = useSelector((state: RootState) => state.tracking);
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    dispatch(fetchLiveParcels());
  }, [dispatch]);

  useEffect(() => {
    if (!socket) return;

    const handleLocationUpdate = (data: {
      parcelId: string;
      coordinates: { lat: number; lng: number };
    }) => {
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

  const filteredParcels = useMemo(() => {
    const allParcels = Object.values(liveParcels);
    if (statusFilter === 'All') return allParcels;
    return allParcels.filter(p => p.status === statusFilter);
  }, [liveParcels, statusFilter]);

  if (loading === 'pending') return <p>Loading live data...</p>;

  return (
    <div className="relative">
      <div className="mb-4 flex items-center justify-between">
        {filters.map(filter => (
          <button
            key={filter.value}
            onClick={() => setStatusFilter(filter.value)}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50
          ${
            statusFilter === filter.value
              ? 'bg-primary-500 text-white shadow' // Active state
              : 'text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700' // Inactive state
          }
        `}
          >
            {filter.label} ({filter.value === 'All' ? Object.keys(liveParcels).length : filteredParcels.filter(p => p.status === filter.value).length})
          </button>
        ))}
        <MapLegend />
      </div>
      <AdminMultiParcelMap parcels={filteredParcels} />
    </div>
  );
}
