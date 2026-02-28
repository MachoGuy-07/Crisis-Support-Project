"use client";

import { motion } from "framer-motion";
import L from "leaflet";
import { AlertTriangle, Cross, Home, PackageCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Circle, MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { NGO, OrderResult, UrgencyLevel } from "@/types/crisis";
import { getUrgencyPalette } from "@/utils/requests";

const defaultIconUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png";
const defaultIconRetinaUrl =
  "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png";
const defaultShadowUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconUrl: defaultIconUrl,
  iconRetinaUrl: defaultIconRetinaUrl,
  shadowUrl: defaultShadowUrl,
});

interface VictimLeafletMapInnerProps {
  userLocation: { lat: number; lng: number };
  ngos: NGO[];
  radiusKm: number;
  urgency: UrgencyLevel;
  pulseScale: number;
  email: string;
  onPlaceOrder: (payload: {
    ngoId: string;
    supplyType: "food" | "medical" | "shelter";
    quantity: number;
    requesterEmail: string;
  }) => OrderResult;
}

function MapFlyTo({
  lat,
  lng,
}: {
  lat: number;
  lng: number;
}) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], map.getZoom(), {
      animate: true,
      duration: 1.2,
    });
  }, [lat, lng, map]);
  return null;
}

function NgoPopupOrder({
  ngo,
  email,
  onPlaceOrder,
}: {
  ngo: NGO;
  email: string;
  onPlaceOrder: (payload: {
    ngoId: string;
    supplyType: "food" | "medical" | "shelter";
    quantity: number;
    requesterEmail: string;
  }) => OrderResult;
}) {
  const [supplyType, setSupplyType] = useState<"food" | "medical" | "shelter">("food");
  const [quantity, setQuantity] = useState(1);
  const [feedback, setFeedback] = useState<OrderResult | null>(null);

  const maxQuantity = ngo.supplies[supplyType];

  const handleSubmit = () => {
    const result = onPlaceOrder({
      ngoId: ngo.id,
      requesterEmail: email,
      supplyType,
      quantity,
    });
    setFeedback(result);
  };

  return (
    <div className="space-y-3 text-zinc-100">
      <h4 className="text-base font-semibold text-white">{ngo.name}</h4>
      <p className="text-xs text-zinc-400">{ngo.description}</p>
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="rounded-lg border border-white/10 bg-white/5 px-2 py-1">
          Food: <span className="font-bold">{ngo.supplies.food}</span>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/5 px-2 py-1">
          Medical: <span className="font-bold">{ngo.supplies.medical}</span>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/5 px-2 py-1">
          Shelter: <span className="font-bold">{ngo.supplies.shelter}</span>
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-xs text-zinc-400">Supply Type</label>
        <select
          value={supplyType}
          onChange={(event) =>
            setSupplyType(event.target.value as "food" | "medical" | "shelter")
          }
          className="h-9 w-full rounded-md border border-white/15 bg-black/50 px-2 text-sm text-zinc-100"
        >
          <option value="food">Food</option>
          <option value="medical">Medical</option>
          <option value="shelter">Shelter</option>
        </select>
      </div>
      <div className="space-y-2">
        <label className="text-xs text-zinc-400">Quantity</label>
        <Input
          type="number"
          min={1}
          max={maxQuantity}
          value={quantity}
          onChange={(event) => setQuantity(Number(event.target.value))}
          className="border-white/20 bg-black/35"
        />
      </div>
      <Button
        type="button"
        onClick={handleSubmit}
        className="h-9 w-full rounded-lg bg-gradient-to-r from-rose-400 to-pink-300 text-zinc-900"
      >
        <PackageCheck className="mr-2 h-4 w-4" />
        Place Order
      </Button>
      {feedback ? (
        <p
          className={
            feedback.ok
              ? "rounded-md border border-emerald-300/35 bg-emerald-500/15 px-2 py-1 text-xs text-emerald-100"
              : "rounded-md border border-red-300/35 bg-red-500/15 px-2 py-1 text-xs text-red-100"
          }
        >
          {feedback.message}
        </p>
      ) : null}
    </div>
  );
}

export function VictimLeafletMapInner({
  userLocation,
  ngos,
  radiusKm,
  urgency,
  pulseScale,
  email,
  onPlaceOrder,
}: VictimLeafletMapInnerProps) {
  const urgencyPalette = getUrgencyPalette(urgency);

  const userIcon = useMemo(
    () =>
      L.divIcon({
        className: "leaflet-user-marker",
        html: '<span class="leaflet-user-marker-inner" />',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      }),
    [],
  );

  const ngoIcon = useMemo(
    () =>
      L.divIcon({
        className: "leaflet-ngo-marker",
        html: '<span class="leaflet-ngo-marker-inner" />',
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      }),
    [],
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative h-[460px] overflow-hidden rounded-2xl border border-white/10"
    >
      <MapContainer
        center={[userLocation.lat, userLocation.lng]}
        zoom={12.5}
        scrollWheelZoom
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapFlyTo lat={userLocation.lat} lng={userLocation.lng} />

        <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
          <Popup>
            <div className="text-sm">
              <p className="font-semibold">You are here</p>
              <p className="text-zinc-500">Live browser location detected.</p>
            </div>
          </Popup>
        </Marker>

        <Circle
          center={[userLocation.lat, userLocation.lng]}
          radius={radiusKm * 1000}
          pathOptions={{
            color: urgencyPalette.color,
            fillColor: urgencyPalette.color,
            fillOpacity: 0.12,
            weight: 2.5,
          }}
        />

        <Circle
          center={[userLocation.lat, userLocation.lng]}
          radius={radiusKm * 1000 * pulseScale}
          pathOptions={{
            color: urgencyPalette.color,
            fillColor: urgencyPalette.color,
            fillOpacity: 0.04,
            opacity: 0.45,
            weight: 1.5,
          }}
        />

        {ngos.map((ngo) => (
          <Marker key={ngo.id} position={[ngo.location.lat, ngo.location.lng]} icon={ngoIcon}>
            <Popup minWidth={280}>
              <NgoPopupOrder ngo={ngo} email={email} onPlaceOrder={onPlaceOrder} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      {ngos.length === 0 ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-5 mx-auto w-fit rounded-xl border border-red-300/35 bg-red-500/15 px-4 py-2 text-xs text-red-100">
          <AlertTriangle className="mr-2 inline h-3.5 w-3.5" />
          No NGOs in selected radius.
        </div>
      ) : (
        <div className="pointer-events-none absolute inset-x-0 bottom-5 mx-auto w-fit rounded-xl border border-emerald-300/30 bg-emerald-500/15 px-4 py-2 text-xs text-emerald-100">
          <Cross className="mr-2 inline h-3.5 w-3.5" />
          {ngos.length} support locations available in this zone.
        </div>
      )}
      <div className="pointer-events-none absolute left-4 top-4 rounded-xl border border-white/15 bg-black/55 px-3 py-2 text-xs text-zinc-200 backdrop-blur-lg">
        <Home className="mr-1 inline h-3.5 w-3.5 text-zinc-300" />
        Radius: {radiusKm} km
      </div>
    </motion.div>
  );
}
