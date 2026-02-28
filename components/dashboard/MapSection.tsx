"use client";

import { motion } from "framer-motion";
import type mapboxgl from "mapbox-gl";
import { useEffect, useRef } from "react";

import type { DashboardMarker } from "@/lib/types/dashboard";
import { cn } from "@/lib/utils";

interface MapSectionProps {
  role: "victim" | "volunteer";
  title: string;
  subtitle: string;
  center: { lat: number; lng: number };
  radiusKm: number;
  markers: DashboardMarker[];
  onMarkerSelect?: (marker: DashboardMarker) => void;
}

const RADIUS_SOURCE_ID = "selected-radius-source";
const RADIUS_FILL_LAYER_ID = "selected-radius-fill";
const RADIUS_OUTLINE_LAYER_ID = "selected-radius-outline";
const INITIAL_CENTER: [number, number] = [78.4867, 17.385];

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function createRadiusPolygon(
  centerLng: number,
  centerLat: number,
  radiusKm: number,
  points = 72,
) {
  const coordinates: [number, number][] = [];
  const distanceX = radiusKm / (111.32 * Math.cos((centerLat * Math.PI) / 180));
  const distanceY = radiusKm / 110.574;

  for (let point = 0; point <= points; point += 1) {
    const theta = (point / points) * (2 * Math.PI);
    const x = distanceX * Math.cos(theta);
    const y = distanceY * Math.sin(theta);
    coordinates.push([centerLng + x, centerLat + y]);
  }

  return {
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: [coordinates],
    },
    properties: {},
  };
}

function markerClassName(marker: DashboardMarker) {
  if (marker.kind === "request") return "map-marker map-marker-request";
  if (marker.kind === "food") return "map-marker map-marker-food";
  if (marker.kind === "medical") return "map-marker map-marker-medical";
  return "map-marker map-marker-water";
}

export function MapSection({
  role,
  title,
  subtitle,
  markers,
  center,
  radiusKm,
  onMarkerSelect,
}: MapSectionProps) {
  const mapToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN?.trim();
  const mapRootRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRefs = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!mapToken || !mapRootRef.current || mapRef.current) return;

    let mounted = true;

    void import("mapbox-gl").then((mapboxModule) => {
      if (!mounted || !mapRootRef.current) return;

      const mapbox = mapboxModule.default;
      mapbox.accessToken = mapToken;

      const map = new mapbox.Map({
        container: mapRootRef.current,
        style: "mapbox://styles/mapbox/dark-v11",
        center: INITIAL_CENTER,
        zoom: 10.6,
        antialias: true,
      });

      map.addControl(new mapbox.NavigationControl(), "bottom-right");

      map.on("load", () => {
        if (!mounted) return;
        const radiusFeature = createRadiusPolygon(INITIAL_CENTER[0], INITIAL_CENTER[1], 10);

        map.addSource(RADIUS_SOURCE_ID, {
          type: "geojson",
          data: radiusFeature as GeoJSON.Feature<GeoJSON.Polygon>,
        });

        map.addLayer({
          id: RADIUS_FILL_LAYER_ID,
          type: "fill",
          source: RADIUS_SOURCE_ID,
          paint: {
            "fill-color": role === "victim" ? "#f472b6" : "#fb923c",
            "fill-opacity": 0.08,
          },
        });

        map.addLayer({
          id: RADIUS_OUTLINE_LAYER_ID,
          type: "line",
          source: RADIUS_SOURCE_ID,
          paint: {
            "line-color": role === "victim" ? "#fda4af" : "#fdba74",
            "line-width": 2,
            "line-opacity": 0.9,
          },
        });
      });

      mapRef.current = map;
    });

    return () => {
      mounted = false;
      markerRefs.current.forEach((marker) => marker.remove());
      markerRefs.current = [];
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [mapToken, role]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const updateLayersAndMarkers = async () => {
      if (!map.isStyleLoaded()) return;

      const source = map.getSource(
        RADIUS_SOURCE_ID,
      ) as mapboxgl.GeoJSONSource | null;
      const newRadius = createRadiusPolygon(center.lng, center.lat, radiusKm);
      if (source) {
        source.setData(newRadius as GeoJSON.Feature<GeoJSON.Polygon>);
      }

      map.flyTo({
        center: [center.lng, center.lat],
        zoom: 10.8,
        duration: 950,
      });

      markerRefs.current.forEach((marker) => marker.remove());
      markerRefs.current = [];

      const mapbox = (await import("mapbox-gl")).default;
      markerRefs.current = markers.map((marker) => {
        const markerElement = document.createElement("button");
        markerElement.type = "button";
        markerElement.className = markerClassName(marker);
        markerElement.ariaLabel = marker.name;

        const safeName = escapeHtml(marker.name);
        const safeDescription = escapeHtml(
          marker.description || "Realtime location data",
        );

        const popup = new mapbox.Popup({ offset: 20, closeButton: false }).setHTML(
          `<div class="map-popup">
              <h4>${safeName}</h4>
              <p>${safeDescription}</p>
           </div>`,
        );

        const mapMarker = new mapbox.Marker(markerElement)
          .setLngLat([marker.lng, marker.lat])
          .setPopup(popup)
          .addTo(map);

        markerElement.addEventListener("click", () => {
          onMarkerSelect?.(marker);
        });

        return mapMarker;
      });
    };

    void updateLayersAndMarkers();
  }, [center.lat, center.lng, markers, onMarkerSelect, radiusKm]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="rounded-3xl border border-white/10 bg-white/[0.02] p-4 shadow-[0_30px_80px_-50px_rgba(0,0,0,0.95)] backdrop-blur-2xl"
    >
      <div className="mb-4">
        <h2 className="text-3xl font-bold tracking-tight text-white">{title}</h2>
        <p className="mt-1 text-zinc-400">{subtitle}</p>
      </div>

      {!mapToken ? (
        <div className="relative h-[380px] overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_20%_20%,rgba(244,114,182,0.2),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.2),transparent_40%),linear-gradient(120deg,#050505,#111,#050505)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.06),transparent_70%)]" />
          <div
            className={cn(
              "absolute left-1/2 top-1/2 h-[62%] w-[62%] -translate-x-1/2 -translate-y-1/2 rounded-full border-2",
              role === "victim" ? "border-rose-200/60" : "border-orange-200/60",
            )}
          />

          {markers.slice(0, 9).map((marker, index) => {
            const left = `${16 + ((index * 13) % 68)}%`;
            const top = `${20 + ((index * 9) % 56)}%`;
            return (
              <button
                key={marker.id}
                type="button"
                onClick={() => onMarkerSelect?.(marker)}
                className={cn(markerClassName(marker), "absolute")}
                style={{ left, top }}
                aria-label={marker.name}
              />
            );
          })}

          <div className="absolute left-4 top-4 rounded-xl border border-amber-200/30 bg-black/40 px-4 py-2 text-xs text-zinc-300 backdrop-blur-xl">
            Set <code className="text-zinc-100">NEXT_PUBLIC_MAPBOX_TOKEN</code> to
            enable full interactive map mode.
          </div>
        </div>
      ) : (
        <div ref={mapRootRef} className="h-[430px] overflow-hidden rounded-2xl" />
      )}
    </motion.section>
  );
}
