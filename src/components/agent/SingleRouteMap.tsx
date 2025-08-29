// SingleRouteMap.tsx

'use client';

import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { useRef } from 'react';
import L, { Routing } from 'leaflet';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';
import { useEffect } from 'react';

interface SingleRouteMapProps {
  start: { lat: number; lng: number };
  end: { lat: number; lng: number };
}

const RoutingComponent = ({ start, end }: SingleRouteMapProps) => {
  const map = useMap();
  const routingControlRef = useRef<Routing.Control | null>(null);

  useEffect(() => {
    if (!map) return;

    // First, clean up any existing route from a previous render.
    // This is crucial for handling React Strict Mode's double-mount.
    // if (routingControlRef.current) {
    //   map.addControl(routingControlRef.current);
    // }

    const waypoints = [L.latLng(start.lat, start.lng), L.latLng(end.lat, end.lng)];

    const routingOptions: Routing.RoutingControlOptions & {
      createMarker: (i: number, waypoint: Routing.Waypoint) => L.Marker;
    } = {
      waypoints,
      routeWhileDragging: false,
      addWaypoints: false,
      show: false,
      createMarker: (i: number, waypoint: Routing.Waypoint) => {
        const markerOptions = {
          draggable: false,
          icon: L.icon({
            iconUrl: i === 0 ? '/marker-start.png' : '/marker-end.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
          }),
        };
        return L.marker(waypoint.latLng, markerOptions);
      },
    };

    // Create the new control, add it to the map, and store it in our ref.
    const control = L.Routing.control(routingOptions).addTo(map);
    routingControlRef.current = control;
    
    control.on('routesfound', (e) => {
      const routes = e.routes;
      if (routes.length > 0 && routes[0].coordinates) {
        const bounds = L.latLngBounds(routes[0].coordinates);
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    });
  }, [map, start, end]);

  return null;
};

export default function SingleRouteMap({ start, end }: SingleRouteMapProps) {
  return (
    <MapContainer
      center={[start.lat, start.lng]}
      zoom={13}
      style={{ height: '300px', width: '100%', borderRadius: '8px' }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <RoutingComponent start={start} end={end} />
    </MapContainer>
  );
}
