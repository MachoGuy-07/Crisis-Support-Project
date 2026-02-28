"use client";

import dynamic from "next/dynamic";

import type { CrisisRequest } from "@/types/crisis";

interface VolunteerLeafletMapProps {
  requests: CrisisRequest[];
  center: { lat: number; lng: number };
}

const VolunteerLeafletMapInner = dynamic(
  () =>
    import("./VolunteerLeafletMapInner").then(
      (module) => module.VolunteerLeafletMapInner,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[420px] items-center justify-center rounded-2xl border border-white/10 bg-black/35 text-zinc-300">
        Loading map...
      </div>
    ),
  },
);

export function VolunteerLeafletMap(props: VolunteerLeafletMapProps) {
  return <VolunteerLeafletMapInner {...props} />;
}
