"use client";

import { motion } from "framer-motion";

import { VolunteerLeafletMap } from "@/components/maps/VolunteerLeafletMap";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { CrisisRequest } from "@/types/crisis";

interface VolunteerMapDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  center: { lat: number; lng: number };
  requests: CrisisRequest[];
}

export function VolunteerMapDialog({
  open,
  onOpenChange,
  center,
  requests,
}: VolunteerMapDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl border-white/20 bg-[#0f0f0f] p-4 text-zinc-100 sm:p-5">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Emergency Request Map
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Request points are color-coded by urgency. Click a point to view its
            radar zone and details.
          </DialogDescription>
        </DialogHeader>
        <motion.div initial={{ opacity: 0.5 }} animate={{ opacity: 1 }}>
          <VolunteerLeafletMap requests={requests} center={center} />
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
