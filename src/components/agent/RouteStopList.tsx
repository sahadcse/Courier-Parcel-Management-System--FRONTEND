'use client';

import { Parcel } from '@/types';

interface RouteStopListProps {
  parcels: Parcel[];
  focusedParcelId: string | null;
  onStopClick: (parcelId: string) => void;
}

export default function RouteStopList({ parcels, focusedParcelId, onStopClick }: RouteStopListProps) {
  return (
    <div className="space-y-2 h-[600px] overflow-y-auto">
      <h3 className="text-xl font-semibold p-2">Delivery Stops</h3>
      {parcels.map((parcel, index) => (
        <div
          key={parcel._id}
          onClick={() => onStopClick(parcel._id) }
          className={`p-3 rounded-lg cursor-pointer transition-colors border ${
            focusedParcelId === parcel._id
              ? 'bg-primary-100 border-primary-500' // Active style
              : 'bg-white hover:bg-gray-50' // Inactive style
          }`}
        >
          <p className="text-sm text-gray-500">Parcel ID: {parcel.parcelId}</p>
          <p className="font-bold">{index + 1}. {parcel.receiverName}</p>
          <p className="text-sm text-gray-600">{parcel.deliveryAddress}</p>
        </div>
      ))}
    </div>
  );
}