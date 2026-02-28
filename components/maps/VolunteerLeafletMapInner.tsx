"use client";

import L from "leaflet";
import { Circle, MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

import type { CrisisRequest } from "@/types/crisis";

const markerIcon = L.divIcon({
  className: "leaflet-volunteer-marker",
  html: '<span class="leaflet-volunteer-marker-inner" />',
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

function colorForPriority(priority: CrisisRequest["priority"]) {
  if (priority === "red") return "#ef4444";
  if (priority === "orange") return "#f59e0b";
  return "#22c55e";
}

interface VolunteerLeafletMapInnerProps {
  requests: CrisisRequest[];
  center: { lat: number; lng: number };
}

export function VolunteerLeafletMapInner({
  requests,
  center,
}: VolunteerLeafletMapInnerProps) {
  return (
    <div className="h-[420px] overflow-hidden rounded-2xl border border-white/10">
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={12}
        className="h-full w-full"
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {requests.map((request) => {
          return (
            <Marker
              key={request.id}
              position={[request.location.lat, request.location.lng]}
              icon={markerIcon}
            >
              <Popup>
                <div className="space-y-1 text-sm">
                  <p className="font-semibold">{request.title}</p>
                  <p className="text-zinc-500">{request.description}</p>
                  <p className="text-xs capitalize text-zinc-400">
                    {request.priority} priority • {request.supplyType}
                  </p>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {requests.map((request) => {
          const color = colorForPriority(request.priority);
          const zoneRadius =
            request.priority === "red"
              ? request.itemsCount * 50
              : request.priority === "orange"
                ? request.itemsCount * 40
                : request.itemsCount * 30;

          return (
            <Circle
              key={`${request.id}-zone`}
              center={[request.location.lat, request.location.lng]}
              radius={Math.max(zoneRadius, 220)}
              pathOptions={{
                color,
                fillColor: color,
                fillOpacity: 0.12,
                opacity: 0.5,
                weight: 1.6,
              }}
            />
          );
        })}
      </MapContainer>
    </div>
  );
}
