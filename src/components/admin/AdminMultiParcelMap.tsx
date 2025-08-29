'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LiveParcel } from '@/lib/trackingSlice';

const defaultCenter: [number, number] = [23.8103, 90.4125];

// Custom icons for different statuses
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

export default function AdminMultiParcelMap({ parcels }: { parcels: LiveParcel[] }) {
  return (
    <MapContainer center={defaultCenter} zoom={12} style={{ height: '600px', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {parcels.map(p => (
        <Marker
          key={p.parcelId}
          position={[p.coordinates.coordinates[1], p.coordinates.coordinates[0]]} // lat, lng
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
    </MapContainer>
  );
}
