'use client';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LiveParcel } from '@/lib/trackingSlice';
import { useEffect } from 'react';

const defaultCenter: [number, number] = [23.8103, 90.4125]; // Dhaka, Bangladesh

const inTransitIcon = new L.Icon({
  iconUrl: '/marker-blue.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
const pickedUpIcon = new L.Icon({
  iconUrl: '/marker-green.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const MapBoundsUpdater = ({ parcels }: { parcels: LiveParcel[] }) => {
  const map = useMap();

  useEffect(() => {
    if (parcels.length === 0) {
      map.setView(defaultCenter, 12);
      return;
    }

    // --- FIX IS HERE ---
    // 1. Create an array of LatLng points from all parcels.
    const allPoints = parcels.map(p =>
      L.latLng(p.coordinates.coordinates[1], p.coordinates.coordinates[0])
    );
    
    // 2. Create the bounds object using the array of points.
    const bounds = L.latLngBounds(allPoints);

    map.fitBounds(bounds, { padding: [50, 50] });
  }, [parcels, map]);

  return null;
};

export default function AdminMultiParcelMap({ parcels }: { parcels: LiveParcel[] }) {
  return (
    <MapContainer center={defaultCenter} zoom={12} className="h-full w-full rounded-lg z-30">
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      
      {parcels.map(p => (
        <Marker
          key={p.parcelId}
          position={[p.coordinates.coordinates[1], p.coordinates.coordinates[0]]}
          icon={p.status === 'In Transit' ? inTransitIcon : pickedUpIcon}
        >
          <Popup>
            <div className="font-bold text-base">{p.parcelId}</div>
            <div className="text-sm">Status: {p.status}</div>
            {p.assignedAgent && (
              <div className="text-sm mt-1 border-t pt-1">
                <div>Agent: {p.assignedAgent.customerName}</div>
                <div>Phone: {p.assignedAgent.phone}</div>
              </div>
            )}
          </Popup>
        </Marker>
      ))}
      
      <MapBoundsUpdater parcels={parcels} />
    </MapContainer>
  );
}