'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for Leaflet default icon not loading in Next.js/Webpack environment
const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
const iconRetinaUrl =
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png';
const shadowUrl =
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';

const customIcon = new L.Icon({
    iconUrl: iconUrl,
    iconRetinaUrl: iconRetinaUrl,
    shadowUrl: shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

interface LocationMarkerProps {
    onLocationSelect: (lat: number, lng: number) => void;
}

function LocationMarker({ onLocationSelect }: LocationMarkerProps) {
    const [position, setPosition] = useState<L.LatLng | null>(null);

    const map = useMapEvents({
        click(e) {
            setPosition(e.latlng);
            onLocationSelect(e.latlng.lat, e.latlng.lng);
            map.flyTo(e.latlng, map.getZoom());
        },
    });

    return position === null ? null : (
        <Marker position={position} icon={customIcon}></Marker>
    );
}

interface MapPickerProps {
    onLocationSelect: (lat: number, lng: number) => void;
    height?: string;
}

export default function MapPicker({ onLocationSelect, height = "300px" }: MapPickerProps) {
    // Default center (Dhaka, Bangladesh)
    const position: [number, number] = [23.8103, 90.4125];

    return (
        <div style={{ height, width: '100%', borderRadius: '0.75rem', overflow: 'hidden' }} className="relative z-0">
            <MapContainer center={position} zoom={13} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker onLocationSelect={onLocationSelect} />
            </MapContainer>
        </div>
    );
}
