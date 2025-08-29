'use client';

import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L, { Routing } from 'leaflet'; // 1. Import 'Routing' for its types
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';
import { useEffect } from 'react';
import { Parcel } from '@/types';

const defaultCenter: [number, number] = [23.8103, 90.4125];

// This component now also handles panning/zooming to a focused location
const RoutingComponent = ({ parcels, focusedParcel }: { parcels: Parcel[]; focusedParcel: Parcel | null }) => {
  const map = useMap();

  // Effect for drawing the route
  useEffect(() => {
    const routableParcels = parcels.filter(p => p.deliveryCoordinates);
    if (!map || routableParcels.length === 0) return;
    
    const waypoints = routableParcels.map(p =>
      L.latLng(p.deliveryCoordinates!.coordinates[1], p.deliveryCoordinates!.coordinates[0])
    );

    // --- THIS IS THE FIX ---
    // 2. Define the options with a specific, extended type
    const routingOptions: Routing.RoutingControlOptions & { createMarker: () => null } = {
      waypoints,
      routeWhileDragging: true,
      createMarker: () => null, // This now matches our extended type
    };

    // 3. Pass the strongly-typed options object to the control
    const routingControl = L.Routing.control(routingOptions).addTo(map);

    return () => { map.removeControl(routingControl); };
  }, [map, parcels]);

  // Effect for flying to a focused parcel
  useEffect(() => {
    if (map && focusedParcel?.deliveryCoordinates) {
      const { coordinates } = focusedParcel.deliveryCoordinates;
      map.flyTo([coordinates[1], coordinates[0]], 16); // Fly to [lat, lng] with zoom level 16
    }
  }, [map, focusedParcel]);

  return null;
};


export default function AgentRouteMap({ parcels, focusedParcel }: { parcels: Parcel[]; focusedParcel: Parcel | null }) {
  return (
    <MapContainer center={defaultCenter} zoom={12} style={{ height: '600px', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <RoutingComponent parcels={parcels} focusedParcel={focusedParcel} />
    </MapContainer>
  );
};
