"use client";

import { motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  HandHeart,
  Package,
  ShieldAlert,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CrisisRequest } from "@/types/crisis";
import { formatSupplyLabel, getRequestLoad, getUrgencyPalette } from "@/utils/requests";

interface RequestCardProps {
  request: CrisisRequest;
  canAccept: boolean;
  onAccept: (id: string) => void;
}

function priorityLabel(priority: CrisisRequest["priority"]) {
  if (priority === "red") return "Urgent";
  if (priority === "orange") return "Moderate";
  return "Low Priority";
}

export function RequestCard({ request, canAccept, onAccept }: RequestCardProps) {
  const palette = getUrgencyPalette(request.priority);
  const classification = getRequestLoad(request.itemsCount);
  const accepted = request.status === "accepted";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className={`border bg-white/[0.04] py-0 backdrop-blur-xl ${palette.border} ${palette.glow} ${request.priority === "green" ? "shadow-none" : ""}`}
      >
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between gap-2 text-base text-white">
            <span className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4" />
              {request.title}
            </span>
            <span className={`rounded-full border px-2 py-0.5 text-xs ${palette.border} ${palette.bg}`}>
              {priorityLabel(request.priority)}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pb-5 text-sm">
          <p className="text-zinc-300">{request.description}</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-md border border-white/10 bg-black/30 px-2 py-1 text-zinc-200">
              <Package className="mr-1 inline h-3.5 w-3.5" />
              {formatSupplyLabel(request.supplyType)}
            </div>
            <div className="rounded-md border border-white/10 bg-black/30 px-2 py-1 text-zinc-200">
              Items: <span className="font-semibold">{request.itemsCount}</span>
            </div>
            <div className="rounded-md border border-white/10 bg-black/30 px-2 py-1 capitalize text-zinc-200">
              Load: {classification}
            </div>
            <div className="rounded-md border border-white/10 bg-black/30 px-2 py-1 text-zinc-200">
              Status: <span className="capitalize">{request.status}</span>
            </div>
          </div>
          <Button
            type="button"
            disabled={accepted || !canAccept}
            onClick={() => onAccept(request.id)}
            className="h-9 w-full rounded-xl bg-gradient-to-r from-orange-400 to-amber-300 text-zinc-900 disabled:bg-zinc-700 disabled:text-zinc-300"
          >
            {accepted ? (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Accepted
              </>
            ) : canAccept ? (
              <>
                <HandHeart className="mr-2 h-4 w-4" />
                Accept Request
              </>
            ) : (
              <>
                <AlertCircle className="mr-2 h-4 w-4" />
                Insufficient Supplies
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
