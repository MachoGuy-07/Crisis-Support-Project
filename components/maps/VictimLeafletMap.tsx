"use client";

import dynamic from "next/dynamic";

import type { NGO, OrderResult } from "@/types/crisis";

interface VictimLeafletMapProps {
  userLocation: { lat: number; lng: number };
  ngos: NGO[];
  radiusKm: number;
  pulseScale: number;
  email: string;
  onPlaceOrder: (payload: {
    ngoId: string;
    supplyType: "food" | "medical" | "shelter";
    quantity: number;
    requesterEmail: string;
  }) => OrderResult;
}

const VictimLeafletMapInner = dynamic(
  () => import("./VictimLeafletMapInner").then((module) => module.VictimLeafletMapInner),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[460px] items-center justify-center rounded-2xl border border-white/10 bg-black/30 text-zinc-300">
        Loading map...
      </div>
    ),
  },
);

export function VictimLeafletMap(props: VictimLeafletMapProps) {
  return <VictimLeafletMapInner {...props} />;
}
