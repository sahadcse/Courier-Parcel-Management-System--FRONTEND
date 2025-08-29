'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { LatLngExpression } from 'leaflet';
import { AgentInfo } from '@/types';

function ChangeView({ center, zoom }: { center: LatLngExpression; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

const defaultCenter: LatLngExpression = [23.8103, 90.4125];

interface LeafletMapProps {
  currentPosition: { lat: number; lng: number } | null;
  popupInfo?: {
    status: string;
    agent?: AgentInfo;
  }
}

export default function LeafletMap({ currentPosition, popupInfo }: LeafletMapProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="h-[400px] bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
        Loading map...
      </div>
    );
  }

  const icon = L.icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  const position: LatLngExpression = currentPosition
    ? [currentPosition.lat, currentPosition.lng]
    : defaultCenter;
  const zoom = currentPosition ? 15 : 12;

  return (
    <MapContainer
      center={position}
      zoom={zoom}
      style={{ height: '400px', width: '100%', borderRadius: '8px' }}
    >
      <ChangeView center={position} zoom={zoom} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {currentPosition && (
        <Marker position={position} icon={icon}>
          <Popup>
            <div className="font-bold">Parcel Location</div>
            {popupInfo && (
              <>
                <div>Status: {popupInfo.status}</div>
                {popupInfo.agent && <div>Agent: {popupInfo.agent.customerName}</div>}
              </>
            )}
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
