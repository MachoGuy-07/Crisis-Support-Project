"use client";

import L from "leaflet";
import { useMemo, useState } from "react";
import { Circle, MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

import type { CrisisRequest } from "@/types/crisis";

function colorsForPriority(priority: CrisisRequest["priority"]) {
  if (priority === "red") {
    return {
      light: "#f87171",
      dark: "#ef4444",
      ring: "rgba(248,113,113,0.2)",
    };
  }
  if (priority === "orange") {
    return {
      light: "#fbbf24",
      dark: "#f59e0b",
      ring: "rgba(251,191,36,0.2)",
    };
  }
  return {
    light: "#4ade80",
    dark: "#22c55e",
    ring: "rgba(74,222,128,0.2)",
  };
}

function markerIcon(priority: CrisisRequest["priority"], selected: boolean) {
  const color = colorsForPriority(priority);
  const size = selected ? 26 : 22;
  const border = selected ? "rgba(255,255,255,0.96)" : "rgba(255,255,255,0.88)";
  const ringWidth = selected ? 5 : 3;

  return L.divIcon({
    className: "leaflet-volunteer-marker",
    html: `<span style="display:block;height:${size}px;width:${size}px;border-radius:999px;border:2px solid ${border};background:radial-gradient(circle at 30% 30%, ${color.light}, ${color.dark});box-shadow:0 0 0 ${ringWidth}px ${color.ring},0 12px 24px -14px ${color.dark};"></span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function zoneRadius(request: CrisisRequest) {
  if (request.priority === "red") return Math.max(request.itemsCount * 58, 280);
  if (request.priority === "orange") return Math.max(request.itemsCount * 46, 240);
  return Math.max(request.itemsCount * 36, 210);
}

interface VolunteerLeafletMapInnerProps {
  requests: CrisisRequest[];
  center: { lat: number; lng: number };
}

export function VolunteerLeafletMapInner({
  requests,
  center,
}: VolunteerLeafletMapInnerProps) {
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);

  const selectedRequest = useMemo(
    () => requests.find((request) => request.id === selectedRequestId) ?? null,
    [requests, selectedRequestId],
  );

  const selectedColor = selectedRequest
    ? colorsForPriority(selectedRequest.priority)
    : null;

  return (
    <div className="relative h-[420px] overflow-hidden rounded-2xl border border-white/10">
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
          const isSelected = selectedRequestId === request.id;
          return (
            <Marker
              key={request.id}
              position={[request.location.lat, request.location.lng]}
              icon={markerIcon(request.priority, isSelected)}
              eventHandlers={{
                click: () => setSelectedRequestId(request.id),
              }}
            >
              <Popup>
                <div className="space-y-1 text-sm">
                  <p className="font-semibold">{request.title}</p>
                  <p className="text-zinc-500">{request.description}</p>
                  <p className="text-xs capitalize text-zinc-400">
                    {request.priority} priority - {request.supplyType}
                  </p>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {selectedRequest && selectedColor ? (
          <>
            <Circle
              center={[selectedRequest.location.lat, selectedRequest.location.lng]}
              radius={zoneRadius(selectedRequest)}
              pathOptions={{
                color: selectedColor.dark,
                fillColor: selectedColor.dark,
                fillOpacity: 0.13,
                opacity: 0.62,
                weight: 2,
              }}
            />
            <Circle
              center={[selectedRequest.location.lat, selectedRequest.location.lng]}
              radius={zoneRadius(selectedRequest) * 1.28}
              pathOptions={{
                color: selectedColor.dark,
                fillColor: selectedColor.dark,
                fillOpacity: 0.03,
                opacity: 0.45,
                weight: 1.4,
              }}
            />
          </>
        ) : null}
      </MapContainer>
      <div className="pointer-events-none absolute left-4 top-4 rounded-xl border border-white/15 bg-black/55 px-3 py-2 text-xs text-zinc-200 backdrop-blur-lg">
        Click a request point to show its radar zone.
      </div>
    </div>
  );
}
