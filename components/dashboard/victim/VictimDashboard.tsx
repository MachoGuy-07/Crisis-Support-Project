"use client";

import { motion } from "framer-motion";
import { PackageOpen } from "lucide-react";
import { useMemo, useState } from "react";

import { VictimLeafletMap } from "@/components/maps/VictimLeafletMap";
import { useDataContext } from "@/context/DataContext";
import { FALLBACK_LOCATION } from "@/mockData/crisisData";
import { isWithinRadius } from "@/utils/geo";

interface VictimDashboardProps {
  email: string;
}

export function VictimDashboard({ email }: VictimDashboardProps) {
  const { ngos, placeOrder, userLocation } = useDataContext();
  const center = userLocation ?? FALLBACK_LOCATION;

  const [statusMessage, setStatusMessage] = useState("");
  const fixedRadius = 10;

  const nearbyNgos = useMemo(() => {
    return ngos.filter((ngo) =>
      isWithinRadius(center, ngo.location, fixedRadius),
    );
  }, [center, ngos]);

  return (
    <div className="space-y-5">
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-white/10 bg-white/[0.045] p-5 backdrop-blur-2xl"
      >
        <h1 className="text-4xl font-black tracking-tight text-white">
          Find Support
        </h1>
        <p className="mt-2 text-zinc-400">
          Locate nearby relief centers on the map to request immediate
          assistance.
        </p>
      </motion.section>

      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-3 backdrop-blur-xl sm:p-4">
        <VictimLeafletMap
          userLocation={center}
          ngos={nearbyNgos}
          radiusKm={fixedRadius}
          urgency="moderate"
          pulseScale={1.05}
          email={email}
          onPlaceOrder={(payload) => {
            const result = placeOrder(payload);
            setStatusMessage(result.message);
            // Auto hide message
            window.setTimeout(() => setStatusMessage(""), 2400);
            return result;
          }}
        />
      </section>

      {statusMessage ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-emerald-300/35 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-100"
        >
          {statusMessage}
        </motion.div>
      ) : null}

      <section className="rounded-3xl border border-rose-300/20 bg-rose-500/5 p-4 text-sm text-zinc-300">
        <PackageOpen className="mr-2 inline h-4 w-4 text-rose-200" />
        Click any NGO marker on the map to select your required supply type,
        enter the quantity needed, and place an order instantly.
      </section>
    </div>
  );
}
